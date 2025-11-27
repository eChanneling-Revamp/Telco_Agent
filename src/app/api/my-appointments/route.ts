import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };

    const result = await pool.query(
      `SELECT 
        a.*,
        d.name as doctor_name,
        d.specialty,
        d.hospital,
        d.city,
        p.payment_status,
        p.transaction_id
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN payments p ON a.id = p.appointment_id
       WHERE a.user_id = $1
       ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [decoded.userId]
    );

    return NextResponse.json({ appointments: result.rows }, { status: 200 });

  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}