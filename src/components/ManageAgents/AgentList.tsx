"use client";

import React, { useState } from "react";
import { Agent } from "@/types/agent";
import { AgentCard } from "./AgentCard";
import { AgentSearchBar } from "./AgentSearchBar";
import { searchAgents } from "@/lib/agent";

interface AgentsListProps {
  initialAgents: Agent[];
}

export const AgentsList: React.FC<AgentsListProps> = ({ initialAgents }) => {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [filteredAgents, setFilteredAgents] = useState<Agent[]>(initialAgents);

  const handleSearch = (query: string) => {
    if (query.trim() === "") {
      setFilteredAgents(agents);
    } else {
      setFilteredAgents(searchAgents(agents, query));
    }
  };

  return (
    <div>
      <AgentSearchBar onSearch={handleSearch} />

      <div className="space-y-4">
        {filteredAgents.map((agent) => (
          <AgentCard
            key={agent.id}
            agent={agent}
            detailsHref={`/admin/users/${agent.id}`}
          />
        ))}

        {filteredAgents.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {agents.length === 0
              ? "No agents found."
              : "No agents found matching your search."}
          </div>
        )}
      </div>
    </div>
  );
};
