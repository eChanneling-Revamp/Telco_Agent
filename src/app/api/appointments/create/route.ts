import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Helper function to format appointment ID
function formatAppointmentId(id: number): string {
  return `APT${String(id).padStart(4, "0")}`;
}

export async function POST(request: NextRequest) {
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
      name: patientName,
      mobile: patientPhone,
      email: patientEmail,
      nic: patientNIC,
      dob: patientDOB,
      gender: patientGender,
      age: patientAge,
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

    const finalSltPhone = sltPhone || patientPhone || null;

    if (!finalSltPhone) {
      return NextResponse.json(
        { error: "Either sltPhone or patientPhone is required" },
        { status: 400 }
      );
    }

    // Fetch doctor details using Prisma
    const doctor = await prisma.doctors.findUnique({
      where: { id: doctorId },
      select: {
        id: true,
        name: true,
        specialty: true,
        hospital: true,
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 400 });
    }

    // Check availability if provided
    if (availabilityId) {
      const availability = await prisma.doctor_availability.findFirst({
        where: {
          id: availabilityId,
          is_active: true,
        },
      });

      if (!availability) {
        return NextResponse.json(
          { error: "This time slot is no longer available" },
          { status: 400 }
        );
      }

      // Check if slots are available
      const bookedAppointments = availability.booked_appointments || 0;
      const maxAppointments = availability.max_appointments || 10;

      if (bookedAppointments >= maxAppointments) {
        return NextResponse.json(
          { error: "This time slot is fully booked" },
          { status: 400 }
        );
      }
    }

    // Normalize appointmentTime
    let appointmentTimeValue: string = appointmentTime;
    if (typeof appointmentTimeValue === "string") {
      const parts = appointmentTimeValue.split(/[-–]/);
      appointmentTimeValue = parts[0].trim();

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

    // Use Prisma transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Create appointment
      const appointment = await tx.appointments.create({
        data: {
          user_id: userId,
          doctor_id: doctorId,
          availability_id: availabilityId || null,
          patient_name: patientName,
          patient_phone: patientPhone || finalSltPhone,
          patient_email: patientEmail || null,
          patient_nic: patientNIC || null,
          patient_dob: patientDOB ? new Date(patientDOB) : null,
          patient_gender: patientGender || null,
          patient_age: patientAge ? parseInt(patientAge) : null,
          slt_phone: finalSltPhone,
          notes: notes || null,
          appointment_date: new Date(appointmentDate),
          appointment_time: new Date(`1970-01-01T${appointmentTimeValue}`),
          payment_method: paymentMethod || "bill",
          total_amount: totalAmount,
          is_member: isMember || false,
          send_sms: sendSms !== undefined ? sendSms : true,
          send_email: sendEmail !== undefined ? sendEmail : false,
          status: "confirmed",
          doctor_name: doctor.name,
          specialty: doctor.specialty,
          hospital: doctor.hospital,
          refund_eligible: agreeRefund || false,
        },
      });

      // Update availability count if provided
      if (availabilityId) {
        await tx.doctor_availability.update({
          where: { id: availabilityId },
          data: {
            booked_appointments: {
              increment: 1,
            },
          },
        });
      }

      // Create payment record
      const paymentStatus = paymentMethod === "card" ? "pending" : "paid";
      await tx.payments.create({
        data: {
          appointment_id: appointment.id,
          payment_method: paymentMethod,
          amount: totalAmount,
          payment_status: paymentStatus,
        },
      });

      return appointment;
    });

    // Get complete appointment details with relations
    const completeAppointment = await prisma.appointments.findUnique({
      where: { id: result.id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const formattedAppointmentId = formatAppointmentId(result.id);

    // Send email if provided
    if (patientEmail && patientEmail.trim() !== "") {
      try {
        console.log("📧 Sending confirmation email to:", patientEmail);

        const basePrice = agreeRefund ? totalAmount - 250 : totalAmount;
        const refundDeposit = agreeRefund ? 250 : 0;

        const emailPayload = {
          email: patientEmail,
          appointmentDetails: {
            appointmentId: formattedAppointmentId,
            doctor: doctor.name,
            specialization: doctor.specialty,
            hospital: doctor.hospital,
            date: new Date(appointmentDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            time: appointmentTime,
            patientName: patientName,
            patientPhone: patientPhone || finalSltPhone,
            patientNIC: patientNIC || null,
            status: "confirmed",
            basePrice: basePrice,
            refundDeposit: refundDeposit,
            total: totalAmount,
          },
        };

        const emailResponse = await fetch(
          `${
            process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
          }/api/appointments/send-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(emailPayload),
          }
        );

        if (emailResponse.ok) {
          console.log("✅ Confirmation email sent successfully");
        } else {
          console.error("⚠️ Email sending failed, but appointment created");
        }
      } catch (emailError) {
        console.error("⚠️ Email error (non-blocking):", emailError);
      }
    }

    return NextResponse.json(
      {
        message: "Appointment booked successfully",
        appointment: {
          ...completeAppointment,
          formattedId: formattedAppointmentId,
        },
        emailSent: !!patientEmail,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating appointment:", error);

    return NextResponse.json(
      { error: "Failed to create appointment", message: error.message },
      { status: 500 }
    );
  }
}
