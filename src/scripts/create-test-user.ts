import pool from '../lib/db';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  try {
    const email = 'test@example.com';
    const password = 'password123';
    const name = 'Test User';

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3)',
      [email, hashedPassword, name]
    );

    console.log('✅ Test user created!');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

createTestUser();