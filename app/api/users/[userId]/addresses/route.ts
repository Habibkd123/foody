// import { NextResponse } from 'next/server';
// import { connectToDatabase } from '@/middleware/mongodb';
// import { ObjectId } from 'mongodb';

// export async function POST(
//   request: Request,
//   { params }: { params: { userId: string } }
// ) {
//   try {
//     const { userId } = params;
//     const addressData = await request.json();

//     // Validate userId
//     if (!ObjectId.isValid(userId)) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid user ID' },
//         { status: 400 }
//       );
//     }

//     // Validate required fields
//     const requiredFields = ['label', 'address', 'area', 'name', 'phone'];
//     const missingFields = requiredFields.filter(field => !addressData[field]);
    
//     if (missingFields.length > 0) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           message: `Missing required fields: ${missingFields.join(', ')}` 
//         },
//         { status: 400 }
//       );
//     }

//     const { db } = await connectToDatabase();
    
//     // Create address document
//     const address = {
//       ...addressData,
//       userId: new ObjectId(userId),
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       isDefault: addressData.isDefault || false
//     };

//     // If this is set as default, update other addresses to not be default
//     if (address.isDefault) {
//       await db.collection('addresses').updateMany(
//         { userId: new ObjectId(userId), isDefault: true },
//         { $set: { isDefault: false, updatedAt: new Date() } }
//       );
//     }

//     // Insert the new address
//     const result = await db.collection('addresses').insertOne(address);

//     // Get the inserted address with its _id
//     const insertedAddress = await db.collection('addresses').findOne({
//       _id: result.insertedId
//     });

//     return NextResponse.json({
//       success: true,
//       message: 'Address added successfully',
//       address: {
//         ...insertedAddress,
//         _id: insertedAddress?._id.toString(),
//         userId: insertedAddress?.userId.toString()
//       }
//     });
//   } catch (error) {
//     console.error('Error adding address:', error);
//     return NextResponse.json(
//       { success: false, message: 'Failed to add address' },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse ,NextRequest} from 'next/server';
import connectDB from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import User from '@/app/models/User';

export async function POST(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const addressData = await request.json();
    
    console.log('Received address data:', addressData);

    await connectDB();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // If this is set as default, unset other defaults first
    if (addressData?.isDefault) {
      user.addresses.forEach((addr: any) => {
        addr.isDefault = false;
      });
    }

    // Create new address object with ALL fields
    const newAddress = {
      address: addressData.address || '',
      area: addressData.area || '',
      city: addressData.city || '',
      flatNumber: addressData.flatNumber || '',
      floor: addressData.floor || '',
      isDefault: Boolean(addressData.isDefault),
      label: addressData.label || 'Home',
      landmark: addressData.landmark || '',
      lat: addressData.lat ? Number(addressData.lat) : null,
      lng: addressData.lng ? Number(addressData.lng) : null,
      name: addressData.name || '',
      phone: addressData.phone ? Number(addressData.phone) : 0,
      state: addressData.state || '',
      street: addressData.street || '',
      zipCode: addressData.zipCode || ''
    };

    console.log('Prepared new address:', newAddress);

    // Add to addresses array
    user.addresses.push(newAddress);
    
    // Save the user
    const savedUser = await user.save();
    
    // Get the newly added address (last one in the array)
    const addedAddress = savedUser.addresses[savedUser.addresses.length - 1];
    
    console.log('Saved address:', addedAddress);

    // Return complete address object
    return NextResponse.json({
      success: true,
      message: 'Address added successfully',
      address: {
        _id: addedAddress._id,
        address: addedAddress.address,
        area: addedAddress.area,
        city: addedAddress.city,
        flatNumber: addedAddress.flatNumber,
        floor: addedAddress.floor,
        isDefault: addedAddress.isDefault,
        label: addedAddress.label,
        landmark: addedAddress.landmark,
        lat: addedAddress.lat,
        lng: addedAddress.lng,
        name: addedAddress.name,
        phone: addedAddress.phone,
        state: addedAddress.state,
        street: addedAddress.street,
        zipCode: addedAddress.zipCode
      }
    });

  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add address', error: error },
      { status: 500 }
    );
  }
}

