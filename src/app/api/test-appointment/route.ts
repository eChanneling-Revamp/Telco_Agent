import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Test appointment route works!',
    timestamp: new Date().toISOString()
  });
}
