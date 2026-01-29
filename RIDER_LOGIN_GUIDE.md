# 🚗 Rider/Delivery Boy Login Guide (हिंदी + English)

## 📱 Rider Kaise Login Karega? / How Will Rider Login?

---

## 🎯 Method 1: Existing Login System (Current)

### **Step-by-Step Process:**

#### **1️⃣ Registration (पहली बार के लिए)**

```
1. Website खोलें: http://localhost:3000/login
2. "Sign Up" पर क्लिक करें
3. Role select करें: "Driver/Rider" (अगर option है)
4. Details भरें:
   - First Name
   - Last Name
   - Email या Phone Number
   - Password
5. OTP verify करें
6. Submit करें
```

#### **2️⃣ Login (अगली बार के लिए)**

```
1. Website खोलें: http://localhost:3000/login
2. Email/Phone और Password डालें
3. Login करें
4. Automatically redirect होगा: /driver dashboard पर
```

---

## 🔧 Current Implementation Status

### **✅ Already Working:**
- Role-based authentication system
- Middleware automatically redirects drivers to `/driver`
- User store supports `role: 'driver'`
- Driver dashboard exists at `/driver`

### **⚠️ What Needs to Be Added:**
- Explicit "Driver/Rider" option in signup form
- Driver-specific registration fields
- Driver profile management

---

## 🛠️ Enhanced Driver Registration (Recommended)

### **Driver Registration Form Should Include:**

```typescript
// Driver-specific fields
{
  // Basic Info
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  
  // Driver-specific
  role: 'driver',
  vehicleType: 'bike' | 'scooter' | 'car',
  vehicleNumber: string,
  licenseNumber: string,
  aadharNumber: string,
  panNumber: string,
  
  // Documents
  licenseFront: File,
  licenseBack: File,
  aadharFront: File,
  aadharBack: File,
  vehicleRC: File,
  photo: File,
  
  // Bank Details
  accountNumber: string,
  ifscCode: string,
  accountHolderName: string,
  
  // Address
  address: string,
  city: string,
  pincode: string,
  
  // Emergency Contact
  emergencyName: string,
  emergencyPhone: string,
}
```

---

## 📋 Implementation Plan

### **Option A: Simple (Quick Setup)**

**Use existing auth system with role selection:**

1. Login page पर जाएं
2. Signup करें
3. Backend में manually role को 'driver' set करें
4. Login करें → Auto redirect to `/driver`

### **Option B: Complete (Recommended)**

**Create dedicated driver registration:**

1. `/register/driver` - Dedicated driver signup page
2. Driver-specific form with all required fields
3. Document upload functionality
4. Admin approval workflow
5. Driver dashboard access after approval

---

## 🎨 UI Flow for Driver Registration

```
┌─────────────────────────────────────────┐
│         Landing Page                     │
│  ┌────────────────────────────────────┐ │
│  │  "Become a Delivery Partner"       │ │
│  │  [Register as Driver] Button       │ │
│  └────────────────────────────────────┘ │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│    Driver Registration Form              │
│  ┌────────────────────────────────────┐ │
│  │  Step 1: Personal Details          │ │
│  │  - Name, Email, Phone              │ │
│  │  - Password                        │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Step 2: Vehicle Details           │ │
│  │  - Vehicle Type                    │ │
│  │  - Vehicle Number                  │ │
│  │  - License Number                  │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Step 3: Documents Upload          │ │
│  │  - License (Front/Back)            │ │
│  │  - Aadhar Card                     │ │
│  │  - Vehicle RC                      │ │
│  │  - Photo                           │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Step 4: Bank Details              │ │
│  │  - Account Number                  │ │
│  │  - IFSC Code                       │ │
│  └────────────────────────────────────┘ │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│    Verification Pending                  │
│  "Your application is under review"     │
│  "We'll notify you within 24-48 hours"  │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│    Admin Approval                        │
│  Admin reviews documents                 │
│  Approves/Rejects application            │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│    Driver Login Enabled                  │
│  Email/SMS notification sent             │
│  Driver can now login                    │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│    Driver Dashboard (/driver)            │
│  - Accept orders                         │
│  - GPS tracking                          │
│  - Earnings                              │
└─────────────────────────────────────────┘
```

---

## 💻 Code Implementation

### **1. Create Driver Registration Page**

**File:** `app/(auth)/register/driver/page.tsx`

```tsx
"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DriverRegistration() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    
    // Vehicle
    vehicleType: 'bike',
    vehicleNumber: '',
    licenseNumber: '',
    
    // Documents (files)
    licenseFront: null,
    licenseBack: null,
    aadharFront: null,
    vehicleRC: null,
    photo: null,
    
    // Bank
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    
    // Address
    address: '',
    city: '',
    pincode: '',
  });

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      
      // Add all text fields
      Object.keys(formData).forEach(key => {
        if (formData[key] && typeof formData[key] !== 'object') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add files
      if (formData.licenseFront) formDataToSend.append('licenseFront', formData.licenseFront);
      if (formData.licenseBack) formDataToSend.append('licenseBack', formData.licenseBack);
      // ... other files
      
      formDataToSend.append('role', 'driver');
      
      const response = await fetch('/api/drivers/register', {
        method: 'POST',
        body: formDataToSend,
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Registration successful! Wait for admin approval.');
        router.push('/login');
      }
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">
          Delivery Partner Registration
        </h1>
        
        {/* Multi-step form */}
        {step === 1 && (
          <PersonalDetailsStep 
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(2)}
          />
        )}
        
        {step === 2 && (
          <VehicleDetailsStep 
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        
        {step === 3 && (
          <DocumentsUploadStep 
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        
        {step === 4 && (
          <BankDetailsStep 
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
}
```

