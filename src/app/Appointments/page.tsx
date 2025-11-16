"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/dashboard/SideBar";
import Header from "../../components/dashboard/Header";
import AppointmentFilters from "../../components/ApointmentManagement/appointmentFilters";
import AppointmentTable from "../../components/ApointmentManagement/AppointmentTable";
import Breadcrumb from "@/components/ApointmentManagement/Breadcrumb";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("Account 1");

  const handleAccountChange = (account: string) => {
    setSelectedAccount(account);
  };

  const appointments = [
    {
      id: 1,
      patientName: "Nimal Perera",
      doctor: "Dr. Kumari Wickramasinghe",
      date: "2025-05-15",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      id: 2,
      patientName: "Sanduni Fernando",
      doctor: "Dr. Ranil Jayawardena",
      date: "2025-05-15",
      time: "11:45 AM",
      status: "Cancelled",
    },
    {
      id: 3,
      patientName: "Kamal Silva",
      doctor: "Dr. Chamari Dissanayake",
      date: "2025-05-16",
      time: "09:30 AM",
      status: "Confirmed",
    },
    {
      id: 4,
      patientName: "Dilani Rathnayake",
      doctor: "Dr. Prasanna Gunasekara",
      date: "2025-05-16",
      time: "02:15 PM",
      status: "Pending",
    },
    {
      id: 5,
      patientName: "Ruwan Mendis",
      doctor: "Dr. Sachini Amarasinghe",
      date: "2025-05-17",
      time: "10:30 AM",
      status: "Confirmed",
    },
  ] as const;

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "All Status" || apt.status === selectedStatus;
    const matchesDate = !selectedDate || apt.date === selectedDate;
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-100 text-emerald-600 border border-emerald-200";
      case "Cancelled":
        return "bg-rose-100 text-rose-600 border border-rose-200";
      case "Pending":
        return "bg-amber-100 text-amber-600 border border-amber-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div
      className="flex h-screen"
      style={{
        backgroundImage: `url('/assets/bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="flex items-center gap-2 mb-6 text-white">
            <span className="text-sm opacity-70">Dashboard</span>
            <span className="opacity-70">›</span>
            <span className="text-sm">Appointment Management</span>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <AppointmentFilters
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />

            <AppointmentTable
              appointments={filteredAppointments}
              getStatusColor={getStatusColor}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
