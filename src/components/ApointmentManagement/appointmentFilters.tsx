"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

type AppointmentFiltersProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  compact?: boolean;
};

export default function AppointmentFilters({
  searchTerm,
  setSearchTerm,
  selectedStatus,
  setSelectedStatus,
  selectedDate,
  setSelectedDate,
  compact = false,
}: AppointmentFiltersProps) {
  const containerClass = compact ? "p-4" : "py-6 px-4 bg-transparent";
  const [inputValue, setInputValue] = useState<string>(searchTerm ?? "");

  // Keep local input in sync if parent resets searchTerm
  useEffect(() => {
    setInputValue(searchTerm ?? "");
  }, [searchTerm]);

  // Debounce input -> propagate to parent after delay
  useEffect(() => {
    const id = setTimeout(() => {
      if (inputValue !== searchTerm) setSearchTerm(inputValue);
    }, 350);
    return () => clearTimeout(id);
  }, [inputValue, searchTerm, setSearchTerm]);

  return (
    <div className={containerClass}>
      <div className="flex justify-center">
        <div className="w-full flex justify-center">
          <div className="w-full max-w-[1200px]">
            {/* Outer pill: make it white and visually heavier (larger padding, bolder input) */}
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 px-8 py-3">
            <div className="flex items-center gap-4">
              {/* search icon */}
              <div className="flex items-center pl-2">
                <Search className="w-6 h-6 text-gray-500" />
              </div>

              {/* input */}
                  <input
                    type="text"
                    placeholder="Search by patient name, doctor, or mobile number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 bg-transparent outline-none text-lg font-medium text-gray-700 placeholder-gray-400 px-4 py-2"
                  />

              {/* blue rounded search button (larger square pill) */}
                  <button
                    onClick={() => {
                      // apply immediately when user clicks the button
                      if (inputValue !== searchTerm) setSearchTerm(inputValue);
                    }}
                    className="ml-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl w-12 h-12 shadow-lg flex items-center justify-center"
                    aria-label="Search"
                  >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
