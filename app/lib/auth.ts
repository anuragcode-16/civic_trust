import { NextRequest } from 'next/server';
import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { getUserByEmail } from './db';

// Secret key for JWT
const SECRET_KEY = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'fallback_secret_key_for_development_only'
);

// Token expiration (in seconds)
const TOKEN_EXPIRATION = 60 * 60 * 24 * 7; // 7 days

// User interface
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
}

// Create a JWT token
export async function createToken(user: Partial<User>): Promise<string> {
  const { id, email, name, role } = user;
  
  return new SignJWT({ id, email, name, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION)
    .sign(SECRET_KEY);
}

// Verify a JWT token
export async function verifyToken(token: string): Promise<JWTPayload> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Extract token from Authorization header
export function extractToken(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.split(' ')[1];
}

// Authenticate a request
export async function authenticateRequest(req: NextRequest): Promise<User | null> {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return null;
    }
    
    const payload = await verifyToken(token);
    
    if (!payload.email) {
      return null;
    }
    
    // You may want to validate against the database here
    const user = await getUserByEmail(payload.email as string);
    
    if (!user) {
      return null;
    }
    
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    };
  } catch (error) {
    return null;
  }
}

// Check if user has admin role
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}

// Middleware to check if user is authenticated
export async function requireAuth(req: NextRequest): Promise<User> {
  const user = await authenticateRequest(req);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

// Middleware to check if user is admin
export async function requireAdmin(req: NextRequest): Promise<User> {
  const user = await requireAuth(req);
  
  if (!isAdmin(user)) {
    throw new Error('Forbidden');
  }
  
  return user;
} 