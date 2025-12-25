import { Appointment } from "@/types/appointment";

export async function fetchAppointmentsByAgent(
  agentId: string
): Promise<Appointment[]> {
  const res = await fetch(`/api/newauth/admin/agents/${agentId}/appoinments`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch agent appointments");
  }

  const data = await res.json();

  return data.appointments.map((row: any) => ({
    id: row.id,
    appointmentId: `APT-${row.id}`,
    patientName: row.patient_name,
    phone: row.patient_phone,
    status: row.status,
    doctor: row.doctor_name,
    doctorSpecialty: row.specialty,
    hospital: row.hospital,
    dateTime: row.appointment_date,
    time: row.appointment_time,
    amount: row.total_amount,
    basePrice: row.consultation_fee,
    refundDeposit: row.total_amount - row.consultation_fee,
    refundable: row.refund_eligible,
  }));
}
