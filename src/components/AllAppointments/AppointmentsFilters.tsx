'use client';

import React from 'react';

interface AppointmentsFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const AppointmentsFilters: React.FC<AppointmentsFiltersProps> = ({ onFilterChange }) => {
  const handleChange = (field: string, value: string) => {
    onFilterChange({ [field]: value });
  };

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <select
        onChange={(e) => handleChange('agent', e.target.value)}
        className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      >
        <option value="all">All Agents</option>
        <option value="john.smith">Agent John Smith</option>
        <option value="mary.j">Agent Mary Johnson</option>
      </select>

      <select
        onChange={(e) => handleChange('date', e.target.value)}
        className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      >
        <option value="all">All Dates</option>
        <option value="2024-01-15">2024-01-15</option>
        <option value="2024-01-16">2024-01-16</option>
      </select>

      <select
        onChange={(e) => handleChange('hospital', e.target.value)}
        className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      >
        <option value="all">All Hospitals</option>
        <option value="City Hospital">City Hospital</option>
        <option value="Metro Medical Center">Metro Medical Center</option>
      </select>

      <select
        onChange={(e) => handleChange('refundStatus', e.target.value)}
        className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      >
        <option value="all">All Refund Status</option>
        <option value="Full refund eligible">Full refund eligible</option>
        <option value="Non-refundable">Non-refundable</option>
      </select>
    </div>
  );
};
