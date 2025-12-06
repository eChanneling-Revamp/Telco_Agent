'use client';

import React, { useState } from 'react';
import { Appointment } from '@/types/appointment';
import { AllAppointmentCard } from './AllAppointmentCard';
import { AppointmentsSearchBar } from './AppointmentsSearchBar';
import { AppointmentsFilters } from './AppointmentsFilters';
import { AppointmentDetailsModal } from '@/components/ManageAgents/AppointmentDetailsModal';
import { searchAppointments, filterAppointments } from '@/lib/appointments';

interface AllAppointmentsListProps {
  initialAppointments: Appointment[];
}

export const AllAppointmentsList: React.FC<AllAppointmentsListProps> = ({ 
  initialAppointments 
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentFilters, setCurrentFilters] = useState<any>({});

  const handleSearch = (query: string) => {
    if (query.trim() === '') {
      setAppointments(filterAppointments(initialAppointments, currentFilters));
    } else {
      const searched = searchAppointments(query);
      setAppointments(filterAppointments(searched, currentFilters));
    }
  };

  const handleFilterChange = (newFilters: any) => {
    const updatedFilters = { ...currentFilters, ...newFilters };
    setCurrentFilters(updatedFilters);
    setAppointments(filterAppointments(initialAppointments, updatedFilters));
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <>
      <AppointmentsSearchBar onSearch={handleSearch} />
      <AppointmentsFilters onFilterChange={handleFilterChange} />
      
      <div className="space-y-4">
        {appointments.map(appointment => (
          <AllAppointmentCard
            key={appointment.id}
            appointment={appointment}
            onViewDetails={handleViewDetails}
          />
        ))}

        {appointments.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No appointments found matching your criteria.
          </div>
        )}
      </div>

      <AppointmentDetailsModal
        isOpen={selectedAppointment !== null}
        onClose={() => setSelectedAppointment(null)}
        appointment={selectedAppointment}
      />
    </>
  );
};