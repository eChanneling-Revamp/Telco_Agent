"use client";

import Sidebar from "../../components/dashboard/SideBar";
import Header from "../../components/dashboard/Header";
import BulkBookingContainer from "../../components/BulkBooking/BulkBookingContainer";

export default function BulkBookingPage() {
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
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
        <Header />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-3 sm:p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6 text-black">
              <span className="text-xs sm:text-sm opacity-70">Dashboard</span>
              <span className="opacity-70">›</span>
              <span className="text-xs sm:text-sm">Bulk Booking</span>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <BulkBookingContainer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
