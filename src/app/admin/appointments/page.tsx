"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import AdminHeader from "@/components/dashboard/AdminHeader";
import { AllAppointmentsList } from "@/components/AllAppointments/AppointmentsList";
import { fetchAllAppointments } from "@/lib/appointments";
import { Appointment } from "@/types/appointment";

type FilterState = {
  search: string;
  agent: string;
  status: string;
  hospital: string;
  date: string;
};

type AgentOption = {
  id: string;
  name: string;
};

const defaultFilters: FilterState = {
  search: "",
  agent: "all",
  status: "all",
  hospital: "all",
  date: "",
};

export default function AllAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [hospitals, setHospitals] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([
    "confirmed",
    "pending",
    "cancelled",
    "completed",
  ]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [listLoading, setListLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  // initial load
  useEffect(() => {
    (async () => {
      try {
        // Fetch metadata and initial data in parallel
        const [metaRes, initialData] = await Promise.all([
          fetch("/api/admin/appointments/filters"),
          fetchAllAppointments(defaultFilters),
        ]);

        if (metaRes.ok) {
          const meta = await metaRes.json();
          setAgents(meta.agents || []);
          setHospitals(meta.hospitals || []);
        }

        setAppointments(initialData || []);
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  // central loader for list updates
  const loadAppointments = async (
    patch: Partial<FilterState> = {},
    searchVal = searchTerm
  ) => {
    setListLoading(true);
    try {
      const updatedFilters = { ...filters, ...patch };
      // Map 'search' to the key expected by api/admin/appointments/route.ts
      const apiParams = {
        ...updatedFilters,
        search: searchVal, // Ensure search string is passed
      };

      const data = await fetchAllAppointments(apiParams);

      setAppointments(data || []);

      // Update local filter state
      setFilters(updatedFilters);
    } catch (err) {
      console.error("List update error:", err);
    } finally {
      setListLoading(false);
    }
  };

  // search change
  const handleSearchChange = (q: string) => {
    setSearchTerm(q); // Update UI state
    loadAppointments({}, q); // Trigger backend fetch
  };

  const handleFiltersChange = (partial: Partial<FilterState>) => {
    loadAppointments(partial);
  };

  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              All Appointments
            </h1>

            {fetchError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {fetchError}
              </div>
            )}

            {initialLoading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
              </div>
            ) : (
              <AllAppointmentsList
                appointments={appointments}
                searchTerm={searchTerm}
                filters={{
                  agent: filters.agent,
                  status: filters.status,
                  hospital: filters.hospital,
                  date: filters.date,
                }}
                agents={agents}
                hospitals={hospitals}
                statuses={statuses}
                onSearchChange={handleSearchChange}
                onFiltersChange={handleFiltersChange}
                loading={listLoading}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
