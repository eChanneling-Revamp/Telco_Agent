import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const specialization = searchParams.get("specialization") || "";
    const hospitalType = searchParams.get("hospitalType") || "";
    const city = searchParams.get("city") || "";
    const date = searchParams.get("date") || "";

    let query = `
  SELECT 
    d.*,
    da.id as availability_id,
    da.start_time,
    da.end_time,
    da.max_appointments,
    da.booked_appointments
  FROM doctors d
  LEFT JOIN doctor_availability da ON d.id = da.doctor_id
  WHERE da.is_active = true
`;

    const params: any[] = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      query += ` AND (
        d.name ILIKE $${paramCount} OR 
        d.specialty ILIKE $${paramCount} OR 
        d.hospital ILIKE $${paramCount}
      )`;
      params.push(`%${search}%`);
    }

    if (specialization) {
      paramCount++;
      query += ` AND d.specialty = $${paramCount}`;
      params.push(specialization);
    }

    if (hospitalType) {
      paramCount++;
      query += ` AND d.hospital_type = $${paramCount}`;
      params.push(hospitalType);
    }

    if (city) {
      paramCount++;
      query += ` AND d.city = $${paramCount}`;
      params.push(city);
    }

    // Date filtering is handled at the appointment booking level, not at doctor availability level

    query += ` AND da.booked_appointments < da.max_appointments ORDER BY d.name`;

    const result = await pool.query(query, params);

    const doctors = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      specialty: row.specialty,
      hospital: row.hospital,
      hospitalType: row.hospital_type,
      city: row.city,
      available: `${row.start_time} - ${row.end_time}`,
      availabilityId: row.availability_id,
      consultationFee: parseFloat(row.consultation_fee),
      slotsAvailable: row.max_appointments - row.booked_appointments,
      availableDates: date ? [date] : [],
    }));

    return NextResponse.json({ doctors }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Failed to fetch appointments", message: error.message },
      { status: 500 }
    );
  }
}
