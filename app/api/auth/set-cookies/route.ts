import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// --------------------
// POST /api/auth
// --------------------
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // Incoming body type
    const { token, user }: { token?: string; user?: Record<string, any> } =
      await request.json();

    if (!token || !user) {
      return NextResponse.json(
        { error: 'Token and user data are required' },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true });

    // Set HTTP-only cookie for token
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // ⚠️ NOTE: If you want user accessible in client JS → httpOnly: false
    response.cookies.set({
      name: 'user',
      value: JSON.stringify(user),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Error setting cookies:', error);
    return NextResponse.json(
      { error: 'Failed to set cookies' },
      { status: 500 }
    );
  }
}

// --------------------
// GET /api/auth
// --------------------
export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  const userCookie = cookieStore.get('user')?.value;
  if (!token || !userCookie) {
    return NextResponse.json(
      { error: 'Token and user data are required' },
      { status: 400 }
    );
  }

  let user: Record<string, any> | null = null;
  try {
    user = JSON.parse(userCookie);
  } catch {
    return NextResponse.json(
      { error: 'Invalid user cookie' },
      { status: 400 }
    );
  }
  return NextResponse.json({
    success: true,
    token,
    user,
  });
}
