import { Agent } from '@/types/agent';

export const mockAgents: Agent[] = [
  {
    id: '1',
    fullName: 'John Smith',
    username: 'john.smith',
    email: 'john@telco.com',
    phone: '+94 77 111 2222',
    accessLevel: 'Full Access',
    status: 'Active',
    joinDate: '2023-06-15',
    totalAppointments: 156
  },
  {
    id: '2',
    fullName: 'Mary Johnson',
    username: 'mary.j',
    email: 'mary@telco.com',
    phone: '+94 77 222 3333',
    accessLevel: 'Booking Only',
    status: 'Active',
    joinDate: '2023-08-22',
    totalAppointments: 89
  },
  {
    id: '3',
    fullName: 'David Wilson',
    username: 'david.w',
    email: 'david@telco.com',
    phone: '+94 77 333 4444',
    accessLevel: 'Full Access',
    status: 'Suspended',
    joinDate: '2023-03-10',
    totalAppointments: 234
  }
];

export const getAgents = (): Agent[] => {
  return mockAgents;
};

export const getAgentById = (id: string): Agent | undefined => {
  return mockAgents.find(agent => agent.id === id);
};

export const searchAgents = (query: string): Agent[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockAgents.filter(
    agent =>
      agent.fullName.toLowerCase().includes(lowercaseQuery) ||
      agent.username.toLowerCase().includes(lowercaseQuery) ||
      agent.email.toLowerCase().includes(lowercaseQuery)
  );
};