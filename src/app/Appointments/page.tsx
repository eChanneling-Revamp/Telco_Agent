"use client";

import { useState, useEffect, useMemo } from "react";
import Sidebar from "../../components/dashboard/SideBar";
import Header from "../../components/dashboard/Header";
import AppointmentFilters from "../../components/ApointmentManagement/appointmentFilters";
import MyAppointments from "../../components/ApointmentManagement/MyAppointments";
import AppointmentDetailsModal from "../../components/ApointmentManagement/AppointmentDetailsModal";

// page-level icons not required

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("Account 1");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // page uses card view only
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null
  );
  const appointmentsPerPage = 8;
  const [totalAppointments, setTotalAppointments] = useState(0);

  const handleAccountChange = (account: string) => {
    setSelectedAccount(account);
  };

  const handleViewDetails = (appointmentId: number) => {
    const appointment = appointments.find((apt) => apt.id === appointmentId);
    if (appointment) {
      setSelectedAppointment({
        id: appointment.id,
        appointmentId:
          appointment.appointmentId ||
          `APT${String(appointment.id).padStart(4, "0")}`,
        status: appointment.status || "Confirmed",
        doctor: appointment.doctor,
        specialization: appointment.specialization,
        hospital: appointment.hospital,
        date: appointment.date,
        time: appointment.time,
        amount: appointment.amount || appointment.basePrice || 3000,
        patientName: appointment.patientName,
        patientPhone: appointment.patientPhone,
        basePrice: appointment.basePrice || 3000,
        refundDeposit: appointment.refundDeposit || 0,
        total:
          appointment.total ||
          (appointment.basePrice || 3000) + (appointment.refundDeposit || 0),
        refundEligible: appointment.refundEligible
          ? "Rs. 250 deposit paid – Full refund eligible if cancelled"
          : "No refund protection",
      });
      setIsModalOpen(true);
    }
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

        const mapped = (data.appointments || []).map((a: any) => {
          const basePrice = a.consultation_fee || 3000;
          const refundDeposit = a.refund_eligible ? 250 : 0;
          const total = basePrice + refundDeposit;
          return {
            id: a.id,
            patientName: a.patient_name,
            patientPhone: a.patient_phone,
            doctor: a.doctor_name,
            specialization: a.specialty,
            hospital: a.hospital,
            date: a.appointment_date,
            time: a.timeSlot || (a.appointment_time ? a.appointment_time : ""),
            status: a.status || "Confirmed",
            amount: a.total_amount,
            basePrice: basePrice,
            refundDeposit: refundDeposit,
            total: total,
            refundEligible: a.refund_eligible,
            paymentStatus: a.payment_status,
          };
        });

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
    <div className="flex h-screen bg-[#eaeaea]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <Header />

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-2 text-black">
            <span className="text-xs sm:text-sm opacity-70">Dashboard</span>
            <span className="opacity-70">›</span>
            <span className="text-xs sm:text-sm">All Appointments</span>
          </div>
            <div className="bg-transparent rounded-xl px-2 py-6 mb-2">
              <div className="max-w-[1400px] mx-auto">
                <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                  My Placed Appointments
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Your recently placed appointments are listed below.
                </p>

                <div className="mt-8 flex justify-center">
                  <div className="w-full max-w-[1200px]">
                    <AppointmentFilters
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      selectedStatus={selectedStatus}
                      setSelectedStatus={setSelectedStatus}
                      selectedDate={selectedDate}
                      setSelectedDate={setSelectedDate}
                      compact={false}
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}

            <div className="max-w-[1400px] mx-auto">
              {/* <div className="rounded-xl shadow-lg p-6 sm:p-8 md:p-10 -mt-8"> */}
              {/* Card List */}
              <MyAppointments
                appointments={pagedAppointments}
                loading={loading}
                searchTerm={searchTerm}
                selectedStatus={
                  selectedStatus !== "All Status" ? selectedStatus : "All"
                }
                onView={handleViewDetails}
              />
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
