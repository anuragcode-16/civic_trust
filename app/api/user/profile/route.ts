import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest, requireAuth } from '@/app/lib/auth';
import { getUserByEmail } from '@/app/lib/db';

// GET user profile (protected route)
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const user = await authenticateRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get full user data from database
    const userData = await getUserByEmail(user.email);
    
    if (!userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Return user profile data (excluding sensitive information)
    return NextResponse.json({
      id: userData._id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
      location: userData.location,
      interests: userData.interests || [],
      activities: userData.activities || []
    });
    
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// PATCH update user profile (protected route)
export async function PATCH(request: NextRequest) {
  try {
    // Ensure user is authenticated
    const user = await requireAuth(request);
    
    // Get request data
    const data = await request.json();
    
    // Prevent changing sensitive fields
    const allowedUpdates = [
      'name',
      'location',
      'interests',
      'profileImage',
      'bio',
      'preferences'
    ];
    
    // Filter out disallowed fields
    const updates: Record<string, any> = {};
    
    Object.keys(data).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = data[key];
      }
    });
    
    // Add updated timestamp
    updates.updatedAt = new Date();
    
    // Update user profile
    // Note: In a real app, you would update the user in the database here
    // This is a simplified example that just returns the updates
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      updates
    });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
} 