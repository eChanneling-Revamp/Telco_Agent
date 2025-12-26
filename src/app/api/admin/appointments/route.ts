import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { role } = verifyToken(token);
    if (role !== "admin" && role !== "superadmin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const agent = url.searchParams.get("agent") || "";
    const status = url.searchParams.get("status") || "";
    const date = url.searchParams.get("date") || "";
    const hospital = url.searchParams.get("hospital") || "";

    let query = `
      SELECT 
        a.*, 
        u.name as booked_by_name,
        u.email as booked_by_email
      FROM appointments a
      LEFT JOIN users u ON a.user_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    let idx = 1;

    if (search) {
      query += ` AND (a.patient_name ILIKE $${idx} OR a.doctor_name ILIKE $${idx} OR a.appointment_id::text ILIKE $${idx})`;
      params.push(`%${search}%`);
      idx++;
    }

    if (agent && agent !== "all") {
      query += ` AND (u.name = $${idx} OR u.id::text = $${idx})`;
      params.push(agent);
      idx++;
    }

    if (status && status !== "all") {
      query += ` AND a.status = $${idx}`;
      params.push(status.toLowerCase());
      idx++;
    }

    if (date && date !== "all") {
      query += ` AND a.appointment_date = $${idx}`;
      params.push(date);
      idx++;
    }

    if (hospital && hospital !== "all") {
      query += ` AND a.hospital = $${idx}`;
      params.push(hospital);
      idx++;
    }

    query += ` ORDER BY a.created_at DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json({ appointments: result.rows }, { status: 200 });
  } catch (error: any) {
    console.error("Admin fetch appointments error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}