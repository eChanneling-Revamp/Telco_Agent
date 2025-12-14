'use client';

import React from 'react';
import { Appointment } from '@/types/appointment';

interface AllAppointmentCardProps {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
}

export const AllAppointmentCard: React.FC<AllAppointmentCardProps> = ({ 
  appointment, 
  onViewDetails 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow mb-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Patient Name and Agent */}
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {appointment.patientName}
            </h3>
            <p className="text-sm text-gray-600">
              Booked by: <span className="font-medium">{appointment.bookedByName}</span>
            </p>
          </div>

          {/* Doctor and Hospital Info */}
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">{appointment.doctor}</p>
                <p className="text-sm text-gray-600">{appointment.doctorSpecialty}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-900">{appointment.hospital}</p>
            </div>
          </div>

          {/* Date, Time and Status */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">{appointment.dateTime} at {appointment.time}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xl font-bold text-blue-600">Rs. {appointment.amount}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-3 mt-4">
            <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {appointment.refundStatus}
            </span>

            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>
        </div>

        {/* View Details Button */}
        <button
          onClick={() => onViewDetails(appointment)}
          className="px-6 py-2.5 bg-blue-800 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm ml-6"
        >
          View Details
        </button>
      </div>
    </div>
  );
};