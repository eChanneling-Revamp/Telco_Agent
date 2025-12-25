"use client";

import React from "react";

type AgentOption = {
  id: string;
  name: string;
};

type SelectedFilters = {
  agent: string;
  status: string;
  hospital: string;
  date: string;
};

interface AppointmentsFiltersProps {
  agents: AgentOption[];
  hospitals: string[];
  statuses: string[];
  selectedFilters: SelectedFilters;
  onFilterChange: (filters: Partial<SelectedFilters>) => void;
}

export const AppointmentsFilters: React.FC<AppointmentsFiltersProps> = ({
  agents,
  hospitals,
  statuses,
  selectedFilters,
  onFilterChange,
}) => {
  const handleChange = (field: keyof SelectedFilters, value: string) => {
    onFilterChange({ [field]: value });
  };

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <select
        value={selectedFilters.agent}
        onChange={(e) => handleChange("agent", e.target.value)}
        className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      >
        <option value="all">All Agents</option>
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={selectedFilters.date}
        onChange={(e) => handleChange("date", e.target.value)}
        className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      />

      <select
        value={selectedFilters.hospital}
        onChange={(e) => handleChange("hospital", e.target.value)}
        className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      >
        <option value="all">All Hospitals</option>
        {hospitals.map((hospital) => (
          <option key={hospital} value={hospital}>
            {hospital}
          </option>
        ))}
      </select>

      <select
        value={selectedFilters.status}
        onChange={(e) => handleChange("status", e.target.value)}
        className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
      >
        <option value="all">All Status</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};
