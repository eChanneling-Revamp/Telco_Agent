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

    // support filtering via query params
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const date = url.searchParams.get("date") || "";

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

    // total count
    const countResult = await pool.query(
      `SELECT COUNT(*) AS total FROM appointments a JOIN doctors d ON a.doctor_id = d.id ${whereSql}`,
      params
    );
    const total = parseInt(countResult.rows[0].total, 10) || 0;

    // Fetch all appointments without limit/offset
    const result = await pool.query(
      `SELECT 
        a.id,
        a.user_id,
        a.doctor_id,
        a.patient_name,
        a.patient_phone,
        a.patient_email,
        a.patient_nic,
        TO_CHAR(a.patient_dob, 'YYYY-MM-DD') as patient_dob,
        a.patient_gender,
        a.patient_age,
        a.slt_phone,
        TO_CHAR(a.appointment_date, 'YYYY-MM-DD') as appointment_date,
        a.appointment_time,
        a.status,
        a.payment_method,
        a.total_amount,
        a.is_member,
        a.send_sms,
        a.send_email,
        a.notes,
        a.doctor_name,
        a.specialty,
        a.hospital,
        a.refund_eligible,
        a.created_at,
        a.updated_at,
        d.name as doctor_full_name,
        d.city,
        d.consultation_fee,
        da.start_time,
        da.end_time,
        p.payment_status,
        p.transaction_id
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN doctor_availability da ON a.availability_id = da.id
       LEFT JOIN payments p ON a.id = p.appointment_id
       ${whereSql}
      ORDER BY a.updated_at DESC`,
      params
    );

    const appointments = result.rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      doctor_id: row.doctor_id,
      patient_name: row.patient_name,
      patient_phone: row.patient_phone,
      patient_email: row.patient_email,
      patient_nic: row.patient_nic,
      patient_dob: row.patient_dob, // Already formatted as YYYY-MM-DD
      patient_gender: row.patient_gender,
      patient_age: row.patient_age,
      slt_phone: row.slt_phone,
      appointment_date: row.appointment_date, // Already formatted as YYYY-MM-DD
      appointment_time: row.appointment_time,
      status: row.status,
      payment_method: row.payment_method,
      total_amount: row.total_amount,
      is_member: row.is_member,
      send_sms: row.send_sms,
      send_email: row.send_email,
      notes: row.notes,
      doctor_name: row.doctor_name || row.doctor_full_name,
      specialty: row.specialty,
      hospital: row.hospital,
      city: row.city,
      consultation_fee: parseFloat(row.consultation_fee) || 3000,
      refund_eligible: row.refund_eligible,
      payment_status: row.payment_status,
      transaction_id: row.transaction_id,
      timeSlot:
        row.start_time && row.end_time
          ? `${row.start_time} - ${row.end_time}`
          : "",
      created_at: row.created_at,
      updated_at: row.updated_at,
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
