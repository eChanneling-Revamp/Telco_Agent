"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "../../components/dashboard/SideBar";
import Header from "../../components/dashboard/Header";
import BulkBookingContainer from "../../components/BulkBooking/BulkBookingContainer";

export default function BulkBookingPage() {
  const [selectedAccount, setSelectedAccount] = useState<string>("default");

  const handleAccountChange = (account: string) => {
    setSelectedAccount(account);
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
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Header */}
      <Header
  selectedAccount={selectedAccount}
  onAccountChange={setSelectedAccount}
/>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-3 sm:p-4 md:p-6">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6 text-black">
              <span className="text-xs sm:text-sm opacity-70">Dashboard</span>
              <span className="opacity-70">›</span>
              <span className="text-xs sm:text-sm">Bulk Booking</span>
            </div>

            {/* Top header area (pale-blue banner) */}
            <div className="mb-2">
              <div className="bg-transparent rounded-xl p-2">
                <div className="max-w-[1400px] mx-auto flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-semibold text-gray-900">
                      Bulk Booking
                    </h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Add multiple appointments and pay once
                    </p>
                  </div>

                  <div>
                    <Link
                      href="/BulkBooking/add"
                      className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-3 rounded-xl shadow-md"
                    >
                      <span className="text-lg font-bold">+</span>
                      <span className="font-semibold">Add Appointment</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Main layout: centered max width with overlapping white card */}
            <div className="max-w-[1400px] mx-auto p-2">
              <div className="grid grid-cols-12 gap-6 items-start">
                <div className="col-span-9">
                  <div className="bg-white rounded-xl shadow-lg p-8 h-96 flex flex-col items-center justify-center">
                    <div className="text-center text-gray-400">
                      <svg
                        className="mx-auto mb-4 w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4"
                        />
                      </svg>
                      <p className="text-lg font-semibold text-gray-800 mb-3">
                        No appointments in cart yet
                      </p>
                      <p className="text-sm text-gray-600 mb-6">
                        Add appointments to the booking cart and pay once for
                        all.
                      </p>
                      <Link
                        href="/BulkBooking/add"
                        className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-lg shadow-md inline-flex items-center gap-2"
                      >
                        <span className="text-lg font-bold">+</span>
                        <span className="font-semibold">
                          Add First Appointment
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-span-3">
                  <div className="bg-white rounded-xl shadow-lg p-6 text-black">
                    <h3 className="text-lg font-semibold mb-3">Booking Cart</h3>
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🛒</div>
                      <p className="text-sm text-gray-500">Cart is empty</p>
                      <p className="text-xs text-gray-400 mt-2">
                        Add appointments to get started
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
