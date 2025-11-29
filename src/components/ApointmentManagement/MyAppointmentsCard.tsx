"use client";

import { MapPin, Calendar, Clock, DollarSign } from "lucide-react";

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
  basePrice?: number;
  refundDeposit?: number;
  total?: number;
  refundEligible?: boolean;
  status: "Confirmed" | "Cancelled" | "Pending" | "Completed";
  paymentStatus?: string;
};

type MyAppointmentsCardProps = {
  appointment: Appointment;
  onView?: (id: number) => void;
};

export default function MyAppointmentsCard({
  appointment,
  onView,
}: MyAppointmentsCardProps) {
  const displayPrice =
    appointment.total || appointment.amount || appointment.basePrice || 0;
  const refundStatus = appointment.refundEligible
    ? "Rs. 250 Paid — Full refund eligible"
    : "No deposit — Non-refundable";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
      {/* Top Section: Patient Info and View Details Button */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900">
            {appointment.patientName}
          </h3>
          {appointment.patientPhone && (
            <p className="text-sm text-gray-600 mt-1">
              {appointment.patientPhone}
            </p>
          )}
        </div>
        {onView && (
          <button
            onClick={() => onView(appointment.id)}
            className="ml-4 px-6 py-2 bg-blue-800 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition whitespace-nowrap"
          >
            View Details
          </button>
        )}
      </div>

      {/* Doctor Section */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-700 font-semibold">
            {appointment.doctor}
          </span>
          {appointment.specialization && (
            <>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-600">
                {appointment.specialization}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Hospital/Location */}
      {appointment.hospital && (
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-gray-500" />
          <span className="text-sm text-gray-700">{appointment.hospital}</span>
        </div>
      )}

      {/* Date and Time - Single Line */}
      <div className="flex items-center gap-6 mb-4 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          <span className="text-sm text-gray-700">{appointment.date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-500" />
          <span className="text-sm text-gray-700">{appointment.time}</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          {/* <DollarSign size={16} className="text-gray-500" /> */}
          <span className="text-2xl font-bold text-blue-800">
            Rs. {displayPrice}
          </span>
        </div>
      </div>

      {/* Refund Status */}
      {appointment.refundEligible ? (
        <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-2xl border border-green-100">
          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-emerald-700">✓</span>
          </div>
          <span className="text-sm text-emerald-700 font-medium">
            {refundStatus}
          </span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-2xl border border-gray-100">
          <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-gray-600">-</span>
          </div>
          <span className="text-sm text-gray-700 font-medium">
            {refundStatus}
          </span>
        </div>
      )}
    </div>
  );
}
