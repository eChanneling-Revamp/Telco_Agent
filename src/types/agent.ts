export type AccessLevel = 'Full Access' | 'Booking Only' | 'Read Only';
export type AgentStatus = 'Active' | 'Suspended' | 'Inactive';

export interface Agent {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  accessLevel: AccessLevel;
  status: AgentStatus;
  joinDate: string;
  totalAppointments: number;
}