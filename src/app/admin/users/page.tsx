"use client";

import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import AdminHeader from "@/components/dashboard/AdminHeader";
import { AgentsList } from "@/components/ManageAgents/AgentList";
import { fetchAgents } from "@/lib/agent";
import { Agent } from "@/types/agent";
import { useRouter } from "next/navigation";

export default function AgentsPage() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedAgents = await fetchAgents();
        setAgents(fetchedAgents);
      } catch (err) {
        console.error("Error loading agents:", err);
        setError("Failed to load agents. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, []);

  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-8">
          <div className=" mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-900">
                Manage Agents
              </h1>
              <button
                onClick={() => router.push("/admin/users/new")}
                className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                Add New Agent
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
              </div>
            ) : (
              <AgentsList initialAgents={agents} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
