// Authentication API (login, password change)

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { loginSchema, passwordChangeSchema } from '@/lib/user-validations';
import { 
  handleUserError, 
  formatUserResponse, 
  createUserSuccessResponse, 
  createUserErrorResponse,
  verifyPassword,
  hashPassword,
  validateUserObjectId
} from '@/utils/user-utils';
import { ApiResponse, LoginResponse, UserPublicResponse } from '@/types/user-types';

// POST - User login
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { action = 'login', ...data } = body;

    if (action === 'login') {
      return await handleLogin(data);
    } else if (action === 'changePassword') {
      return await handlePasswordChange(data);
    } else {
      return createUserErrorResponse(
        'Invalid action',
        'Supported actions are: login, changePassword',
        400
      );
    }

  } catch (error) {
    return handleUserError(error);
  }
}

async function handleLogin(data: any): Promise<NextResponse> {
  const validatedData = loginSchema.parse(data);

  // Find user by email
  const user = await User.findOne({ email: validatedData.email }).select('+password');

  if (!user) {
    return createUserErrorResponse(
      'Invalid credentials',
      'Email or password is incorrect',
      401
    );
  }

  // Verify password
  const isPasswordValid = await verifyPassword(validatedData.password, user.password);

  if (!isPasswordValid) {
    return createUserErrorResponse(
      'Invalid credentials',
      'Email or password is incorrect',
      401
    );
  }

  // Format user response (exclude password)
  const userResponse = formatUserResponse(user, false) as UserPublicResponse;

  // In a real application, you would generate a JWT token here
  // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

  const loginResponse: LoginResponse = {
    user: userResponse,
    message: 'Login successful',
    // token: token // Uncomment when implementing JWT
  };

  return createUserSuccessResponse(loginResponse, 'Login successful');
}

async function handlePasswordChange(data: any): Promise<NextResponse> {
  const { userId, ...passwordData } = data;

  if (!userId || !validateUserObjectId(userId)) {
    return createUserErrorResponse(
      'Invalid user ID',
      'A valid user ID is required for password change',
      400
    );
  }

  const validatedData = passwordChangeSchema.parse(passwordData);

  // Find user
  const user = await User.findById(userId).select('+password');

  if (!user) {
    return createUserErrorResponse(
      'User not found',
      'No user found with the provided ID',
      404
    );
  }

  // Verify current password
  const isCurrentPasswordValid = await verifyPassword(
    validatedData.currentPassword, 
    user.password
  );

  if (!isCurrentPasswordValid) {
    return createUserErrorResponse(
      'Invalid current password',
      'The current password is incorrect',
      401
    );
  }

  // Hash new password
  const hashedNewPassword = await hashPassword(validatedData.newPassword);

  // Update password
  await User.findByIdAndUpdate(userId, { 
    password: hashedNewPassword 
  });

  return createUserSuccessResponse(
    null,
    'Password changed successfully'
  );
}

// GET - Verify token / Get current user (for when implementing JWT)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const getAllUser =await User.find()
    if (!getAllUser || getAllUser.length === 0) {
      return createUserErrorResponse(
        'No users found', 
        'No users found in the database', 
        404 
      );
    }
       
return  NextResponse.json({
      success: true,
      users: getAllUser.map(user => formatUserResponse(user, false))
    }, { status: 200 });

  } catch (error) {
    return handleUserError(error);
  }
}