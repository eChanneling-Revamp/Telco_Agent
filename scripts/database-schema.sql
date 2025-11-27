-- ============================================
-- DATABASE SCHEMA FOR APPOINTMENT BOOKING SYSTEM
-- ============================================

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    hospital VARCHAR(255) NOT NULL,
    hospital_type VARCHAR(50) CHECK (hospital_type IN ('Private', 'Government')),
    city VARCHAR(100) NOT NULL,
    consultation_fee DECIMAL(10, 2) DEFAULT 3000.00,
    qualification TEXT,
    experience_years INTEGER,
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Doctor Availability Table
CREATE TABLE IF NOT EXISTS doctor_availability (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    day_of_week VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_appointments INTEGER DEFAULT 10,
    booked_appointments INTEGER DEFAULT 0,
    consultation_fee DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT check_appointments CHECK (booked_appointments <= max_appointments)
);

-- Create Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
    availability_id INTEGER REFERENCES doctor_availability(id) ON DELETE SET NULL,
    patient_name VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_email VARCHAR(255),
    slt_phone VARCHAR(20) NOT NULL,
    notes TEXT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    is_member BOOLEAN DEFAULT false,
    send_sms BOOLEAN DEFAULT true,
    send_email BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'no-show')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER REFERENCES appointments(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    transaction_id VARCHAR(255),
    payment_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_doctors_specialty ON doctors(specialty);
CREATE INDEX idx_doctors_city ON doctors(city);
CREATE INDEX idx_doctors_hospital_type ON doctors(hospital_type);
CREATE INDEX idx_doctor_availability_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_payments_appointment_id ON payments(appointment_id);

-- ============================================
-- INSERT SAMPLE DATA
-- ============================================

-- Insert Sample Doctors
INSERT INTO doctors (name, specialty, hospital, hospital_type, city, consultation_fee, experience_years) VALUES
('Dr. Samantha Perera', 'Cardiologist', 'National Hospital', 'Government', 'Colombo', 3000.00, 15),
('Dr. Ajith Fernando', 'Dermatologist', 'Asiri Medical', 'Private', 'Colombo', 3500.00, 10),
('Dr. Nimal Silva', 'Neurologist', 'Lanka Hospitals', 'Private', 'Kandy', 4000.00, 12),
('Dr. Kumari Jayawardena', 'Pediatrician', 'Nawaloka Hospital', 'Private', 'Colombo', 2500.00, 8),
('Dr. Rohan Wickramasinghe', 'Orthopedic', 'Durdans Hospital', 'Private', 'Colombo', 3500.00, 20),
('Dr. Malini Dissanayake', 'Gynecologist', 'Castle Street Hospital', 'Private', 'Colombo', 3000.00, 14),
('Dr. Pradeep Gunasekara', 'ENT Specialist', 'Oasis Hospital', 'Private', 'Kandy', 2800.00, 9),
('Dr. Chaminda Rathnayake', 'General Physician', 'Colombo South Hospital', 'Government', 'Colombo', 2000.00, 18);

-- Insert Doctor Availability (Sample schedule for each doctor)
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, max_appointments, consultation_fee) VALUES
-- Dr. Samantha Perera (Cardiologist)
(1, 'Monday', '10:00:00', '12:30:00', 15, 3000.00),
(1, 'Wednesday', '10:00:00', '12:30:00', 15, 3000.00),
(1, 'Friday', '10:00:00', '12:30:00', 15, 3000.00),

-- Dr. Ajith Fernando (Dermatologist)
(2, 'Monday', '14:00:00', '17:00:00', 12, 3500.00),
(2, 'Tuesday', '14:00:00', '17:00:00', 12, 3500.00),
(2, 'Thursday', '14:00:00', '17:00:00', 12, 3500.00),

-- Dr. Nimal Silva (Neurologist)
(3, 'Tuesday', '09:00:00', '11:00:00', 10, 4000.00),
(3, 'Thursday', '09:00:00', '11:00:00', 10, 4000.00),
(3, 'Saturday', '09:00:00', '11:00:00', 10, 4000.00),

-- Dr. Kumari Jayawardena (Pediatrician)
(4, 'Monday', '15:30:00', '18:30:00', 20, 2500.00),
(4, 'Wednesday', '15:30:00', '18:30:00', 20, 2500.00),
(4, 'Friday', '15:30:00', '18:30:00', 20, 2500.00),

-- Dr. Rohan Wickramasinghe (Orthopedic)
(5, 'Tuesday', '08:00:00', '10:00:00', 12, 3500.00),
(5, 'Thursday', '16:00:00', '18:00:00', 12, 3500.00),
(5, 'Saturday', '08:00:00', '12:00:00', 15, 3500.00),

-- Dr. Malini Dissanayake (Gynecologist)
(6, 'Monday', '09:00:00', '12:00:00', 15, 3000.00),
(6, 'Wednesday', '14:00:00', '17:00:00', 15, 3000.00),
(6, 'Friday', '09:00:00', '12:00:00', 15, 3000.00),

-- Dr. Pradeep Gunasekara (ENT)
(7, 'Tuesday', '10:00:00', '13:00:00', 12, 2800.00),
(7, 'Thursday', '10:00:00', '13:00:00', 12, 2800.00),
(7, 'Saturday', '10:00:00', '13:00:00', 12, 2800.00),

-- Dr. Chaminda Rathnayake (General Physician)
(8, 'Monday', '08:00:00', '11:00:00', 25, 2000.00),
(8, 'Tuesday', '08:00:00', '11:00:00', 25, 2000.00),
(8, 'Wednesday', '08:00:00', '11:00:00', 25, 2000.00),
(8, 'Thursday', '08:00:00', '11:00:00', 25, 2000.00),
(8, 'Friday', '08:00:00', '11:00:00', 25, 2000.00);

-- Create a sample user (password: password123)
INSERT INTO users (name, email, phone, password_hash, role) VALUES
('Test User', 'test@example.com', '+94771234567', '$2b$10$XYZ...', 'user');

-- ============================================
-- USEFUL QUERIES FOR TESTING
-- ============================================

-- Get all doctors with their availability
SELECT 
    d.name, 
    d.specialty, 
    d.hospital, 
    da.day_of_week, 
    da.start_time, 
    da.end_time,
    da.max_appointments - da.booked_appointments as available_slots
FROM doctors d
JOIN doctor_availability da ON d.id = da.doctor_id
WHERE da.is_active = true
ORDER BY d.name, da.day_of_week;

-- Get appointments for a specific date
SELECT 
    a.id,
    a.patient_name,
    d.name as doctor_name,
    d.specialty,
    a.appointment_date,
    a.appointment_time,
    a.status
FROM appointments a
JOIN doctors d ON a.doctor_id = d.id
WHERE a.appointment_date = '2025-11-20'
ORDER BY a.appointment_time;

-- Get doctor schedule with booking count
SELECT 
    d.name,
    d.specialty,
    da.day_of_week,
    da.start_time,
    da.end_time,
    da.booked_appointments,
    da.max_appointments,
    (da.max_appointments - da.booked_appointments) as slots_available
FROM doctors d
JOIN doctor_availability da ON d.id = da.doctor_id
WHERE da.is_active = true
ORDER BY d.name, da.day_of_week;