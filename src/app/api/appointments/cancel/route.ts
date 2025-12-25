import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  console.log("Request received at /api/appointments/cancel");
  let client;

  try {
    // Connect to database with timeout
    client = (await Promise.race([
      pool.connect(),
      new Promise(
        (_, reject) =>
          setTimeout(
            () => reject(new Error("Database connection timeout")),
            10000
          ) // Increase timeout to 10 seconds
      ),
    ])) as any;

    // Get and verify token
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated. Please login to cancel appointments." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: number;
      };
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token. Please login again." },
        { status: 401 }
      );
    }

    const { appointmentId, withRefund } = await request.json();

    // Validate input
    if (!appointmentId) {
      return NextResponse.json(
        { error: "Appointment ID is required" },
        { status: 400 }
      );
    }

    await client.query("BEGIN");

    // Get appointment details with authorization check
    const appointmentResult = await client.query(
      `SELECT a.*, p.payment_status, p.id as payment_id 
       FROM appointments a
       LEFT JOIN payments p ON p.appointment_id = a.id
       WHERE a.id = $1 AND a.user_id = $2`,
      [appointmentId, decoded.userId]
    );

    if (appointmentResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json(
        {
          error:
            "Appointment not found or you do not have permission to cancel it",
        },
        { status: 404 }
      );
    }

    const appointment = appointmentResult.rows[0];

    // Check if appointment can be cancelled
    if (appointment.status === "cancelled") {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "This appointment is already cancelled" },
        { status: 400 }
      );
    }

    if (appointment.status === "completed") {
      await client.query("ROLLBACK");
      return NextResponse.json(
        { error: "Completed appointments cannot be cancelled" },
        { status: 400 }
      );
    }

    // Check which columns exist in the appointments table
    const columnsCheckAppointments = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'appointments' AND column_name IN ('cancellation_date', 'cancelled_by')
    `);

    const existingColumns = columnsCheckAppointments.rows.map(
      (row: any) => row.column_name
    );
    const hasCancellationDate = existingColumns.includes("cancellation_date");
    const hasCancelledBy = existingColumns.includes("cancelled_by");

    // Update appointment status with available columns
    let updateQuery = `UPDATE appointments SET status = 'cancelled'`;
    const updateParams: any[] = [appointmentId];
    let paramCount = 1;

    if (hasCancellationDate) {
      updateQuery += `, cancellation_date = NOW()`;
    }

    if (hasCancelledBy) {
      paramCount++;
      updateQuery += `, cancelled_by = $${paramCount}`;
      updateParams.push(decoded.userId);
    }

    updateQuery += ` WHERE id = $1`;

    await client.query(updateQuery, updateParams);

    // Decrease booked appointments count if availability_id exists
    if (appointment.availability_id) {
      await client.query(
        `UPDATE doctor_availability 
         SET booked_appointments = GREATEST(booked_appointments - 1, 0)
         WHERE id = $1`,
        [appointment.availability_id]
      );
    }

    // Handle refund if requested and eligible
    if (withRefund && appointment.refund_eligible) {
      // Update payment status to refunded
      if (appointment.payment_id) {
        // Check if updated_at column exists
        const columnsCheck = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'payments' AND column_name IN ('refund_date', 'refund_amount', 'updated_at')
        `);

        const paymentColumns = columnsCheck.rows.map(
          (row: any) => row.column_name
        );
        const hasRefundDate = paymentColumns.includes("refund_date");
        const hasRefundAmount = paymentColumns.includes("refund_amount");
        const hasUpdatedAt = paymentColumns.includes("updated_at");

        let paymentUpdateQuery = `UPDATE payments SET payment_status = 'refunded'`;
        const paymentParams: any[] = [appointment.payment_id];

        if (hasRefundDate) {
          paymentUpdateQuery += `, refund_date = NOW()`;
        }

        if (hasRefundAmount && appointment.total_amount) {
          paymentParams.push(appointment.total_amount);
          paymentUpdateQuery += `, refund_amount = $${paymentParams.length}`;
        }

        if (hasUpdatedAt) {
          paymentUpdateQuery += `, updated_at = NOW()`;
        }

        paymentUpdateQuery += ` WHERE id = $1`;

        await client.query(paymentUpdateQuery, paymentParams);
      }

      // Create refund record for tracking - check if refunds table exists first
      try {
        const refundsTableCheck = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'refunds'
          );
        `);

        if (refundsTableCheck.rows[0].exists) {
          await client.query(
            `INSERT INTO refunds (
              appointment_id, 
              user_id, 
              amount, 
              status, 
              refund_reason,
              created_at
            ) VALUES ($1, $2, $3, $4, $5, NOW())`,
            [
              appointmentId,
              decoded.userId,
              appointment.total_amount,
              "pending",
              "User requested cancellation with refund",
            ]
          );

          console.log(
            `Refund requested for appointment ${appointmentId}, amount: ${appointment.total_amount}`
          );
        }
      } catch (refundError) {
        console.error("Refund record creation failed:", refundError);
        // Continue without creating refund record
      }
    } else {
      // Just mark payment as cancelled (no refund)
      if (appointment.payment_id) {
        // Check which columns exist
        const columnsCheck = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'payments' AND column_name = 'updated_at'
        `);

        const hasUpdatedAt = columnsCheck.rows.length > 0;

        if (hasUpdatedAt) {
          await client.query(
            `UPDATE payments 
             SET payment_status = 'cancelled',
                 updated_at = NOW()
             WHERE id = $1`,
            [appointment.payment_id]
          );
        } else {
          // Fallback without updated_at
          await client.query(
            `UPDATE payments 
             SET payment_status = 'cancelled'
             WHERE id = $1`,
            [appointment.payment_id]
          );
        }
      }
    }

    await client.query("COMMIT");

    return NextResponse.json(
      {
        message:
          withRefund && appointment.refund_eligible
            ? "Appointment cancelled successfully. Refund will be processed within 5-7 business days."
            : "Appointment cancelled successfully",
        cancelled: true,
        refundInitiated: withRefund && appointment.refund_eligible,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error cancelling appointment:", error);

    // Rollback transaction
    if (client) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Rollback failed:", rollbackError);
      }
    }

    // Handle specific errors
    if (error.message === "Database connection timeout") {
      return NextResponse.json(
        {
          error: "Database connection failed",
          message: "Unable to connect to database. Please try again later.",
        },
        { status: 503 }
      );
    }

    if (error.code === "ETIMEDOUT") {
      return NextResponse.json(
        {
          error: "Database timeout",
          message: "Database connection timed out. Please try again.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: "Failed to cancel appointment", message: error.message },
      { status: 500 }
    );
  } finally {
    if (client) {
      client.release();
    }
  }
}
