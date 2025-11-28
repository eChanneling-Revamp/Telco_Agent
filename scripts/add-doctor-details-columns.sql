-- ============================================
-- MIGRATION: Add Doctor Details and Refund Eligibility to Appointments
-- ============================================

-- Add new columns to appointments table
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS specialty VARCHAR(100),
ADD COLUMN IF NOT EXISTS hospital VARCHAR(255),
ADD COLUMN IF NOT EXISTS refund_eligible BOOLEAN DEFAULT false;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_name ON appointments(doctor_name);
CREATE INDEX IF NOT EXISTS idx_appointments_refund_eligible ON appointments(refund_eligible);

-- Update existing appointments by joining with doctors table
UPDATE appointments a
SET 
  doctor_name = d.name,
  specialty = d.specialty,
  hospital = d.hospital
FROM doctors d
WHERE a.doctor_id = d.id AND a.doctor_name IS NULL;

-- Display migration status
SELECT 'Migration completed successfully!' as status;
SELECT 
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_name = 'appointments' 
  AND column_name IN ('doctor_name', 'specialty', 'hospital', 'refund_eligible')
ORDER BY ordinal_position;
