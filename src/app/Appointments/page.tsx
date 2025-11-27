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
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const appointmentsPerPage = 8;
  const [totalAppointments, setTotalAppointments] = useState(0);

  const handleAccountChange = (account: string) => {
    setSelectedAccount(account);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(currentPage));
        params.set("limit", String(appointmentsPerPage));
        if (searchTerm) params.set("search", searchTerm);
        if (selectedStatus && selectedStatus !== "All Status")
          params.set("status", selectedStatus);
        if (selectedDate) params.set("date", selectedDate);

        const res = await fetch(
          `/api/appointments/my-appointments?${params.toString()}`
        );
        if (!res.ok) throw new Error("Not authenticated or failed");
        const data = await res.json();

        const mapped = (data.appointments || []).map((a: any) => ({
          id: a.id,
          patientName: a.patient_name,
          doctor: a.doctor_name,
          date: a.appointment_date,
          time: a.timeSlot || (a.appointment_time ? a.appointment_time : ""),
          status: a.status || "Confirmed",
        }));

        setAppointments(mapped);
        setTotalAppointments(data.total || 0);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
        setAppointments([]);
        setTotalAppointments(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentPage, searchTerm, selectedStatus, selectedDate]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedDate]);

  // server returns paged results, use them directly
  const pagedAppointments = appointments;

  const handlePreviousPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () =>
    setCurrentPage((p) =>
      Math.min(Math.ceil(totalAppointments / appointmentsPerPage) || 1, p + 1)
    );

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
      className="flex h-screen bg-[#eaeaea]"
      // style={{
      //   backgroundImage: `url('/assets/bg.png')`,
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      //   backgroundRepeat: "no-repeat",
      // }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <Header />

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6 text-black">
              <span className="text-xs sm:text-sm opacity-70">Dashboard</span>
              <span className="opacity-70">›</span>
              <span className="text-xs sm:text-sm">Appointment Management</span>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <AppointmentFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
              />

              <AppointmentTable
                appointments={pagedAppointments}
                getStatusColor={getStatusColor}
                currentPage={currentPage}
                totalAppointments={totalAppointments}
                appointmentsPerPage={appointmentsPerPage}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
