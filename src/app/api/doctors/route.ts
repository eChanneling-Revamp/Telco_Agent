// import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams;
//     const search = searchParams.get("search") || "";
//     const specialization = searchParams.get("specialization") || "";
//     const hospitalType = searchParams.get("hospitalType") || "";
//     const doctorId = searchParams.get("doctorId");
//     const date = searchParams.get("date");
//     const getHospitalTypes = searchParams.get("getHospitalTypes");

//     // Return hospital types if requested
//     if (getHospitalTypes === "true") {
//       const types = await prisma.doctors.findMany({
//         distinct: ["hospital_type"],
//         select: {
//           hospital_type: true,
//         },
//       });

//       const hospitalTypes = types
//         .map((t) => t.hospital_type)
//         .filter((type) => type !== null && type !== undefined) as string[];

//       return NextResponse.json(
//         {
//           hospitalTypes: [...new Set(hospitalTypes)].sort(),
//         },
//         { status: 200 },
//       );
//     }

//     // If doctorId and date are provided, return availability for that doctor
//     if (doctorId && date) {
//       const availability = await prisma.doctor_availability.findMany({
//         where: {
//           doctor_id: parseInt(doctorId),
//           is_active: true,
//         },
//         include: {
//           // Get doctor details through the relation
//           // Note: You'll need to add this relation to your schema first
//         },
//         orderBy: {
//           start_time: "asc",
//         },
//       });

//       // Calculate slots available
//       const availabilityWithSlots = availability
//         .filter((slot) => {
//           const booked = slot.booked_appointments || 0;
//           const max = slot.max_appointments || 10;
//           return max - booked > 0;
//         })
//         .map((slot) => ({
//           ...slot,
//           slots_available:
//             (slot.max_appointments || 10) - (slot.booked_appointments || 0),
//         }));

//       return NextResponse.json(
//         {
//           doctors: availabilityWithSlots,
//         },
//         { status: 200 },
//       );
//     }

//     // Build filters for doctor search
//     const whereClause: any = {
//       is_active: true,
//       doctor_availability: {
//         some: {
//           is_active: true,
//           // Only include slots with availability
//           OR: [
//             {
//               booked_appointments: {
//                 lt: prisma.doctor_availability.fields.max_appointments,
//               },
//             },
//           ],
//         },
//       },
//     };

//     // Add search filter
//     if (search) {
//       whereClause.OR = [
//         {
//           name: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//         {
//           hospital: {
//             contains: search,
//             mode: "insensitive",
//           },
//         },
//       ];
//     }

//     // Add specialty filter
//     if (specialization) {
//       whereClause.specialty = specialization;
//     }

//     // Add hospital type filter
//     if (hospitalType) {
//       whereClause.hospital_type = hospitalType;
//     }

//     // Fetch doctors with availability
//     const doctors = await prisma.doctors.findMany({
//       where: whereClause,
//       include: {
//         doctor_availability: {
//           where: {
//             is_active: true,
//           },
//           orderBy: {
//             start_time: "asc",
//           },
//         },
//       },
//       orderBy: {
//         name: "asc",
//       },
//     });

//     // Format the response
//     const formattedDoctors = doctors
//       .map((doctor) => {
//         // Filter availability slots that have space
//         const availableSlots = doctor.doctor_availability.filter((slot) => {
//           const booked = slot.booked_appointments || 0;
//           const max = slot.max_appointments || 10;
//           return max - booked > 0;
//         });

//         // Skip doctors with no available slots
//         if (availableSlots.length === 0) return null;

//         // Calculate total slots available
//         const totalSlotsAvailable = availableSlots.reduce((sum, slot) => {
//           const booked = slot.booked_appointments || 0;
//           const max = slot.max_appointments || 10;
//           return sum + (max - booked);
//         }, 0);

//         // Format availability slots
//         const formattedSlots = availableSlots.map((slot) => ({
//           availability_id: slot.id,
//           start_time: slot.start_time,
//           end_time: slot.end_time,
//           slots_available:
//             (slot.max_appointments || 10) - (slot.booked_appointments || 0),
//           max_appointments: slot.max_appointments,
//           booked_appointments: slot.booked_appointments,
//         }));

