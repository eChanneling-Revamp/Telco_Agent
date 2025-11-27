import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  const client = await pool.connect();
  
  try {
    // Get user from token
    const token = request.cookies.get('token')?.value;
    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        userId = decoded.userId;
      } catch (error) {
        console.log('Invalid token, continuing as guest');
      }
    }

    const body = await request.json();
    const {
      doctorId,
      availabilityId,
      patientName,
      patientPhone,
      patientEmail,
      sltPhone,
      notes,
      appointmentDate,
      appointmentTime,
      paymentMethod,
      totalAmount,
      isMember,
      sendSms,
      sendEmail
    } = body;

    // Validation
    if (!doctorId || !patientName || !patientPhone || !sltPhone || !appointmentDate || !appointmentTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Check if slot is still available
    const availabilityCheck = await client.query(
      `SELECT * FROM doctor_availability 
       WHERE id = $1 AND is_active = true 
       AND booked_appointments < max_appointments`,
      [availabilityId]
    );

    if (availabilityCheck.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json(
        { error: 'This time slot is no longer available' },
        { status: 400 }
      );
    }

    // Create appointment
    const appointmentResult = await client.query(
      `INSERT INTO appointments (
        user_id, doctor_id, availability_id, patient_name, patient_phone,
        patient_email, slt_phone, notes, appointment_date, appointment_time,
        payment_method, total_amount, is_member, send_sms, send_email, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *`,
      [
        userId, doctorId, availabilityId, patientName, patientPhone,
        patientEmail, sltPhone, notes, appointmentDate, appointmentTime,
        paymentMethod, totalAmount, isMember, sendSms, sendEmail, 'confirmed'
      ]
    );

    const appointment = appointmentResult.rows[0];

    // Update availability count
    await client.query(
      `UPDATE doctor_availability 
       SET booked_appointments = booked_appointments + 1 
       WHERE id = $1`,
      [availabilityId]
    );

    // Create payment record
    await client.query(
      `INSERT INTO payments (appointment_id, payment_method, amount, payment_status)
       VALUES ($1, $2, $3, $4)`,
      [appointment.id, paymentMethod, totalAmount, paymentMethod === 'card' ? 'pending' : 'paid']
    );

    await client.query('COMMIT');

    // Get complete appointment details
    const completeAppointment = await pool.query(
      `SELECT 
        a.*,
        d.name as doctor_name,
        d.specialty,
        d.hospital
       FROM appointments a
       JOIN doctors d ON a.doctor_id = d.id
       WHERE a.id = $1`,
      [appointment.id]
    );

    return NextResponse.json(
      {
        message: 'Appointment booked successfully',
        appointment: completeAppointment.rows[0]
      },
      { status: 201 }
    );

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}