### **2. Create Driver Registration API**

**File:** `app/api/drivers/register/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    
    // Extract text fields
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const vehicleType = formData.get('vehicleType') as string;
    const vehicleNumber = formData.get('vehicleNumber') as string;
    const licenseNumber = formData.get('licenseNumber') as string;
    // ... other fields
    
    // Extract files
    const licenseFront = formData.get('licenseFront') as File;
    const licenseBack = formData.get('licenseBack') as File;
    // ... other files
    
    // Upload files to cloud storage (Cloudinary, AWS S3, etc.)
    // const licenseFrontUrl = await uploadToCloud(licenseFront);
    // const licenseBackUrl = await uploadToCloud(licenseBack);
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create driver user
    const driver = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: 'driver',
      driverDetails: {
        vehicleType,
        vehicleNumber,
        licenseNumber,
        documents: {
          licenseFront: 'url_here', // licenseFrontUrl
          licenseBack: 'url_here',  // licenseBackUrl
          // ... other documents
        },
        bankDetails: {
          accountNumber: formData.get('accountNumber'),
          ifscCode: formData.get('ifscCode'),
          accountHolderName: formData.get('accountHolderName'),
        },
        status: 'pending', // pending, approved, rejected
        isVerified: false,
      },
    });
    
    return NextResponse.json({
      success: true,
      message: 'Driver registration successful. Wait for approval.',
      data: driver,
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: error.message || 'Registration failed',
    }, { status: 500 });
  }
}
```

### **3. Update User Model for Driver**

**File:** `models/User.ts` (Add to existing model)

```typescript
// Add to User schema
driverDetails: {
  vehicleType: {
    type: String,
    enum: ['bike', 'scooter', 'car'],
  },
  vehicleNumber: String,
  licenseNumber: String,
  aadharNumber: String,
  documents: {
    licenseFront: String,
    licenseBack: String,
    aadharFront: String,
    aadharBack: String,
    vehicleRC: String,
    photo: String,
  },
  bankDetails: {
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String,
  },
  address: {
    street: String,
    city: String,
    pincode: String,
  },
  emergencyContact: {
    name: String,
    phone: String,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAvailable: {
    type: Boolean,
    default: false,
  },
  currentLocation: {
    latitude: Number,
    longitude: Number,
  },
  earnings: {
    today: { type: Number, default: 0 },
    thisWeek: { type: Number, default: 0 },
    thisMonth: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  stats: {
    totalDeliveries: { type: Number, default: 0 },
    completedDeliveries: { type: Number, default: 0 },
    cancelledDeliveries: { type: Number, default: 0 },
    rating: { type: Number, default: 5 },
    reviews: { type: Number, default: 0 },
  },
},
```

---

## 🔑 Quick Setup (For Testing)

### **Abhi ke liye (Current Setup):**

1. **Database में manually driver create करें:**

```javascript
// MongoDB shell या Compass में
db.users.insertOne({
  firstName: "Rahul",
  lastName: "Kumar",
  email: "rider@example.com",
  phone: "9876543210",
  password: "$2a$10$hashedpassword", // Use bcrypt to hash
  role: "driver",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

2. **Login करें:**
```
Email: rider@example.com
Password: your_password
```

3. **Automatically redirect होगा `/driver` पर**

---

## 📱 Mobile App Integration (Future)

```
┌─────────────────────────────────────────┐
│     Rider Mobile App                     │
│  ┌────────────────────────────────────┐ │
│  │  Login Screen                      │ │
│  │  - Phone Number                    │ │
│  │  - OTP Verification                │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │  Dashboard                         │ │
│  │  - Available Orders                │ │
│  │  - Accept/Reject                   │ │
│  │  - GPS Navigation                  │ │
│  │  - Earnings                        │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## ✅ Summary / सारांश

### **Current Status (अभी की स्थिति):**
✅ Driver role middleware में add है  
✅ `/driver` dashboard exist करता है  
✅ Login system काम कर रहा है  
✅ Auto-redirect working है  

### **What's Needed (क्या चाहिए):**
⚠️ Driver registration form  
⚠️ Document upload functionality  
⚠️ Admin approval system  
⚠️ Driver profile management  

### **Quick Solution (तुरंत के लिए):**
1. Database में manually driver user बनाएं
2. Email/password से login करें
3. Auto-redirect होगा `/driver` पर

### **Proper Solution (सही तरीका):**
1. Dedicated driver registration page बनाएं
2. Document upload add करें
3. Admin approval workflow implement करें
4. Driver dashboard enhance करें

---

**Need help implementing? Let me know which approach you want to follow!** 🚀
