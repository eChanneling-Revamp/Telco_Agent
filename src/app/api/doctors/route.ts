import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Extract search parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const specialization = searchParams.get("specialization") || "";
    const hospitalType = searchParams.get("hospitalType") || "";

    // Build dynamic SQL query with WHERE conditions
    let query = `
      SELECT 
        d.*,
        COUNT(da.id) as availability_slots
      FROM doctors d
      LEFT JOIN doctor_availability da ON d.id = da.doctor_id AND da.is_active = true
      WHERE 1=1
    `;

    const queryParams: any[] = [];
    let paramIndex = 1;

    // Add search filter (doctor name or hospital)
    if (search) {
      query += ` AND (LOWER(d.name) LIKE LOWER($${paramIndex}) OR LOWER(d.hospital) LIKE LOWER($${paramIndex}))`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Add specialty filter
    if (specialization) {
      query += ` AND d.specialty = $${paramIndex}`;
      queryParams.push(specialization);
      paramIndex++;
    }

    // Add hospital type filter
    if (hospitalType) {
      query += ` AND d.hospital_type = $${paramIndex}`;
      queryParams.push(hospitalType);
      paramIndex++;
    }

    query += `
      GROUP BY d.id
      ORDER BY d.name
    `;

    // Execute query with parameters
    const result = await pool.query(query, queryParams);

    const doctors = result.rows;

    return NextResponse.json({ doctors }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors", message: error.message },
      { status: 500 }
    );
  }
}
