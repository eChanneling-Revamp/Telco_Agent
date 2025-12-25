"use client";

import React from "react";
import { Appointment } from "@/types/appointment";
import { AllAppointmentCard } from "./AllAppointmentCard";
import { AppointmentsSearchBar } from "./AppointmentsSearchBar";
import { AppointmentsFilters } from "./AppointmentsFilters";
import { AppointmentDetailsModal } from "@/components/ManageAgents/AppointmentDetailsModal";

type AgentOption = {
  id: string;
  name: string;
};

type FilterState = {
  agent: string;
  status: string;
  hospital: string;
  date: string;
};

interface AllAppointmentsListProps {
  appointments: Appointment[];
  searchTerm: string;
  filters: FilterState;
  agents: AgentOption[];
  hospitals: string[];
  statuses: string[];
  onSearchChange: (query: string) => void;
  onFiltersChange: (filters: Partial<FilterState>) => void;
}

export const AllAppointmentsList: React.FC<AllAppointmentsListProps> = ({
  appointments,
  searchTerm,
  filters,
  agents,
  hospitals,
  statuses,
  onSearchChange,
  onFiltersChange,
}) => {
  const [selectedAppointment, setSelectedAppointment] =
    React.useState<Appointment | null>(null);

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <>
      <AppointmentsSearchBar value={searchTerm} onSearch={onSearchChange} />
      <AppointmentsFilters
        agents={agents}
        hospitals={hospitals}
        statuses={statuses}
        selectedFilters={filters}
        onFilterChange={onFiltersChange}
      />

      <div className="space-y-4">
        {appointments.map((appointment) => (
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
        appointment={
          selectedAppointment
            ? {
                id: Number(selectedAppointment.id),
                appointmentId: selectedAppointment.appointmentId,
                status: selectedAppointment.status,
                doctor: selectedAppointment.doctor,
                specialization: selectedAppointment.doctorSpecialty,
                hospital: selectedAppointment.hospital,
                date: selectedAppointment.dateTime,
                time: selectedAppointment.time,
                amount: selectedAppointment.amount,
                patientName: selectedAppointment.patientName,
                patientPhone: selectedAppointment.phone,
                basePrice: selectedAppointment.basePrice,
                refundDeposit: selectedAppointment.refundDeposit,
                total: selectedAppointment.amount,
                refundEligible: selectedAppointment.refundStatus,
              }
            : null
        }
      />
    </>
  );
};
