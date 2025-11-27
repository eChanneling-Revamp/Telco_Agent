import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT DISTINCT specialty FROM doctors WHERE specialty IS NOT NULL ORDER BY specialty'
    );
    
    const specializations = result.rows.map(row => row.specialty);
    
    return NextResponse.json({ specializations }, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching specializations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specializations', message: error.message },
      { status: 500 }
    );
  }
}