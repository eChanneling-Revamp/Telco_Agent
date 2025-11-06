"use client";

export default function Breadcrumb() {
  return (
    <div>
      {/* 🔹 Breadcrumb Section */}
      <div className="flex items-center gap-2 mb-5 p-6 text-white">
        <span className="text-sm opacity-70">Dashboard</span>
        <span className="opacity-70">›</span>
        <span className="text-sm">Appointment Management</span>
      </div>
    </div>
  );
}
