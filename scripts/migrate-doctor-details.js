#!/usr/bin/env node

/**
 * Migration Script: Add doctor details and refund eligibility columns to appointments table
 *
 * This script applies the migration to add the following columns:
 * - doctor_name: VARCHAR(255) - stores the doctor's name at time of appointment
 * - specialty: VARCHAR(100) - stores the doctor's specialty at time of appointment
 * - hospital: VARCHAR(255) - stores the hospital name at time of appointment
 * - refund_eligible: BOOLEAN - tracks if the patient agreed to pay for full refund eligibility
 *
 * Usage: node scripts/migrate-doctor-details.js
 */

const fs = require("fs");
const path = require("path");

// Load environment variables from .env file manually
const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith("#")) {
      // Parse DATABASE_URL="value" format
      const match = trimmedLine.match(/^([^=]+)=["']?([^"']+)["']?$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2];
      }
    }
  });
}

const { Pool } = require("pg");

// Build pool configuration - handle sslmode in connection string
const getPoolConfig = () => {
  const dbUrl = process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // If the connection string already has sslmode parameter, don't add ssl config
  // The pg driver will handle it from the connection string
  if (dbUrl.includes("sslmode")) {
    return {
      connectionString: dbUrl,
      // No ssl config - let the connection string handle it
    };
  }

  // For local development databases without sslmode, disable SSL
  if (
    dbUrl.includes("localhost") ||
    dbUrl.includes("127.0.0.1") ||
    dbUrl.includes("local")
  ) {
    return {
      connectionString: dbUrl,
      ssl: false,
    };
  }

  // For remote databases without sslmode, use SSL with error handling
  return {
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  };
};

const pool = new Pool(getPoolConfig());

async function runMigration() {
  const client = await pool.connect();

  try {
    console.log(
      "🔄 Running migration: Add doctor details and refund eligibility columns...\n"
    );

    // Add new columns
    await client.query(`
      ALTER TABLE appointments
      ADD COLUMN IF NOT EXISTS doctor_name VARCHAR(255),
      ADD COLUMN IF NOT EXISTS specialty VARCHAR(100),
      ADD COLUMN IF NOT EXISTS hospital VARCHAR(255),
      ADD COLUMN IF NOT EXISTS refund_eligible BOOLEAN DEFAULT false;
    `);
    console.log("✅ Added new columns to appointments table");

    // Create indexes for better performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_appointments_doctor_name ON appointments(doctor_name);
      CREATE INDEX IF NOT EXISTS idx_appointments_refund_eligible ON appointments(refund_eligible);
    `);
    console.log("✅ Created indexes for new columns");

    // Update existing appointments by joining with doctors table
    const updateResult = await client.query(`
      UPDATE appointments a
      SET 
        doctor_name = d.name,
        specialty = d.specialty,
        hospital = d.hospital
      FROM doctors d
      WHERE a.doctor_id = d.id AND a.doctor_name IS NULL;
    `);
    console.log(
      `✅ Updated ${updateResult.rowCount} existing appointments with doctor details`
    );

    // Verify the migration
    const verifyResult = await client.query(`
      SELECT 
        column_name, 
        data_type,
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'appointments' 
        AND column_name IN ('doctor_name', 'specialty', 'hospital', 'refund_eligible')
      ORDER BY ordinal_position;
    `);

    console.log("\n📋 New columns created:");
    verifyResult.rows.forEach((row) => {
      console.log(
        `   ✓ ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`
      );
    });

    // Show sample data
    const sampleData = await client.query(`
      SELECT id, patient_name, doctor_name, specialty, hospital, refund_eligible 
      FROM appointments 
      LIMIT 5;
    `);

    if (sampleData.rows.length > 0) {
      console.log("\n📊 Sample appointment data:");
      console.table(sampleData.rows);
    }

    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
