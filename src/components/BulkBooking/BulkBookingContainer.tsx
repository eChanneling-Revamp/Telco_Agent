"use client";

import { useMemo, useState, useEffect } from "react";

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  hospital: string;
  consultation_fee: number;
};

type TimeSlot = {
  time: string;
  available: boolean;
  slotNumber: number;
};

export default function BulkBookingContainer({ cart, setCart }: any) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showDoctorList, setShowDoctorList] = useState(true);

  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("All Specialties");
  const [hospital, setHospital] = useState("All Hospitals");

  const [appointmentDate, setAppointmentDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [patientName, setPatientName] = useState("");
  const [patientNIC, setPatientNIC] = useState("");
  const [patientDOB, setPatientDOB] = useState("");
  const [patientGender, setPatientGender] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientMobile, setPatientMobile] = useState("");
  const [agreeRefund, setAgreeRefund] = useState(false);

  const [showBookingForm, setShowBookingForm] = useState(false);

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [availabilityInfo, setAvailabilityInfo] = useState<{
    available: boolean;
    selectedDay: string;
    availableDays: string[];
    message?: string;
  } | null>(null);

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors");
        const data = await response.json();
        setDoctors(data.doctors || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Fetch time slots when date and doctor are selected
  useEffect(() => {
    if (!appointmentDate || !selectedDoctor) {
      setTimeSlots([]);
      setSelectedTime(null);
      setAvailabilityInfo(null);
      return;
    }

    const fetchTimeSlots = async () => {
      setLoadingSlots(true);
      try {
        const params = new URLSearchParams();
        params.set("doctorId", String(selectedDoctor.id));
        params.set("date", appointmentDate);

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
          setSelectedTime(null);
          setLoadingSlots(false);
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
        setLoadingSlots(false);
      }
    };

    fetchTimeSlots();
  }, [appointmentDate, selectedDoctor]);

  const specialties = useMemo(
    () => ["All Specialties", ...new Set(doctors.map((d) => d.specialty))],
    [doctors],
  );

  const hospitals = useMemo(
    () => ["All Hospitals", ...new Set(doctors.map((d) => d.hospital))],
    [doctors],
  );

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

        slots.push({
          time: timeString,
          available: i >= bookedAppointments, // First bookedAppointments slots are unavailable
          slotNumber: i + 1,
        });
      }

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

  const filtered = doctors.filter((d) => {
    if (specialty !== "All Specialties" && d.specialty !== specialty)
      return false;
    if (hospital !== "All Hospitals" && d.hospital !== hospital) return false;
    if (
      search &&
      !`${d.name} ${d.hospital}`.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const resetForm = () => {
    setShowDoctorList(true);
    setSelectedDoctor(null);
    setShowBookingForm(false);
    setSelectedTime(null);
    setAppointmentDate("");
    setPatientName("");
    setPatientNIC("");
    setPatientDOB("");
    setPatientGender("");
    setPatientAge("");
    setPatientMobile("");
    setPatientEmail("");
    setAgreeRefund(false);
  };

  /* ------------------ DOCTOR LIST SCREEN ------------------ */
  if (showDoctorList) {
    return (
      <div className="space-y-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctor or hospital..."
          className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {specialties.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={hospital}
            onChange={(e) => setHospital(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {hospitals.map((h) => (
              <option key={h}>{h}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">
            Loading doctors...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No doctors found</div>
        ) : (
          <div className="space-y-3">
            {filtered.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setSelectedDoctor(doc);
                  setShowDoctorList(false);
                }}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all"
              >
                <div className="font-bold text-gray-900">{doc.name}</div>
                <div className="text-sm text-gray-600">
                  {doc.specialty} • {doc.hospital}
                </div>
                <div className="text-2xl font-semibold text-blue-800 mt-1 text-right">
                  Rs. {doc.consultation_fee}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ------------------ BOOKING FORM (PRICE & PATIENT DETAILS) ------------------ */
  if (showBookingForm && selectedTime) {
    const basePrice = Number(selectedDoctor?.consultation_fee || 0);
    const refund = 250;
    const totalPrice = agreeRefund ? basePrice + refund : basePrice;

    return (
      <div className="space-y-6">
        {/* Selected Doctor Info */}
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-2">Selected Doctor</p>
          <p className="font-semibold text-gray-900">{selectedDoctor?.name}</p>
          <p className="text-sm text-gray-600">{selectedDoctor?.specialty}</p>
          <p className="text-sm text-gray-600">{selectedDoctor?.hospital}</p>
          <button
            onClick={resetForm}
            className="text-blue-600 underline mt-2 text-sm hover:text-blue-700"
          >
            Change Doctor
          </button>
        </div>

        {/* Appointment Date & Time */}
        <div>
          <p className="text-sm text-gray-500 mb-2">Appointment Date & Time</p>
          <p className="font-medium text-gray-900">{appointmentDate}</p>
          <p className="text-sm text-gray-600">{selectedTime}</p>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Price & Refund Option
          </h2>

          <p className="text-sm text-gray-500 mb-1">Base Price</p>
          <p className="text-2xl font-bold text-blue-800 mb-4">
            Rs. {basePrice}
          </p>

          {/* Refund Box */}
          <div className="border-2 border-blue-100 rounded-lg p-4 mb-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeRefund}
                onChange={(e) => setAgreeRefund(e.target.checked)}
                className="mt-1 w-5 h-5"
              />
              <div>
                <p className="font-medium text-gray-900">
                  Customer agrees to pay additional Rs. 250 for full refund
                  eligibility
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  This amount makes the appointment fully refund-able if
                  cancelled.
                </p>
              </div>
            </label>
          </div>

          {/* Total Price */}
          <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Price</span>
              <span className="text-2xl font-bold text-teal-600">
                Rs. {totalPrice}
              </span>
            </div>
            {agreeRefund && (
              <p className="text-xs text-gray-600 mt-2">
                Base Fee: Rs. {basePrice} + Refund Deposit: Rs. {refund} =
                Total: Rs. {totalPrice}
              </p>
            )}
          </div>
        </div>

        {/* PATIENT DETAILS */}
        <h3 className="text-lg font-semibold text-gray-900 mt-6">
          Patient Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-black">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Priyani"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient NIC <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={patientNIC}
              onChange={(e) => setPatientNIC(e.target.value)}
              placeholder="123456789V"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={patientMobile}
              onChange={(e) => setPatientMobile(e.target.value)}
              placeholder="0712345678"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient Email{" "}
              <span className="text-gray-400 text-xs">(Optional)</span>
            </label>
            <input
              type="email"
              value={patientEmail}
              onChange={(e) => setPatientEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={patientDOB}
              onChange={(e) => setPatientDOB(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={patientAge}
              onChange={(e) => setPatientAge(e.target.value)}
              placeholder="25"
              min="0"
              max="150"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={() => {
              setShowBookingForm(false);
              setSelectedTime(null);
            }}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            ← Back
          </button>

          <button
            onClick={() => {
              if (
                !patientName ||
                !patientNIC ||
                !patientMobile ||
                !patientDOB ||
                !patientGender ||
                !patientAge
              ) {
                alert("Please fill all required patient details");
                return;
              }

              setCart([
                ...cart,
                {
                  selectedDoctor,
                  appointmentDate,
                  selectedTime,
                  patientName,
                  patientNIC,
                  patientMobile,
                  patientEmail,
                  patientDOB,
                  patientGender,
                  patientAge,
                  refundDeposit: agreeRefund,
                  totalPrice,
                },
              ]);

              resetForm();
            }}
            disabled={
              !patientName ||
              !patientNIC ||
              !patientMobile ||
              !patientDOB ||
              !patientGender ||
              !patientAge
            }
            className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add to Cart
          </button>
        </div>
      </div>
    );
  }

  /* ------------------ TIME SELECTION ------------------ */
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="font-bold text-gray-900">{selectedDoctor?.name}</div>
        <div className="text-sm text-gray-600">
          {selectedDoctor?.specialty} • {selectedDoctor?.hospital}
        </div>
        <div className="text-xl font-semibold text-blue-800 mt-1">
          Rs. {selectedDoctor?.consultation_fee}
        </div>

        <button
          onClick={resetForm}
          className="text-blue-600 underline mt-2 text-sm hover:text-blue-700"
        >
          Change Doctor
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Appointment Date
        </label>
        <input
          type="date"
          value={appointmentDate}
          onChange={(e) => setAppointmentDate(e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          className="border border-gray-300 rounded-xl w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {appointmentDate && (
          <p className="text-sm text-gray-600 mt-2">
            Selected: {getDayName(appointmentDate)}
          </p>
        )}
      </div>

      {/* Availability Message */}
      {availabilityInfo && !availabilityInfo.available && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
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

      {appointmentDate && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Time Slot
          </label>
          {loadingSlots ? (
            <div className="text-center py-8 text-gray-500">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mb-2"></div>
              <p>Loading appointment slots...</p>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
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
                {timeSlots.map((time) => (
                  <button
                    key={`${time.time}-${time.slotNumber}`}
                    onClick={() => {
                      setSelectedTime(time.time);
                      setShowBookingForm(true);
                    }}
                    disabled={!time.available}
                    className={`border rounded-xl py-3 text-sm font-medium transition-all ${
                      selectedTime === time.time
                        ? "border-teal-400 bg-teal-400 text-white"
                        : time.available
                          ? "border-teal-400 hover:bg-teal-100 hover:border-teal-400 text-gray-700 bg-teal-50"
                          : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center gap-1">
                      <span className="whitespace-nowrap">{time.time}</span>
                      {!time.available && (
                        <span className="text-xs text-red-500 font-medium">
                          Booked
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

/* Remove the old section below */
