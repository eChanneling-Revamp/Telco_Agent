"use client";

import React from "react";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import AdminHeader from "@/components/dashboard/AdminHeader";


const NewAdminDashboard = () => {
  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Admin Dashboard" />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Statistic Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 text-black">
            {/* Total Agents Registered */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-blue-100 mr-4">
                  <div className="w-6 h-6 bg-blue-500 rounded-lg"></div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">
                    Total Agents Registered
                  </p>
                  <p className="text-2xl font-bold">24</p>
                </div>
              </div>
            </div>

            {/* Active Agents */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-green-100 mr-4">
                  <div className="w-6 h-6 bg-green-500 rounded-lg"></div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Active Agents</p>
                  <p className="text-2xl font-bold">20</p>
                </div>
              </div>
            </div>

            {/* Suspended Agents */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-yellow-100 mr-4">
                  <div className="w-6 h-6 bg-yellow-500 rounded-lg"></div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Suspended Agents</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
              </div>
            </div>

            {/* Total Appointments Today */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-purple-100 mr-4">
                  <div className="w-6 h-6 bg-purple-500 rounded-lg"></div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">
                    Total Appointments Today
                  </p>
                  <p className="text-2xl font-bold">48</p>
                </div>
              </div>
            </div>

            {/* Refund Requests */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-red-100 mr-4">
                  <div className="w-6 h-6 bg-red-500 rounded-lg"></div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Refund Requests</p>
                  <p className="text-2xl font-bold">7</p>
                </div>
              </div>
            </div>

            {/* System Activity */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-xl bg-indigo-100 mr-4">
                  <div className="w-6 h-6 bg-indigo-500 rounded-lg"></div>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">System Activity</p>
                  <p className="text-2xl font-bold">High</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Agent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 text-black">
            <h2 className="text-xl font-semibold mb-6">
              Recent Agent Activity
            </h2>
            <div className="space-y-6">
              <div className="flex justify-between items-start pb-6 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Agent John
                  </h3>
                  <p className="text-sm text-gray-500">
                    Booked appointment for Sarah Wilson
                  </p>
                </div>
                <div className="text-sm text-gray-400">10 mins ago</div>
              </div>
              <div className="flex justify-between items-start pb-6 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Agent Mary
                  </h3>
                  <p className="text-sm text-gray-500">
                    Cancelled appointment for Mike Brown
                  </p>
                </div>
                <div className="text-sm text-gray-400">25 mins ago</div>
              </div>
              <div className="flex justify-between items-start pb-6 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Agent David
                  </h3>
                  <p className="text-sm text-gray-500">
                    Booked appointment for Lisa Chen
                  </p>
                </div>
                <div className="text-sm text-gray-400">1 hour ago</div>
              </div>
              <div className="flex justify-between items-start pb-6 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Agent John
                  </h3>
                  <p className="text-sm text-gray-500">
                    Booked appointment for Sarah Wilson
                  </p>
                </div>
                <div className="text-sm text-gray-400">10 mins ago</div>
              </div>
              <div className="flex justify-between items-start pb-6 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">
                    Agent Mary
                  </h3>
                  <p className="text-sm text-gray-500">
                    Cancelled appointment for Mike Brown
                  </p>
                </div>
                <div className="text-sm text-gray-400">25 mins ago</div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewAdminDashboard;
