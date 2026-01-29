import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();

        const {
            firstName,
            lastName,
            email,
            phone,
            password,
            vehicleType,
            vehicleNumber,
            licenseNumber,
            address,
            city,
            pincode,
            accountNumber,
            ifscCode,
            accountHolderName,
            emergencyName,
            emergencyPhone,
            documents,
        } = body;

        // Validate required fields
        if (!firstName || !lastName || !email || !phone || !password) {
            return NextResponse.json({
                success: false,
                message: 'Missing required personal details',
            }, { status: 400 });
        }

        if (!vehicleType || !vehicleNumber || !licenseNumber) {
            return NextResponse.json({
                success: false,
                message: 'Missing required vehicle details',
            }, { status: 400 });
        }

        if (!documents || !documents.licenseFront || !documents.aadharFront || !documents.photo) {
            return NextResponse.json({
                success: false,
                message: 'Missing required documents',
            }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: 'User with this email or phone already exists',
            }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create driver user
        const driver = await User.create({
            firstName,
            lastName,
            name: `${firstName} ${lastName}`,
            email,
            phone,
            password: hashedPassword,
            role: 'driver',
            driverDetails: {
                vehicleType,
                vehicleNumber,
                licenseNumber,
                documents,
                address: {
                    street: address,
                    city,
                    pincode,
                },
                bankDetails: {
                    accountNumber,
                    ifscCode,
                    accountHolderName,
                },
                emergencyContact: {
                    name: emergencyName,
                    phone: emergencyPhone,
                },
                status: 'pending', // pending, approved, rejected
                isVerified: false,
                isAvailable: false,
                earnings: {
                    today: 0,
                    thisWeek: 0,
                    thisMonth: 0,
                    total: 0,
                },
                stats: {
                    totalDeliveries: 0,
                    completedDeliveries: 0,
                    cancelledDeliveries: 0,
                    rating: 5,
                    reviews: 0,
                },
            },
        });

        // Remove password from response
        const driverResponse = driver.toObject();
        delete driverResponse.password;

        return NextResponse.json({
            success: true,
            message: 'Driver registration successful. Wait for admin approval.',
            data: driverResponse,
        }, { status: 201 });

    } catch (error: any) {
        console.error('Driver registration error:', error);
        return NextResponse.json({
            success: false,
            message: error.message || 'Registration failed',
        }, { status: 500 });
    }
}
