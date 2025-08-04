// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  // Get token from cookies or Authorization header
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
console.log('token', token);
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    // '/profile',
    // '/orders',
    // '/cart',
    // '/checkout',
    // '/productList'
  ]

  // Define public routes that don't need authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/forgot-password'
  ]

  const { pathname } = request.nextUrl

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if current route is public auth route
  const isAuthRoute = publicRoutes.includes(pathname)

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    console.log('No token found, redirecting to login')
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If token exists, verify it's valid
  if (token && isProtectedRoute) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
      
      if (!decoded) {
        console.log('Invalid token, redirecting to login')
        // Clear invalid token
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('token')
        return response
      }

      // Token is valid, allow access
      console.log('Valid token, allowing access')
      
    } catch (error) {
      console.log('Token verification failed:', error)
      // Clear invalid token and redirect
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  // If user has valid token and tries to access auth pages, redirect to dashboard
  if (token && isAuthRoute) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string)
      if (decoded) {
        console.log('User already authenticated, redirecting to dashboard')
        return NextResponse.redirect(new URL('/productList', request.url))
      }
    } catch (error) {
      // Token is invalid, clear it and allow access to auth pages
      const response = NextResponse.next()
      response.cookies.delete('token')
      return response
    }
  }

  // Allow access to all other routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes (handled separately)
    // - _next/static (static files)
    // - _next/image (image optimization files) 
    // - favicon.ico, robots.txt etc.
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
}



type AuthResult = {
  isAuthenticated: boolean
  message: string
  user?: any
}

export async function authenticateUser(request: Request): Promise<AuthResult> {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization')
    const token = authHeader && authHeader.split(' ')[1] // "Bearer TOKEN"
console.log('authenticateUsertoken', token);
    if (!token) {
      return {
        isAuthenticated: false,
        message: 'Access token required'
      }
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any
    
    if (!decoded || !decoded.userId) {
      return {
        isAuthenticated: false,
        message: 'Invalid token format'
      }
    }

    // // Connect to database and find user
    // await connectDB()
    // const user = await User.findById(decoded.userId).select('-password')
    
    // if (!user) {
    //   return {
    //     isAuthenticated: false,
    //     message: 'User not found'
    //   }
    // }

    return {
      isAuthenticated: true,
      message: 'Authentication successful',
      // user: user
    }

  } catch (error) {
    console.error('Authentication error:', error)
    return {
      isAuthenticated: false,
      message: 'Invalid or expired token'
    }
  }
}

// Helper function to get user from request
export async function getCurrentUser(request: Request) {
  const authResult = await authenticateUser(request)
  console.log('authResult', authResult);
  if (!authResult.isAuthenticated) {
    return null
  }
  
  return authResult.user
}

// Usage example in API routes:
/*
// In your API route (e.g., app/api/profile/route.ts)
import { authenticateUser } from '@/middleware/auth'

export async function GET(request: Request) {
  const authResult = await authenticateUser(request)
  
  if (!authResult.isAuthenticated) {
    return Response.json(
      { error: authResult.message }, 
      { status: 401 }
    )
  }
  
  // User is authenticated, proceed with API logic
  const user = authResult.user
  
  return Response.json({
    success: true,
    user: user
  })
}
*/