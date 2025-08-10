import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import bcrypt from 'bcryptjs';
import { ApiResponse, UserResponse, UserPublicResponse } from '@/types/user-types';

export function handleUserError(error: any): NextResponse<ApiResponse<null>> {
  console.error('User API Error:', error);

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        message: error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      },
      { status: 400 }
    );
  }

  if (error.name === 'CastError') {
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid ID format',
        message: 'The provided ID is not in valid MongoDB ObjectId format'
      },
      { status: 400 }
    );
  }

  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    const value = Object.values(error.keyValue || {})[0] || '';
    return NextResponse.json(
      {
        success: false,
        error: 'Duplicate entry',
        message: `User with this ${field} (${value}) already exists`
      },
      { status: 409 }
    );
  }

  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return NextResponse.json(
      {
        success: false,
        error: 'Validation error',
        message: messages.join(', ')
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: 'Internal server error',
      message: 'Something went wrong on the server'
    },
    { status: 500 }
  );
}

export function validateUserObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export function formatUserResponse(user: any, includePrivateInfo = false): UserResponse | UserPublicResponse {
  const baseUser = {
    _id: user._id.toString(),
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    role: user.role,
    email: user.email,
    phone: user.phone,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
  };

  if (includePrivateInfo) {
    return {
      ...baseUser,
      email: user.email,
      phone: user.phone,
      addresses: user.addresses || [],
      updatedAt: user.updatedAt.toISOString(),
    } as UserResponse;
  }

  return baseUser as UserPublicResponse;
}

export function createUserSuccessResponse<T>(
  data: T, 
  message?: string, 
  statusCode = 200
) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      data,
      message,
    },
    { status: statusCode }
  );
}

export function createUserErrorResponse(
  error: string, 
  message?: string, 
  statusCode = 400
) {
  return NextResponse.json<ApiResponse<null>>(
    {
      success: false,
      error,
      message,
    },
    { status: statusCode }
  );
}

// Password hashing utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

// Email validation utility
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation utility
export function isValidPhone(phone: number): boolean {
  const phoneStr = phone.toString();
  return phoneStr.length >= 10 && phoneStr.length <= 15;
}

// Username generation utility
export function generateUsername(firstName: string, lastName: string): string {
  const baseUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${baseUsername}${randomSuffix}`;
}

// Address formatting utility
export function formatAddress(address: any): string {
  return `${address.street}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
}

// User search utility
export function buildUserSearchQuery(searchTerm: string) {
  const searchRegex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

  return {
    $or: [
      { firstName: { $regex: searchRegex } },
      { lastName: { $regex: searchRegex } },
      { username: { $regex: searchRegex } },
      { email: { $regex: searchRegex } },
      { 
        $expr: {
          $regexMatch: {
            input: { $concat: ["$firstName", " ", "$lastName"] },
            regex: searchRegex
          }
        }
      }
    ]
  };
}

// Check if user is admin
export function isAdmin(user: any): boolean {
  return user && user.role === 'admin';
}

// Check if user can access resource
export function canAccessUser(requestingUser: any, targetUserId: string): boolean {
  if (!requestingUser) return false;

  // Admin can access any user
  if (isAdmin(requestingUser)) return true;

  // Users can only access their own data
  return requestingUser._id.toString() === targetUserId;
}

// Sanitize user data (remove sensitive info)
export function sanitizeUserForPublic(user: any): UserPublicResponse {
  return {
    _id: user._id.toString(),
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}

// Check password strength
export function isStrongPassword(password: string): { isStrong: boolean; message: string } {
  if (password.length < 6) {
    return { isStrong: false, message: 'Password must be at least 6 characters long' };
  }

  if (password.length > 100) {
    return { isStrong: false, message: 'Password is too long' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return { 
      isStrong: false, 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    };
  }

  return { isStrong: true, message: 'Password is strong' };
}