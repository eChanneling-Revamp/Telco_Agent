'use client';

import React from 'react';

interface AppointmentsSearchBarProps {
  onSearch: (query: string) => void;
}

export const AppointmentsSearchBar: React.FC<AppointmentsSearchBarProps> = ({ onSearch }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex-1 relative bg-white rounded-2xl shadow-sm border border-gray-100">
        <input
          type="text"
          placeholder="Search by patient, doctor, agent, or hospital"
          onChange={handleChange}
          className="w-full px-6 py-4 rounded-2xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        />
      </div>
      <button className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl transition-colors shadow-sm">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
};