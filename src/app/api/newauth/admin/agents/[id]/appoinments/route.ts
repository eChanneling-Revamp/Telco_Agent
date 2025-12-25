import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = verifyToken(token);

    // Only admin and superadmin can view agent appointments
    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ Next.js 15 FIX: await params
    const { id: agentId } = await context.params;

    const result = await pool.query(
      `
      SELECT
        a.id,
        a.patient_name,
        a.patient_phone,
        a.status,
        a.total_amount,
        a.refund_eligible,
        TO_CHAR(a.appointment_date, 'YYYY-MM-DD') AS appointment_date,
        a.appointment_time,
        a.doctor_name,
        a.specialty,
        a.hospital,
        d.consultation_fee,
        a.created_at
      FROM appointments a
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.user_id = $1
      ORDER BY a.created_at DESC
      `,
      [agentId]
    );

    return NextResponse.json({ appointments: result.rows }, { status: 200 });
  } catch (error) {
    console.error("Admin agent appointments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch agent appointments" },
      { status: 500 }
    );
  }
}
