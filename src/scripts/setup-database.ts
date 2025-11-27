// const { Pool } = require('pg');

// const pool = new Pool({
//   connectionString: 'postgresql://neondb_owner:npg_ibV06KmfCNsk@ep-square-sun-a4y96x44-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// async function setupDatabase() {
//   try {
//     console.log('🔄 Connecting to database...');
    
//     // Create users table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id SERIAL PRIMARY KEY,
//         email VARCHAR(255) UNIQUE NOT NULL,
//         password VARCHAR(255) NOT NULL,
//         name VARCHAR(255),
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);
//     console.log('✅ Users table created!');

//     // Create sessions table
//     await pool.query(`
//       CREATE TABLE IF NOT EXISTS sessions (
//         id SERIAL PRIMARY KEY,
//         user_id INTEGER REFERENCES users(id),
//         token TEXT NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         expires_at TIMESTAMP NOT NULL
//       );
//     `);
//     console.log('✅ Sessions table created!');

//     // Check if tables exist
//     const tables = await pool.query(`
//       SELECT table_name 
//       FROM information_schema.tables 
//       WHERE table_schema = 'public'
//     `);
    
//     console.log('\n📋 Tables in database:');
//     tables.rows.forEach(row => {
//       console.log(`  - ${row.table_name}`);
//     });

//   } catch (error) {
//     console.error('❌ Error:', error.message);
//   } finally {
//     await pool.end();
//     console.log('\n🔌 Database connection closed');
//   }
// }

// setupDatabase();