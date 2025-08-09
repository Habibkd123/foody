// User address management API

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { addAddressSchema, updateAddressSchema } from '@/lib/user-validations';
import { 
  handleUserError, 
  validateUserObjectId, 
  createUserSuccessResponse, 
  createUserErrorResponse,
  formatAddress
} from '@/utils/user-utils';
import { ApiResponse } from '@/types/user-types';

// GET - Get user addresses
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;

    if (!validateUserObjectId(userId)) {
      return createUserErrorResponse(
        'Invalid user ID format',
        'The provided user ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const user = await User.findById(userId).select('addresses firstName lastName');

    if (!user) {
      return createUserErrorResponse(
        'User not found',
        'No user found with the provided ID',
        404
      );
    }

    return createUserSuccessResponse({
      userId,
      userName: `${user.firstName} ${user.lastName}`,
      addresses: user.addresses || [],
      count: user.addresses?.length || 0
    });

  } catch (error) {
    return handleUserError(error);
  }
}

// POST - Add new address
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;

    if (!validateUserObjectId(userId)) {
      return createUserErrorResponse(
        'Invalid user ID format',
        'The provided user ID is not a valid MongoDB ObjectId',
        400
      );
    }

    const body = await request.json();
    const validatedAddress = addAddressSchema.parse(body);

    const user = await User.findById(userId);

    if (!user) {
      return createUserErrorResponse(
        'User not found',
        'No user found with the provided ID',
        404
      );
    }

    // Check for duplicate addresses (same street, city, postal code)
    const isDuplicate = user.addresses?.some(addr => 
      addr.street.toLowerCase() === validatedAddress.street.toLowerCase() &&
      addr.city.toLowerCase() === validatedAddress.city.toLowerCase() &&
      addr.postalCode === validatedAddress.postalCode
    );

    if (isDuplicate) {
      return createUserErrorResponse(
        'Duplicate address',
        'An address with the same street, city, and postal code already exists',
        409
      );
    }

    // Add address to user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $push: { addresses: validatedAddress } },
      { new: true, runValidators: true }
    ).select('addresses firstName lastName');

    const newAddress = updatedUser!.addresses[updatedUser!.addresses.length - 1];

    return createUserSuccessResponse(
      {
        address: newAddress,
        formattedAddress: formatAddress(newAddress),
        totalAddresses: updatedUser!.addresses.length
      },
      'Address added successfully',
      201
    );

  } catch (error) {
    return handleUserError(error);
  }
}

// PUT - Update specific address
export async function PUT(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('addressId');

    if (!validateUserObjectId(userId)) {
      return createUserErrorResponse(
        'Invalid user ID format',
        'The provided user ID is not a valid MongoDB ObjectId',
        400
      );
    }

    if (!addressId || !validateUserObjectId(addressId)) {
      return createUserErrorResponse(
        'Invalid address ID',
        'A valid address ID is required',
        400
      );
    }

    const body = await request.json();
    const validatedAddress = updateAddressSchema.parse(body);

    const user = await User.findById(userId);

    if (!user) {
      return createUserErrorResponse(
        'User not found',
        'No user found with the provided ID',
        404
      );
    }

    // Find the address to update
    const addressIndex = user.addresses?.findIndex(addr => 
      addr._id?.toString() === addressId
    );

    if (addressIndex === -1 || addressIndex === undefined) {
      return createUserErrorResponse(
        'Address not found',
        'No address found with the provided ID',
        404
      );
    }

    // Update the address
    const updateQuery: any = {};
    Object.keys(validatedAddress).forEach(key => {
      if (validatedAddress[key] !== undefined) {
        updateQuery[`addresses.${addressIndex}.${key}`] = validatedAddress[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateQuery },
      { new: true, runValidators: true }
    ).select('addresses firstName lastName');

    const updatedAddress = updatedUser!.addresses[addressIndex];

    return createUserSuccessResponse(
      {
        address: updatedAddress,
        formattedAddress: formatAddress(updatedAddress),
      },
      'Address updated successfully'
    );

  } catch (error) {
    return handleUserError(error);
  }
}

// DELETE - Remove specific address
export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    await connectDB();

    const { userId } = params;
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('addressId');

    if (!validateUserObjectId(userId)) {
      return createUserErrorResponse(
        'Invalid user ID format',
        'The provided user ID is not a valid MongoDB ObjectId',
        400
      );
    }

    if (!addressId || !validateUserObjectId(addressId)) {
      return createUserErrorResponse(
        'Invalid address ID',
        'A valid address ID is required',
        400
      );
    }

    const user = await User.findById(userId);

    if (!user) {
      return createUserErrorResponse(
        'User not found',
        'No user found with the provided ID',
        404
      );
    }

    // Check if address exists
    const addressExists = user.addresses?.some(addr => 
      addr._id?.toString() === addressId
    );

    if (!addressExists) {
      return createUserErrorResponse(
        'Address not found',
        'No address found with the provided ID',
        404
      );
    }

    // Remove the address
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true }
    ).select('addresses firstName lastName');

    return createUserSuccessResponse(
      {
        remainingAddresses: updatedUser!.addresses.length,
        message: 'Address removed successfully'
      },
      'Address deleted successfully'
    );

  } catch (error) {
    return handleUserError(error);
  }
}