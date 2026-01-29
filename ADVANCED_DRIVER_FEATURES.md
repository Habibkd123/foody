# 🚀 Advanced Driver Features - Implementation Guide

## Overview

This document outlines the implementation of 5 advanced features for the driver system:

1. 📸 **Document Upload** (License, Aadhar, RC photos)
2. 📧 **Email/SMS Notifications**
3. 📍 **GPS Tracking Integration**
4. 📊 **Driver Analytics Dashboard**
5. ⭐ **Rating & Review System**

---

## 1. 📸 Document Upload System

### **Status:** ✅ Component Created

### **Files Created:**
- `components/DocumentUpload.tsx` - Reusable upload component

### **Integration Required:**

#### **A. Update Driver Registration Form**

Add document upload step between Step 2 (Vehicle) and Step 3 (Address):

```typescript
// Add to formData state
documents: {
  licenseFront: '',
  licenseBack: '',
  aadharFront: '',
  aadharBack: '',
  vehicleRC: '',
  photo: ''
}
```

#### **B. Cloudinary Setup**

1. **Sign up for Cloudinary:**
   - Visit: https://cloudinary.com
   - Create free account
   - Get Cloud Name, API Key, API Secret

2. **Add to `.env.local`:**
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Create Upload Preset:**
   - Go to Settings → Upload
   - Create unsigned preset: `driver_documents`
   - Set folder: `drivers/`

#### **C. Usage Example:**

```tsx
import DocumentUpload from '@/components/DocumentUpload';

<DocumentUpload
  label="Driving License (Front)"
  name="licenseFront"
  required
  onUpload={(file, url) => {
    setFormData(prev => ({
      ...prev,
      documents: { ...prev.documents, licenseFront: url }
    }));
  }}
  value={formData.documents.licenseFront}
/>
```

### **Alternative: Local Storage**

If you don't want to use Cloudinary:

```typescript
// Use Next.js API route for local upload
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData,
});

const { url } = await response.json();
```

---

## 2. 📧 Email/SMS Notifications

### **Email Notifications (Using Resend)**

#### **A. Install Resend:**

```bash
npm install resend
```

#### **B. Setup:**

1. **Get API Key:**
   - Visit: https://resend.com
   - Sign up and get API key

2. **Add to `.env.local`:**
   ```env
   RESEND_API_KEY=re_your_api_key
   ```

#### **C. Create Email Service:**

