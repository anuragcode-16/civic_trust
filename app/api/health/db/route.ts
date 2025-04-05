import { NextResponse } from 'next/server';
import dbClientPromise from '../../../lib/db-client';

export const runtime = 'edge';

export async function GET() {
  try {
    // Use the unified DB client
    const client = await dbClientPromise;
    const db = client.db();
    
    // Perform a simple command to verify the connection is working
    await db.command({ ping: 1 });
    
    return NextResponse.json({ 
      status: 'connected', 
      environment: 'edge'
    }, { status: 200 });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        status: 'disconnected', 
        message: 'Could not connect to database',
        error: process.env.NODE_ENV === 'development' ? String(error) : undefined
      }, 
      { status: 503 }
    );
  }
} 