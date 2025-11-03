import DoctorSearch from "./DoctorSearch";
import AppointmentForm from "./AppointmentForm";

export default function AppointmentBookingContainer() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Left Section - Search & Results */}
      <div>
        <DoctorSearch onSelectDoctor={() => {}} />
      </div>

      {/* Right Section - Booking Form */}
      <div>
        <AppointmentForm selectedDoctor={null} />
      </div>
    </div>
  );
}
