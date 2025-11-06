"use client";

export default function Breadcrumb({ current = "Appointment Management" }: { current?: string }) {
  return (
    <div className="flex items-center justify-start h-12 mb-4">
      {/* 🔹 Breadcrumb Section */}
      <div className="flex items-center text-sm space-x-2">
        <span className="font-medium text-white/70">Dashboard </span>
        <span className="text-white/70">{">"}</span>
        <span className="text-white font-semibold">{current}</span>
      </div>
    </div>
  );
}
