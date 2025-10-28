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
  // ✅ Await is required in your Next.js version
  const cookieStore = await cookies();

  const token = cookieStore.get("token")?.value;
  const userRole = cookieStore.get("user-role")?.value;
  const userAuth = cookieStore.get("user-auth")?.value;
  const user_id = cookieStore.get("user-id")?.value;

  if (!token || !userRole) {
    return NextResponse.json(
      { error: "Token and user data are required" },
      { status: 400 }
    );
  }

  // ✅ Safely handle JSON parsing
  let parsedAuth = null;
  if (userAuth) {
    try {
      parsedAuth = JSON.parse(userAuth);
    } catch {
      parsedAuth = userAuth;
    }
  }

  return NextResponse.json({
    success: true,
    token,
    user: { role: userRole },
    userAuth: parsedAuth,
    user_id: user_id,
  });
}

// --------------------
// DELETE /api/auth
// --------------------
export async function DELETE(): Promise<NextResponse> {
  try {
    const response = NextResponse.json({ success: true, message: 'Cookies deleted successfully' });

    // Delete all auth cookies
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0, // Expires immediately
    });

    response.cookies.set({
      name: 'user',
      value: '',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    response.cookies.set({
      name: 'user-role',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    response.cookies.set({
      name: 'user-auth',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    response.cookies.set({
      name: 'user-id',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error('Error deleting cookies:', error);
    return NextResponse.json(
      { error: 'Failed to delete cookies' },
      { status: 500 }
    );
  }
}

