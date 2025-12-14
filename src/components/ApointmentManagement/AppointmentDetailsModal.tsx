"use client";

import {
  X,
  FileText,
  Mail,
  Download,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

type AppointmentDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCancelled?: () => void;
  appointment?: {
    id: number;
    appointmentId: string;
    status: string;
    doctor: string;
    specialization?: string;
    hospital?: string;
    date: string;
    time: string;
    amount?: number;
    patientName: string;
    patientPhone?: string;
    patientNIC?: string;
    patientDOB?: string;
    patientGender?: string;
    patientAge?: number;
    basePrice?: number;
    refundDeposit?: number;
    total?: number;
    refundEligible?: string;
  };
};

export default function AppointmentDetailsModal({
  isOpen,
  onClose,
  onAppointmentCancelled,
  appointment,
}: AppointmentDetailsModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [cancellationSuccess, setCancellationSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Local state to track current appointment status
  const [currentStatus, setCurrentStatus] = useState(appointment?.status || "");

  // Update local status when appointment prop changes
  useEffect(() => {
    if (appointment?.status) {
      setCurrentStatus(appointment.status);
    }
  }, [appointment?.status]);

  if (!isOpen || !appointment) return null;

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-rose-100 text-rose-700";
      case "pending":
        return "bg-amber-100 text-amber-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-green-100 text-green-700";
    }
  };

  const getStatusLabel = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    return normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
  };

  const downloadAsImage = () => {
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

  const hasRefundDeposit =
    appointment.refundDeposit && appointment.refundDeposit > 0;

  const handleCancelAppointment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          withRefund: false,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel appointment");
      }

      setIsProcessing(false);
      setShowCancelModal(false);

      // Update local status immediately
      setCurrentStatus("cancelled");

      setCancellationSuccess(true);

      // Auto close success message and refresh after 3 seconds
      setTimeout(() => {
        setCancellationSuccess(false);
        if (onAppointmentCancelled) {
          onAppointmentCancelled();
        }
        onClose();
      }, 3000);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message);
      console.error("Error cancelling appointment:", err);
    }
  };

  const handleCancelWithRefund = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId: appointment.id,
          withRefund: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process refund");
      }

      setIsProcessing(false);
      setShowRefundModal(false);

      // Update local status immediately
      setCurrentStatus("cancelled");

      setCancellationSuccess(true);

      // Auto close success message and refresh after 3 seconds
      setTimeout(() => {
        setCancellationSuccess(false);
        if (onAppointmentCancelled) {
          onAppointmentCancelled();
        }
        onClose();
      }, 3000);
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message);
      console.error("Error processing refund:", err);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
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

                {/* Status - Use currentStatus instead of appointment.status */}
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      currentStatus
                    )}`}
                  >
                    {getStatusLabel(currentStatus)}
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
                  <p className="text-sm text-gray-700">
                    {appointment.time || "N/A"}
                  </p>
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
                  {appointment.refundDeposit > 0 && (
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
            {appointment.refundEligible && appointment.refundDeposit > 0 && (
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
                    value={appointment.patientName || "N/A"}
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
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    NIC Number
                  </label>
                  <input
                    type="text"
                    value={appointment.patientNIC || "N/A"}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Date of Birth
                  </label>
                  <input
                    type="text"
                    value={appointment.patientDOB || "N/A"}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Gender
                  </label>
                  <input
                    type="text"
                    value={
                      appointment.patientGender
                        ? appointment.patientGender.charAt(0).toUpperCase() +
                          appointment.patientGender.slice(1)
                        : "N/A"
                    }
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="text-sm text-gray-600 mb-2 block">
                    Age
                  </label>
                  <input
                    type="text"
                    value={
                      appointment.patientAge
                        ? `${appointment.patientAge} years`
                        : "N/A"
                    }
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons - Conditional layout based on refund deposit */}
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
              <button
                className={`flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  !hasRefundDeposit ? "col-span-2" : ""
                }`}
                onClick={() => setShowCancelModal(true)}
                disabled={currentStatus === "cancelled"}
              >
                <X className="w-5 h-5" />
                {currentStatus === "cancelled"
                  ? "Appointment Cancelled"
                  : "Cancel Appointment"}
              </button>
              {/* Only show Cancel & Refund button if there's a refund deposit */}
              {hasRefundDeposit && (
                <button
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowRefundModal(true)}
                  disabled={currentStatus === "cancelled"}
                >
                  <AlertCircle className="w-5 h-5" />
                  {currentStatus === "cancelled"
                    ? "Cancelled"
                    : "Cancel & Refund"}
                </button>
              )}
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
                    {getStatusLabel(currentStatus)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.date}
                  </p>
                  <p className="text-sm text-gray-700">
                    {appointment.time || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hospital</p>
                  <p className="font-semibold text-gray-900">
                    {appointment.hospital || "N/A"}
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-b-2 border-gray-300 py-4 mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Patient Information
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Patient Name</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientName || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientPhone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">NIC</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientNIC || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientDOB || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientGender
                        ? appointment.patientGender.charAt(0).toUpperCase() +
                          appointment.patientGender.slice(1)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-semibold text-gray-900">
                      {appointment.patientAge
                        ? `${appointment.patientAge} years`
                        : "N/A"}
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
                    {appointment.refundDeposit > 0 && (
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

              {appointment.refundEligible && appointment.refundDeposit > 0 && (
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

      {/* Cancel Appointment Confirmation Modal */}
      {showCancelModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => !isProcessing && setShowCancelModal(false)}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Cancel Appointment?
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to cancel this appointment with{" "}
                  {appointment.doctor}? This action cannot be undone.
                </p>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                    disabled={isProcessing}
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={handleCancelAppointment}
                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition disabled:opacity-50"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cancel & Refund Confirmation Modal */}
      {showRefundModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[60]"
            onClick={() => !isProcessing && setShowRefundModal(false)}
          />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-emerald-100 rounded-full mb-4">
                  <AlertCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                  Cancel & Request Refund?
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  Are you sure you want to cancel this appointment and request a
                  refund?
                </p>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-700">
                      Refund Amount:
                    </span>
                    <span className="text-lg font-bold text-emerald-600">
                      Rs. {appointment.refundDeposit}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {appointment.refundEligible ||
                      "Refund will be processed within 5-7 business days"}
                  </p>
                </div>
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRefundModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition"
                    disabled={isProcessing}
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={handleCancelWithRefund}
                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Yes, Refund"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Success Message */}
      {cancellationSuccess && (
        <>
          <div className="fixed inset-0 bg-black/60 z-[60]" />
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
              <div className="p-6 text-center">
                <div className="flex items-center justify-center w-16 h-16 mx-auto bg-green-100 rounded-full mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {hasRefundDeposit
                    ? "Refund Initiated!"
                    : "Appointment Cancelled"}
                </h3>
                <p className="text-gray-600">
                  {hasRefundDeposit
                    ? `Your appointment has been cancelled and a refund of Rs. ${appointment.refundDeposit} will be processed within 5-7 business days.`
                    : "Your appointment has been successfully cancelled."}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
