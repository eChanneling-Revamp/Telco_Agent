-- Add new patient detail columns to appointments table
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS patient_nic VARCHAR(20),
ADD COLUMN IF NOT EXISTS patient_dob DATE,
ADD COLUMN IF NOT EXISTS patient_gender VARCHAR(10),
ADD COLUMN IF NOT EXISTS patient_age INTEGER;

-- Add doctor_name, specialty, hospital columns if they don't exist
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS specialty VARCHAR(255),
ADD COLUMN IF NOT EXISTS hospital VARCHAR(255),
ADD COLUMN IF NOT EXISTS refund_eligible BOOLEAN DEFAULT false;

-- Create indexes for better query performance (optional but recommended)
CREATE INDEX IF NOT EXISTS idx_appointments_patient_nic ON appointments(patient_nic);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_dob ON appointments(patient_dob);

-- Display confirmation
SELECT 'Patient detail columns added successfully!' as message;