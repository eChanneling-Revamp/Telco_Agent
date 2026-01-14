"use client";

import { useState } from "react";
import Sidebar from "../../components/dashboard/SideBar";
import Header from "../../components/dashboard/Header";
import SearchDoctor from "../../components/AppointmentBooking/SearchDoctor";
import SelectDateTime from "../../components/AppointmentBooking/SelectDateTime";
import PriceAndPatient from "../../components/AppointmentBooking/PriceAndPatient";
import AppointmentSummary from "../../components/AppointmentBooking/AppointmentSummary";
import { PatientData } from "@/types/appointment";
import { Doctor } from "@/types/appointment";

export default function AppointmentBookingPage() {
  const [selectedAccount, setSelectedAccount] = useState<string>("default");
  const [step, setStep] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientData, setPatientData] = useState<PatientData | null>(null);

  const handleDoctorSelect = (doctor: Doctor) => {
    console.log("✅ Doctor selected in page:", doctor);
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleDateTimeSelect = (date: string, time: string) => {
    console.log("✅ Date/Time selected:", { date, time });
    setSelectedDate(date);
    setSelectedTime(time);
    setStep(3);
  };

  const handlePatientSubmit = (data: PatientData) => {
    console.log("✅ Patient data submitted:", data);
    setPatientData(data);
    setStep(4);
  };

  const handleConfirm = async () => {
    if (!selectedDoctor || !patientData) {
      console.error("❌ Missing doctor or patient data", {
        doctor: selectedDoctor,
        patient: patientData,
      });
      return { success: false, error: "Missing required data" };
    }

    // ✅ FIX: Log all data before sending
    console.log("📊 Complete booking data:", {
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
      patient: patientData,
    });

    try {
      const payload = {
        doctorId: selectedDoctor.id,
        availabilityId: selectedDoctor.availabilityId,
        name: patientData.name,
        mobile: patientData.mobile,
        email: patientData.email || "",
        nic: patientData.nic,
        dob: patientData.dob,
        gender: patientData.gender,
        age: patientData.age,
        sltPhone: patientData.mobile,
        notes: "",
        appointmentDate: selectedDate,
        appointmentTime: selectedTime,
        paymentMethod: "bill",
        totalAmount: patientData.totalPrice,
        isMember: false,
        sendSms: true,
        sendEmail: patientData.email ? true : false,
        agreeRefund: patientData.agreeRefund,
      };

      console.log("📤 Sending payload:", payload);

      // ✅ Validate payload before sending
      const requiredFields = [
        "doctorId",
        "name",
        "appointmentDate",
        "appointmentTime",
        "totalAmount",
      ];
      const missingFields = requiredFields.filter(
        (field) => !payload[field as keyof typeof payload]
      );

      if (missingFields.length > 0) {
        console.error("❌ Missing required fields:", missingFields);
        return {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        };
      }

      const response = await fetch("/api/appointments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("📥 Response:", data);

      if (response.ok) {
        return { success: true, data };
      } else {
        console.error("❌ API Error:", data);
        return {
          success: false,
          error: data.error || data.message || "Booking failed",
        };
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      return {
        success: false,
        error: "Network error while booking. Please check your connection.",
      };
    }
  };

  const handleBookingSuccess = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSelectedDate("");
    setSelectedTime("");
    setPatientData(null);
  };

  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10 overflow-y-auto">
        <Header
          selectedAccount={selectedAccount}
          onAccountChange={setSelectedAccount}
        />
        <div className="p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 mb-4 sm:mb-2 text-black">
            <span className="text-xs sm:text-sm opacity-70">Dashboard</span>
            <span className="opacity-70">›</span>
            <span className="text-xs sm:text-sm">Appointment Booking</span>
          </div>

          {step === 1 && <SearchDoctor onNext={handleDoctorSelect} />}

          {step === 2 && selectedDoctor && (
            <SelectDateTime
              doctor={selectedDoctor}
              onNext={handleDateTimeSelect}
              onBack={() => setStep(1)}
              initialDate={selectedDate}
              initialTime={selectedTime}
            />
          )}

          {step === 3 && selectedDoctor && (
            <PriceAndPatient
              doctor={selectedDoctor}
              date={selectedDate}
              time={selectedTime}
              onNext={handlePatientSubmit}
              onBack={() => setStep(2)}
              initialData={patientData}
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
              onSuccess={handleBookingSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}
