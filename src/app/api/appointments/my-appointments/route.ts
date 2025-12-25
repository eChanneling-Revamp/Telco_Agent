import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    // Get query parameters
    const url = new URL(request.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const date = url.searchParams.get("date") || "";

    // Build where clause dynamically
    const whereClause: any = {
      user_id: decoded.userId,
    };

    if (status) {
      whereClause.status = status;
    }

    if (date) {
      whereClause.appointment_date = new Date(date);
    }

    if (search) {
      whereClause.OR = [
        {
          patient_name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          doctor_name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Get total count
    const total = await prisma.appointments.count({
      where: whereClause,
    });

    // Fetch appointments with relations
    const appointmentsData = await prisma.appointments.findMany({
      where: whereClause,
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: {
          select: {
            payment_status: true,
            transaction_id: true,
          },
        },
      },
      orderBy: {
        updated_at: "desc",
      },
    });

    // Format the response
    const appointments = appointmentsData.map((appt) => ({
      id: appt.id,
      user_id: appt.user_id,
      doctor_id: appt.doctor_id,
      patient_name: appt.patient_name,
      patient_phone: appt.patient_phone,
      patient_email: appt.patient_email,
      patient_nic: appt.patient_nic,
      patient_dob: appt.patient_dob?.toISOString().split("T")[0] || null,
      patient_gender: appt.patient_gender,
      patient_age: appt.patient_age,
      slt_phone: appt.slt_phone,
      appointment_date: appt.appointment_date.toISOString().split("T")[0],
      appointment_time: appt.appointment_time,
      status: appt.status,
      payment_method: appt.payment_method,
      total_amount: parseFloat(appt.total_amount.toString()),
      is_member: appt.is_member,
      send_sms: appt.send_sms,
      send_email: appt.send_email,
      notes: appt.notes,
      doctor_name: appt.doctor_name,
      specialty: appt.specialty,
      hospital: appt.hospital,
      refund_eligible: appt.refund_eligible,
      payment_status: appt.payments[0]?.payment_status || null,
      transaction_id: appt.payments[0]?.transaction_id || null,
      created_at: appt.created_at,
      updated_at: appt.updated_at,
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
