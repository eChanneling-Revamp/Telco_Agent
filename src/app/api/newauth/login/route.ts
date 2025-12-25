// import { NextRequest, NextResponse } from 'next/server';
// import pool from '@/lib/db';
// import bcrypt from 'bcryptjs';
// import { signToken } from '@/lib/auth';

// export async function POST(req: NextRequest) {
//   try {
//     const { email, password } = await req.json();

//     if (!email || !password) {
//       return NextResponse.json({ error: 'Email & password required' }, { status: 400 });
//     }

//     const result = await pool.query(
//       'SELECT id,email,password_hash,role,phone FROM users WHERE email=$1',
//       [email]
//     );

//     const user = result.rows[0];
//     if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

//     const match = await bcrypt.compare(password, user.password_hash);
//     if (!match) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

//     const token = signToken({ userId: user.id, role: user.role });

//     const res = NextResponse.json({
//       message: 'Login successful',
//       user: { id: user.id, email: user.email, role: user.role }
//     });

//     res.cookies.set('token', token, {
//       httpOnly: true,
//       path: '/',
//       sameSite: 'strict'
//     });

//     return res;
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
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email & password required" },
        { status: 400 }
      );
    }

    // Find user with Prisma
    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password_hash: true,
        role: true,
        phone: true,
        is_active: true,
        is_suspended: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if user is active and not suspended
    if (!user.is_active || user.is_suspended) {
      return NextResponse.json(
        { error: "Account is inactive or suspended" },
        { status: 403 }
      );
    }

    // Verify password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" }
    );

    const res = NextResponse.json({
      message: "Login successful",
      user: { id: user.id, email: user.email, role: user.role },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}