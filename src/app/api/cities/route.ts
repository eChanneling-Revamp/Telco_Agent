import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT DISTINCT city FROM doctors WHERE city IS NOT NULL ORDER BY city'
    );
    
    const cities = result.rows.map(row => row.city);
    
    return NextResponse.json({ cities }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cities', message: error.message },
      { status: 500 }
    );
  }
}
