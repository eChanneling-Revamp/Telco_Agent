import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const specialization = searchParams.get("specialization") || "";
    const hospitalType = searchParams.get("hospitalType") || "";
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");

    // If doctorId and date are provided, return availability for that doctor
    if (doctorId && date) {
      const availability = await prisma.doctor_availability.findMany({
        where: {
          doctor_id: parseInt(doctorId),
          is_active: true,
        },
        include: {
          // Get doctor details through the relation
          // Note: You'll need to add this relation to your schema first
        },
        orderBy: {
          start_time: "asc",
        },
      });

      // Calculate slots available
      const availabilityWithSlots = availability
        .filter((slot) => {
          const booked = slot.booked_appointments || 0;
          const max = slot.max_appointments || 10;
          return max - booked > 0;
        })
        .map((slot) => ({
          ...slot,
          slots_available:
            (slot.max_appointments || 10) - (slot.booked_appointments || 0),
        }));

      return NextResponse.json(
        {
          doctors: availabilityWithSlots,
        },
        { status: 200 }
      );
    }

    // Build filters for doctor search
    const whereClause: any = {
      is_active: true,
      doctor_availability: {
        some: {
          is_active: true,
          // Only include slots with availability
          OR: [
            {
              booked_appointments: {
                lt: prisma.doctor_availability.fields.max_appointments,
              },
            },
          ],
        },
      },
    };

    // Add search filter
    if (search) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          hospital: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Add specialty filter
    if (specialization) {
      whereClause.specialty = specialization;
    }

    // Add hospital type filter
    if (hospitalType) {
      whereClause.hospital_type = hospitalType;
    }

    // Fetch doctors with availability
    const doctors = await prisma.doctors.findMany({
      where: whereClause,
      include: {
        doctor_availability: {
          where: {
            is_active: true,
          },
          orderBy: {
            start_time: "asc",
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    // Format the response
    const formattedDoctors = doctors
      .map((doctor) => {
        // Filter availability slots that have space
        const availableSlots = doctor.doctor_availability.filter((slot) => {
          const booked = slot.booked_appointments || 0;
          const max = slot.max_appointments || 10;
          return max - booked > 0;
        });

        // Skip doctors with no available slots
        if (availableSlots.length === 0) return null;

        // Calculate total slots available
        const totalSlotsAvailable = availableSlots.reduce((sum, slot) => {
          const booked = slot.booked_appointments || 0;
          const max = slot.max_appointments || 10;
          return sum + (max - booked);
        }, 0);

        // Format availability slots
        const formattedSlots = availableSlots.map((slot) => ({
          availability_id: slot.id,
          start_time: slot.start_time,
          end_time: slot.end_time,
          slots_available:
            (slot.max_appointments || 10) - (slot.booked_appointments || 0),
          max_appointments: slot.max_appointments,
          booked_appointments: slot.booked_appointments,
        }));

        return {
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty,
          hospital: doctor.hospital,
          hospitalType: doctor.hospital_type,
          city: doctor.city,
          consultation_fee: parseFloat(
            doctor.consultation_fee?.toString() || "0"
          ),
          availability_slots: formattedSlots,
          total_slots_available: totalSlotsAvailable,
          // For backward compatibility
          available: formattedSlots[0]
            ? `${formattedSlots[0].start_time} - ${formattedSlots[0].end_time}`
            : "No slots",
          availabilityId: formattedSlots[0]?.availability_id || null,
          slotsAvailable: totalSlotsAvailable,
        };
      })
      .filter((doctor) => doctor !== null); // Remove doctors with no slots

    return NextResponse.json({ doctors: formattedDoctors }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { error: "Failed to fetch doctors", message: error.message },
      { status: 500 }
    );
  }
}