// GET method to fetch all addresses
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;

    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId).select('addresses');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return all address fields
    const addresses = user.addresses.map((addr: any) => ({
      _id: addr._id,
      address: addr.address || '',
      area: addr.area || '',
      city: addr.city || '',
      flatNumber: addr.flatNumber || '',
      floor: addr.floor || '',
      isDefault: addr.isDefault || false,
      label: addr.label || 'Home',
      landmark: addr.landmark || '',
      lat: addr.lat,
      lng: addr.lng,
      name: addr.name || '',
      phone: addr.phone || 0,
      state: addr.state || '',
      street: addr.street || '',
      zipCode: addr.zipCode || ''
    }));

    return NextResponse.json({
      success: true,
      addresses: addresses
    });

  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch addresses' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const addressData = await request.json();
    let addressId = addressData._id;
    // Validate IDs
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid user ID' },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(addressId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid address ID' },
        { status: 400 }
      );
    }

    // Required fields validation
    const requiredFields = ['label', 'city', 'state', 'name'];
    const missingFields = requiredFields.filter(field => !addressData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, message: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

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
console.log("addressData",addressIndex);
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
console.log("result",result);
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
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;
    const { addressId } = await request.json();
    
    console.log("userId", userId);
    console.log("addressId", addressId);
    
    if (!ObjectId.isValid(userId) || !ObjectId.isValid(addressId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid ID' },
        { status: 400 }
      );
    }

    await connectDB();

    // First check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the address exists and find its index
    const addressIndex = user.addresses.findIndex((addr: { _id: any }) => 
      addr._id.toString() === addressId || 
      (addr._id instanceof ObjectId && addr._id.equals(new ObjectId(addressId)))
    );
    
    if (addressIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Address not found' },
        { status: 404 }
      );
    }

    // Remove the address by index to ensure we're removing the correct one
    const result = await User.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: user.addresses[addressIndex]._id } } },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete address' },
      { status: 500 }
    );
  }
}
// export async function DELETE(request: Request, { params }: { params: { userId: string, addressId: string } }) {
//   try {
//     const { userId, addressId } = await Promise.resolve(params);
//     if (!ObjectId.isValid(userId)) {
//       return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
//     }

//     if (!ObjectId.isValid(addressId)) {
//       return NextResponse.json({ success: false, message: 'Invalid address ID' }, { status: 400 });
//     }

//    await connectDB();

//     const result = await User.updateOne(
//       { _id: new ObjectId(userId) },
//       { $pull: { addresses: { _id: new ObjectId(addressId) } } }
//     );

//     if (result.modifiedCount === 0) {
//       return NextResponse.json({ success: false, message: 'Address not deleted or user not found' }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, message: 'Address deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting address:', error);
//     return NextResponse.json({ success: false, message: 'Failed to delete address' }, { status: 500 });
//   }
// }


// PATCH (or PUT): Edit user address by address _id
export async function PATCH(
  request: Request,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await context.params;

    const updateData = await request.json();

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(updateData.addressId)) {
      return NextResponse.json({ success: false, message: "Invalid user or address ID" }, { status: 400 });
    }

    // Build the update fields, including updatedAt
    updateData.updatedAt = new Date();

   await connectDB();

    // Update the embedded address in addresses array
    const result = await User.updateOne(
      {
        _id: new ObjectId(userId),
        "addresses._id": new ObjectId(updateData.addressId)
      },
      {
        $set: Object.fromEntries(Object.entries(updateData).map(([key, value]) => [`addresses.$.${key}`, value]))
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, message: 'Address not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Address updated successfully' });
  } catch (error) {
    console.error('Error editing address:', error);
    return NextResponse.json({ success: false, message: 'Failed to update address' }, { status: 500 });
  }
}


// GET: Get all addresses for a user
// export async function GET(
//   request: Request,
//   { params }: { params: { userId: string } }
// ) {
//   try {
//     const { userId } = await Promise.resolve(params);
// console.log("gettttt",userId);
//     // if (!ObjectId.isValid(userId)) {
//     //   return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
//     // }

//     await connectDB();
//     // Query user by _id and select only addresses
//     const user = await User.findById(userId,
//     );
// console.log("user",user);
//     if (!user) {
//       return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
//     }

//     return NextResponse.json({
//       success: true,
//       addresses: user.addresses || []
//     });
//   } catch (error) {
//     console.error('Error fetching addresses:', error);
//     return NextResponse.json({ success: false, message: 'Failed to get addresses' }, { status: 500 });
//   }
// }