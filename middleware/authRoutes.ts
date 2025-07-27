// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   // Get the authentication token from cookies
//   const token = request.cookies.get('auth-// Check if the user is trying to access a protected route
//   const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
//                           request.nextUrl.pathname.startsWith('/profile') ||
//                           request.nextUrl.pathname.startsWith('/admin')
  
//   // If no token and trying to access protected route, redirect to login
//   if (isProtectedRoute && !token) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }
  
//   // If token exists and trying to access auth pages, redirect to dashboard
//   if (token && (request.nextUrl.pathname === '/login' || 
//                 request.nextUrl.pathname === '/register')) {
//     return NextResponse.redirect(new URL('/dashboard', request.url))
//   }
  
//   return NextResponse.next()
// }

// export const config = {
//   matcher: [
//     // Match all pathnames except for
//     // - api (API routes)
//     // - _next/static (static files)
//     // - _next/image (image optimization files)
//     // - favicon.ico (favicon file)
//     '/((?!api|_next/static|_next/image|favicon.ico).*)',
//   ],
// }



// middleware/auth.ts
import jwt from 'jsonwebtoken';
import User from '../app/models/User';
import connectDB from '../lib/mongodb';

type UserDocument = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
};

export async function authenticateToken(request: Request): Promise<{
  isAuthenticated: boolean;
  message: string;
  user?: UserDocument;
}> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
      return {
        isAuthenticated: false,
        message: 'Access token required',
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    console.log('Decoded token:', decoded);
    if(!decoded) {
      return {
        isAuthenticated: false,
        message: 'Invalid token',
      };
    }
    await connectDB();
    const user = await User.findById(decoded?.userId).select('-password');
    
    if (!user) {
      return {
        isAuthenticated: false,
        message: 'User not found',
      };
    }

    return {
      isAuthenticated: true,
      user: user,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      message: 'Invalid token',
    };
  }
}

// Admin authorization check करने के लिए
export async function requireAdmin(request: Request): Promise<{
  isAuthenticated: boolean;
  message: string;
  user?: UserDocument;
}> {
  const authResult = await authenticateToken(request);
  
  if (!authResult.isAuthenticated) {
    return authResult;
  }

  if (authResult.user?.role !== 'admin') {
    return {
      isAuthenticated: false,
      message: 'Admin access required',
    };
  }

  return authResult;
}

