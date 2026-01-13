// src/types/appointment.ts

export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "cancelled"
  | "completed";
export type RefundStatus =
  | "Full refund eligible"
  | "Non-refundable"
  | "Partial refund";

export interface Appointment {
  id: string;
  appointmentId: string;
  patientName: string;
  phone?: string;
  bookedBy: string;
  bookedByName: string;
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

// Doctor type
export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  hospital: string;
  hospitalType: "Private" | "Government";
  city: string;
  available: string;
  availabilityId: number;
  consultationFee: number;
  slotsAvailable: number;
};

// Patient data for appointment booking
export type PatientData = {
  name: string; // Required
  mobile: string; // Required
  email: string; // Can be empty string but exists
  nic: string; // Required
  dob: string; // Required - format: YYYY-MM-DD
  gender: string; // Required - "male" | "female" | "other"
  age: number; // Required - must be a number, not string
  totalPrice: number; // Required - must be a number
  agreeRefund: boolean; // Required - true or false
};

// API payload type for creating appointments
export type CreateAppointmentPayload = {
  doctorId: number;
  availabilityId: number;
  name: string;
  mobile: string;
  email: string;
  nic: string;
  dob: string;
  gender: string;
  age: number;
  sltPhone: string;
  notes: string;
  appointmentDate: string;
  appointmentTime: string;
  paymentMethod: string;
  totalAmount: number;
  isMember: boolean;
  sendSms: boolean;
  sendEmail: boolean;
  agreeRefund: boolean;
};
