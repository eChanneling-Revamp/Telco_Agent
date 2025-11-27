const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_ibV06KmfCNsk@ep-square-sun-a4y96x44-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function setupDatabaseWithUser() {
  try {
    console.log('🔄 Setting up database...\n');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created!');

    // Create sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        token TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      );
    `);
    console.log('✅ Sessions table created!');

    // Create test user
    const email = 'test@example.com';
    const password = 'password123';
    const name = 'Test User';
    
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3)',
        [email, hashedPassword, name]
      );
      console.log('✅ Test user created!');
      console.log('\n📧 Login Credentials:');
      console.log('   Email:', email);
      console.log('   Password:', password);
    } else {
      console.log('ℹ️  Test user already exists');
    }

    // List all users
    const users = await pool.query('SELECT id, email, name, created_at FROM users');
    console.log('\n👥 Users in database:');
    users.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.name})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
    console.log('\n🔌 Database connection closed');
  }
}

setupDatabaseWithUser();