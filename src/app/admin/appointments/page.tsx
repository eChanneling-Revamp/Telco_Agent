import React from 'react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import AdminHeader from '@/components/dashboard/AdminHeader';
import { AllAppointmentsList } from '@/components/AllAppointments/AppointmentsList';
import { getAllAppointments } from '@/lib/appointments';

export default function AllAppointmentsPage() {
  const appointments = getAllAppointments();

  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="All Appointments" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">All Appointments</h1>

            <AllAppointmentsList initialAppointments={appointments} />
          </div>
        </main>
      </div>
    </div>
  );
}