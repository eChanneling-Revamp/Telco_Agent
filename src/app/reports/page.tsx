"use client";

import React from "react";
import Sidebar from "@/components/dashboard/SideBar";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaCalendarAlt, FaFilePdf, FaFileExcel } from "react-icons/fa";

const dailyData = [
  { day: "Mon", bookings: 8 },
  { day: "Tue", bookings: 18 },
  { day: "Wed", bookings: 14 },
  { day: "Thu", bookings: 22 },
  { day: "Fri", bookings: 28 },
  { day: "Sat", bookings: 21 },
  { day: "Sun", bookings: 10 },
];

const monthlyData = [
  { month: "Jan", bookings: 30, cancellations: 2 },
  { month: "Feb", bookings: 35, cancellations: 3 },
  { month: "Mar", bookings: 32, cancellations: 4 },
  { month: "Apr", bookings: 34, cancellations: 3 },
  { month: "May", bookings: 38, cancellations: 2 },
];

const recentActivity = [
  {
    id: 1,
    title: "New appointment booked",
    details: "Dr. Sarah Wilson with John Doe at Central Hospital",
    time: "Today, 10:30 AM",
  },
  {
    id: 2,
    title: "New appointment booked",
    details: "Dr. Sarah Wilson with Jane Doe at Metro Medical Center",
    time: "Today, 10:00 AM",
  },
  {
    id: 3,
    title: "New appointment booked",
    details: "Dr. James Fernando with Mark Silva at MediPharm Plus",
    time: "Today, 9:30 AM",
  },
];

const ReportsPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full bg-[#0b233f]">
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 bg-gray-50 p-6 overflow-y-auto">
        <h1 className="text-xl font-semibold text-gray-800 mb-4">Reports</h1>

        {/* Header */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700">
            Telco Agent Module
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 border rounded-md px-2 py-1 text-sm text-gray-600">
              <FaCalendarAlt className="text-gray-500" />
              <span>mm/dd/yyyy</span>
              <span>to</span>
              <span>mm/dd/yyyy</span>
            </div>
            <select className="border rounded-md px-2 py-1 text-sm text-gray-600">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-500">Total Bookings</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-1">1,245</p>
            <p className="text-xs text-green-600 mt-1">↑ 12% vs last period</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-500">Cancellations</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-1">128</p>
            <p className="text-xs text-red-600 mt-1">↑ 3% vs last period</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-semibold text-gray-800 mt-1">Rs. 3.2M</p>
            <p className="text-xs text-green-600 mt-1">↑ 8% vs last period</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Daily Bookings */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Daily Bookings
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="#007bff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Monthly Trends
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#22c55e"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="cancellations"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex justify-end gap-3 mb-6">
          <button className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-100 text-sm">
            <FaFilePdf className="text-red-500" /> Export PDF
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white text-gray-700 rounded-md shadow-sm hover:bg-gray-100 text-sm">
            <FaFileExcel className="text-green-500" /> Export Excel
          </button>
        </div>

        

        <footer className="text-xs text-gray-500 mt-6 text-center">
          © 2025 Sri Lanka Telecom eChanneling
        </footer>
      </div>
    </div>
  );
};

export default ReportsPage;
