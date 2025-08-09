import { NextRequest, NextResponse } from 'next/server';
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
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;
    const { searchParams } = new URL(request.url);
    const includePrivate = searchParams.get('includePrivate') === 'true';

    if (!validateUserObjectId(id)) {
      return createUserErrorResponse(
        'Invalid user ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    // For demo purposes, we'll assume all requests are authorized
    // In a real app, you'd check authentication and authorization here
    const user = await User.findById(id)
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

    return createUserSuccessResponse(formattedUser);

  } catch (error) {
    return handleUserError(error);
  }
}

// PUT - Update user by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!validateUserObjectId(id)) {
      return createUserErrorResponse(
        'Invalid user ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return createUserErrorResponse(
        'No data provided',
        'Request body cannot be empty for update operation',
        400
      );
    }

    const validatedData = updateUserSchema.parse(body);

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return createUserErrorResponse(
        'User not found',
        'No user found with the provided ID',
        404
      );
    }

    // Check for duplicate email or phone (excluding current user)
    if (validatedData.email || validatedData.phone) {
      const duplicateQuery: any = {
        _id: { $ne: id }
      };

      if (validatedData.email && validatedData.phone) {
        duplicateQuery.$or = [
          { email: validatedData.email },
          { phone: validatedData.phone }
        ];
      } else if (validatedData.email) {
        duplicateQuery.email = validatedData.email;
      } else if (validatedData.phone) {
        duplicateQuery.phone = validatedData.phone;
      }

      const duplicateUser = await User.findOne(duplicateQuery);
      if (duplicateUser) {
        const field = duplicateUser.email === validatedData.email ? 'email' : 'phone';
        return createUserErrorResponse(
          `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
          `A user with this ${field} already exists`,
          409
        );
      }
    }

    // Check for duplicate username (excluding current user)
    if (validatedData.username) {
      const duplicateUsername = await User.findOne({
        username: validatedData.username,
        _id: { $ne: id }
      });

      if (duplicateUsername) {
        return createUserErrorResponse(
          'Username already exists',
          'A user with this username already exists',
          409
        );
      }
    }

    // Hash password if provided
    if (validatedData.password) {
      validatedData.password = await hashPassword(validatedData.password);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      validatedData,
      { new: true, runValidators: true }
    ).select('-password');

    const formattedUser = formatUserResponse(updatedUser!, true) as UserResponse;

    return createUserSuccessResponse(
      formattedUser,
      'User updated successfully'
    );

  } catch (error) {
    return handleUserError(error);
  }
}

// DELETE - Delete user by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const { id } = params;

    if (!validateUserObjectId(id)) {
      return createUserErrorResponse(
        'Invalid user ID format',
        'The provided ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const user = await User.findById(id);
    if (!user) {
      return createUserErrorResponse(
        'User not found',
        'No user found with the provided ID',
        404
      );
    }

    // Optional: Check if user has associated orders/data before deletion
    // const hasOrders = await Order.exists({ user: id });
    // if (hasOrders) {
    //   return createUserErrorResponse(
    //     'User has associated data',
    //     'Cannot delete user with existing orders. Please contact administrator.',
    //     409
    //   );
    // }

    await User.findByIdAndDelete(id);

    return NextResponse.json<ApiResponse<null>>({
      success: true,
      message: `User "${user.firstName} ${user.lastName}" deleted successfully`,
    });

  } catch (error) {
    return handleUserError(error);
  }
}