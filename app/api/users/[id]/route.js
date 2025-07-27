// // app/api/users/[id]/route.js
// import { NextResponse } from 'next/server';
// import { UserController } from '../../../../controllers/userController';
// import { authenticateToken } from '../../../../middleware/auth';

// // GET - specific user get करना
// export async function GET(request, { params }) {
//   try {
//     const authResult = await authenticateToken(request);
//     if (!authResult.isAuthenticated) {
//       return NextResponse.json(
//         { success: false, message: authResult.message },
//         { status: 401 }
//       );
//     }

//     const result = await UserController.getUserById(params.id);
    
//     return NextResponse.json(result, {
//       status: result.success ? 200 : 404
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // PUT - user update करना
// export async function PUT(request, { params }) {
//   try {
//     const authResult = await authenticateToken(request);
//     if (!authResult.isAuthenticated) {
//       return NextResponse.json(
//         { success: false, message: authResult.message },
//         { status: 401 }
//       );
//     }

//     const body = await request.json();
    
//     // User can only update their own profile (unless admin)
//     if (authResult.user._id.toString() !== params.id && authResult.user.role !== 'admin') {
//       return NextResponse.json(
//         { success: false, message: 'You can only update your own profile' },
//         { status: 403 }
//       );
//     }

//     const result = await UserController.updateUser(params.id, body);
    
//     return NextResponse.json(result, {
//       status: result.success ? 200 : 400
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - user delete करना
// export async function DELETE(request, { params }) {
//   try {
//     const authResult = await authenticateToken(request);
//     if (!authResult.isAuthenticated) {
//       return NextResponse.json(
//         { success: false, message: authResult.message },
//         { status: 401 }
//       );
//     }

//     // Only admin can delete users
//     if (authResult.user.role !== 'admin') {
//       return NextResponse.json(
//         { success: false, message: 'Admin access required' },
//         { status: 403 }
//       );
//     }

//     const result = await UserController.deleteUser(params.id);
    
//     return NextResponse.json(result, {
//       status: result.success ? 200 : 404
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { success: false, message: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
