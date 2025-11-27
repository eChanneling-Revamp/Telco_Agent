import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
    };

    // support pagination and filtering via query params
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "8", 10);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const date = url.searchParams.get("date") || "";

    const offset = (Math.max(page, 1) - 1) * limit;

    // Build WHERE clauses dynamically
    const whereClauses = ["a.user_id = $1"];
    const params: any[] = [decoded.userId];
    let idx = 2;

    if (status) {
      whereClauses.push(`a.status = $${idx}`);
      params.push(status);
      idx++;
    }

    if (date) {
      whereClauses.push(`a.appointment_date = $${idx}`);
      params.push(date);
      idx++;
    }

    if (search) {
      whereClauses.push(
        `(a.patient_name ILIKE $${idx} OR d.name ILIKE $${idx})`
      );
      params.push(`%${search}%`);
      idx++;
    }

    const whereSql = whereClauses.length
      ? "WHERE " + whereClauses.join(" AND ")
      : "";

    // total count for pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) AS total FROM appointments a JOIN doctors d ON a.doctor_id = d.id ${whereSql}`,
      params
    );
    const total = parseInt(countResult.rows[0].total, 10) || 0;

    // Add limit/offset params
    params.push(limit, offset);

    const result = await pool.query(
      `SELECT 
        a.*,
        d.name as doctor_name,
        d.specialty,
        d.hospital,
        d.city,
        da.start_time,
        da.end_time,
        p.payment_status,
        p.transaction_id
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN doctor_availability da ON a.availability_id = da.id
       LEFT JOIN payments p ON a.id = p.appointment_id
       ${whereSql}
       ORDER BY a.appointment_date DESC, a.appointment_time DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      params
    );

    const appointments = result.rows.map((row) => ({
      ...row,
      timeSlot: `${row.start_time} - ${row.end_time}`,
    }));

    return NextResponse.json({ appointments, total }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments", message: error.message },
      { status: 500 }
    );
  }
}
