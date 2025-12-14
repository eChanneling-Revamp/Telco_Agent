const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_ibV06KmfCNsk@ep-square-sun-a4y96x44-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function migratePatientDetails() {
  try {
    console.log('🔄 Adding patient detail columns to appointments table...\n');

    // Add patient detail columns
    await pool.query(`
      ALTER TABLE appointments 
      ADD COLUMN IF NOT EXISTS patient_nic VARCHAR(20),
      ADD COLUMN IF NOT EXISTS patient_dob DATE,
      ADD COLUMN IF NOT EXISTS patient_gender VARCHAR(10),
      ADD COLUMN IF NOT EXISTS patient_age INTEGER;
    `);
    console.log('✅ Patient detail columns added!');

    // Add doctor info columns if they don't exist
    await pool.query(`
      ALTER TABLE appointments 
      ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS specialty VARCHAR(255),
      ADD COLUMN IF NOT EXISTS hospital VARCHAR(255),
      ADD COLUMN IF NOT EXISTS refund_eligible BOOLEAN DEFAULT false;
    `);
    console.log('✅ Doctor info and refund columns added!');

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_appointments_patient_nic ON appointments(patient_nic);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_appointments_patient_dob ON appointments(patient_dob);
    `);
    console.log('✅ Indexes created!');

    // Verify columns were added
    const columnsResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'appointments' 
      AND column_name IN ('patient_nic', 'patient_dob', 'patient_gender', 'patient_age', 'doctor_name', 'specialty', 'hospital', 'refund_eligible')
      ORDER BY column_name;
    `);

    console.log('\n📋 New columns in appointments table:');
    columnsResult.rows.forEach(row => {
      console.log(`  ✓ ${row.column_name} (${row.data_type})`);
    });

    console.log('\n✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
  }
}

migratePatientDetails();