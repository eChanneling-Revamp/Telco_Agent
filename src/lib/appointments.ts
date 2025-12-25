import { Appointment } from "@/types/appointment";

export const mockAppointments: Appointment[] = [
  {
    id: "1",
    appointmentId: "APT0001",
    patientName: "John Doe",
    phone: "0712345678",
    bookedBy: "john.smith",
    bookedByName: "Agent John Smith",
    doctor: "Dr. Sarah Johnson",
    doctorSpecialty: "Cardiologist",
    hospital: "City Hospital",
    dateTime: "2024-01-15",
    time: "10:00 AM",
    amount: 2750,
    refundable: true,
    refundStatus: "Full refund eligible",
    status: "confirmed",
    basePrice: 2500,
    refundDeposit: 250,
  },
  {
    id: "2",
    appointmentId: "APT0002",
    patientName: "Jane Smith",
    phone: "0723456789",
    bookedBy: "mary.j",
    bookedByName: "Agent Mary Johnson",
    doctor: "Dr. Michael Chen",
    doctorSpecialty: "Neurologist",
    hospital: "Metro Medical Center",
    dateTime: "2024-01-16",
    time: "2:00 PM",
    amount: 3000,
    refundable: false,
    refundStatus: "Non-refundable",
    status: "confirmed",
    basePrice: 3000,
    refundDeposit: 0,
  },
  {
    id: "3",
    appointmentId: "APT0003",
    patientName: "Robert Williams",
    phone: "0734567890",
    bookedBy: "john.smith",
    bookedByName: "Agent John Smith",
    doctor: "Dr. Emily Davis",
    doctorSpecialty: "Pediatrician",
    hospital: "City Hospital",
    dateTime: "2024-01-17",
    time: "11:30 AM",
    amount: 2500,
    refundable: true,
    refundStatus: "Full refund eligible",
    status: "pending",
    basePrice: 2300,
    refundDeposit: 200,
  },
];

export const getAllAppointments = (): Appointment[] => {
  return mockAppointments;
};

export const getAppointmentById = (id: string): Appointment | undefined => {
  return mockAppointments.find((apt) => apt.id === id);
};

import { getAgentById } from "@/lib/agent";

export const getAppointmentsByAgentId = (agentId: string): Appointment[] => {
  const agent = getAgentById(agentId);
  const username = agent?.username;
  return mockAppointments.filter(
    (apt) =>
      apt.bookedBy === agentId || (username ? apt.bookedBy === username : false)
  );
};

export const searchAppointments = (query: string): Appointment[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockAppointments.filter(
    (apt) =>
      apt.patientName.toLowerCase().includes(lowercaseQuery) ||
      apt.doctor.toLowerCase().includes(lowercaseQuery) ||
      apt.bookedByName.toLowerCase().includes(lowercaseQuery) ||
      apt.hospital.toLowerCase().includes(lowercaseQuery)
  );
};

export const filterAppointments = (
  appointments: Appointment[],
  filters: {
    agent?: string;
    date?: string;
    hospital?: string;
    refundStatus?: string;
  }
): Appointment[] => {
  let filtered = [...appointments];

  if (filters.agent && filters.agent !== "all") {
    filtered = filtered.filter((apt) => apt.bookedBy === filters.agent);
  }

  if (filters.date && filters.date !== "all") {
    filtered = filtered.filter((apt) => apt.dateTime === filters.date);
  }

  if (filters.hospital && filters.hospital !== "all") {
    filtered = filtered.filter((apt) => apt.hospital === filters.hospital);
  }

  if (filters.refundStatus && filters.refundStatus !== "all") {
    filtered = filtered.filter(
      (apt) => apt.refundStatus === filters.refundStatus
    );
  }

  return filtered;
};


export const fetchAllAppointments = async (filters: any = {}): Promise<Appointment[]> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== 'all') params.append(key, value as string);
  });

  const res = await fetch(`/api/admin/appointments?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  const data = await res.json();

  return data.appointments.map((row: any) => ({
    id: String(row.id),
    appointmentId: `APT${String(row.id).padStart(4, "0")}`,
    patientName: row.patient_name,
    phone: row.patient_phone,
    bookedBy: String(row.user_id),
    bookedByName: row.booked_by_name || "System",
    doctor: row.doctor_name,
    doctorSpecialty: row.specialty,
    hospital: row.hospital,
    dateTime: new Date(row.appointment_date).toISOString().split('T')[0],
    time: row.appointment_time,
    amount: parseFloat(row.total_amount),
    refundable: row.refund_eligible,
    refundStatus: row.refund_eligible ? "Full refund eligible" : "Non-refundable",
    status: row.status,
    basePrice: parseFloat(row.total_amount) - (row.refund_eligible ? 250 : 0),
    refundDeposit: row.refund_eligible ? 250 : 0,
  }));
};

