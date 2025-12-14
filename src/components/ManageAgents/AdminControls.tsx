'use client';

import React, { useState } from 'react';
import { ResetPasswordModal } from '@/components/ManageAgents/ResetPasswordModal';
import { ChangeAccessModal } from '@/components/ManageAgents/ChangeAccessModal';
import { SuspendAgentModal } from '@/components/ManageAgents/SuspendAgentModal';
import { Agent } from '@/types/agent';

interface AdminControlsProps {
  agent: Agent;
}

export const AdminControls: React.FC<AdminControlsProps> = ({ agent }) => {
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showChangeAccess, setShowChangeAccess] = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin Controls</h2>
        
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => setShowResetPassword(true)}
            className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-green-700 text-green-700 rounded-2xl hover:bg-green-200 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            Reset Password
          </button>

          <button
            onClick={() => setShowChangeAccess(true)}
            className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-blue-800 text-blue-800 rounded-2xl hover:bg-blue-200 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Save Access Level Changes
          </button>

          <button
            onClick={() => setShowSuspend(true)}
            className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-red-500 text-red-700 rounded-2xl hover:bg-red-200 transition-colors font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Suspend Agent
          </button>
        </div>
      </div>

      <ResetPasswordModal 
        isOpen={showResetPassword}
        onClose={() => setShowResetPassword(false)}
        agent={agent}
      />

      <ChangeAccessModal
        isOpen={showChangeAccess}
        onClose={() => setShowChangeAccess(false)}
        agent={agent}
      />

      <SuspendAgentModal
        isOpen={showSuspend}
        onClose={() => setShowSuspend(false)}
        agent={agent}
      />
    </>
  );
};