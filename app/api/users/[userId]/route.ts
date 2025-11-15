import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { updateUserSchema } from '@/lib/user-validations';
import { 
  handleUserError, 
  validateUserObjectId, 
  formatUserResponse, 
  createUserSuccessResponse, 
  createUserErrorResponse,
  hashPassword,
  canAccessUser
} from '@/utils/user-utils';
import { ApiResponse, UserResponse, UserPublicResponse } from '@/types/user-types';

// GET - Fetch user by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const { userId } = await params;
    console.log("userId",userId);
    const { searchParams } = new URL(request.url);
    const includePrivate = searchParams.get('includePrivate') === 'true';

    if (!validateUserObjectId(userId)) {
      return createUserErrorResponse(
        'Invalid user ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    // For demo purposes, we'll assume all requests are authorized
    // In a real app, you'd check authentication and authorization here
    const user = await User.findById(userId)
      .select(includePrivate ? '-password' : 'firstName lastName username role createdAt')
      .lean();

    if (!user) {
      return createUserErrorResponse(
        'User not found',
        'No user found with the provided ID',
        404
      );
    }

    const formattedUser = formatUserResponse(user, includePrivate);
    return createUserSuccessResponse(formattedUser, 'User retrieved successfully');
  } catch (error) {
    console.error('Error fetching user:', error);
    return handleUserError(error);
  }
}

// PUT - Update user by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    const { userId } = await params;
    const data = await request.json();

    // Validate user ID
    if (!validateUserObjectId(userId)) {
      return createUserErrorResponse(
        'Invalid user ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    // Validate request body
    const validation = updateUserSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation error',
          errors: validation.error,
        },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return createUserErrorResponse(
        'User not found',
        'No user found with the provided ID',
        404
      );
    }

    // Update user fields
    const { password, ...updateData } = data;
    
    // Hash new password if provided
    if (password) {
      updateData.password = await hashPassword(password);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    const formattedUser = formatUserResponse(updatedUser!.toObject(), true);
    
    // Create response and update all user cookies
    const response = createUserSuccessResponse(formattedUser, 'User updated successfully');
    
    // Update user-auth cookie with new user data
    response.cookies.set({
      name: 'user-auth',
      value: JSON.stringify(formattedUser),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    // Update user cookie (client-accessible) with basic info
    response.cookies.set({
      name: 'user',
      value: JSON.stringify({
        firstName: formattedUser.firstName,
        lastName: formattedUser.lastName,
        image: 'image' in formattedUser ? formattedUser.image || '' : '',
        role: formattedUser.role
      }),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return response;
  } catch (error) {
    console.error('Error updating user:', error);
    return handleUserError(error);
  }
}

// DELETE - Delete user by ID (and logout - clear cookies)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();
    const { userId } = await params;

    // Validate user ID
    if (!validateUserObjectId(userId)) {
      return createUserErrorResponse(
        'Invalid user ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return createUserErrorResponse(
        'User not found',
        'No user found with the provided ID',
        404
      );
    }

    // Delete user from database
    await User.findByIdAndDelete(userId);

    // Create response and clear all auth cookies
    const response = NextResponse.json({
      success: true,
      message: 'User deleted successfully and logged out',
    }, { status: 200 });

    // Clear all auth cookies
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
    console.error('Error deleting user:', error);
    return handleUserError(error);
  }
}
