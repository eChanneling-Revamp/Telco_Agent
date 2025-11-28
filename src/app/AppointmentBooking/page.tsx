"use client";
import SideBar from "../../components/dashboard/SideBar";
import Header from "../../components/dashboard/Header";

const AppointmentBookingPage = () => {
  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <SideBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-2 mb-6  text-black">
            <span className="text-sm ">Appoinment Booking</span>
          </div>
        </main>
      </div>
    </div>
  );
};
export default AppointmentBookingPage;