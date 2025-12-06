'use client';

import React from 'react';
import Link from 'next/link';
import { Agent } from '@/types/agent';
import { Badge } from '@/components/ManageAgents/Badge';

interface AgentCardProps {
  agent: Agent;
  detailsHref?: string; // optional override for details link
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent, detailsHref }) => {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Suspended': return 'danger';
      case 'Inactive': return 'warning';
      default: return 'primary';
    }
  };

  const getAccessVariant = (access: string) => {
    return access === 'Full Access' ? 'primary' : 'primary';
  };

  const getInitialsColor = (status: string) => {
    return status === 'Suspended' ? 'bg-red-100' : 'bg-green-100';
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const href = detailsHref ?? `/agents/${agent.id}`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className={`w-14 h-14 rounded-full ${getInitialsColor(agent.status)} flex items-center justify-center`}>
            <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900">{agent.fullName}</h3>
            <p className="text-gray-600 text-sm mt-1">
              {agent.username} • {agent.email}
            </p>
            <p className="text-gray-500 text-sm mt-0.5">{agent.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Access Level</p>
            <Badge variant={getAccessVariant(agent.accessLevel)}>
              {agent.accessLevel}
            </Badge>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <Badge variant={getStatusVariant(agent.status)}>
              {agent.status}
            </Badge>
          </div>


          <Link
            href={href}
            className="ml-4 px-6 py-2 bg-blue-800 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition whitespace-nowrap"
            // className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            View Details
            </Link>
        </div>
      </div>
    </div>
  );
};



































// 'use client';

// import React from 'react';
// import Link from 'next/link';
// import { Agent } from '@/types/agent';
// import { Badge } from '@/components/ManageAgents/Badge';

// interface AgentCardProps {
//   agent: Agent;
// }

// export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
//   const getStatusVariant = (status: string) => {
//     switch (status) {
//       case 'Active': return 'success';
//       case 'Suspended': return 'danger';
//       case 'Inactive': return 'warning';
//       default: return 'primary';
//     }
//   };

//   const getAccessVariant = (access: string) => {
//     return access === 'Full Access' ? 'primary' : 'primary';
//   };

//   const getInitialsColor = (status: string) => {
//     return status === 'Suspended' ? 'bg-red-100' : 'bg-green-100';
//   };

//   const getInitials = (name: string) => {
//     return name.split(' ').map(n => n[0]).join('');
//   };

//   return (
//     <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4 flex-1">
//           <div className={`w-14 h-14 rounded-full ${getInitialsColor(agent.status)} flex items-center justify-center`}>
//             <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//             </svg>
//           </div>
          
//           <div className="flex-1">
//             <h3 className="text-xl font-semibold text-gray-900">{agent.fullName}</h3>
//             <p className="text-gray-600 text-sm mt-1">
//               {agent.username} • {agent.email}
//             </p>
//             <p className="text-gray-500 text-sm mt-0.5">{agent.phone}</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-6">
//           <div className="text-right">
//             <p className="text-sm text-gray-500 mb-1">Access Level</p>
//             <Badge variant={getAccessVariant(agent.accessLevel)}>
//               {agent.accessLevel}
//             </Badge>
//           </div>

//           <div className="text-right">
//             <p className="text-sm text-gray-500 mb-1">Status</p>
//             <Badge variant={getStatusVariant(agent.status)}>
//               {agent.status}
//             </Badge>
//           </div>

//           <Link href={`/agents/${agent.id}`}>
//             <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors">
//               View Details
//             </button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// };