//         return {
//           id: doctor.id,
//           name: doctor.name,
//           specialty: doctor.specialty,
//           hospital: doctor.hospital,
//           hospitalType: doctor.hospital_type,
//           city: doctor.city,
//           consultation_fee: parseFloat(
//             doctor.consultation_fee?.toString() || "0",
//           ),
//           availability_slots: formattedSlots,
//           total_slots_available: totalSlotsAvailable,
//           // For backward compatibility
//           available: formattedSlots[0]
//             ? `${formattedSlots[0].start_time} - ${formattedSlots[0].end_time}`
//             : "No slots",
//           availabilityId: formattedSlots[0]?.availability_id || null,
//           slotsAvailable: totalSlotsAvailable,
//         };
//       })
//       .filter((doctor) => doctor !== null); // Remove doctors with no slots

//     return NextResponse.json({ doctors: formattedDoctors }, { status: 200 });
//   } catch (error: any) {
//     console.error("Error fetching doctors:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch doctors", message: error.message },
//       { status: 500 },
//     );
//   }
// }
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
    const getHospitalTypes = searchParams.get("getHospitalTypes");

    // Return hospital types if requested
    if (getHospitalTypes === "true") {
      const types = await prisma.doctors.findMany({
        distinct: ["hospital_type"],
        select: {
          hospital_type: true,
        },
      });

      const hospitalTypes = types
        .map((t) => t.hospital_type)
        .filter((type) => type !== null && type !== undefined) as string[];

      return NextResponse.json(
        {
          hospitalTypes: [...new Set(hospitalTypes)].sort(),
        },
        { status: 200 },
      );
    }

    // If doctorId and date are provided, return availability for that doctor on that date
    if (doctorId && date) {
      // Get the day of week from the date
      const selectedDate = new Date(date);
      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const selectedDayName = dayNames[selectedDate.getDay()];

      // Fetch all availability for this doctor
      const allAvailability = await prisma.doctor_availability.findMany({
        where: {
          doctor_id: parseInt(doctorId),
          is_active: true,
        },
        orderBy: {
          start_time: "asc",
        },
      });

      // Filter availability based on:
      // 1. Specific date match (availability_date)
      // 2. OR day of week match (availability_days contains the selected day)
      const availableSlots = allAvailability.filter((slot) => {
        // If there's a specific date set, check if it matches
        if (slot.availability_date) {
          const slotDate = new Date(slot.availability_date);
          return slotDate.toDateString() === selectedDate.toDateString();
        }

        // Otherwise, check if the day of week is in availability_days
        if (slot.availability_days) {
          // Parse the JSON array if it's stored as string
          const availableDays =
            typeof slot.availability_days === "string"
              ? JSON.parse(slot.availability_days)
              : slot.availability_days;

          return Array.isArray(availableDays) && availableDays.includes(selectedDayName);
        }

        return false;
      });

      // If no slots available for this day, return all doctor's availability for info
      if (availableSlots.length === 0) {
        // Get unique available days from all slots
        const availableDaysSet = new Set<string>();
        allAvailability.forEach((slot) => {
          if (slot.availability_days) {
            const days =
              typeof slot.availability_days === "string"
                ? JSON.parse(slot.availability_days)
                : slot.availability_days;
            if (Array.isArray(days)) {
              days.forEach((day) => availableDaysSet.add(day));
            }
          }
        });

        return NextResponse.json(
          {
            doctors: [],
            available: false,
            selectedDay: selectedDayName,
            availableDays: Array.from(availableDaysSet).sort(),
            message: `Doctor is not available on ${selectedDayName}`,
          },
          { status: 200 },
        );
      }

      // Return availability slots with max_appointments and booked_appointments
      const availabilityData = availableSlots.map((slot) => ({
        id: slot.id,
        start_time: slot.start_time,
        end_time: slot.end_time,
        max_appointments: slot.max_appointments || 0,
        booked_appointments: slot.booked_appointments || 0,
        slots_available: (slot.max_appointments || 0) - (slot.booked_appointments || 0),
      }));

      return NextResponse.json(
        {
          doctors: availabilityData,
          available: true,
          selectedDay: selectedDayName,
        },
        { status: 200 },
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
          availability_days: slot.availability_days,
        }));

        return {
          id: doctor.id,
          name: doctor.name,
          specialty: doctor.specialty,
          hospital: doctor.hospital,
          hospitalType: doctor.hospital_type,
          city: doctor.city,
          consultation_fee: parseFloat(
            doctor.consultation_fee?.toString() || "0",
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
      { status: 500 },
    );
  }
}