const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_ibV06KmfCNsk@ep-square-sun-a4y96x44-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkTables() {
  try {
    console.log('🔍 Checking database tables...\n');

    // Check what tables exist
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    console.log('📋 Tables in database:');
    if (tables.rows.length === 0) {
      console.log('   ⚠️  No tables found!');
    } else {
      tables.rows.forEach(row => {
        console.log(`   ✓ ${row.table_name}`);
      });
    }

    // Check doctors table
    console.log('\n👨‍⚕️ Checking doctors table:');
    try {
      const doctors = await pool.query('SELECT COUNT(*) FROM doctors');
      console.log(`   Found ${doctors.rows[0].count} doctors`);
      
      if (doctors.rows[0].count > 0) {
        const sample = await pool.query('SELECT * FROM doctors LIMIT 1');
        console.log('   Sample doctor:', sample.rows[0]);
      }
    } catch (error) {
      console.log('   ❌ Error:', error.message);
    }

    // Check doctor_availability table
    console.log('\n📅 Checking doctor_availability table:');
    try {
      const avail = await pool.query('SELECT COUNT(*) FROM doctor_availability');
      console.log(`   Found ${avail.rows[0].count} availability slots`);
    } catch (error) {
      console.log('   ❌ Error:', error.message);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkTables();