'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ManageAgents/Modal';
import { Agent } from '@/types/agent';

interface SuspendAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
}

export const SuspendAgentModal: React.FC<SuspendAgentModalProps> = ({ isOpen, onClose, agent }) => {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle suspend agent logic here
    console.log('Agent suspended:', agent.username, 'Reason:', reason);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Suspend Agent" size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h4 className="text-sm font-semibold text-red-900">Warning</h4>
              <p className="text-sm text-red-700 mt-1">
                Suspending this agent will immediately revoke their access to the system.
              </p>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Name
          </label>
          <input
            type="text"
            value={agent.fullName}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Suspension
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter the reason for suspending this agent..."
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-gray-900 placeholder:text-gray-400"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Suspend Agent
          </button>
        </div>
      </form>
    </Modal>
  );
};