import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Notification from '@/app/models/Notification';

// Simple in-memory rate limiter per IP
const RATE_LIMIT_WINDOW_MS = 60_000; // 60 seconds
const RATE_LIMIT_MAX = 60; // max events per window
type Bucket = { count: number; windowStart: number };
const buckets = new Map<string, Bucket>();

function getClientKey(req: NextRequest) {
  const xf = req.headers.get('x-forwarded-for') || '';
  const ip = (xf.split(',')[0] || req.headers.get('x-real-ip') || 'unknown').toString();
  return `ip:${ip}`;
}

function isRateLimited(req: NextRequest) {
  const key = getClientKey(req);
  const now = Date.now();
  const bucket = buckets.get(key) || { count: 0, windowStart: now };
  if (now - bucket.windowStart > RATE_LIMIT_WINDOW_MS) {
    bucket.count = 0;
    bucket.windowStart = now;
  }
  bucket.count += 1;
  buckets.set(key, bucket);
  return bucket.count > RATE_LIMIT_MAX;
}

// POST - Track notification views and clicks
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    if (isRateLimited(request)) {
      return NextResponse.json({ success: false, error: 'Rate limit exceeded' }, { status: 429 });
    }
    
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
