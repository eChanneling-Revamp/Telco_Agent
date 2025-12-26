// import { NextRequest, NextResponse } from "next/server";
// import pool from "@/lib/db";
// import { verifyToken } from "@/lib/auth";

// // POST → suspend/unsuspend
// export async function POST(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { role, userId: currentUserId } = verifyToken(token);
//     const { userId, suspend } = await req.json();

//     if (typeof userId !== "number" || typeof suspend !== "boolean") {
//       return NextResponse.json(
//         { error: "Invalid request body" },
//         { status: 400 }
//       );
//     }

//     const targetResult = await pool.query(
//       "SELECT id, role FROM users WHERE id=$1",
//       [userId]
//     );
//     const targetUser = targetResult.rows[0];
//     if (!targetUser)
//       return NextResponse.json({ error: "User not found" }, { status: 404 });

//     if (role === "superadmin") {
//       if (targetUser.id === currentUserId) {
//         return NextResponse.json(
//           { error: "Cannot suspend yourself" },
//           { status: 403 }
//         );
//       }
//     } else if (role === "admin") {
//       if (targetUser.role !== "agent") {
//         return NextResponse.json(
//           { error: "Admins can only suspend agents" },
//           { status: 403 }
//         );
//       }
//     } else {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     const updateResult = await pool.query(
//       "UPDATE users SET is_suspended=$1 WHERE id=$2 RETURNING id,email,role,is_suspended",
//       [suspend, userId]
//     );

//     return NextResponse.json(
//       {
//         message: suspend ? "User suspended" : "User unsuspended",
//         user: updateResult.rows[0],
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }

// // GET → list users for suspend/unsuspend
// export async function GET(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token)
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { role } = verifyToken(token);

//     let result;
//     if (role === "superadmin") {
//       // Superadmin sees admins + agents
//       result = await pool.query(
//         `SELECT id,email,name,role,is_suspended FROM users WHERE role IN ('admin','agent')`
//       );
//     } else if (role === "admin") {
//       // Admin sees agents only
//       result = await pool.query(
//         `SELECT id,email,name,role,is_suspended FROM users WHERE role='agent'`
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

// POST → suspend/unsuspend
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      role: string;
    };

    const { userId, suspend } = await req.json();

    if (typeof userId !== "number" || typeof suspend !== "boolean") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Get target user
    const targetUser = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
        email: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Permission checks
    if (decoded.role === "superadmin") {
      if (targetUser.id === decoded.userId) {
        return NextResponse.json(
          { error: "Cannot suspend yourself" },
          { status: 403 }
        );
      }
    } else if (decoded.role === "admin") {
      if (targetUser.role !== "agent") {
        return NextResponse.json(
          { error: "Admins can only suspend agents" },
          { status: 403 }
        );
      }
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update suspension status
    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        is_suspended: suspend,
      },
      select: {
        id: true,
        email: true,
        role: true,
        is_suspended: true,
      },
    });

    return NextResponse.json(
      {
        message: suspend ? "User suspended" : "User unsuspended",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// GET → list users for suspend/unsuspend
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
      // Superadmin sees admins + agents
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
          is_suspended: true,
        },
      });
    } else if (decoded.role === "admin") {
      // Admin sees agents only
      users = await prisma.users.findMany({
        where: {
          role: "agent",
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          is_suspended: true,
        },
      });
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}