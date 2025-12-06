'use client';

import React from 'react';
import { Agent } from '@/types/agent';
import { Badge } from '@/components/ManageAgents/Badge';

interface AgentDetailsProps {
  agent: Agent;
}

export const AgentDetails: React.FC<AgentDetailsProps> = ({ agent }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Suspended': return 'danger';
      case 'Inactive': return 'warning';
      default: return 'primary';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Agent Information</h2>
      
      <div className="grid grid-cols-2 gap-x-12 gap-y-8">
        <div>
          <p className="text-gray-500 text-sm mb-2">Full Name</p>
          <p className="text-gray-900 text-lg font-semibold">{agent.fullName}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-2">Username</p>
          <p className="text-gray-900 text-lg font-semibold">{agent.username}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-2">Email</p>
          <p className="text-gray-900 text-lg font-semibold">{agent.email}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-2">Phone Number</p>
          <p className="text-gray-900 text-lg font-semibold">{agent.phone}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-2">Join Date</p>
          <p className="text-gray-900 text-lg font-semibold">{agent.joinDate}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-2">Total Appointments</p>
          <p className="text-blue-600 text-lg font-semibold">{agent.totalAppointments}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-2">Access Level</p>
           <p className="text-blue-600 text-lg font-semibold">{agent.accessLevel}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm mb-2">Status</p>
          <div className="mt-2">
            <Badge variant={getStatusVariant(agent.status)}>
              {agent.status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};