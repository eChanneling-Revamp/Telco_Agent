"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

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
  paymentStatus?: string;
};

type MyAppointmentsCardProps = {
  appointment: Appointment;
  onView?: (id: number) => void;
};

const getStatusBadge = (status: string, paymentStatus?: string) => {
  if (paymentStatus) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <span className="text-emerald-600 font-medium">{paymentStatus}</span>
      </div>
    );
  }

  switch (status) {
    case "Confirmed":
      return (
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-600 font-medium">Confirmed</span>
        </div>
      );
    case "Cancelled":
      return (
        <div className="flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span className="text-rose-600 font-medium">Cancelled</span>
        </div>
      );
    case "Pending":
      return (
        <div className="flex items-center gap-2 text-xs">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <span className="text-amber-600 font-medium">Pending</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle2 className="w-4 h-4 text-gray-600" />
          <span className="text-gray-600 font-medium">Confirmed</span>
        </div>
      );
  }
};

export default function MyAppointmentsCard({
  appointment,
  onView,
}: MyAppointmentsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all">
      {/* Top Row: Patient Name and View Details Button */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">{appointment.patientName}</h3>
        {onView && (
          <button
            onClick={() => onView(appointment.id)}
            className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700 transition"
          >
            View Details
          </button>
        )}
      </div>

      {/* Phone Number */}
      {appointment.patientPhone && (
        <p className="text-sm text-gray-600 mb-2">{appointment.patientPhone}</p>
      )}

      {/* Doctor with Icon */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 text-sm font-semibold">👨‍⚕️</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{appointment.doctor}</p>
          {appointment.specialization && (
            <p className="text-xs text-gray-600">{appointment.specialization}</p>
          )}
        </div>
      </div>

      {/* Hospital/Location with Icon */}
      {appointment.hospital && (
        <div className="flex items-center gap-3 mb-4 text-sm">
          <span className="text-gray-400">📍</span>
          <span className="text-gray-700 font-medium">{appointment.hospital}</span>
        </div>
      )}

      {/* Date, Time, Amount in a Row */}
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-lg">📅</span>
          <div>
            <p className="text-xs text-gray-600">Date</p>
            <p className="text-sm font-semibold text-gray-800">{appointment.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-lg">🕐</span>
          <div>
            <p className="text-xs text-gray-600">Time</p>
            <p className="text-sm font-semibold text-gray-800">{appointment.time}</p>
          </div>
        </div>
        {appointment.amount && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-lg">💰</span>
            <div>
              <p className="text-xs text-gray-600">Amount</p>
              <p className="text-sm font-semibold text-emerald-600">Rs. {appointment.amount}</p>
            </div>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div className="pt-2">
        {getStatusBadge(appointment.status, appointment.paymentStatus)}
      </div>
    </div>
  );
}
