import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/app/models/Notification';

// GET - Fetch active notifications for users
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location') || 'home';
    const isAdmin = searchParams.get('admin') === 'true';

    if (isAdmin) {
      // Admin: Get all notifications
      const notifications = await Notification.find()
        .sort({ createdAt: -1 });
      
      return NextResponse.json({ 
        success: true, 
        data: notifications,
        count: notifications.length 
      });
    } else {
      // Users: Get only active notifications
      const now = new Date();
      
      const notifications = await Notification.find({
        status: 'active',
        displayLocation: location,
        $or: [
          { startDate: { $lte: now }, endDate: { $gte: now } },
          { startDate: { $exists: false }, endDate: { $exists: false } }
        ]
      })
      .sort({ priority: -1, createdAt: -1 })
      .limit(10);

      return NextResponse.json({ 
        success: true, 
        data: notifications,
        count: notifications.length 
      });
    }
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// POST - Create new notification (Admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      title, 
      message, 
      type, 
      status, 
      priority,
      icon,
      link,
      linkText,
      startDate,
      endDate,
      scheduledDate,
      targetAudience,
      displayLocation,
      createdBy 
    } = body;

    // Validation
    if (!title || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title and message are required' 
      }, { status: 400 });
    }

    // Auto-activate if scheduled date is in the past
    let finalStatus = status;
    if (status === 'scheduled' && scheduledDate) {
      const schedDate = new Date(scheduledDate);
      if (schedDate <= new Date()) {
        finalStatus = 'active';
      }
    }

    const notification = await Notification.create({
      title,
      message,
      type: type || 'info',
      status: finalStatus || 'draft',
      priority: priority || 'medium',
      icon: icon || '🔔',
      link,
      linkText: linkText || 'Learn More',
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      targetAudience: targetAudience || 'all',
      displayLocation: displayLocation || ['home', 'products'],
      createdBy: createdBy || 'admin'
    });

    return NextResponse.json({ 
      success: true, 
      data: notification,
      message: 'Notification created successfully' 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating notification:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// PUT - Update notification (Admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Notification ID is required' 
      }, { status: 400 });
    }

    // Convert date strings to Date objects
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    if (updateData.scheduledDate) updateData.scheduledDate = new Date(updateData.scheduledDate);

    const notification = await Notification.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!notification) {
      return NextResponse.json({ 
        success: false, 
        error: 'Notification not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: notification,
      message: 'Notification updated successfully' 
    });
  } catch (error: any) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE - Delete notification (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Notification ID is required' 
      }, { status: 400 });
    }

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return NextResponse.json({ 
        success: false, 
        error: 'Notification not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Notification deleted successfully' 
    });
  } catch (error: any) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
