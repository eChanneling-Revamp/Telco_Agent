"use client";

export default function Breadcrumb() {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-5">
      {/* 🔹 Breadcrumb Section */}
      <div className="flex items-center text-sm text-white space-x-2">
        <span className="font-medium">Dashboard</span>
        <span className="text-white">{">"}</span>
        <span className="text-white font-semibold">Appointment Management</span>
      </div>
    </div>
  );
}
