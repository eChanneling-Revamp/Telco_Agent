"use client";

import React, { useState } from 'react';

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  consultationFee: number;
};

interface PriceAndPatientProps {
  doctor: Doctor;
  date: string;
  time: string;
  onNext: (patientData: any) => void;
  onBack: () => void;
}

export default function PriceAndPatient({ doctor, date, time, onNext, onBack }: PriceAndPatientProps) {
  const [patientName, setPatientName] = useState("");
  const [patientNIC, setPatientNIC] = useState("");
  const [patientMobile, setPatientMobile] = useState("");
  const [agreeRefund, setAgreeRefund] = useState(false);

  const basePrice = doctor.consultationFee;
  const refund = 250;
  const totalPrice = agreeRefund ? basePrice + refund : basePrice;

  const handleContinue = () => {
    onNext({
      name: patientName,
      nic: patientNIC,
      mobile: patientMobile,
      agreeRefund,
      totalPrice
    });
  };

  return (
    <div className=" mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Place an Appointment</h1>
      
      {/* Progress Bar */}
      <div  className="flex items-center gap-2 mb-8">
        <div className="flex-1 h-1 bg-blue-900 rounded"></div>
        <div className="flex-1 h-1 bg-blue-900 rounded"></div>
        <div className="flex-1 h-1 bg-blue-900 rounded"></div>
        <div className="flex-1 h-1 bg-gray-400 rounded"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Price & Refund Option</h2>

        {/* Selected Doctor Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-500 mb-2">Selected Doctor</p>
          <p className="font-semibold text-gray-900">{doctor.name}</p>
          <p className="text-sm text-gray-600">{doctor.specialty}</p>
        </div>

        {/* Appointment Details */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Appointment Date & Time</p>
          <p className="font-medium text-gray-900">{date}</p>
          <p className="text-sm text-gray-600">{time}</p>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Base Price</p>
          <p className="text-2xl font-bold text-blue-600">Rs. {basePrice}</p>
        </div>

        {/* Refund Option */}
        <div className="border-2 border-blue-100 rounded-lg p-4 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeRefund}
              onChange={(e) => setAgreeRefund(e.target.checked)}
              className="mt-1 w-5 h-5"
            />
            <div>
              <p className="font-medium text-gray-900">
                Customer agrees to pay additional Rs. 250 for full refund eligibility
              </p>
              <p className="text-xs text-gray-500 mt-1">
                This amount makes the appointment fully refund-able if cancelled.
              </p>
            </div>
          </label>
        </div>

        {/* Total Price */}
        <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">Total Price</span>
            <span className="text-2xl font-bold text-teal-600">Rs. {totalPrice}</span>
          </div>
          {agreeRefund && (
            <p className="text-xs text-gray-600 mt-2">
              Base Fee: Rs. {basePrice} + Refund Deposit: Rs. {refund} = Total: Rs. {totalPrice}
            </p>
          )}
        </div>

        {/* Patient Details Section */}
        <h3 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Patient Details</h3>
        
        <div className="space-y-4 mb-6 text-black">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient Name</label>
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Priyani"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient NIC</label>
            <input
              type="text"
              value={patientNIC}
              onChange={(e) => setPatientNIC(e.target.value)}
              placeholder="123456789V"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Patient Mobile Number</label>
            <input
              type="tel"
              value={patientMobile}
              onChange={(e) => setPatientMobile(e.target.value)}
              placeholder="0712345678"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
            />
          </div>
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
            onClick={handleContinue}
            disabled={!patientName || !patientNIC || !patientMobile}
            className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-medium hover:bg-blue-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Review Appointment
          </button>
        </div>
      </div>
    </div>
  );
}
