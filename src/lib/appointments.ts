import { Appointment } from '@/types/appointment';

export const mockAppointments: Appointment[] = [
  {
    id: '1',
    appointmentId: 'APT0064',
    patientName: 'Sarah Wilson',
    phone: '0766822742',
    doctor: 'Dr. Johnson',
    doctorSpecialty: 'Pediatrician',
    hospital: 'City Hospital',
    dateTime: '2024-01-15',
    time: '10:00 AM',
    amount: 2750,
    refundable: true,
    status: 'confirmed',
    basePrice: 2500,
    refundDeposit: 250
  },
  {
    id: '2',
    appointmentId: 'APT0065',
    patientName: 'Mike Brown',
    phone: '0766822742',
    doctor: 'Dr. Chen',
    doctorSpecialty: 'Cardiologist',
    hospital: 'Metro Medical',
    dateTime: '2024-01-16',
    time: '2:00 PM',
    amount: 3000,
    refundable: false,
    status: 'confirmed',
    basePrice: 3000,
    refundDeposit: 0
  }
];

export const getAppointmentsByAgentId = (agentId: string): Appointment[] => {
  return mockAppointments;
};

export const getAppointmentById = (id: string): Appointment | undefined => {
  return mockAppointments.find(apt => apt.id === id);
};