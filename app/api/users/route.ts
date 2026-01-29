import { NextRequest, NextResponse } from 'next/server';
import { isEmailVerified, verifyOTP, clearOTP } from '@/app/api/auth/otpStore';

import connectDB from '@/lib/mongodb';
import User from '@/app/models/User'; // Your existing model
import { createUserSchema, userQuerySchema } from '@/lib/user-validations';
import {
  handleUserError,
  formatUserResponse,
  createUserSuccessResponse,
  createUserErrorResponse,
  hashPassword,
  generateUsername,
  buildUserSearchQuery
} from '@/utils/user-utils';
import { ApiResponse, UserResponse, UserListResponse } from '@/types/user-types';

// GET - Fetch all users with pagination and filtering
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const queryData = Object.fromEntries(searchParams.entries());

    const {
      page = 1,
      limit = 20,
      role,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      hasAddresses
    } = userQuerySchema.parse(queryData);

    // Build filter object
    const filter: any = {};

    // Filter by role
    if (role) {
      filter.role = role;
    }

    // Filter by users with/without addresses
    if (hasAddresses !== undefined) {
      if (hasAddresses) {
        filter.addresses = { $exists: true, $not: { $size: 0 } };
      } else {
        filter.$or = [
          { addresses: { $exists: false } },
          { addresses: { $size: 0 } }
        ];
      }
    }

    // Add search functionality
    if (search) {
      const searchQuery = buildUserSearchQuery(search);
      filter.$and = filter.$and ? [...filter.$and, searchQuery] : [searchQuery];
    }

    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries in parallel
    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password') // Exclude password from results
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter)
    ]);

    const formattedUsers = users.map(user => formatUserResponse(user, true)) as UserResponse[];

    const responseData: UserListResponse = {
      users: formattedUsers,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        current: page,
        limit,
      },
    };

    return createUserSuccessResponse(responseData);

  } catch (error) {
    return handleUserError(error);
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      username,
      otp,
      role,
      restaurantName,
      restaurantOwnerName,
      restaurantAddress,
      openingTime,
      closingTime,
    } = await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Only allow user / restaurant / driver signup from public registration
    let normalizedRole: 'user' | 'restaurant' | 'driver' = 'user';
    if (role === 'restaurant') normalizedRole = 'restaurant';
    if (role === 'driver') normalizedRole = 'driver';

    if (normalizedRole === 'restaurant') {
      if (!restaurantName || !restaurantOwnerName || !restaurantAddress || !openingTime || !closingTime) {
        return NextResponse.json(
          { success: false, message: 'All restaurant details are required' },
          { status: 400 }
        );
      }
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 }
      );
    }

    // Require verified email via OTP. If not verified yet but OTP provided, try inline verification.
    if (!isEmailVerified(email)) {
      const inlineOk = otp ? verifyOTP(email, otp) : false;
      if (!inlineOk) {
        return NextResponse.json(
          { success: false, message: 'Please verify your email with a valid OTP' },
          { status: 400 }
        );
      }
    }

    // Create user (password gets hashed automatically)
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      username,
      role: normalizedRole,
      restaurant: normalizedRole === 'restaurant'
        ? {
          status: 'pending',
          name: restaurantName,
          ownerName: restaurantOwnerName,
          address: restaurantAddress,
          openingTime,
          closingTime,
        }
        : undefined,
      driverDetails: normalizedRole === 'driver'
        ? {
          status: 'pending',
          isVerified: false,
          isAvailable: false,
        }
        : undefined,
    });

    const { password: _, ...userData } = newUser.toObject();

    // Clear OTP after successful account creation
    clearOTP(email);

    return NextResponse.json(
      { success: true, message: 'User registered successfully', user: userData },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}