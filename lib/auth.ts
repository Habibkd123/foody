import { SignJWT, jwtVerify } from 'jose';

const secretEnv = process.env.JWT_SECRET;
if (!secretEnv || secretEnv.length === 0) {
  throw new Error('JWT_SECRET is required');
}
const JWT_SECRET = new TextEncoder().encode(secretEnv);
const TOKEN_EXPIRY = '7d';

type UserPayload = {
  id: string;
  userId?: string;
  email: string;
  role: 'user' | 'admin' | 'restaurant';
};

export async function generateToken(user: UserPayload): Promise<string> {
  const payload = { ...user, userId: user.userId || user.id };
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as UserPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function getTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }
  return null;
}
