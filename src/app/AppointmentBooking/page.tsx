"use client";

import Sidebar from "../../components/dashboard/SideBar";
import Header from "../../components/dashboard/Header";
import DoctorSearch from "../../components/AppointmentBooking/DoctorSearch";
import AppointmentForm from "../../components/AppointmentBooking/AppointmentForm";
import { useState } from "react";

export default function AppointmentBookingPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  return (
    <div
      className="flex h-screen bg-gradient-to-br from-[#1ABC9C] to-[#0B60E0] bg-cover bg-center relative"
      style={{ backgroundImage: `url('/assets/bg.png')` }}
    >
      {/* Left Sidebar */}
      <div className="w-64 bg-[#0C4A34]/90 backdrop-blur-sm shadow-md relative z-20 border-r border-[#0f563a]/40">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col relative z-10">
        <Header selectedAccount="Agent" onAccountChange={() => {}} />
          

        <div className="flex flex-1 px-8 py-6 gap-6 overflow-y-auto">
          
          {/* Left Card */}
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-h-[720px]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Find Doctor / Hospital
            </h2>
            <DoctorSearch onSelectDoctor={setSelectedDoctor} />
          </div>

          {/* Right Card */}
          <div className="w-full lg:w-[40%] bg-white rounded-2xl shadow-lg p-6 border border-gray-100 min-h-[720px]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Appointment Details
            </h2>
            <AppointmentForm selectedDoctor={selectedDoctor} />
          </div>
        </div>
      </div>
    </div>
  );
}
