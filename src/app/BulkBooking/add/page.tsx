"use client";

import Link from "next/link";
import { useState } from "react";
import Sidebar from "../../../components/dashboard/SideBar";
import Header from "../../../components/dashboard/Header";
import BulkBookingContainer from "../../../components/BulkBooking/BulkBookingContainer";

export default function AddBulkBookingPage() {
  const [selectedAccount, setSelectedAccount] = useState("Account 1");

  const handleAccountChange = (account: string) => setSelectedAccount(account);

  return (
    <div className="flex h-screen bg-[#f4fbff]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-0">
        <Header selectedAccount={selectedAccount} onAccountChange={handleAccountChange} />

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="p-3 sm:p-4 md:p-6">
            <div className="max-w-[1600px] mx-auto">

              {/* COLUMN LAYOUT UPDATED */}
              <div className="grid grid-cols-12 gap-6 items-start -mt-4">

                {/* LEFT: Main Appointment Box (WIDTH UPDATED) */}
                <div className="col-span-8 flex justify-center">
                  <div className="relative w-full max-w-[900px]">

                    <div className="bg-white rounded-2xl shadow-2xl p-8">

                      {/* Header Row -> Title + Cancel Button */}
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-3xl font-bold text-gray-900">Add New Appointment</h3>

                        <Link href="/BulkBooking">
                          <button
                            className="px-5 py-2.5 rounded-full border border-blue-300 
                            text-blue-600 bg-white shadow-sm 
                            hover:bg-blue-50 hover:border-blue-400 transition-all font-semibold"
                          >
                            Cancel
                          </button>
                        </Link>
                      </div>

                      {/* Scrollable content inside card */}
                      <div className="max-h-[75vh] overflow-y-auto custom-scrollbar pr-2">
                        <BulkBookingContainer />
                      </div>

                    </div>

                  </div>
                </div>

                {/* RIGHT: Booking Cart */}
                <div className="col-span-4 flex items-start">
                  <div className="bg-white rounded-2xl shadow-lg p-6 w-full">
                    <h3 className="text-xl font-semibold mb-4">Booking Cart</h3>
                    <div className="text-sm text-gray-500">Cart is empty</div>
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
