// "use client";

// import React, { useState, useEffect } from "react";
// import { Clock, CheckCircle } from "lucide-react";

// type Doctor = {
//   id: number;
//   name: string;
//   specialty: string;
//   hospital: string;
//   consultationFee: number;
//   availabilityId?: number;
// };

// type TimeSlot = {
//   time: string;
//   available: boolean;
// };

// interface SelectDateTimeProps {
//   doctor: Doctor;
//   onNext: (date: string, time: string) => void;
//   onBack: () => void;
//   initialDate?: string;
//   initialTime?: string;
// }

// export default function SelectDateTime({
//   doctor,
//   onNext,
//   onBack,
//   initialDate,
//   initialTime,
// }: SelectDateTimeProps) {
//   const [selectedDate, setSelectedDate] = useState(initialDate || "");
//   const [selectedTime, setSelectedTime] = useState(initialTime || "");
//   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch time slots when date is selected
//   useEffect(() => {
//     if (!selectedDate) {
//       setTimeSlots([]);
//       setSelectedTime("");
//       return;
//     }

//     const fetchTimeSlots = async () => {
//       setLoading(true);
//       try {
//         const params = new URLSearchParams();
//         params.set("doctorId", String(doctor.id));
//         params.set("date", selectedDate);

//         const response = await fetch(`/api/appointments?${params.toString()}`);
//         const data = await response.json();

//         if (data.doctors && data.doctors.length > 0) {
//           const availability = data.doctors[0];
//           // Validate that start_time and end_time exist
//           if (availability.start_time && availability.end_time) {
//             const slots = generateTimeSlots(
//               availability.start_time,
//               availability.end_time
//             );
//             setTimeSlots(slots);
//           } else {
//             console.warn("Missing start_time or end_time in availability data");
//             setTimeSlots(getDefaultTimeSlots());
//           }
//         } else {
//           // Fallback to default slots if no availability found
//           setTimeSlots(getDefaultTimeSlots());
//         }
//       } catch (error) {
//         console.error("Error fetching time slots:", error);
//         setTimeSlots(getDefaultTimeSlots());
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTimeSlots();
//   }, [selectedDate, doctor.id]);

//   // Generate time slots between two times (15-min intervals)
//   const generateTimeSlots = (
//     startTime: string,
//     endTime: string
//   ): TimeSlot[] => {
//     // Validate inputs
//     if (!startTime || !endTime) {
//       console.error("Invalid time parameters:", { startTime, endTime });
//       return [];
//     }

//     const slots: TimeSlot[] = [];

//     try {
//       const startParts = startTime.split(":");
//       const endParts = endTime.split(":");

//       // Validate time format
//       if (startParts.length < 2 || endParts.length < 2) {
//         console.error("Invalid time format:", { startTime, endTime });
//         return [];
//       }

//       const [startHour, startMin] = startParts.map(Number);
//       const [endHour, endMin] = endParts.map(Number);

//       // Validate that we got valid numbers
//       if (
//         isNaN(startHour) ||
//         isNaN(startMin) ||
//         isNaN(endHour) ||
//         isNaN(endMin)
//       ) {
//         console.error("Invalid time values:", { startTime, endTime });
//         return [];
//       }

//       let currentHour = startHour;
//       let currentMin = startMin;

//       while (
//         currentHour < endHour ||
//         (currentHour === endHour && currentMin < endMin)
//       ) {
//         const timeStr = `${String(currentHour).padStart(2, "0")}:${String(
//           currentMin
//         ).padStart(2, "0")}`;
//         const ampm = currentHour >= 12 ? "PM" : "AM";
//         const displayHour = currentHour % 12 || 12;
//         slots.push({
//           time: `${displayHour}:${String(currentMin).padStart(2, "0")} ${ampm}`,
//           available: true,
//         });

//         currentMin += 15;
//         if (currentMin >= 60) {
//           currentMin = 0;
//           currentHour += 1;
//         }
//       }

//       return slots;
//     } catch (error) {
//       console.error("Error generating time slots:", error);
//       return [];
//     }
//   };

