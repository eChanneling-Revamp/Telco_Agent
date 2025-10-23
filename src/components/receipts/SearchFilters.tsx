import React from "react";
const SearchFilters = ({ 
  searchQuery, 
  startDate, 
  endDate, 
  statusFilter,
  onSearchChange, 
  onStartDateChange, 
  onEndDateChange,
  onStatusFilterChange 
}: {
  searchQuery: string;
  startDate: string;
  endDate: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <input
        type="text"
        placeholder="Search by Receipt ID / Patient"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 min-w-[200px] p-2 border border-gray-200 rounded-lg placeholder:text-gray-400 text-black"
      />
      <div className="flex gap-4">
        <input 
          type="date" 
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="p-2 border border-gray-200 rounded-lg  text-black" 
        />
        <span className="self-center text-black">to</span>
        <input 
          type="date" 
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="p-2 border border-gray-200 rounded-lg text-black" 
        />
        <select 
          value={statusFilter}
          onChange={(e) => onStatusFilterChange(e.target.value)}
          className="p-2 border border-gray-200 rounded-lg text-black"
        >
          <option value="">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Refunded">Refunded</option>
          <option value="Pending">Pending</option>
        </select>
      </div>
    </div>
  );
};


export default SearchFilters;
