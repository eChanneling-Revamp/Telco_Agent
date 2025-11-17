import React from "react";

export default function SelectedSession({ session }: { session: any | null }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm w-full max-w-sm">

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Selected Session</h3>

      {/* No session selected */}
      {!session ? (
        <p className="text-gray-400 text-sm">No session selected</p>
      ) : (
        <div className="flex flex-col gap-3">

          {/* Doctor Name */}
          <p className="text-[18px] font-semibold text-gray-900">
            {session.name}
          </p>

          {/* Specialization */}
          <p className="text-sm text-gray-600">
            {session.specialization}
          </p>

          {/* Hospital */}
          <p className="text-sm text-gray-500">
            {session.hospital}
          </p>

          {/* Appointment Time */}
          <div className="mt-3 inline-block px-4 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium shadow-sm">
            {session.date} | {session.time}
          </div>

          {/* Optional: Add a "Change Doctor" button */}
          <button className="mt-4 px-4 py-2 bg-gradient-to-r from-[#23DE4F] to-[#330FFB] text-white rounded-full text-sm font-medium hover:opacity-90 transition shadow-md">
            Change Doctor
          </button>

        </div>
      )}
    </div>
  );
}
