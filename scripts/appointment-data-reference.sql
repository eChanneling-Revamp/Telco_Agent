-- ============================================
-- QUICK REFERENCE: What Gets Saved in Appointments
-- ============================================

-- After implementing the doctor details and refund eligibility changes,
-- an appointment record now includes:

-- PATIENT INFORMATION
-- - patient_name: Name of the patient
-- - patient_phone: Patient's phone number
-- - patient_email: Patient's email (optional)
-- - slt_phone: SLT phone number for contact

-- APPOINTMENT DETAILS
-- - appointment_date: Date of appointment (YYYY-MM-DD)
-- - appointment_time: Time of appointment (HH:MM:SS)
-- - appointment_date + appointment_time: Complete appointment datetime

-- DOCTOR INFORMATION (NEW - Saved at time of booking)
-- - doctor_id: Reference to doctor
-- - doctor_name: Name of doctor (NEW)
-- - specialty: Doctor's specialty (NEW)
-- - hospital: Hospital name (NEW)
-- Note: These are snapshots at the time of appointment creation

-- PAYMENT INFORMATION
-- - payment_method: Method of payment (bill, mobile, card)
-- - total_amount: Total amount charged
-- - refund_eligible: Whether patient is eligible for full refund (NEW)

-- BOOKING OPTIONS
-- - is_member: Whether patient is a member
-- - send_sms: SMS confirmation requested
-- - send_email: Email confirmation requested
-- - notes: Additional notes

-- STATUS
-- - status: Appointment status (confirmed, cancelled, completed, no-show)
-- - availability_id: Link to availability slot (optional)

-- METADATA
-- - user_id: User ID if logged in (null if guest)
-- - created_at: When appointment was created
-- - updated_at: When appointment was last updated

-- ============================================
-- EXAMPLE APPOINTMENT RECORD
-- ============================================
/*
{
  "id": 42,
  "user_id": 5,
  "doctor_id": 1,
  "availability_id": 15,
  "patient_name": "John Doe",
  "patient_phone": "0712345678",
  "patient_email": "john@example.com",
  "slt_phone": "0912345678",
  "notes": null,
  "appointment_date": "2025-12-15",
  "appointment_time": "10:30:00",
  "payment_method": "bill",
  "total_amount": 3250.00,
  "is_member": false,
  "send_sms": true,
  "send_email": false,
  "status": "confirmed",
  "doctor_name": "Dr. Samantha Perera",           // NEW
  "specialty": "Cardiologist",                   // NEW
  "hospital": "National Hospital",               // NEW
  "refund_eligible": true,                       // NEW
  "created_at": "2025-11-28T10:30:00Z",
  "updated_at": "2025-11-28T10:30:00Z"
}
*/

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check the schema of appointments table with new columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'appointments'
ORDER BY ordinal_position;

-- View recent appointments with all details
SELECT 
  a.id,
  a.patient_name,
  a.doctor_name,
  a.specialty,
  a.hospital,
  a.appointment_date,
  a.appointment_time,
  a.total_amount,
  a.refund_eligible,
  a.status,
  a.created_at
FROM appointments a
ORDER BY a.created_at DESC
LIMIT 10;

-- Find appointments where patient agreed to pay for refund eligibility
SELECT 
  id,
  patient_name,
  doctor_name,
  total_amount,
  appointment_date
FROM appointments
WHERE refund_eligible = true
ORDER BY created_at DESC;

-- Statistics on refund eligibility
SELECT 
  CASE WHEN refund_eligible THEN 'With Refund Protection' ELSE 'No Refund Protection' END as type,
  COUNT(*) as count,
  ROUND(SUM(total_amount)::numeric, 2) as total_revenue
FROM appointments
WHERE status IN ('confirmed', 'completed')
GROUP BY refund_eligible;

-- Breakdown by doctor
SELECT 
  doctor_name,
  specialty,
  hospital,
  COUNT(*) as total_appointments,
  SUM(CASE WHEN refund_eligible THEN 1 ELSE 0 END) as refund_eligible_count,
  ROUND(AVG(total_amount)::numeric, 2) as avg_fee
FROM appointments
WHERE status != 'cancelled'
GROUP BY doctor_name, specialty, hospital
ORDER BY total_appointments DESC;
