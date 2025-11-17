import { useState } from "react";
import DoctorSearch from "./DoctorSearch";
import AppointmentForm from "./AppointmentForm";

export default function AppointmentBookingContainer() {
  // Store doctor selected from search
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Left Section - Search & Results */}
      <div>
        <DoctorSearch 
          onSelectDoctor={(doctor: any) => setSelectedDoctor(doctor)} 
        />
      </div>

      {/* Right Section - Booking Form */}
      <div>
        <AppointmentForm selectedDoctor={selectedDoctor} />
      </div>
    </div>
  );
}
