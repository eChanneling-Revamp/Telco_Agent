// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/lib/db";
// import { verifyToken } from "@/lib/auth";

// export async function GET(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { role } = verifyToken(token);

//     let result;
//     if (role === "superadmin") {
//       // Superadmin can view admins and agents
//       result = await pool.query(
//         `SELECT 
//           u.id, 
//           u.email, 
//           u.name, 
//           u.role, 
//           u.phone,
//           u.is_suspended,
//           COALESCE(COUNT(a.id), 0)::integer as total_appointments
//         FROM users u
//         LEFT JOIN appointments a ON u.id = a.user_id
//         WHERE u.role IN ('admin', 'agent')
//         GROUP BY u.id, u.email, u.name, u.role, u.phone, u.is_suspended`
//       );
//     } else if (role === "admin") {
//       // Admin can view agents only
//       result = await pool.query(
//         `SELECT 
//           u.id, 
//           u.email, 
//           u.name, 
//           u.role, 
//           u.phone,
//           u.is_suspended,
//           COALESCE(COUNT(a.id), 0)::integer as total_appointments
//         FROM users u
//         LEFT JOIN appointments a ON u.id = a.user_id
//         WHERE u.role='agent'
//         GROUP BY u.id, u.email, u.name, u.role, u.phone, u.is_suspended`
//       );
//     } else {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     return NextResponse.json({ users: result.rows }, { status: 200 });
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: string;
    };

    let users;

    if (decoded.role === "superadmin") {
      // Superadmin can view admins and agents
      users = await prisma.users.findMany({
        where: {
          role: {
            in: ["admin", "agent"],
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          is_suspended: true,
          _count: {
            select: {
              appointments: true,
            },
          },
        },
      });
    } else if (decoded.role === "admin") {
      // Admin can view agents only
      users = await prisma.users.findMany({
        where: {
          role: "agent",
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          is_suspended: true,
          _count: {
            select: {
              appointments: true,
            },
          },
        },
      });
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Format response to match original structure
    const formattedUsers = users.map((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      is_suspended: user.is_suspended,
      total_appointments: user._count.appointments,
    }));

    return NextResponse.json({ users: formattedUsers }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}