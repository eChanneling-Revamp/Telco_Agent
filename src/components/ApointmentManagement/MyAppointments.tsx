"use client";

import { useState, useEffect } from "react";
import MyAppointmentsCard from "./MyAppointmentsCard";
import { Calendar } from "lucide-react";

type Appointment = {
  id: number;
  patientName: string;
  patientPhone?: string;
  doctor: string;
  specialization?: string;
  hospital?: string;
  date: string;
  time: string;
  amount?: number;
  status: "Confirmed" | "Cancelled" | "Pending" | "Completed";
};

type MyAppointmentsProps = {
  appointments: Appointment[];
  loading?: boolean;
  onView?: (id: number) => void;
  onCancel?: (id: number) => void;
  onReschedule?: (id: number) => void;
  searchTerm?: string;
  selectedStatus?: string;
};

const defaultGetStatusBg = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "bg-emerald-50";
    case "Cancelled":
      return "bg-rose-50";
    case "Pending":
      return "bg-amber-50";
    case "Completed":
      return "bg-blue-50";
    default:
      return "bg-gray-50";
  }
};

export default function MyAppointments({
  appointments = [],
  loading = false,
  onView,
  onCancel,
  onReschedule,
  searchTerm = "",
  selectedStatus = "All",
}: MyAppointmentsProps) {
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    let filtered = [...appointments];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(term) ||
          apt.doctor.toLowerCase().includes(term) ||
          apt.hospital?.toLowerCase().includes(term)
      );
    }

    // Filter by status
    if (selectedStatus && selectedStatus !== "All") {
      filtered = filtered.filter((apt) => apt.status === selectedStatus);
    }

    // Sort by date descending (most recent first)
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time || '00:00'}`).getTime();
      const dateB = new Date(`${b.date} ${b.time || '00:00'}`).getTime();
      return dateB - dateA;
    });

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, selectedStatus]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (filteredAppointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Appointments Found</h3>
        <p className="text-gray-600 text-center text-sm">
          {searchTerm ? "Try adjusting your search filters" : "You don't have any appointments yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredAppointments.map((appointment) => (
        <MyAppointmentsCard
          key={appointment.id}
          appointment={appointment}
          onView={onView}
        />
      ))}
    </div>
  );
}
