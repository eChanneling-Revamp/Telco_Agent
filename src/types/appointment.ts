export interface Appointment {
  id: string;
  appointmentId: string;
  patientName: string;
  phone?: string;
  doctor: string;
  doctorSpecialty: string;
  hospital: string;
  dateTime: string;
  time: string;
  amount: number;
  refundable: boolean;
  status: 'confirmed' | 'pending' | 'cancelled';
  basePrice: number;
  refundDeposit: number;
}