import React from "react";
import Link from "next/link";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import AdminHeader from "@/components/dashboard/AdminHeader";
import { notFound } from "next/navigation";
import { AgentDetails } from "@/components/ManageAgents/AgentDetails";
import { AdminControls } from "@/components/ManageAgents/AdminControls";
import { AppointmentsList } from "@/components/ManageAgents/AppointmentsList";
import { getAgentById } from "@/lib/agent";
import { getAppointmentsByAgentId } from "@/lib/appointments";

interface AgentPageProps {
  params: {
    id: string;
  };
}

export default function AgentPage({ params }: AgentPageProps) {
  const agent = getAgentById(params.id);

  if (!agent) {
    notFound();
  }

  // Get appointments for this agent
  const appointments = getAppointmentsByAgentId(params.id);

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

            {/* Admin Controls Section - 3 buttons horizontally */}

            {/* Agent Details Section */}
            <div className="mb-8">
              <AgentDetails agent={agent} />
            </div>

            <AdminControls agent={agent} />

            {/* Appointments Section */}
            <AppointmentsList appointments={appointments} />
          </div>
        </main>
      </div>
    </div>
  );
}

// import React from 'react';
// import Link from 'next/link';
// import AdminSidebar from '@/components/dashboard/AdminSidebar';
// import AdminHeader from '@/components/dashboard/AdminHeader';
// import { notFound } from 'next/navigation';
// import { AgentDetails } from '@/components/ManageAgents/AgentDetails';
// import { getAgentById } from '@/lib/agent';

// interface AgentPageProps {
//   params: {
//     id: string;
//   };
// }

// export default function AgentPage({ params }: AgentPageProps) {
//   const agent = getAgentById(params.id);

//   if (!agent) {
//     notFound();
//   }

//   return (
//     <div className="flex h-screen bg-[#eaeaea]">
//       <AdminSidebar />

//       <div className="flex-1 flex flex-col overflow-hidden">
//         <AdminHeader title="Agent Details" />

//         <main className="flex-1 overflow-y-auto p-6">
//           <div className="max-w-5xl mx-auto">
//             <div className="mb-6">
//               <Link
//                 href="/admin/users"
//                 className="text-blue-600 hover:text-blue-700 flex items-center gap-2 font-medium"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                 </svg>
//                 Back to Agents
//               </Link>
//             </div>

//             <h1 className="text-4xl font-bold text-gray-900 mb-8">Agent Details</h1>

//             <AgentDetails agent={agent} />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }
