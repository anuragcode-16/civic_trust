import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './app/lib/auth';

// Define protected API routes
const PROTECTED_API_ROUTES = [
  '/api/user/profile',
  '/api/projects/[id]' // For PATCH and DELETE methods only
];

// Define admin-only API routes
const ADMIN_API_ROUTES = [
  '/api/admin/'
];

export async function middleware(request: NextRequest) {
  const { pathname, method } = request.nextUrl;
  
  // Check if this is a protected API route
  const isProtectedApiRoute = PROTECTED_API_ROUTES.some(route => {
    if (route.includes('[') && route.includes(']')) {
      // Handle dynamic routes
      const routePattern = route.replace(/\[.*?\]/g, '[^/]+');
      const regex = new RegExp(`^${routePattern}$`);
      return regex.test(pathname);
    }
    return pathname === route;
  });
  
  // Check if this is a protected method for certain routes
  const isProtectedMethod = 
    (pathname.startsWith('/api/projects/') && ['PATCH', 'DELETE'].includes(method)) ||
    (pathname.startsWith('/api/issues/') && ['PATCH', 'DELETE'].includes(method));
  
  // Check if this is an admin-only route
  const isAdminRoute = ADMIN_API_ROUTES.some(route => pathname.startsWith(route));
  
  // If not a protected route or method, continue
  if (!isProtectedApiRoute && !isProtectedMethod && !isAdminRoute) {
    return NextResponse.next();
  }
  
  // Get the token from the Authorization header
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized' }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify the token
    const payload = await verifyToken(token);
    
    // Add user info to the request headers
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.id as string);
    requestHeaders.set('x-user-email', payload.email as string);
    requestHeaders.set('x-user-role', payload.role as string);
    
    // For admin routes, check if the user is an admin
    if (isAdminRoute && payload.role !== 'admin') {
      return new NextResponse(
        JSON.stringify({ error: 'Forbidden: Admin access required' }),
        { 
          status: 403,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Continue with added headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (error) {
    // Token is invalid
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized: Invalid token' }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Only run middleware on API routes
export const config = {
  matcher: '/api/:path*',
}; 