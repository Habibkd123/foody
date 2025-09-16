import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' ,success:false,message:"Login failed"},
        { status: 400 } 
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' ,success:false,message:"Login failed"},
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' ,success:false,message:"Login failed"},
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role || 'user',
    });

    // Prepare user data (without password)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role || 'user',
    };

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Set user data in a separate cookie
    cookieStore.set({
      name: 'user',
      value: JSON.stringify(userData),
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ user: userData ,token :token ,success:true,message:"Login successful"});

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' ,success:false,message:"Login failed"},
      { status: 500 }
    );
  }
}
