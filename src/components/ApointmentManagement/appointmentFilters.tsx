"use client";
import { Search, Calendar, ChevronDown, Filter } from "lucide-react"; // <-- Use Filter icon here

type AppointmentFiltersProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
};

export default function AppointmentFilters({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedDate,
  setSelectedDate,
}: AppointmentFiltersProps) {
  return (
    <div className="p-4 bg-white border-b shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/*  Search */}
        <div className="flex-1 relative min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient or doctor"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/*  Date Picker */}
        <div className="relative flex items-center w-44">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="mm/dd/yyyy"
            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => !e.target.value && (e.target.type = "text")}
          />
        </div>

        {/*  Status Dropdown */}
        <div className="relative w-40">
          <select
            className="appearance-none w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8 transition-all"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Confirmed</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>

        {/*  More Filters Button */}
        <button
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-teal-500 hover:text-teal-600 shadow-sm transition-all"
          onClick={() =>
            alert("Open advanced filters (Doctor, Department, Time, etc.)")
          }
        >
          <Filter className="w-4 h-4 text-gray-600" /> {/* Funnel icon */}
          More Filters
        </button>
      </div>
    </div>
  );
}
