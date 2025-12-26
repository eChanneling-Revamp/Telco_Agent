// import { NextRequest, NextResponse } from 'next/server';
// import pool from '@/lib/db';
// import bcrypt from 'bcryptjs';

// export async function POST(request: NextRequest) {
//   try {
//     const { email, password, name, role, phone } = await request.json();

//     if (!email || !password || !role) {
//       return NextResponse.json({ error: 'Email, password, and role are required' }, { status: 400 });
//     }

//     const validRoles = ['superadmin', 'admin', 'agent'];
//     if (!validRoles.includes(role)) {
//       return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
//     }

//     const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
//     if (existingUser.rows.length > 0) {
//       return NextResponse.json({ error: 'User already exists' }, { status: 400 });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       'INSERT INTO users (email, password_hash, name, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, name, role, phone',
//       [email, hashedPassword, name || email.split('@')[0], role, phone || null]
//     );

//     return NextResponse.json({ message: 'User created successfully', user: result.rows[0] }, { status: 201 });
//   } catch (error) {
//     console.error('Registration error:', error);
//     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, role, phone } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    const validRoles = ["superadmin", "admin", "agent"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.users.create({
      data: {
        email,
        password_hash: hashedPassword,
        name: name || email.split("@")[0],
        role,
        phone: phone || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
      },
    });

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}