//   // Default fallback time slots (15-minute intervals)
//   const getDefaultTimeSlots = (): TimeSlot[] => [
//     { time: "09:00 AM", available: true },
//     { time: "09:15 AM", available: true },
//     { time: "09:30 AM", available: false },
//     { time: "09:45 AM", available: true },
//     { time: "10:00 AM", available: true },
//     { time: "10:15 AM", available: true },
//     { time: "10:30 AM", available: true },
//     { time: "10:45 AM", available: false },
//     { time: "11:00 AM", available: true },
//     { time: "11:15 AM", available: true },
//     { time: "11:30 AM", available: true },
//     { time: "11:45 AM", available: true },
//     { time: "12:00 PM", available: false },
//     { time: "01:00 PM", available: true },
//     { time: "01:15 PM", available: true },
//     { time: "01:30 PM", available: false },
//     { time: "01:45 PM", available: true },
//     { time: "02:00 PM", available: true },
//     { time: "02:15 PM", available: true },
//     { time: "02:30 PM", available: true },
//     { time: "02:45 PM", available: true },
//     { time: "03:00 PM", available: true },
//     { time: "03:15 PM", available: false },
//     { time: "03:30 PM", available: true },
//     { time: "03:45 PM", available: true },
//     { time: "04:00 PM", available: true },
//     { time: "04:15 PM", available: true },
//     { time: "04:30 PM", available: true },
//     { time: "04:45 PM", available: false },
//   ];

//   return (
//     <div className="mx-auto p-6 px-2 py-6 mb-2">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">
//         Place an Appointment
//       </h1>

//       {/* Progress Bar */}
//       <div className="flex items-center gap-2 mb-8">
//         <div className="flex-1 h-2 bg-blue-900 rounded"></div>
//         <div className="flex-1 h-2 bg-blue-900 rounded"></div>
//         <div className="flex-1 h-2 bg-gray-400 rounded"></div>
//         <div className="flex-1 h-2 bg-gray-400 rounded"></div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//         <h2 className="text-xl font-semibold text-gray-900 mb-6">
//           Select Date & Time
//         </h2>

//         {/* Selected Doctor Info */}
//         <div className="bg-gray-50 rounded-lg p-4 mb-6">
//           <p className="text-sm text-gray-500 mb-2">Selected Doctor</p>
//           <p className="font-semibold text-gray-900">{doctor.name}</p>
//           <p className="text-sm text-gray-600">
//             {doctor.specialty} • {doctor.hospital}
//           </p>
//         </div>

//         {/* Date Picker */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-800 mb-2">
//             Appointment Date
//           </label>
//           <input
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             min={new Date().toISOString().split("T")[0]}
//             className="w-full px-4 py-3 text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>

//         {/* Time Slots */}
//         <div className="mb-6">
//           <label className="block text-sm font-medium text-gray-700 mb-3">
//             Time Slots for {selectedDate || "Select a date"}
//           </label>
//           {!selectedDate ? (
//             <div className="text-center py-8 text-gray-500">
//               Please select a date to view available time slots
//             </div>
//           ) : loading ? (
//             <div className="text-center py-8 text-gray-500">
//               Loading time slots...
//             </div>
//           ) : timeSlots.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               No time slots available for this date
//             </div>
//           ) : (
//             <div className="grid grid-cols-4 gap-3">
//               {timeSlots.map((slot) => (
//                 <button
//                   key={slot.time}
//                   onClick={() => slot.available && setSelectedTime(slot.time)}
//                   disabled={!slot.available}
//                   className={`py-3 px-2 rounded-lg border-2 text-sm font-medium transition min-h-[3.5rem] flex flex-col items-center justify-center ${
//                     selectedTime === slot.time
//                       ? "border-teal-400 bg-teal-400 text-white"
//                       : slot.available
//                       ? "border-teal-400 hover:border-teal-400 hover:bg-teal-100 text-gray-700 bg-teal-50"
//                       : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-1">
//                     <span className="whitespace-nowrap">{slot.time}</span>
//                     {selectedTime === slot.time && (
//                       <CheckCircle size={16} className="text-white font-bold" />
//                     )}
//                   </div>
//                   {!slot.available && (
//                     <div className="text-xs mt-1">Booked</div>
//                   )}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex gap-4">
//           <button
//             onClick={onBack}
//             className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
//           >
//             ← Back
//           </button>
//           <button
//             onClick={() =>
//               selectedDate && selectedTime && onNext(selectedDate, selectedTime)
//             }
//             disabled={!selectedDate || !selectedTime}
//             className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
//           >
//             Continue to Price & Patient
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, Calendar } from "lucide-react";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  consultationFee: number;
  availabilityId?: number;
};

type TimeSlot = {
  time: string;
  available: boolean;
  slotNumber: number;
};

interface SelectDateTimeProps {
  doctor: Doctor;
  onNext: (date: string, time: string) => void;
  onBack: () => void;
  initialDate?: string;
  initialTime?: string;
}

