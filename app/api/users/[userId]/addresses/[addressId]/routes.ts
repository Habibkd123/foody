import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import mongoose from 'mongoose';

export async function PUT(
  request: NextRequest,
  context: { params: { userId: string; addressId: string } }
) {
  try {
    const { userId, addressId } = await Promise.resolve(context.params);
    const addressData = await request.json();

    // Validate IDs
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid address ID' },
        { status: 400 }
      );
    }

    // Required fields validation
    // const requiredFields = ['label', 'city', 'state', 'name'];
    // const missingFields = requiredFields.filter(field => !addressData[field]);
    
    // if (missingFields.length > 0) {
    //   return NextResponse.json(
    //     { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
    //     { status: 400 }
    //   );
    // }

    await connectDB();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Find the address to update
    const addressIndex = user.addresses.findIndex((addr: any) => addr._id.toString() === addressId);
    if (addressIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Address not found' },
        { status: 404 }
      );
    }

    // Prepare updated address
    const updatedAddress = {
      address: addressData.address || '',
      area: addressData.area || '',
      city: addressData.city,
      flatNumber: addressData.flatNumber || '',
      floor: addressData.floor || '',
      isDefault: Boolean(addressData.isDefault),
      label: addressData.label,
      landmark: addressData.landmark || '',
      lat: addressData.lat ? Number(addressData.lat) : undefined,
      lng: addressData.lng ? Number(addressData.lng) : undefined,
      name: addressData.name,
      phone: addressData.phone ? Number(addressData.phone) : 0,
      state: addressData.state,
      street: addressData.street || '',
      zipCode: addressData.zipCode || ''
    };

    // If this is being set as default, unset other defaults first
    if (updatedAddress.isDefault) {
      await User.findByIdAndUpdate(
        userId,
        { $set: { 'addresses.$[].isDefault': false } },
        { new: true }
      );
    }

    // Update the specific address using positional operator
    const result = await User.findByIdAndUpdate(
      userId,
      { 
        $set: { 
          [`addresses.${addressIndex}`]: {
            ...user.addresses[addressIndex],
            ...updatedAddress,
            _id: user.addresses[addressIndex]._id // Keep the original _id
          }
        }
      },
      { new: true, runValidators: true }
    );

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Failed to update address' },
        { status: 500 }
      );
    }

    // Get the updated address
    const savedAddress = result.addresses[addressIndex];

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully',
      address: {
        _id: savedAddress._id,
        address: savedAddress.address,
        area: savedAddress.area,
        city: savedAddress.city,
        flatNumber: savedAddress.flatNumber,
        floor: savedAddress.floor,
        isDefault: savedAddress.isDefault,
        label: savedAddress.label,
        landmark: savedAddress.landmark,
        lat: savedAddress.lat,
        lng: savedAddress.lng,
        name: savedAddress.name,
        phone: savedAddress.phone,
        state: savedAddress.state,
        street: savedAddress.street,
        zipCode: savedAddress.zipCode
      }
    });

  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update address' },
      { status: 500 }
    );
  }
}
//api/users/:userId/addresses/:addressId

// DELETE method for removing addresses

// http://localhost:3000/api/users/688619cd5deae295d9a43f49/addresses/68b0666bbda51f431e1439fa
// export async function DELETE(
//   request: NextRequest,
//   context: { params: { userId: string; addressId: string } }
// ) {
//   try {
//     const { userId, addressId } = await Promise.resolve(context.params);
// console.log("userId",userId)
// console.log("addressId",addressId)
//     if (!ObjectId.isValid(userId) || !ObjectId.isValid(addressId)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid ID' },
//         { status: 400 }
//       );
//     }

//     await connectDB();

//     // First check if the user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // Check if the address exists and find its index
//     const addressIndex = user.addresses.findIndex((addr: { _id: any }) => 
//       addr._id.toString() === addressId || 
//       (addr._id instanceof ObjectId && addr._id.equals(new ObjectId(addressId)))
//     );
    
//     if (addressIndex === -1) {
//       return NextResponse.json(
//         { success: false, message: 'Address not found' },
//         { status: 404 }
//       );
//     }

//     // Remove the address by index to ensure we're removing the correct one
//     const result = await User.findByIdAndUpdate(
//       userId,
//       { $pull: { addresses: { _id: user.addresses[addressIndex]._id } } },
//       { new: true }
//     );

//     return NextResponse.json({
//       success: true,
//       message: 'Address deleted successfully'
//     });

//   } catch (error) {
//     console.error('Error deleting address:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to delete address' },
//       { status: 500 }
//     );
//   }
// }

export async function GET() {
  return NextResponse.json({ message: "Route found" });
}