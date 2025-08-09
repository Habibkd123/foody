// Search users API

import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import { 
  handleUserError, 
  formatUserResponse, 
  createUserSuccessResponse, 
  createUserErrorResponse,
  buildUserSearchQuery
} from '@/utils/user-utils';
import { ApiResponse, UserResponse, UserPublicResponse } from '@/types/user-types';

// GET - Simple user search
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = Math.min(Number(searchParams.get('limit')) || 20, 100);
    const role = searchParams.get('role') as 'user' | 'admin' | undefined;
    const includePrivate = searchParams.get('includePrivate') === 'true';

    if (!query || query.trim().length < 2) {
      return createUserErrorResponse(
        'Invalid search query',
        'Search query must be at least 2 characters long',
        400
      );
    }

    const searchQuery = buildUserSearchQuery(query.trim());

    // Add role filter if specified
    const filter: any = searchQuery;
    if (role) {
      filter.role = role;
    }

    const selectFields = includePrivate ? '-password' : 'firstName lastName username role createdAt';

    const users = await User.find(filter)
      .select(selectFields)
      .sort({ firstName: 1, lastName: 1 })
      .limit(limit)
      .lean();

    const formattedUsers = users.map(user => 
      formatUserResponse(user, includePrivate)
    );

    return createUserSuccessResponse({
      query,
      results: formattedUsers,
      count: formattedUsers.length,
      includePrivate
    });

  } catch (error) {
    return handleUserError(error);
  }
}

// POST - Advanced user search with filters
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { 
      query, 
      filters = {}, 
      sort = { firstName: 1 }, 
      limit = 50,
      includePrivate = false
    } = body;

    if (!query || query.trim().length < 2) {
      return createUserErrorResponse(
        'Invalid search query',
        'Search query must be at least 2 characters long',
        400
      );
    }

    const searchQuery = buildUserSearchQuery(query.trim());

    // Build match conditions
    const matchConditions: any = searchQuery;

    // Add filters
    if (filters.role) {
      matchConditions.role = filters.role;
    }

    if (filters.hasAddresses !== undefined) {
      if (filters.hasAddresses) {
        matchConditions.addresses = { $exists: true, $not: { $size: 0 } };
      } else {
        matchConditions.$or = [
          { addresses: { $exists: false } },
          { addresses: { $size: 0 } }
        ];
      }
    }

    if (filters.createdAfter) {
      matchConditions.createdAt = { $gte: new Date(filters.createdAfter) };
    }

    if (filters.createdBefore) {
      matchConditions.createdAt = { 
        ...matchConditions.createdAt,
        $lte: new Date(filters.createdBefore) 
      };
    }

    const selectFields = includePrivate ? '-password' : 'firstName lastName username role createdAt';

    const users = await User.find(matchConditions)
      .select(selectFields)
      .sort(sort)
      .limit(Math.min(limit, 100))
      .lean();

    const formattedUsers = users.map(user => 
      formatUserResponse(user, includePrivate)
    );

    return createUserSuccessResponse({
      query,
      filters,
      results: formattedUsers,
      count: formattedUsers.length,
      includePrivate
    });

  } catch (error) {
    return handleUserError(error);
  }
}