'use client';

import React from 'react';
import { Appointment } from '@/types/appointment';

interface AppointmentCardProps {
  appointment: Appointment;
  onViewDetails: (appointment: Appointment) => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onViewDetails }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        {/* Left side - Patient and appointment info */}
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{appointment.patientName}</h3>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start">
              <p className="text-gray-700 text-sm">
                <span className="font-medium">{appointment.doctor}</span>
                <span className="text-gray-500"> • {appointment.doctorSpecialty}</span>
              </p>
            </div>

            <div className="flex items-center text-gray-600 text-sm">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {appointment.hospital}
            </div>

            <div className="flex items-center text-gray-600 text-sm">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {appointment.dateTime}
              <svg className="w-4 h-4 ml-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {appointment.time}
            </div>
          </div>

          {/* Payment status badge */}
          <div className="mt-4">
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Rs. {appointment.refundDeposit} Paid — {appointment.refundable ? 'Full refund eligible' : 'Non-refundable'}
            </div>
          </div>
        </div>

        {/* Right side - Price and button */}
        <div className="flex flex-col items-end gap-22 ml-6">

            <button
            onClick={() => onViewDetails(appointment)}
            // className="px-8 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-sm"
            className="px-8 py-2.5 bg-blue-800 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition whitespace-nowrap"
          >
            View Details
          </button>

          <p className="text-2xl font-bold text-blue-800">Rs. {appointment.amount}</p>
          
        </div>
      </div>
    </div>
  );
};
