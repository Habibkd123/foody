// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { UserController } from '../../../controllers/userController';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await UserController.loginUser(email, password);
    
    return NextResponse.json(result, {
      status: result.success ? 200 : 401
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
