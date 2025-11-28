"use client";

import { useState } from "react";
import Sidebar from "../../components/dashboard/SideBar";
import Header from "../../components/dashboard/Header";
import SearchDoctor from "../../components/AppointmentBooking/SearchDoctor";
import SelectDateTime from "../../components/AppointmentBooking/SelectDateTime";
import PriceAndPatient from "../../components/AppointmentBooking/PriceAndPatient";
import AppointmentSummary from "../../components/AppointmentBooking/AppointmentSummary";

type Doctor = {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  hospitalType: "Private" | "Government";
  city: string;
  available: string;
  availabilityId: number;
  consultationFee: number;
  slotsAvailable: number;
};

export default function AppointmentBookingPage() {
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientData, setPatientData] = useState<any>(null);

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(3);
  };

  const handlePatientSubmit = (data: any) => {
    setPatientData(data);
    setStep(4);
  };

  const handleConfirm = async () => {
    if (!selectedDoctor || !patientData) return;

    try {
      const payload = {
        doctorId: selectedDoctor.id,
        availabilityId: selectedDoctor.availabilityId,
        patientName: patientData.name,
        patientPhone: patientData.mobile,
        patientEmail: "",
        sltPhone: patientData.mobile,
        notes: "",
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        paymentMethod: "bill",
        totalAmount: patientData.totalPrice,
        isMember: false,
        sendSms: true,
        sendEmail: false,
        agreeRefund: patientData.agreeRefund,
      };

      const response = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Appointment booked successfully!");
        // Reset to step 1
        setStep(1);
        setSelectedDoctor(null);
        setSelectedDate("");
        setSelectedTime("");
        setPatientData(null);
      } else {
        alert(data.error || "Booking failed");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Network error while booking");
    }
  };

  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        <Header />
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-2 text-black">
            <span className="text-xs sm:text-sm opacity-70">Dashboard</span>
            <span className="opacity-70">›</span>
            <span className="text-xs sm:text-sm">Appointment Booking</span>
          </div>

          {/* Render current step */}
          {step === 1 && <SearchDoctor onNext={handleDoctorSelect} />}

          {step === 2 && selectedDoctor && (
            <SelectDateTime
              doctor={selectedDoctor}
              onNext={handleDateTimeSelect}
              onBack={() => setStep(1)}
            />
          )}

          {step === 3 && selectedDoctor && (
            <PriceAndPatient
              doctor={selectedDoctor}
              date={selectedDate}
              time={selectedTime}
              onNext={handlePatientSubmit}
              onBack={() => setStep(2)}
            />
          )}

          {step === 4 && selectedDoctor && patientData && (
            <AppointmentSummary
              doctor={selectedDoctor}
              date={selectedDate}
              time={selectedTime}
              patientData={patientData}
              onConfirm={handleConfirm}
              onBack={() => setStep(3)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
