"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle } from "lucide-react";

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
};

interface SelectDateTimeProps {
  doctor: Doctor;
  onNext: (date: string, time: string) => void;
  onBack: () => void;
}

export default function SelectDateTime({
  doctor,
  onNext,
  onBack,
}: SelectDateTimeProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch time slots when date is selected
  useEffect(() => {
    if (!selectedDate) {
      setTimeSlots([]);
      setSelectedTime("");
      return;
    }

    const fetchTimeSlots = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("doctorId", String(doctor.id));
        params.set("date", selectedDate);

        const response = await fetch(`/api/appointments?${params.toString()}`);
        const data = await response.json();

        if (data.doctors && data.doctors.length > 0) {
          const availability = data.doctors[0];
          // Parse start_time and end_time to create time slots
          const startTime = availability.start_time; // HH:MM:SS format
          const endTime = availability.end_time;
          const slots = generateTimeSlots(startTime, endTime);
          setTimeSlots(slots);
        } else {
          // Fallback to default slots if no availability found
          setTimeSlots(getDefaultTimeSlots());
        }
      } catch (error) {
        console.error("Error fetching time slots:", error);
        setTimeSlots(getDefaultTimeSlots());
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [selectedDate, doctor.id]);

  // Generate time slots between two times (30-min intervals)
  const generateTimeSlots = (
    startTime: string,
    endTime: string
  ): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    let currentHour = startHour;
    let currentMin = startMin;

    while (
      currentHour < endHour ||
      (currentHour === endHour && currentMin < endMin)
    ) {
      const timeStr = `${String(currentHour).padStart(2, "0")}:${String(
        currentMin
      ).padStart(2, "0")}`;
      const ampm = currentHour >= 12 ? "PM" : "AM";
      const displayHour = currentHour % 12 || 12;
      slots.push({
        time: `${displayHour}:${String(currentMin).padStart(2, "0")} ${ampm}`,
        available: true, // Assume all fetched slots are available
      });

      currentMin += 30;
      if (currentMin >= 60) {
        currentMin = 0;
        currentHour += 1;
      }
    }

    return slots;
  };

  // Default fallback time slots
  const getDefaultTimeSlots = (): TimeSlot[] => [
    { time: "09:00 AM", available: false },
    { time: "10:00 AM", available: true },
    { time: "11:00 AM", available: true },
    { time: "12:00 PM", available: true },
    { time: "01:00 PM", available: false },
    { time: "03:00 PM", available: true },
    { time: "04:00 PM", available: true },
    { time: "05:00 PM", available: false },
  ];

  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Place an Appointment
      </h1>

      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-1 bg-blue-900 rounded"></div>
        <div className="flex-1 h-1 bg-blue-900 rounded"></div>
        <div className="flex-1 h-1 bg-gray-400 rounded"></div>
        <div className="flex-1 h-1 bg-gray-400 rounded"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
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
        </div>

        {/* Time Slots */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Time Slots for {selectedDate || "Select a date"}
          </label>
          {!selectedDate ? (
            <div className="text-center py-8 text-gray-500">
              Please select a date to view available time slots
            </div>
          ) : loading ? (
            <div className="text-center py-8 text-gray-500">
              Loading time slots...
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No time slots available for this date
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                  className={`py-3 rounded-lg border-2 text-sm font-medium transition ${
                    selectedTime === slot.time
                      ? "border-teal-400 bg-teal-500 text-white"
                      : slot.available
                      ? "border-teal-400 hover:border-teal-400 hover:bg-teal-100 text-gray-700 bg-teal-50"
                      : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Clock size={16} />
                    <span>{slot.time}</span>
                    {selectedTime === slot.time && (
                      <CheckCircle size={16} className="text-teal-500" />
                    )}
                  </div>
                  {!slot.available && (
                    <div className="text-xs mt-1">Booked</div>
                  )}
                </button>
              ))}
            </div>
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
