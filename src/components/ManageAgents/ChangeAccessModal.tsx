'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ManageAgents/Modal';
import { Agent, AccessLevel } from '@/types/agent';

interface ChangeAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent;
}

export const ChangeAccessModal: React.FC<ChangeAccessModalProps> = ({ isOpen, onClose, agent }) => {
  const [accessLevel, setAccessLevel] = useState<AccessLevel>(agent.accessLevel);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle access level change logic here
    console.log('Access level changed to:', accessLevel);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Access Level" size="sm">
      <form onSubmit={handleSubmit} className="space-y-6">
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
            Current Access Level
          </label>
          <input
            type="text"
            value={agent.accessLevel}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Access Level
          </label>
          <select
            value={accessLevel}
            onChange={(e) => setAccessLevel(e.target.value as AccessLevel)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder:text-gray-400"
          >
            <option value="Full Access">Full Access</option>
            <option value="Booking Only">Booking Only</option>
            <option value="Read Only">Read Only</option>
          </select>
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
            className="flex-1 px-6 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
};