**File:** `lib/email.ts`

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendDriverApprovalEmail(
  email: string,
  driverName: string
) {
  try {
    await resend.emails.send({
      from: 'Gro-Delivery <noreply@yourdomain.com>',
      to: email,
      subject: '🎉 Your Driver Application is Approved!',
      html: `
        <h1>Congratulations ${driverName}!</h1>
        <p>Your driver application has been approved.</p>
        <p>You can now login and start delivering:</p>
        <a href="http://localhost:3000/login">Login Now</a>
      `,
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
}

export async function sendDriverRejectionEmail(
  email: string,
  driverName: string,
  reason: string
) {
  try {
    await resend.emails.send({
      from: 'Gro-Delivery <noreply@yourdomain.com>',
      to: email,
      subject: 'Driver Application Update',
      html: `
        <h1>Hello ${driverName},</h1>
        <p>Unfortunately, your driver application was not approved.</p>
        <p>Reason: ${reason}</p>
        <p>You can reapply after addressing the issues.</p>
      `,
    });
  } catch (error) {
    console.error('Email send failed:', error);
  }
}
```

#### **D. Update Approval API:**

```typescript
// In app/api/drivers/[id]/approve/route.ts
import { sendDriverApprovalEmail } from '@/lib/email';

// After approving driver
await sendDriverApprovalEmail(
  driver.email,
  `${driver.firstName} ${driver.lastName}`
);
```

### **SMS Notifications (Using Twilio)**

#### **A. Install Twilio:**

```bash
npm install twilio
```

#### **B. Setup:**

1. **Get Credentials:**
   - Visit: https://twilio.com
   - Get Account SID, Auth Token, Phone Number

2. **Add to `.env.local`:**
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

#### **C. Create SMS Service:**

**File:** `lib/sms.ts`

```typescript
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendDriverApprovalSMS(
  phone: string,
  driverName: string
) {
  try {
    await client.messages.create({
      body: `Hi ${driverName}! Your Gro-Delivery driver application is approved. Login now: http://localhost:3000/login`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`, // Add country code
    });
  } catch (error) {
    console.error('SMS send failed:', error);
  }
}
```

---

## 3. 📍 GPS Tracking Integration

### **Real-time Location Tracking**

#### **A. Frontend - Get Driver Location:**

**File:** `hooks/useGeolocation.ts`

```typescript
import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        setError(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { location, error };
}
```

#### **B. Driver Dashboard - Send Location:**

```typescript
'use client';

import { useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useUserStore } from '@/lib/store/useUserStore';

export default function DriverDashboard() {
  const { location } = useGeolocation();
  const { user } = useUserStore();

  useEffect(() => {
    if (location && user?._id) {
      // Send location every 30 seconds
      const interval = setInterval(async () => {
        await fetch(`/api/drivers/${user._id}/location`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(location),
        });
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [location, user]);

  return (
    <div>
      <h1>Driver Dashboard</h1>
      {location && (
        <p>
          Current Location: {location.latitude}, {location.longitude}
        </p>
      )}
    </div>
  );
}
```

#### **C. API - Update Location:**

**File:** `app/api/drivers/[id]/location/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { latitude, longitude } = await request.json();
    const { id } = params;

    await User.findByIdAndUpdate(id, {
      $set: {
        'driverDetails.currentLocation': {
          latitude,
          longitude,
          updatedAt: new Date(),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
```

#### **D. Display on Map (Google Maps):**

```bash
npm install @react-google-maps/api
```

```typescript
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

export function DriverMap({ latitude, longitude }: { latitude: number; longitude: number }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      center={{ lat: latitude, lng: longitude }}
      zoom={15}
      mapContainerStyle={{ width: '100%', height: '400px' }}
    >
      <Marker position={{ lat: latitude, lng: longitude }} />
    </GoogleMap>
  );
}
```

---

## 4. 📊 Driver Analytics Dashboard

### **Create Analytics Page:**

**File:** `app/(admin)/admin/drivers/analytics/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Package, Star } from 'lucide-react';

export default function DriverAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/drivers/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data));
  }, []);

  if (!analytics) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Driver Analytics</h1>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Drivers</CardTitle>
            <TrendingUp className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalDrivers}</div>
            <p className="text-xs text-gray-500">
              +{analytics.newDriversThisMonth} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Drivers</CardTitle>
            <Package className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeDrivers}</div>
            <p className="text-xs text-gray-500">Currently delivering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{analytics.totalEarnings}</div>
            <p className="text-xs text-gray-500">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.avgRating}</div>
            <p className="text-xs text-gray-500">Out of 5</p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Drivers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.topDrivers?.map((driver: any, index: number) => (
              <div key={driver._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{driver.name}</p>
                    <p className="text-sm text-gray-500">
                      {driver.stats.completedDeliveries} deliveries
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{driver.earnings.total}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    {driver.stats.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

### **Analytics API:**

**File:** `app/api/drivers/analytics/route.ts`

```typescript
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';

export async function GET() {
  try {
    await connectDB();

    const drivers = await User.find({ role: 'driver' });

    const analytics = {
      totalDrivers: drivers.length,
      activeDrivers: drivers.filter(d => d.driverDetails?.isAvailable).length,
      newDriversThisMonth: drivers.filter(d => {
        const createdDate = new Date(d.createdAt);
        const now = new Date();
        return createdDate.getMonth() === now.getMonth();
      }).length,
      totalEarnings: drivers.reduce((sum, d) => sum + (d.driverDetails?.earnings?.total || 0), 0),
      avgRating: (drivers.reduce((sum, d) => sum + (d.driverDetails?.stats?.rating || 0), 0) / drivers.length).toFixed(1),
      topDrivers: drivers
        .sort((a, b) => (b.driverDetails?.earnings?.total || 0) - (a.driverDetails?.earnings?.total || 0))
        .slice(0, 5)
        .map(d => ({
          _id: d._id,
          name: `${d.firstName} ${d.lastName}`,
          stats: d.driverDetails?.stats,
          earnings: d.driverDetails?.earnings,
        })),
    };

    return NextResponse.json(analytics);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
```

---

## 5. ⭐ Rating & Review System

### **A. Add Review Model:**

**File:** `app/models/DriverReview.ts`

```typescript
import mongoose, { Schema, model } from 'mongoose';

const DriverReviewSchema = new Schema({
  driver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    enum: ['friendly', 'fast', 'careful', 'professional', 'polite'],
  }],
}, { timestamps: true });

export default mongoose.models.DriverReview || model('DriverReview', DriverReviewSchema);
```

### **B. Submit Review API:**

**File:** `app/api/drivers/[id]/review/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import DriverReview from '@/app/models/DriverReview';
import User from '@/app/models/User';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { orderId, customerId, rating, comment, tags } = await request.json();
    const driverId = params.id;

    // Create review
    const review = await DriverReview.create({
      driver: driverId,
      order: orderId,
      customer: customerId,
      rating,
      comment,
      tags,
    });

    // Update driver's average rating
    const allReviews = await DriverReview.find({ driver: driverId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(driverId, {
      $set: {
        'driverDetails.stats.rating': avgRating.toFixed(1),
        'driverDetails.stats.reviews': allReviews.length,
      },
    });

    return NextResponse.json({ success: true, data: review });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
```

### **C. Review Component:**

```typescript
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DriverReviewForm({ driverId, orderId }: { driverId: string; orderId: string }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = async () => {
    await fetch(`/api/drivers/${driverId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        customerId: 'current_user_id',
        rating,
        comment,
        tags,
      }),
    });
    alert('Review submitted!');
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold mb-2">Rate your delivery experience:</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-8 h-8 cursor-pointer ${
                star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
              }`}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-2">Comment (optional):</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Share your experience..."
        />
      </div>

      <div>
        <p className="font-semibold mb-2">Tags:</p>
        <div className="flex flex-wrap gap-2">
          {['friendly', 'fast', 'careful', 'professional', 'polite'].map((tag) => (
            <button
              key={tag}
              onClick={() => {
                setTags(prev =>
                  prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
                );
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                tags.includes(tag)
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} className="w-full">
        Submit Review
      </Button>
    </div>
  );
}
```

---

## 📋 Implementation Checklist

### **Phase 1: Document Upload**
- [ ] Setup Cloudinary account
- [ ] Add environment variables
- [ ] Create upload preset
- [ ] Add document step to registration form
- [ ] Update API to store document URLs
- [ ] Display documents in admin approval page

### **Phase 2: Notifications**
- [ ] Setup Resend for emails
- [ ] Setup Twilio for SMS
- [ ] Create email templates
- [ ] Add notification calls to approval/rejection APIs
- [ ] Test email delivery
- [ ] Test SMS delivery

### **Phase 3: GPS Tracking**
- [ ] Create useGeolocation hook
- [ ] Add location tracking to driver dashboard
- [ ] Create location update API
- [ ] Setup Google Maps
- [ ] Display driver location on map
- [ ] Add real-time updates

### **Phase 4: Analytics**
- [ ] Create analytics API
- [ ] Build analytics dashboard
- [ ] Add charts (optional: recharts library)
- [ ] Display top performers
- [ ] Add filters (date range, etc.)

### **Phase 5: Reviews**
- [ ] Create DriverReview model
- [ ] Create review submission API
- [ ] Build review form component
- [ ] Display reviews on driver profile
- [ ] Update driver rating automatically
- [ ] Add review moderation (optional)

---

## 🔧 Environment Variables Required

```env
# Cloudinary (Document Upload)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend (Email)
RESEND_API_KEY=re_your_api_key

# Twilio (SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Google Maps (GPS)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

---

## 📦 NPM Packages to Install

```bash
npm install resend twilio @react-google-maps/api
```

---

## 🎯 Priority Order

1. **Document Upload** - Essential for verification
2. **Email Notifications** - Better UX
3. **GPS Tracking** - Core delivery feature
4. **Analytics Dashboard** - Business insights
5. **Rating System** - Quality control

---

**Yeh complete implementation guide hai! Batao kaunsa feature pehle implement karna hai?** 🚀
