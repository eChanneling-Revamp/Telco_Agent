// import { NextRequest, NextResponse } from 'next/server';
// import pool from '@/lib/db';
// import bcrypt from 'bcryptjs';
// import { verifyToken } from '@/lib/auth';

// export async function POST(req: NextRequest) {
//   try {
//     const token = req.cookies.get('token')?.value;
//     if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const { role } = verifyToken(token);
//     if (!['admin', 'superadmin'].includes(role)) {
//       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//     }

//     const { email, password, name, phone } = await req.json();
//     const hash = await bcrypt.hash(password, 10);

//     const result = await pool.query(
//       `INSERT INTO users (email,password_hash,name,role,phone)
//        VALUES ($1,$2,$3,'agent',$4)
//        RETURNING id,email,role`,
//       [email, hash, name, phone || null]
//     );

//     return NextResponse.json({ agent: result.rows[0] }, { status: 201 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: string;
    };

    // Only admin and superadmin can create agents
    if (!["admin", "superadmin"].includes(decoded.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email, password, name, phone } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
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
    const hash = await bcrypt.hash(password, 10);

    // Create agent user
    const newAgent = await prisma.users.create({
      data: {
        email,
        password_hash: hash,
        name: name || email.split("@")[0],
        role: "agent",
        phone: phone || null,
      },
      select: {
        id: true,
        email: true,
        role: true,
        name: true,
      },
    });

    return NextResponse.json({ agent: newAgent }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}