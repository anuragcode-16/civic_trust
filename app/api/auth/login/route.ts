import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/app/lib/auth';
import { getUserByEmail } from '@/app/lib/db';
import { isValidEmail } from '@/app/lib/validation';
import { compare } from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const user = await getUserByEmail(email);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Verify password
    const passwordMatch = await compare(password, user.passwordHash);
    
    if (!passwordMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Generate token
    const token = await createToken({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'user'
    });
    
    // Return token and user info
    return NextResponse.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || 'user'
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 