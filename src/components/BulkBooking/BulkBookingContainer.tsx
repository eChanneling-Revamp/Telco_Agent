"use client";

import { useState } from "react";
import AvailableDoctors from "./AvailableDoctors";
import ManualEntryForm from "./ManualEntryForm";
import CSVImport from "./CSVImport";
import EntryList from "./EntryList";

interface Entry {
  id: string;
  doctor: string;
  specialization: string;
  dateTime: string;
  patientName: string;
  patientNIC: string;
  patientPhone: string;
  patientEmail: string;
  paymentMethod: string;
  sltPhone: string;
  date: string;
  time: string;
}

export default function BulkBookingContainer() {
  const [activeTab, setActiveTab] = useState("manual");
  const [entries, setEntries] = useState<Entry[]>([]);

  const handleCSVImport = (importedEntries: Entry[]) => {
    setEntries([...entries, ...importedEntries]);
    alert(`Successfully imported ${importedEntries.length} appointment(s)!`);
  };

  const validateAll = () => {
    if (entries.length === 0) {
      alert("No appointments to validate!");
      return;
    }
    alert("All appointments validated successfully!");
  };

  const bookAll = () => {
    if (entries.length === 0) {
      alert("No appointments to book!");
      return;
    }
    alert(`Booking ${entries.length} appointment(s)...`);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-black">
      <AvailableDoctors />

      <div className="flex border-b border-gray-200">
        <button
          className={`px-6 py-3 font-semibold text-sm relative transition ${
            activeTab === "manual"
              ? "text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("manual")}
        >
          + Manual Entry
          {activeTab === "manual" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
          )}
        </button>

        <button
          className={`px-6 py-3 font-semibold text-sm relative flex items-center gap-2 transition ${
            activeTab === "csv"
              ? "text-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("csv")}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          CSV Import
          {activeTab === "csv" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600"></div>
          )}
        </button>
      </div>

      {activeTab === "manual" ? (
        <ManualEntryForm />
      ) : (
        <CSVImport onImport={handleCSVImport} />
      )}

      {entries.length > 0 && activeTab === "csv" && (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            Imported Appointments
          </h3>
          <EntryList entries={entries} setEntries={setEntries} />

          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-green-200 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-base">
                  Ready to Submit
                </p>
                <p className="text-xs text-gray-600">
                  {entries.length} appointment{entries.length > 1 ? "s" : ""}{" "}
                  ready for booking
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={validateAll}
                className="px-6 py-2.5 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all text-sm border border-gray-300 shadow-sm"
              >
                Validate All
              </button>

              <button
                onClick={bookAll}
                className="px-6 py-2.5 rounded-md bg-gradient-to-r from-green-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:from-green-600 hover:to-blue-700 transition-all text-sm"
              >
                Book All Appointments
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
