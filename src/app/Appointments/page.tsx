"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../components/dashboard/SideBar";
import Header from "../../components/dashboard/Header";
import AppointmentFilters from "../../components/ApointmentManagement/appointmentFilters";
import MyAppointments from "../../components/ApointmentManagement/MyAppointments";
import AppointmentDetailsModal from "../../components/ApointmentManagement/AppointmentDetailsModal";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("Account 1");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(
    null
  );
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
        status: appointment.status || "confirmed",
        doctor: appointment.doctor,
        specialization: appointment.specialization,
        hospital: appointment.hospital,
        date: appointment.date,
        time: appointment.time,
        amount: appointment.amount || appointment.total || 0,
        patientName: appointment.patientName,
        patientPhone: appointment.patientPhone,
        patientNIC: appointment.patientNIC,
        patientDOB: appointment.patientDOB,
        patientGender: appointment.patientGender,
        patientAge: appointment.patientAge,
        basePrice: appointment.basePrice || 0,
        refundDeposit: appointment.refundDeposit || 0,
        total: appointment.total || 0,
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
        if (searchTerm) params.set("search", searchTerm);
        if (selectedStatus && selectedStatus !== "All Status")
          params.set("status", selectedStatus.toLowerCase());
        if (selectedDate) params.set("date", selectedDate);

        const res = await fetch(
          `/api/appointments/my-appointments?${params.toString()}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await res.json();

        const mapped = (data.appointments || []).map((a: any) => {
          const basePrice =
            parseFloat(a.consultation_fee) || parseFloat(a.total_amount) || 0;
          const refundDeposit = a.refund_eligible ? 250 : 0;
          const total = a.total_amount
            ? parseFloat(a.total_amount)
            : basePrice + refundDeposit;

          return {
            id: a.id,
            appointmentId: `APT${String(a.id).padStart(4, "0")}`,
            patientName: a.patient_name,
            patientPhone: a.patient_phone || a.slt_phone,
            patientNIC: a.patient_nic,
            patientDOB: a.patient_dob,
            patientGender: a.patient_gender,
            patientAge: a.patient_age,
            doctor: a.doctor_name || a.doctor_full_name,
            specialization: a.specialty,
            hospital: a.hospital,
            date: a.appointment_date,
            time: a.timeSlot || a.appointment_time || "",
            status: a.status || "confirmed",
            amount: total,
            basePrice: basePrice,
            refundDeposit: refundDeposit,
            total: total,
            refundEligible: a.refund_eligible,
            paymentStatus: a.payment_status,
            createdAt: a.created_at,
          };
        });

        setAppointments(mapped);
        setTotalAppointments(data.total || mapped.length);
      } catch (err) {
        console.error("Failed to fetch appointments:", err);
        setAppointments([]);
        setTotalAppointments(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [searchTerm, selectedStatus, selectedDate]);

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "confirmed":
        return "bg-emerald-100 text-emerald-600 border border-emerald-200";
      case "cancelled":
        return "bg-rose-100 text-rose-600 border border-rose-200";
      case "pending":
        return "bg-amber-100 text-amber-600 border border-amber-200";
      case "completed":
        return "bg-blue-100 text-blue-600 border border-blue-200";
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

            <div className="max-w-[1400px] mx-auto">
              <MyAppointments
                appointments={appointments}
                loading={loading}
                searchTerm={searchTerm}
                selectedStatus={
                  selectedStatus !== "All Status" ? selectedStatus : "All"
                }
                onView={handleViewDetails}
              />
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
