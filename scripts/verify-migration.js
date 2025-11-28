#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Load environment variables
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      const match = trimmedLine.match(/^([^=]+)=["']?([^"']+)["']?$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2];
      }
    }
  });
}

const { Pool } = require("pg");

async function verifyMigration() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log("🔍 Verifying migration...\n");

    // Check columns exist
    const columnsResult = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'appointments' 
      AND column_name IN ('doctor_name', 'specialty', 'hospital', 'refund_eligible')
      ORDER BY column_name;
    `);

    console.log("✅ New columns found:");
    columnsResult.rows.forEach((row) => {
      console.log(`   • ${row.column_name}: ${row.data_type}`);
    });

    // Check sample data
    const dataResult = await pool.query(`
      SELECT id, patient_name, doctor_name, specialty, hospital, refund_eligible 
      FROM appointments 
      ORDER BY id DESC 
      LIMIT 5;
    `);

    console.log("\n✅ Sample appointment data:");
    console.table(dataResult.rows);

    // Check statistics
    const statsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_appointments,
        COUNT(CASE WHEN doctor_name IS NOT NULL THEN 1 END) as with_doctor_name,
        COUNT(CASE WHEN specialty IS NOT NULL THEN 1 END) as with_specialty,
        COUNT(CASE WHEN hospital IS NOT NULL THEN 1 END) as with_hospital,
        COUNT(CASE WHEN refund_eligible = true THEN 1 END) as refund_eligible_count
      FROM appointments;
    `);

    console.log("\n📊 Statistics:");
    console.table(statsResult.rows);

    console.log("\n✅ Migration verification completed successfully!");
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifyMigration();
