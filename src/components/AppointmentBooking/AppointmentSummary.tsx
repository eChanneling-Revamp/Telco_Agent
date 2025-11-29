"use client";

import React, { useState } from "react";
import { CheckCircle, Loader, AlertCircle } from "lucide-react";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  consultation_fee: number;
};

interface AppointmentSummaryProps {
  doctor: Doctor;
  date: string;
  time: string;
  patientData: any;
  onConfirm: () => Promise<{ success: boolean; error?: string }>;
  onBack: () => void;
  onSuccess?: () => void;
}

type PopupType = "success" | "error" | null;

export default function AppointmentSummary({
  doctor,
  date,
  time,
  patientData,
  onConfirm,
  onBack,
  onSuccess,
}: AppointmentSummaryProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [popup, setPopup] = useState<PopupType>(null);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      // Call the actual booking function immediately
      const result = await onConfirm();

      if (result.success) {
        setPopup("success");
        // Auto-close success popup after 2 seconds and call onSuccess
        setTimeout(() => {
          setPopup(null);
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        setPopup("error");
        setIsLoading(false);
        // Auto-close error popup after 3 seconds
        setTimeout(() => setPopup(null), 3000);
      }
    } catch (error) {
      setPopup("error");
      setIsLoading(false);
      setTimeout(() => setPopup(null), 3000);
    }
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
        <div className="flex-1 h-2 bg-blue-900 rounded"></div>
        <div className="flex-1 h-2 bg-blue-900 rounded"></div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Appointment Summary
        </h2>

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
              <span className="font-medium text-gray-900">
                Rs. {doctor.consultation_fee}
              </span>
            </div>
            {patientData.agreeRefund && (
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Refund Deposit</span>
                <span className="font-medium text-green-600">Rs. 250</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Price</span>
              <span className="text-2xl font-bold text-blue-800">
                Rs. {patientData.totalPrice}
              </span>
            </div>
          </div>

          {/* Refund Info */}
          {patientData.agreeRefund && (
            <div className="flex items-start gap-3 bg-green-50 rounded-lg p-4">
              <CheckCircle
                className="text-green-600 flex-shrink-0 mt-0.5"
                size={20}
              />
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
            disabled={isLoading}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 bg-teal-500 text-white py-3 rounded-lg font-medium hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              "Place Appointment"
            )}
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {popup === "success" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4 animate-scale-in">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Success!</h3>
              <p className="text-gray-600">
                Your appointment has been booked successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {popup === "error" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full mx-4 animate-scale-in">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Error</h3>
              <p className="text-gray-600">
                Failed to book appointment. Please try again.
              </p>
              <button
                onClick={() => setPopup(null)}
                className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
