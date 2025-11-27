const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_ibV06KmfCNsk@ep-square-sun-a4y96x44-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function initAppointmentTables() {
  try {
    console.log('Ì¥Ñ Creating appointment tables...\n');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialty VARCHAR(255) NOT NULL,
        hospital VARCHAR(255) NOT NULL,
        hospital_type VARCHAR(50) CHECK (hospital_type IN ('Private', 'Government')),
        city VARCHAR(100),
        phone VARCHAR(20),
        email VARCHAR(255),
        consultation_fee DECIMAL(10, 2) DEFAULT 3000.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('‚úÖ Doctors table created!');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctor_availability (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
        available_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        max_appointments INTEGER DEFAULT 20,
        booked_appointments INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(doctor_id, available_date, start_time)
      );
    `);
    console.log('‚úÖ Doctor availability table created!');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        doctor_id INTEGER REFERENCES doctors(id),
        availability_id INTEGER REFERENCES doctor_availability(id),
        patient_name VARCHAR(255) NOT NULL,
        patient_phone VARCHAR(20) NOT NULL,
        patient_email VARCHAR(255),
        slt_phone VARCHAR(20) NOT NULL,
        notes TEXT,
        appointment_date DATE NOT NULL,
        appointment_time TIME NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        payment_method VARCHAR(50) CHECK (payment_method IN ('bill', 'card', 'mobile')),
        payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
        total_amount DECIMAL(10, 2) NOT NULL,
        is_member BOOLEAN DEFAULT false,
        send_sms BOOLEAN DEFAULT true,
        send_email BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('‚úÖ Appointments table created!');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        appointment_id INTEGER REFERENCES appointments(id),
        payment_method VARCHAR(50),
        payment_status VARCHAR(50) DEFAULT 'pending',
        amount DECIMAL(10, 2) NOT NULL,
        transaction_id VARCHAR(255),
        payment_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('‚úÖ Payments table created!');

    const doctorsCount = await pool.query('SELECT COUNT(*) FROM doctors');
    if (doctorsCount.rows[0].count === '0') {
      await pool.query(`
        INSERT INTO doctors (name, specialty, hospital, hospital_type, city, phone, consultation_fee)
        VALUES 
          ('Dr. Samantha Perera', 'Cardiologist', 'National Hospital', 'Government', 'Colombo', '0112345678', 2500.00),
          ('Dr. Ajith Fernando', 'Dermatologist', 'Asiri Medical', 'Private', 'Colombo', '0112345679', 3500.00),
          ('Dr. Nimal Silva', 'Neurologist', 'Lanka Hospitals', 'Private', 'Kandy', '0812345678', 4000.00),
          ('Dr. Kumari Jayawardena', 'Pediatrician', 'Nawaloka Hospital', 'Private', 'Colombo', '0112345680', 3000.00);
      `);
      console.log('‚úÖ Sample doctors inserted!');

      await pool.query(`
        INSERT INTO doctor_availability (doctor_id, available_date, start_time, end_time, max_appointments)
        VALUES 
          (1, '2025-11-20', '10:30:00', '12:30:00', 20),
          (1, '2025-11-21', '10:30:00', '12:30:00', 20),
          (2, '2025-11-20', '14:00:00', '17:00:00', 15),
          (3, '2025-11-21', '09:00:00', '11:00:00', 10),
          (4, '2025-11-22', '15:30:00', '18:30:00', 25);
      `);
      console.log('‚úÖ Sample availability inserted!');
    } else {
      console.log('‚ÑπÔ∏è  Sample data already exists, skipping insert');
    }

    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('doctors', 'doctor_availability', 'appointments', 'payments')
      ORDER BY table_name
    `);
    
    console.log('\nÌ≥ã Appointment tables in database:');
    tables.rows.forEach(row => {
      console.log(`  ‚úì ${row.table_name}`);
    });

    console.log('\n‚úÖ All appointment tables created successfully!');

  } catch (error) {
    console.error('‚ùå Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

initAppointmentTables();
