
import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await pool.query(`
      SELECT 
        d.*,
        COUNT(da.id) as availability_slots
      FROM doctors d
      LEFT JOIN doctor_availability da ON d.id = da.doctor_id AND da.is_active = true
      GROUP BY d.id
      ORDER BY d.name
    `);

    const doctors = result.rows;

    return NextResponse.json({ doctors }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors', message: error.message },
      { status: 500 }
    );
  }
}
