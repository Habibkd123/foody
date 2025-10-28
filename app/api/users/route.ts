import { NextRequest, NextResponse } from 'next/server';
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
// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();

//     const body = await request.json();
//     const validatedData = createUserSchema.parse(body);

//     // Check if user with same email or phone already exists
//     const existingUser = await User.findOne({
//       $or: [
//         { email: validatedData.email },
//         // { phone: validatedData.phone }
//       ]
//     });

//     if (existingUser) {
//       const field = existingUser.email === validatedData.email && 'email' 
//       return createUserErrorResponse(
//         'User already exists',
//         `A user with this ${field} already exists`,
//         409
//       );
//     }

//     // Generate username if not provided
//     if (!validatedData.username) {
//       validatedData.username = generateUsername(validatedData.firstName, validatedData.lastName);

//       // Ensure username is unique
//       let attempts = 0;
//       while (attempts < 5) {
//         const existingUsername = await User.findOne({ username: validatedData.username });
//         if (!existingUsername) break;

//         validatedData.username = generateUsername(validatedData.firstName, validatedData.lastName);
//         attempts++;
//       }
//     } else {
//       // Check if provided username is unique
//       const existingUsername = await User.findOne({ username: validatedData.username });
//       if (existingUsername) {
//         return createUserErrorResponse(
//           'Username already exists',
//           'A user with this username already exists',
//           409
//         );
//       }
//     }

//     // Hash password
//     validatedData.password = await hashPassword(validatedData.password);

//     const user = await User.create(validatedData);
//     const formattedUser = formatUserResponse(user, true) as UserResponse;

//     return createUserSuccessResponse(
//       formattedUser,
//       'User created successfully',
//       201
//     );

//   } catch (error) {
//     return handleUserError(error);
//   }
// }

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password, phone, username } =
      await request.json();

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be filled' },
        { status: 400 }
      );
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

    // Create user (password gets hashed automatically)
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      username,
    });

    const { password: _, ...userData } = newUser.toObject();

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