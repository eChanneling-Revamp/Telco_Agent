import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  const client = await pool.connect();

  try {
    const token = request.cookies.get("token")?.value;
    let userId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          userId: number;
        };
        userId = decoded.userId;
      } catch (error) {
        console.log("Invalid token, continuing as guest");
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
      sendEmail,
      agreeRefund,
    } = body;

    // Validation - check required fields
    if (
      !doctorId ||
      !patientName ||
      !appointmentDate ||
      !appointmentTime ||
      !totalAmount
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: doctorId, patientName, appointmentDate, appointmentTime, totalAmount",
        },
        { status: 400 }
      );
    }

    // Use sltPhone if provided, otherwise use patientPhone, otherwise use null
    const finalSltPhone = sltPhone || patientPhone || null;

    if (!finalSltPhone) {
      return NextResponse.json(
        { error: "Either sltPhone or patientPhone is required" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Fetch doctor details
    const doctorResult = await client.query(
      `SELECT id, name, specialty, hospital FROM doctors WHERE id = $1`,
      [doctorId]
    );

    if (doctorResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Doctor not found" }, { status: 400 });
    }

    const doctor = doctorResult.rows[0];

    // Check if slot is available (optional check if availabilityId is provided)
    if (availabilityId) {
      const availabilityCheck = await client.query(
        `SELECT * FROM doctor_availability 
         WHERE id = $1 AND is_active = true 
         AND booked_appointments < max_appointments`,
        [availabilityId]
      );

      if (availabilityCheck.rows.length === 0) {
        await client.query("ROLLBACK");
        return NextResponse.json(
          { error: "This time slot is no longer available" },
          { status: 400 }
        );
      }
    }

    // Normalize appointmentTime: extract start time if a range was passed
    let appointmentTimeValue: string = appointmentTime;
    if (typeof appointmentTimeValue === "string") {
      // If time is passed as a range like "14:00:00 - 17:00:00" or "2:00 PM–5:00 PM", take start
      const parts = appointmentTimeValue.split(/[-–]/);
      appointmentTimeValue = parts[0].trim();

      // If time contains AM/PM convert to 24h HH:MM:SS
      const ampmMatch = appointmentTimeValue.match(
        /(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM|am|pm)/
      );
      if (ampmMatch) {
        let hh = parseInt(ampmMatch[1], 10);
        const mm = ampmMatch[2];
        const ss = ampmMatch[3] || "00";
        const ampm = ampmMatch[4].toLowerCase();
        if (ampm === "pm" && hh !== 12) hh += 12;
        if (ampm === "am" && hh === 12) hh = 0;
        appointmentTimeValue = `${String(hh).padStart(2, "0")}:${mm}:${ss}`;
      } else {
        // If time is HH:MM or HH:MM:SS ensure seconds present
        const hhmm = appointmentTimeValue.match(
          /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/
        );
        if (hhmm) {
          const hh = hhmm[1].padStart(2, "0");
          const mm = hhmm[2];
          const ss = hhmm[3] || "00";
          appointmentTimeValue = `${hh}:${mm}:${ss}`;
        }
      }
    }

    // Create appointment
    const appointmentResult = await client.query(
      `INSERT INTO appointments (
        user_id, doctor_id, availability_id, patient_name, patient_phone,
        patient_email, slt_phone, notes, appointment_date, appointment_time,
        payment_method, total_amount, is_member, send_sms, send_email, status,
        doctor_name, specialty, hospital, refund_eligible
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
      RETURNING *`,
      [
        userId,
        doctorId,
        availabilityId || null,
        patientName,
        patientPhone || finalSltPhone,
        patientEmail || null,
        finalSltPhone,
        notes || null,
        appointmentDate,
        appointmentTimeValue,
        paymentMethod || "bill",
        totalAmount,
        isMember || false,
        sendSms !== undefined ? sendSms : true,
        sendEmail !== undefined ? sendEmail : false,
        "confirmed",
        doctor.name,
        doctor.specialty,
        doctor.hospital,
        agreeRefund || false,
      ]
    );

    const appointment = appointmentResult.rows[0];

    // Update availability count (if availabilityId was provided)
    if (availabilityId) {
      await client.query(
        `UPDATE doctor_availability 
         SET booked_appointments = booked_appointments + 1 
         WHERE id = $1`,
        [availabilityId]
      );
    }

    // Create payment record
    const paymentStatus = paymentMethod === "card" ? "pending" : "paid";
    await client.query(
      `INSERT INTO payments (appointment_id, payment_method, amount, payment_status)
       VALUES ($1, $2, $3, $4)`,
      [appointment.id, paymentMethod, totalAmount, paymentStatus]
    );

    await client.query("COMMIT");

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
        message: "Appointment booked successfully",
        appointment: completeAppointment.rows[0],
      },
      { status: 201 }
    );
  } catch (error: any) {
    await client.query("ROLLBACK");
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Failed to create appointment", message: error.message },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
