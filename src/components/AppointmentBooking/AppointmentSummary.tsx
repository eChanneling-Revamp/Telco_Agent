"use client";

import React from 'react';
import { CheckCircle } from 'lucide-react';

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  consultationFee: number;
};

interface AppointmentSummaryProps {
  doctor: Doctor;
  date: string;
  time: string;
  patientData: any;
  onConfirm: () => void;
  onBack: () => void;
}

export default function AppointmentSummary({ 
  doctor, 
  date, 
  time, 
  patientData, 
  onConfirm, 
  onBack 
}: AppointmentSummaryProps) {
  return (
    <div className="mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Place an Appointment</h1>
      
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-1 bg-blue-900 rounded"></div>
        <div className="flex-1 h-1 bg-blue-900 rounded"></div>
        <div className="flex-1 h-1 bg-blue-900 rounded"></div>
        <div className="flex-1 h-1 bg-blue-900 rounded"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Appointment Summary</h2>

        <div className="space-y-6">
          {/* Doctor Info */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Doctor</p>
              <p className="font-semibold text-gray-900">{doctor.name}</p>
              <p className="text-sm text-gray-600">{doctor.specialty}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Hospital</p>
              <p className="font-medium text-gray-900">{doctor.hospital}</p>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-1">Date & Time</p>
              <p className="font-medium text-gray-900">{date}</p>
              <p className="text-sm text-gray-600">{time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Patient</p>
              <p className="font-medium text-gray-900">{patientData.name}</p>
              <p className="text-sm text-gray-600">{patientData.nic}</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="pb-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Base Price</span>
              <span className="font-medium text-gray-900">Rs. {doctor.consultationFee}</span>
            </div>
            {patientData.agreeRefund && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Refund Deposit</span>
                <span className="font-medium text-green-600">Rs. 250</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Price</span>
              <span className="text-2xl font-bold text-blue-600">Rs. {patientData.totalPrice}</span>
            </div>
          </div>

          {/* Refund Info */}
          {patientData.agreeRefund && (
            <div className="flex items-start gap-3 bg-green-50 rounded-lg p-4">
              <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-gray-700">
                Rs. 250 Paid—Full refund eligible
              </p>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            onClick={onBack}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            ← Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition"
          >
            Place Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
