import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { role } = verifyToken(token);
        if (role !== "admin" && role !== "superadmin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const [agentsResult, hospitalsResult] = await Promise.all([
            pool.query(
                `SELECT id, COALESCE(NULLIF(name, ''), email) AS display_name
         FROM users
         WHERE role = 'agent'
         ORDER BY display_name`
            ),
            pool.query(
                `SELECT DISTINCT hospital
         FROM appointments
         WHERE hospital IS NOT NULL
         ORDER BY hospital`
            ),
        ]);

        const agents = agentsResult.rows.map((row) => ({
            id: String(row.id),
            name: row.display_name ?? "Unknown Agent",
        }));

        const hospitals = hospitalsResult.rows
            .map((row) => row.hospital)
            .filter(Boolean);

        const statuses = ["confirmed", "pending", "cancelled", "completed"];

        return NextResponse.json(
            { agents, hospitals, statuses },
            { status: 200 }
        );
    } catch (error) {
        console.error("Admin filter metadata error:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}