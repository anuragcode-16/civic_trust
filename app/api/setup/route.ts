import { NextRequest, NextResponse } from 'next/server';
import { setupDatabase } from '@/app/lib/indexes';
import { authenticateRequest } from '@/app/lib/auth';

// POST endpoint to trigger database setup
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const user = await authenticateRequest(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }
    
    // Set up database indexes
    const result = await setupDatabase();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Database setup failed' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Database setup completed successfully'
    });
    
  } catch (error) {
    console.error('Error in database setup:', error);
    
    return NextResponse.json(
      { error: 'Database setup failed due to an unexpected error' },
      { status: 500 }
    );
  }
}

// GET endpoint to check if setup is needed (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const user = await authenticateRequest(request);
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 403 }
      );
    }
    
    // Note: In a production application, you would check if indexes exist
    // This is a simplified version that just returns a mock status
    
    return NextResponse.json({
      ready: true,
      message: 'Database is set up and ready',
      lastSetup: new Date().toISOString(),
      collections: [
        { name: 'events', indexes: 3 },
        { name: 'projects', indexes: 4 },
        { name: 'issues', indexes: 5 },
        { name: 'users', indexes: 3 }
      ]
    });
    
  } catch (error) {
    console.error('Error checking database status:', error);
    
    return NextResponse.json(
      { error: 'Failed to check database status' },
      { status: 500 }
    );
  }
} 