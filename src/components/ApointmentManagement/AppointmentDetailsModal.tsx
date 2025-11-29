"use client";

import {
  X,
  FileText,
  Mail,
  Download,
  AlertCircle,
  Printer,
} from "lucide-react";
import { useState, useRef } from "react";

type AppointmentDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  appointment?: {
    id: number;
    appointmentId: string;
    status: "Confirmed" | "Cancelled" | "Pending" | "Completed";
    doctor: string;
    specialization?: string;
    hospital?: string;
    date: string;
    time: string;
    amount?: number;
    patientName: string;
    patientPhone?: string;
    basePrice?: number;
    refundDeposit?: number;
    total?: number;
    refundEligible?: string;
  };
};

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  appointment,
}: AppointmentDetailsModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !appointment) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-rose-100 text-rose-700";
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const downloadAsImage = () => {
    // Open print dialog where user can save as PDF or image
    if (receiptRef.current) {
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(receiptRef.current.innerHTML);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 100);
      }
    }
  };

  const downloadAsPdf = () => {
    // Open print dialog for PDF download
    if (receiptRef.current) {
      const printWindow = window.open("", "", "width=800,height=600");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .receipt { background: white; padding: 20px; }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.print();
        }, 100);
      }
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50  z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Appointment Details
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Appointment Summary */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Appointment Summary
              </h3>
              <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
                {/* Appointment ID */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Appointment ID</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {appointment.appointmentId}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 bg-green-100 rounded-full text-sm font-semibold ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </div>

                {/* Doctor */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Doctor</p>
                  <p className="text-base font-semibold text-gray-900">
                    {appointment.doctor}
                  </p>
                  {appointment.specialization && (
                    <p className="text-xs text-gray-600">
                      {appointment.specialization}
                    </p>
                  )}
                </div>

                {/* Hospital */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Hospital</p>
                  <p className="text-base font-semibold text-gray-900">
                    {appointment.hospital || "N/A"}
                  </p>
                </div>

                {/* Date & Time */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date & Time</p>
                  <p className="text-base font-semibold text-gray-900">
                    {appointment.date}
                  </p>
                  <p className="text-sm text-gray-700">{appointment.time}</p>
                </div>

                {/* Total Amount */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-xl font-bold text-emerald-600">
                    Rs. {appointment.total || appointment.amount || 0}
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            {(appointment.basePrice || appointment.refundDeposit) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Pricing Breakdown
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 space-y-3">
                  {appointment.basePrice && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Base Price:</span>
                      <span className="font-semibold text-gray-900">
                        Rs. {appointment.basePrice}
                      </span>
                    </div>
                  )}
                  {appointment.refundDeposit && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Refund Deposit:</span>
                      <span className="font-semibold text-cyan-600">
                        Rs. {appointment.refundDeposit}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-blue-200 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        Total:
                      </span>
                      <span className="text-lg font-bold text-cyan-600">
                        Rs. {appointment.total || appointment.amount || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Refund Eligibility */}
            {appointment.refundEligible && (
              <div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-emerald-900">
                      Refund Eligibility
                    </p>
                    <p className="text-sm text-emerald-800">
                      {appointment.refundEligible}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Patient Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Patient Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={appointment.patientName}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    value={appointment.patientPhone || "N/A"}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-blue-500 rounded-lg text-blue-700 font-semibold hover:bg-gray-50 transition">
                <FileText className="w-5 h-5" />
                Send SMS Receipt
              </button>
              <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-blue-500 rounded-lg text-blue-700 font-semibold hover:bg-gray-50 transition">
                <Mail className="w-5 h-5" />
                Send Email Receipt
              </button>
              <button
                onClick={downloadAsPdf}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-blue-500 rounded-lg text-blue-700 font-semibold hover:bg-gray-50 transition"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
              <button
                onClick={downloadAsImage}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-blue-500 rounded-lg text-blue-700 font-semibold hover:bg-gray-50 transition"
              >
                <Download className="w-5 h-5" />
                Download Image
              </button>
              <button className=" flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition">
                <X className="w-5 h-5" />
                Cancel Appointment
              </button>
              <button className=" flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition">
                <AlertCircle className="w-5 h-5" />
                Cancel & Refund
              </button>
            </div>
          </div>

          {/* Hidden Receipt for Printing/Export */}
          <div ref={receiptRef} className="hidden">
            <div className="w-full max-w-2xl bg-white p-8">
              <div className="border-b-2 border-gray-300 pb-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Appointment Receipt
                </h1>
                <p className="text-gray-600 mt-2">
                  ID: {appointment.appointmentId}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Doctor</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.doctor}
                  </p>
                  {appointment.specialization && (
                    <p className="text-sm text-gray-700">
                      {appointment.specialization}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.date}
                  </p>
                  <p className="text-sm text-gray-700">{appointment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hospital</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.hospital || "N/A"}
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-b-2 border-gray-300 py-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientPhone || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {appointment.basePrice && (
                <div className="mb-6">
                  <p className="text-sm font-semibold text-gray-900 mb-3">
                    Pricing
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Base Price:</span>
                      <span className="font-semibold">
                        Rs. {appointment.basePrice}
                      </span>
                    </div>
                    {appointment.refundDeposit && (
                      <div className="flex justify-between">
                        <span className="text-gray-700">Refund Deposit:</span>
                        <span className="font-semibold">
                          Rs. {appointment.refundDeposit}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between border-t-2 border-gray-300 pt-2 mt-2">
                      <span className="font-bold text-gray-900">Total:</span>
                      <span className="font-bold text-lg">
                        Rs. {appointment.total || appointment.amount}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {appointment.refundEligible && (
                <div className="bg-gray-100 p-4 rounded-lg mb-6">
                  <p className="font-semibold text-gray-900 mb-2">
                    Refund Eligibility
                  </p>
                  <p className="text-sm text-gray-700">
                    {appointment.refundEligible}
                  </p>
                </div>
              )}

              <div className="text-center text-xs text-gray-500 border-t-2 border-gray-300 pt-4 mt-6">
                <p>This is an electronically generated receipt</p>
                <p>Printed on: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