export default function SelectDateTime({
  doctor,
  onNext,
  onBack,
  initialDate,
  initialTime,
}: SelectDateTimeProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate || "");
  const [selectedTime, setSelectedTime] = useState(initialTime || "");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [availabilityInfo, setAvailabilityInfo] = useState<{
    available: boolean;
    selectedDay: string;
    availableDays: string[];
    message?: string;
  } | null>(null);

  // Fetch time slots when date is selected
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      setSelectedTime("");
      setAvailabilityInfo(null);
      return;
    }

    const fetchTimeSlots = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("doctorId", String(doctor.id));
        params.set("date", selectedDate);

        const response = await fetch(`/api/doctors?${params.toString()}`);
        const data = await response.json();

        // Check if doctor is available on this day
        if (!data.available && data.availableDays) {
          setAvailabilityInfo({
            available: false,
            selectedDay: data.selectedDay,
            availableDays: data.availableDays,
            message: data.message,
          });
          setTimeSlots([]);
          setSelectedTime("");
          setLoading(false);
          return;
        }

        if (data.doctors && data.doctors.length > 0) {
          // Generate time slots based on max_appointments
          const allSlots: TimeSlot[] = [];

          data.doctors.forEach((availability: any) => {
            const {
              start_time,
              end_time,
              max_appointments,
              booked_appointments,
            } = availability;

            if (start_time && end_time && max_appointments > 0) {
              const slots = generateAppointmentSlots(
                start_time,
                end_time,
                max_appointments,
                booked_appointments || 0,
              );
              allSlots.push(...slots);
            }
          });

          setTimeSlots(allSlots);
          setAvailabilityInfo({
            available: true,
            selectedDay: data.selectedDay,
            availableDays: [],
          });
        } else {
          setTimeSlots([]);
          setAvailabilityInfo({
            available: false,
            selectedDay: data.selectedDay || "",
            availableDays: data.availableDays || [],
            message: "No time slots available for this date",
          });
        }
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setTimeSlots([]);
        setAvailabilityInfo({
          available: false,
          selectedDay: "",
          availableDays: [],
          message: "Error loading availability",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, doctor.id]);

  /**
   * Generate appointment slots based on max_appointments
   * Distributes appointments evenly across the time range
   * Marks first booked_appointments slots as unavailable
   */
  const generateAppointmentSlots = (
    startTime: string,
    endTime: string,
    maxAppointments: number,
    bookedAppointments: number,
  ): TimeSlot[] => {
    const slots: TimeSlot[] = [];

    try {
      // Validate inputs
      if (!startTime || !endTime || maxAppointments <= 0) {
        console.error("Invalid inputs for slot generation:", {
          startTime,
          endTime,
          maxAppointments,
        });
        return [];
      }

      // Parse start and end times - handle format like "09:00:00"
      // Handle DateTime objects from Prisma
      let startTimeStr = startTime;
      let endTimeStr = endTime;

      // If it's a DateTime object, extract just the time portion
      if (typeof startTime === "string" && startTime.includes("T")) {
        startTimeStr = startTime.split("T")[1];
      }
      if (typeof endTime === "string" && endTime.includes("T")) {
        endTimeStr = endTime.split("T")[1];
      }

      console.log("🕐 Processing times:", { startTimeStr, endTimeStr });

      const startParts = startTimeStr.split(":");
      const endParts = endTimeStr.split(":");

      if (startParts.length < 2 || endParts.length < 2) {
        console.error("Invalid time format:", { startTimeStr, endTimeStr });
        return [];
      }

      const startHour = parseInt(startParts[0], 10);
      const startMin = parseInt(startParts[1], 10);
      const endHour = parseInt(endParts[0], 10);
      const endMin = parseInt(endParts[1], 10);

      // Validate parsed values
      if (
        isNaN(startHour) ||
        isNaN(startMin) ||
        isNaN(endHour) ||
        isNaN(endMin)
      ) {
        console.error("Failed to parse time values:", {
          startHour,
          startMin,
          endHour,
          endMin,
          original: { startTime, endTime },
        });
        return [];
      }

      console.log("✅ Parsed:", {
        startHour,
        startMin,
        endHour,
        endMin,
      });

      // Calculate total minutes in the time range
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const totalMinutes = endMinutes - startMinutes;

      if (totalMinutes <= 0) {
        console.error("Invalid time range:", { startMinutes, endMinutes });
        return [];
      }

      // Calculate time interval between appointments (in minutes)
      const intervalMinutes = Math.floor(totalMinutes / maxAppointments);

      if (intervalMinutes <= 0) {
        console.error("Invalid interval minutes:", intervalMinutes);
        return [];
      }

      // Generate slots
      for (let i = 0; i < maxAppointments; i++) {
        const slotMinutes = startMinutes + i * intervalMinutes;
        const slotHour = Math.floor(slotMinutes / 60);
        const slotMin = slotMinutes % 60;

        // Convert to 12-hour format
        const ampm = slotHour >= 12 ? "PM" : "AM";
        const displayHour = slotHour % 12 || 12;

        // Ensure proper formatting with padding
        const timeString = `${displayHour}:${String(slotMin).padStart(2, "0")} ${ampm}`;

        console.log(`Slot ${i + 1}: ${timeString} (minute: ${slotMinutes})`);

        slots.push({
          time: timeString,
          available: i >= bookedAppointments, // First bookedAppointments slots are unavailable
          slotNumber: i + 1,
        });
      }

      console.log("Generated slots:", slots);
      return slots;
    } catch (error) {
      console.error("Error generating appointment slots:", error);
      return [];
    }
  };

  // Get day name from date
  const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    <div className="mx-auto p-6 px-2 py-6 mb-2">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Place an Appointment
      </h1>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-2 bg-blue-900 rounded"></div>
        <div className="flex-1 h-2 bg-blue-900 rounded"></div>
        <div className="flex-1 h-2 bg-gray-400 rounded"></div>
        <div className="flex-1 h-2 bg-gray-400 rounded"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Select Date & Time
        </h2>

        {/* Selected Doctor Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">Selected Doctor</p>
          <p className="font-semibold text-gray-900">{doctor.name}</p>
          <p className="text-sm text-gray-600">
            {doctor.specialty} • {doctor.hospital}
          </p>
        </div>

        {/* Date Picker */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Appointment Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full px-4 py-3 text-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {selectedDate && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: {getDayName(selectedDate)}
            </p>
          )}
        </div>

        {/* Availability Message */}
        {availabilityInfo && !availabilityInfo.available && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle
                className="text-amber-600 mt-0.5 flex-shrink-0"
                size={20}
              />
              <div className="flex-1">
                <p className="font-medium text-amber-900 mb-2">
                  {availabilityInfo.message ||
                    `Doctor not available on ${availabilityInfo.selectedDay}`}
                </p>
                {availabilityInfo.availableDays.length > 0 && (
                  <div>
                    <p className="text-sm text-amber-800 mb-2">
                      This doctor is available on:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {availabilityInfo.availableDays.map((day) => (
                        <span
                          key={day}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-amber-300 rounded-md text-sm text-amber-900"
                        >
                          <Calendar size={14} />
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Time Slots */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {selectedDate
              ? `Available Appointment Slots for ${getDayName(selectedDate)}, ${selectedDate}`
              : "Select a date to view available appointment slots"}
          </label>

          {!selectedDate ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <Calendar className="mx-auto mb-2 text-gray-400" size={40} />
              <p>Please select a date to view available appointment slots</p>
            </div>
          ) : loading ? (
            <div className="text-center py-8 text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mb-2"></div>
              <p>Loading appointment slots...</p>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
              <AlertCircle className="mx-auto mb-2 text-gray-400" size={40} />
              <p>No appointment slots available for this date</p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  Total Slots: {timeSlots.length}
                </span>
                <span className="text-gray-600">
                  Available:{" "}
                  <span className="font-semibold text-green-600">
                    {timeSlots.filter((s) => s.available).length}
                  </span>{" "}
                  | Booked:{" "}
                  <span className="font-semibold text-red-600">
                    {timeSlots.filter((s) => !s.available).length}
                  </span>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {timeSlots.map((slot) => (
                  <button
                    key={`${slot.time}-${slot.slotNumber}`}
                    onClick={() => slot.available && setSelectedTime(slot.time)}
                    disabled={!slot.available}
                    className={`py-3 px-2 rounded-lg border-2 text-sm font-medium transition min-h-[3.5rem] flex flex-col items-center justify-center ${
                      selectedTime === slot.time
                        ? "border-teal-400 bg-teal-400 text-white"
                        : slot.available
                          ? "border-teal-400 hover:border-teal-400 hover:bg-teal-100 text-gray-700 bg-teal-50"
                          : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className="whitespace-nowrap">{slot.time}</span>
                      {selectedTime === slot.time && (
                        <CheckCircle
                          size={16}
                          className="text-white font-bold"
                        />
                      )}
                    </div>
                    {!slot.available && (
                      <div className="text-xs mt-1 text-red-500 font-medium">
                        Booked
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            ← Back
          </button>
          <button
            onClick={() =>
              selectedDate && selectedTime && onNext(selectedDate, selectedTime)
            }
            disabled={!selectedDate || !selectedTime}
            className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Continue to Price & Patient
          </button>
        </div>
      </div>
    </div>
  );
}
