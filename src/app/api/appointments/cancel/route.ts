import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    const { appointmentId } = await request.json();

    await client.query('BEGIN');
    
    // Get appointment details
    const appointmentResult = await client.query(
      'SELECT * FROM appointments WHERE id = $1 AND user_id = $2',
      [appointmentId, decoded.userId]
    );

    if (appointmentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    const appointment = appointmentResult.rows[0];

    // Check if appointment can be cancelled (not already cancelled or completed)
    if (appointment.status === 'cancelled') {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'Appointment already cancelled' },
        { status: 400 }
      );
    }
    
    // Update appointment status
    await client.query(
      `UPDATE appointments SET status = 'cancelled', updated_at = NOW() WHERE id = $1`,
      [appointmentId]
    );

    // Decrease booked appointments count
    await client.query(
      `UPDATE doctor_availability 
       SET booked_appointments = GREATEST(booked_appointments - 1, 0)
       WHERE id = $1`,
      [appointment.availability_id]
    );

    // Update payment status
    await client.query(
      `UPDATE payments SET payment_status = 'refunded' WHERE appointment_id = $1`,
      [appointmentId]
    );

    await client.query('COMMIT');

    return NextResponse.json(
      { message: 'Appointment cancelled successfully' },
      { status: 200 }
    );

  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Error cancelling appointment:', error);
    return NextResponse.json(
      { error: 'Failed to cancel appointment', message: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}