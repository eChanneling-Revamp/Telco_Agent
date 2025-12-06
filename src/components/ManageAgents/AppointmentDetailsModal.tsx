'use client';

import React from 'react';
import { Modal } from '@/components/ManageAgents/Modal';
import { Appointment } from '@/types/appointment';
import { Badge } from '@/components/ManageAgents/Badge';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: Appointment | null;
}

export const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  appointment 
}) => {
  if (!appointment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Appointment Details" size="md">
      <div className="space-y-8">
        {/* Appointment Summary */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Appointment Summary</h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">Appointment ID</p>
              <p className="text-lg font-semibold text-gray-900">{appointment.appointmentId}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Status</p>
              <Badge variant="success">{appointment.status}</Badge>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Doctor</p>
              <p className="text-lg font-semibold text-gray-900">{appointment.doctor}</p>
              <p className="text-sm text-gray-600">{appointment.doctorSpecialty}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Hospital</p>
              <p className="text-lg font-semibold text-gray-900">{appointment.hospital}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Date & Time</p>
              <p className="text-lg font-semibold text-gray-900">{appointment.dateTime}</p>
              <p className="text-sm text-gray-600">{appointment.time}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-2">Total Amount</p>
              <p className="text-lg font-semibold text-green-600">Rs. {appointment.amount}</p>
            </div>
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-6">Pricing Breakdown</h3>
          
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Base Price:</span>
              <span className="font-semibold text-gray-900">Rs. {appointment.basePrice}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Refund Deposit:</span>
              <span className="font-semibold text-cyan-600">Rs. {appointment.refundDeposit}</span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-cyan-600">Rs. {appointment.amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
          <button
            className="flex-1 px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Edit Appointment
          </button>
        </div>
      </div>
    </Modal>
  );
};