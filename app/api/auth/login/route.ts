// import { NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { generateToken } from '@/lib/auth';
// import connectDB from '@/lib/mongodb';
// import User from '@/app/models/User';

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     // Input validation
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: 'Email and password are required' ,success:false,message:"Login failed"},
//         { status: 400 } 
//       );
//     }

//     await connectDB();

//     // Find user by email
//     const user = await User.findOne({ email }).select('+password');

//     if (!user) {
//       return NextResponse.json(
//         { error: 'Invalid email or password' ,success:false,message:"Login failed"},
//         { status: 401 }
//       );
//     }

//     // Verify password
//     const isPasswordValid = await user.comparePassword(password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: 'Invalid email or password' ,success:false,message:"Login failed"},
//         { status: 401 }
//       );
//     }

//     // Generate JWT token
//     const token = await generateToken({
//       id: user._id.toString(),
//       email: user.email,
//       role: user.role || 'user',
//     });

//     // Prepare user data (without password)
//     const userData = {
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role || 'user',
//     };

//     // Set HTTP-only cookie
//     const cookieStore = await cookies();
//     cookieStore.set({
//       name: 'token',
//       value: token,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'strict',
//       path: '/',
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     });

//     // Set user data in a separate cookie
//     cookieStore.set({
//       name: 'user',
//       value: JSON.stringify(userData),
//       path: '/',
//       maxAge: 60 * 60 * 24 * 7, // 7 days
//     });

//     return NextResponse.json({ user: userData ,token :token ,success:true,message:"Login successful"});

//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' ,success:false,message:"Login failed"},
//       { status: 500 }
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import AuthSession from '@/app/models/AuthSession';
import ActivityLog from '@/app/models/ActivityLog';
import { ensureDeviceId, ensureSessionId, getClientIp, getUserAgent } from '@/app/lib/security';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Fetch user with password (select: false by default)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      try {
        await connectDB();
        await ActivityLog.create({
          action: 'login_failed',
          meta: { email: String(email || '') },
          ip: getClientIp(request.headers),
          userAgent: getUserAgent(request.headers),
        });
      } catch {}
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const ip = getClientIp(request.headers);
    const userAgent = getUserAgent(request.headers);
    const deviceId = ensureDeviceId(cookieStore.get('device-id')?.value);
    const sessionId = ensureSessionId();

    const token = await generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const userData = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      restaurant: user.restaurant,
    };

    // Persist session (and optionally revoke old sessions)
    try {
      // Optional policy: revoke all old sessions on new login.
      // Enable by setting env: SINGLE_SESSION_ONLY=true
      if (String(process.env.SINGLE_SESSION_ONLY || '').toLowerCase() === 'true') {
        await AuthSession.updateMany(
          { userId: user._id, revokedAt: { $exists: false } },
          { $set: { revokedAt: new Date(), revokedReason: 'new_login_single_session' } }
        );
      }

      await AuthSession.create({
        sessionId,
        userId: user._id,
        role: user.role,
        deviceId,
        ip,
        userAgent,
        lastSeenAt: new Date(),
      });

      await ActivityLog.create({
        userId: user._id,
        role: user.role,
        action: 'session_created',
        sessionId,
        deviceId,
        ip,
        userAgent,
      });
      await ActivityLog.create({
        userId: user._id,
        role: user.role,
        action: 'login_success',
        sessionId,
        deviceId,
        ip,
        userAgent,
      });
    } catch {}

    // Cookie setup
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set({
      name: 'sid',
      value: sessionId,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set({
      name: 'device-id',
      value: deviceId,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });

    cookieStore.set({
      name: 'user-role',
      value: user.role,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set({
      name: 'user-id',
      value: user._id.toString(),
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
   cookieStore.set({
      name: 'user-auth',
      value: userData ? JSON.stringify(userData) : '',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData,
      token,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}