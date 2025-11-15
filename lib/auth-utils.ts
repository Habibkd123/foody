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
  const cookieToken = request.cookies.get('token')?.value;
  const headerAuth = request.headers.get('authorization');
  const headerToken = headerAuth?.startsWith('Bearer ')
    ? headerAuth.replace('Bearer ', '')
    : undefined;
  const token = cookieToken || headerToken;
  // Debug: presence only, not values
  try {
    console.log('[auth] token source', {
      hasCookieToken: Boolean(cookieToken),
      hasHeaderBearer: Boolean(headerToken),
    });
  } catch {}

  if (!token) {
    return {
      userId: null,
      role: null,
      isAuthenticated: false,
      isAdmin: false,
    };
  }

  try {
    const secretEnv = process.env.JWT_SECRET;
    try {
      console.log('[auth] has JWT_SECRET:', Boolean(secretEnv));
    } catch {}
    if (!secretEnv || secretEnv.length === 0) {
      // Missing secret; cannot verify tokens safely
      return {
        userId: null,
        role: null,
        isAuthenticated: false,
        isAdmin: false,
      };
    }
    const secret = new TextEncoder().encode(secretEnv);
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
