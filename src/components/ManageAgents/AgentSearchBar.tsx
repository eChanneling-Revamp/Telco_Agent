'use client';

import React from 'react';

interface AgentSearchBarProps {
  onSearch: (query: string) => void;
}

export const AgentSearchBar: React.FC<AgentSearchBarProps> = ({ onSearch }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex items-center gap-4 mb-8">
      <div className="flex-1 relative bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center px-6 py-4">
          <svg 
            className="w-6 h-6 text-gray-400 mr-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
          <input
            type="text"
            placeholder="Search agents by name, username, or email"
            onChange={handleChange}
            className="flex-1 text-gray-400 text-base focus:outline-none bg-transparent placeholder:text-gray-400"
          />
        </div>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl transition-colors shadow-sm">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </div>
  );
};




