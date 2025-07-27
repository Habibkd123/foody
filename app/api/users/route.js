// app/api/users/route.js
import { NextResponse } from 'next/server';
import { UserController } from '../../controllers/userController';
import { authenticateToken } from '../../../middleware/authRoutes';

// GET - सभी users get करना
export async function GET(request) {
  try {
    // Authentication check
    const authResult = await authenticateToken(request);
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { success: false, message: authResult.message },
        { status: 401 }
      );
    }

    const result = await UserController.getAllUsers();
    
    return NextResponse.json(result, {
      status: result.success ? 200 : 400
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - नया user create करना
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validation
    if (!body.firstName || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, message: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    const result = await UserController.createUser(body);
    
    return NextResponse.json(result, {
      status: result.success ? 201 : 400
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
