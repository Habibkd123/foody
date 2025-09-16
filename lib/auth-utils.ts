import { NextRequest } from 'next/server';
import * as jose from 'jose';

type UserPayload = {
  userId: string;
  role: string;
  [key: string]: any;
};

export async function getAuthUser(request: NextRequest): Promise<{
  userId: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}> {
  const token = request.cookies.get('token')?.value || 
               request.headers.get('authorization')?.replace('Bearer ', '');

  if (!token) {
    return {
      userId: null,
      role: null,
      isAuthenticated: false,
      isAdmin: false,
    };
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret) as { payload: UserPayload };
    
    return {
      userId: payload.userId,
      role: payload.role || 'user',
      isAuthenticated: true,
      isAdmin: payload.role === 'admin',
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return {
      userId: null,
      role: null,
      isAuthenticated: false,
      isAdmin: false,
    };
  }
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const { isAuthenticated } = await getAuthUser(request);
    
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return handler(request, ...args);
  };
}

export function requireAdmin(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    const { isAuthenticated, isAdmin } = await getAuthUser(request);
    
    if (!isAuthenticated) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return handler(request, ...args);
  };
}
