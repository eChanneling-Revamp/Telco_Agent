import React from 'react';
import AdminSidebar from '@/components/dashboard/AdminSidebar';
import AdminHeader from '@/components/dashboard/AdminHeader';
import { AgentsList } from '@/components/ManageAgents/AgentList';
import { getAgents } from '@/lib/agent';

export default function AgentsPage() {
  const agents = getAgents();

  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader title="Manage Agents" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-gray-900">Manage Agents</h1>
              <button className="bg-blue-800 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors flex items-center gap-2">
                <span className="text-xl">+</span>
                Add New Agent
              </button>
            </div>

            <AgentsList initialAgents={agents} />
          </div>
        </main>
      </div>
    </div>
  );
}