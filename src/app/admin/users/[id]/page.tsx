"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import AdminHeader from "@/components/dashboard/AdminHeader";
import { useRouter } from "next/navigation";
import { AgentDetails } from "@/components/ManageAgents/AgentDetails";
import { AdminControls } from "@/components/ManageAgents/AdminControls";
import { AppointmentsList } from "@/components/ManageAgents/AppointmentsList";
import { fetchAgentById } from "@/lib/agent";
import { fetchAppointmentsByAgent } from "@/lib/adminAppoinments";
import { Appointment } from "@/types/appointment";
import { Agent } from "@/types/agent";

interface AgentPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AgentPage({ params }: AgentPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  useEffect(() => {
    const loadAgent = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedAgent = await fetchAgentById(id);

        if (!fetchedAgent) {
          setError("Agent not found");
          return;
        }

        setAgent(fetchedAgent);
      } catch (err) {
        console.error("Error loading agent:", err);
        setError("Failed to load agent details");
      } finally {
        setIsLoading(false);
      }
    };

    loadAgent();
  }, [id]);

  useEffect(() => {
    const loadAppointments = async () => {
      if (!id || !agent) return;

      try {
        setAppointmentsLoading(true);
        const agentName = agent.fullName || agent.username;
        const fetchedAppointments = await fetchAppointmentsByAgent(
          id,
          // agentName
        );
        setAppointments(fetchedAppointments);
      } catch (err) {
        console.error("Error loading appointments:", err);
      } finally {
        setAppointmentsLoading(false);
      }
    };

    if (agent) {
      loadAppointments();
    }
  }, [id, agent]);

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#eaeaea]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="flex h-screen bg-[#eaeaea]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          <main className="flex-1 overflow-y-auto p-8">
            <div className="mx-auto">
              <Link
                href="/admin/users"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium mb-6"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Agents
              </Link>
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error || "Agent not found"}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto">
            <div className="mb-6">
              <Link
                href="/admin/users"
                className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Agents
              </Link>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Agent Details
            </h1>

            {/* Agent Details Section */}
            <div className="mb-8">
              <AgentDetails agent={agent} />
            </div>

            <AdminControls agent={agent} />

            {/* Appointments Section */}
            {appointmentsLoading ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
                </div>
              </div>
            ) : (
              <AppointmentsList appointments={appointments} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
