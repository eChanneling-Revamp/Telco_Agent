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
    console.log('Ì¥Ñ Setting up database...\n');
    
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
    console.log('‚úÖ Users table created!');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        token TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at TIMESTAMP NOT NULL
      );
    `);
    console.log('‚úÖ Sessions table created!');

    const email = 'test@example.com';
    const password = 'password123';
    const name = 'Test User';
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length === 0) {
      await pool.query(
        'INSERT INTO users (email, password, name) VALUES ($1, $2, $3)',
        [email, hashedPassword, name]
      );
      console.log('‚úÖ Test user created!');
      console.log('\nÌ≥ß Login Credentials:');
      console.log('   Email:', email);
      console.log('   Password:', password);
    } else {
      console.log('‚ÑπÔ∏è  Test user already exists');
    }

    const users = await pool.query('SELECT id, email, name, created_at FROM users');
    console.log('\nÌ±• Users in database:');
    users.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.name})`);
    });

  } catch (error) {
    console.error('‚ùå Error:', error.message);
    console.error(error);
  } finally {
    await pool.end();
    console.log('\nÌ¥å Database connection closed');
  }
}

setupDatabaseWithUser();
