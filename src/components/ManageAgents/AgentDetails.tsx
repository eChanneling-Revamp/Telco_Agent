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
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Information</h2>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Full Name</p>
          <p className="text-gray-900 text-base font-semibold">{agent.fullName}</p>
        </div>

        {/* Username */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Username</p>
          <p className="text-gray-900 text-base font-semibold">{agent.username}</p>
        </div>

        {/* Email */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Email</p>
          <p className="text-gray-900 text-base font-semibold break-all">{agent.email}</p>
        </div>

        {/* Phone Number */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Phone Number</p>
          <p className="text-gray-900 text-base font-semibold">{agent.phone}</p>
        </div>

        {/* Join Date */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Join Date</p>
          <p className="text-gray-900 text-base font-semibold">{agent.joinDate}</p>
        </div>

        {/* Total Appointments */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xs font-medium text-blue-600 mb-2 uppercase tracking-wide">Total Appointments</p>
          <p className="text-blue-800 text-2xl font-bold">{agent.totalAppointments}</p>
        </div>

        {/* Access Level */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Access Level</p>
          <p className="text-gray-900 text-base font-semibold">{agent.accessLevel}</p>
        </div>

        {/* Status */}
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Status</p>
          <div className="mt-1">
            <Badge variant={getStatusVariant(agent.status)}>
              {agent.status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

















// 'use client';

// import React from 'react';
// import { Agent } from '@/types/agent';
// import { Badge } from '@/components/ManageAgents/Badge';

// interface AgentDetailsProps {
//   agent: Agent;
// }

// export const AgentDetails: React.FC<AgentDetailsProps> = ({ agent }) => {
//   const getStatusVariant = (status: string) => {
//     switch (status) {
//       case 'Active': return 'success';
//       case 'Suspended': return 'danger';
//       case 'Inactive': return 'warning';
//       default: return 'primary';
//     }
//   };

//   return (
//     <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
//       <h2 className="text-2xl font-bold text-gray-900 mb-8">Agent Information</h2>
      
//       <div className="grid grid-cols-2 gap-x-12 gap-y-8">
//         <div>
//           <p className="text-gray-500 text-sm mb-2">Full Name</p>
//           <p className="text-gray-900 text-lg font-semibold">{agent.fullName}</p>
//         </div>

//         <div>
//           <p className="text-gray-500 text-sm mb-2">Username</p>
//           <p className="text-gray-900 text-lg font-semibold">{agent.username}</p>
//         </div>

//         <div>
//           <p className="text-gray-500 text-sm mb-2">Email</p>
//           <p className="text-gray-900 text-lg font-semibold">{agent.email}</p>
//         </div>

//         <div>
//           <p className="text-gray-500 text-sm mb-2">Phone Number</p>
//           <p className="text-gray-900 text-lg font-semibold">{agent.phone}</p>
//         </div>

//         <div>
//           <p className="text-gray-500 text-sm mb-2">Join Date</p>
//           <p className="text-gray-900 text-lg font-semibold">{agent.joinDate}</p>
//         </div>

//         <div>
//           <p className="text-gray-500 text-sm mb-2">Total Appointments</p>
//           <p className="text-blue-600 text-lg font-semibold">{agent.totalAppointments}</p>
//         </div>

//         <div>
//           <p className="text-gray-500 text-sm mb-2">Access Level</p>
//            <p className="text-blue-600 text-lg font-semibold">{agent.accessLevel}</p>
//         </div>

//         <div>
//           <p className="text-gray-500 text-sm mb-2">Status</p>
//           <div className="mt-2">
//             <Badge variant={getStatusVariant(agent.status)}>
//               {agent.status}
//             </Badge>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };