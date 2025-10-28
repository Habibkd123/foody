import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/app/models/Notification';

// POST - Track notification views and clicks
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { notificationId, action } = body;

    if (!notificationId || !action) {
      return NextResponse.json({ 
        success: false, 
        error: 'Notification ID and action are required' 
      }, { status: 400 });
    }

    const updateField = action === 'view' ? 'viewCount' : 'clickCount';
    
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { $inc: { [updateField]: 1 } },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ 
        success: false, 
        error: 'Notification not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `${action} tracked successfully` 
    });
  } catch (error: any) {
    console.error('Error tracking notification stats:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}
