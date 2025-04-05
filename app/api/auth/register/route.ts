import { NextRequest, NextResponse } from 'next/server';
import { createToken } from '@/app/lib/auth';
import { createUser, getUserByEmail } from '@/app/lib/db';
import { isValidEmail, sanitizeInput } from '@/app/lib/validation';
import { hash } from 'bcrypt';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
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
    
    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      );
    }
    
    // Hash password
    const passwordHash = await hash(password, 10);
    
    // Create user
    const sanitizedName = sanitizeInput(name);
    
    const userData = {
      name: sanitizedName,
      email: email.toLowerCase(),
      passwordHash,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await createUser(userData);
    
    // Generate token
    const token = await createToken({
      id: result.insertedId.toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role
    });
    
    // Return token and user info
    return NextResponse.json(
      {
        token,
        user: {
          id: result.insertedId,
          email: userData.email,
          name: userData.name,
          role: userData.role
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
} 