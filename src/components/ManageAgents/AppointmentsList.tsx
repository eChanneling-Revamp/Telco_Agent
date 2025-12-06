'use client';

import React, { useState } from 'react';
import { Appointment } from '@/types/appointment';
import { AppointmentCard } from './AppointmentCard';
import { AppointmentDetailsModal } from '@/components/ManageAgents/AppointmentDetailsModal';

interface AppointmentsListProps {
  appointments: Appointment[];
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({ appointments }) => {
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Appointments Booked by This Agent</h2>
        
        <div className="space-y-4">
          {appointments.map(appointment => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onViewDetails={handleViewDetails}
            />
          ))}

          {appointments.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No appointments found for this agent.
            </div>
          )}
        </div>
      </div>

      <AppointmentDetailsModal
        isOpen={selectedAppointment !== null}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </>
  );
};