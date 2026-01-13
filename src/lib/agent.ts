// src/lib/agent.ts

import { Agent } from "@/types/agent";

// Define proper types for API responses
interface UserApiResponse {
  id: number;
  name?: string;
  email: string;
  phone?: string;
  is_suspended: boolean;
  total_appointments: string | number;
}

interface UsersApiData {
  users: UserApiResponse[];
}

// Fallback mock agents for error scenarios
export const mockAgents: Agent[] = [
  {
    id: "1",
    fullName: "John Smith",
    username: "john.smith",
    email: "john@telco.com",
    phone: "+94 77 111 2222",
    accessLevel: "Full Access",
    status: "Active",
    joinDate: "2023-06-15",
    totalAppointments: 156,
  },
];

// Transform API user data to Agent format
const transformUserToAgent = (user: UserApiResponse): Agent => ({
  id: String(user.id),
  fullName: user.name || user.email.split("@")[0],
  username: user.email.split("@")[0],
  email: user.email,
  phone: user.phone || "N/A",
  accessLevel: "Full Access",
  status: user.is_suspended ? "Suspended" : "Active",
  joinDate: new Date().toISOString().split("T")[0],
  totalAppointments: parseInt(String(user.total_appointments), 10) || 0,
});

// Fetch agents from backend API
export const fetchAgents = async (): Promise<Agent[]> => {
  try {
    const response = await fetch("/api/newauth/admin/view-users", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch agents:", response.statusText);
      return mockAgents;
    }

    const data: UsersApiData = await response.json();

    // Transform backend response to Agent format
    return (data.users || []).map(transformUserToAgent);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return mockAgents;
  }
};

// Fetch agent by ID from backend
export const fetchAgentById = async (
  id: string
): Promise<Agent | undefined> => {
  try {
    const response = await fetch(`/api/newauth/admin/view-users`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch agent:", response.statusText);
      return undefined;
    }

    const data: UsersApiData = await response.json();
    const user = (data.users || []).find((u) => String(u.id) === id);

    if (!user) return undefined;

    return transformUserToAgent(user);
  } catch (error) {
    console.error("Error fetching agent:", error);
    return undefined;
  }
};

// Legacy function for backward compatibility
export const getAgents = (): Agent[] => {
  return mockAgents;
};

// Legacy function for backward compatibility
export const getAgentById = (id: string): Agent | undefined => {
  return mockAgents.find((agent) => agent.id === id);
};

// Search agents locally (client-side)
export const searchAgents = (agents: Agent[], query: string): Agent[] => {
  const lowercaseQuery = query.toLowerCase();
  return agents.filter(
    (agent) =>
      agent.fullName.toLowerCase().includes(lowercaseQuery) ||
      agent.username.toLowerCase().includes(lowercaseQuery) ||
      agent.email.toLowerCase().includes(lowercaseQuery)
  );
};