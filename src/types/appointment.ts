export type AppointmentStatus = 'confirmed' | 'pending' | 'cancelled';
export type RefundStatus = 'Full refund eligible' | 'Non-refundable' | 'Partial refund';

export interface Appointment {
  id: string;
  appointmentId: string;
  patientName: string;
  phone?: string;
  bookedBy: string;              // Agent who booked
  bookedByName: string;          // Agent full name
  doctor: string;
  doctorSpecialty: string;
  hospital: string;
  dateTime: string;
  time: string;
  amount: number;
  refundable: boolean;
  refundStatus: RefundStatus;
  status: AppointmentStatus;
  basePrice: number;
  refundDeposit: number;
}


















// export interface Appointment {
//   id: string;
//   appointmentId: string;
//   patientName: string;
//   phone?: string;
//   doctor: string;
//   doctorSpecialty: string;
//   hospital: string;
//   dateTime: string;
//   time: string;
//   amount: number;
//   refundable: boolean;
//   status: 'confirmed' | 'pending' | 'cancelled';
//   basePrice: number;
//   refundDeposit: number;
// }