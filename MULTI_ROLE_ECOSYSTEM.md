# Multi-Role Ecosystem Documentation

## Overview
Gro-Delivery implements a comprehensive multi-role ecosystem with distinct environments, dashboards, and permissions for **four user types**: Users (Customers), Admins, Restaurants, and Drivers (Riders).

## 🎭 Role Types

### 1. **User (Customer)** - `role: 'user'`
Regular customers who browse products, place orders, and track deliveries.

### 2. **Admin** - `role: 'admin'`
Platform administrators with full system access and management capabilities.

### 3. **Restaurant** - `role: 'restaurant'`
Restaurant owners/managers who manage their menu, inventory, and orders.

### 4. **Driver (Rider)** - `role: 'driver'`
Delivery personnel who accept and fulfill delivery orders.

---

## 📁 Directory Structure

```
app/
├── (userRouting)/          # Customer-facing routes
│   ├── productlist/
│   ├── products/
│   ├── checkout/
│   ├── profile/
│   ├── wishlist/
│   ├── notifications/
│   └── ...
│
├── (admin)/admin/          # Admin dashboard routes
│   ├── products/
│   ├── categories/
│   ├── orders/
│   ├── users/
│   ├── banner/
│   ├── restaurants/
│   ├── notifications/
│   ├── sales/
│   ├── disputes/
│   ├── food-approval/
│   └── settings/
│
├── (restaurant)/restaurant/ # Restaurant dashboard routes
│   ├── food/
│   ├── orders/
│   ├── inventory/
│   ├── analytics/
│   ├── disputes/
│   └── profile/
│
└── driver/                 # Driver/Rider dashboard
    ├── page.tsx
    └── layout.tsx
```

---

## 🔐 Role-Based Access Control

### Middleware Configuration
**File:** `middleware.ts`

```typescript
const roleRoutes: Record<string, string[]> = {
  admin: [
    "/admin",
    "/orders",
  ],
  restaurant: [
    "/restaurant",
  ],
  user: [
    "/",
    "/home",
    "/products",
    "/productlist",
    "/checkout",
    "/profile",
    "/wishlist",
    "/orders",
    "/notifications",
    "/success",
  ],
};
```

### Access Rules

#### **Public Routes** (No Authentication Required)
- `/` - Homepage
- `/login` - Login page
- `/auth` - Authentication
- `/home` - Home page
- `/products` - Product listing
- `/productlist` - Product list
- `/contact` - Contact page
- `/faqs` - FAQs
- `/feedback` - Feedback
- `/unauthorized` - Unauthorized page
- `/not-found` - 404 page
- `/success` - Success page

#### **User Routes** (Requires `role: 'user'`)
- All public routes
- `/checkout` - Checkout process
- `/profile` - User profile
- `/wishlist` - Wishlist
- `/orders` - Order history
- `/notifications` - Notifications
- `/add-address` - Address management
- `/confirm-location` - Location confirmation

#### **Admin Routes** (Requires `role: 'admin'`)
- `/admin/*` - All admin dashboard routes
- `/admin/products` - Product management
- `/admin/categories` - Category management
- `/admin/orders` - Order management
- `/admin/users` - User management
- `/admin/banner` - Banner management
- `/admin/restaurants` - Restaurant approval/management
- `/admin/notifications` - Notification management
- `/admin/sales` - Sales analytics
- `/admin/disputes` - Dispute resolution
- `/admin/food-approval` - Food item approval
- `/admin/settings` - System settings
- `/orders` - Order viewing

#### **Restaurant Routes** (Requires `role: 'restaurant'`)
- `/restaurant/*` - All restaurant dashboard routes
- `/restaurant/food` - Menu management
- `/restaurant/food/add` - Add food items
- `/restaurant/orders` - Restaurant orders
- `/restaurant/inventory` - Inventory management
- `/restaurant/analytics` - Restaurant analytics
- `/restaurant/disputes` - Dispute management
- `/restaurant/profile` - Restaurant profile

#### **Driver Routes** (Requires `role: 'driver'`)
- `/driver` - Driver dashboard
- Real-time order assignment
- GPS tracking
- Delivery status updates

---

## 👤 User Type Definitions

### User Interface
**File:** `lib/store/useUserStore.ts`

```typescript
interface User {
  _id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: 'user' | 'admin' | 'restaurant';
  image?: string;
  phone?: string;
  phoneNumber?: string;
  restaurant?: {
    _id: string;
    isOpen: boolean;
    status: 'pending' | 'approved' | 'rejected' | 'none';
  };
}
```

---

## 🎯 Role-Specific Features

### 1. **User (Customer) Features**

#### **Dashboard/Home**
- Product browsing and search
- Category filtering
- Product details and reviews
- Wishlist management
- Cart management

#### **Shopping Experience**
- Add to cart
- Apply coupons
- Multiple payment methods (Razorpay, Stripe)
- Address management
- Order tracking

#### **Profile Management**
- Personal information
- Order history
- Saved addresses
- Wishlist
- Notifications

#### **Key Components**
- `ProductGrid` - Product listing
- `ProductDetailsClient` - Product details
- `AddCards` - Shopping cart
- `AddressModal` - Address selection
- `UserLayoutClient` - User layout wrapper

---

### 2. **Admin Features**

#### **Dashboard**
**File:** `app/(admin)/admin/page.tsx`

- System overview
- Sales analytics
- User statistics
- Order metrics
- Revenue tracking

#### **Product Management**
- Create/Edit/Delete products
- Category management
- Bulk operations
- Product approval workflow
- Image uploads

#### **Order Management**
- View all orders
- Order status updates
- Assign riders
- Refund processing
- Order analytics

#### **User Management**
- View all users
- User roles
- Account status
- Activity monitoring

#### **Restaurant Management**
- Approve/Reject restaurants
- Monitor restaurant status
- Food item approval
- Restaurant analytics

#### **System Management**
- Banner management
- Notification system
- Settings configuration
- Dispute resolution
- Sales reports

#### **Key Components**
- `admin-dashboard` - Admin overview
- `AdminProducts` - Product management
- `AdminDisputeModal` - Dispute handling

---

### 3. **Restaurant Features**

#### **Dashboard**
**File:** `app/(restaurant)/restaurant/page.tsx`

- Restaurant overview
- Today's orders
- Revenue metrics
- Inventory alerts
- Customer reviews

#### **Menu Management**
- Add/Edit/Delete food items
- Category organization
- Pricing management
- Availability status
- Item descriptions

#### **Order Management**
- Incoming orders
- Order preparation
- Ready for pickup notifications
- Order history
- Customer notes

#### **Inventory Management**
- Stock tracking
- Low stock alerts
- Ingredient management
- Supplier information

#### **Analytics**
- Sales reports
- Popular items
- Peak hours
- Revenue trends
- Customer insights

#### **Profile Management**
- Restaurant information
- Operating hours
- Contact details
- Bank details
- Document uploads

#### **Key Features**
- Real-time order notifications
- Status updates (Open/Closed)
- Dispute management
- Review responses

---

### 4. **Driver (Rider) Features**

#### **Dashboard**
**File:** `app/driver/page.tsx`

- Active deliveries
- Order queue
- GPS tracking
- Earnings tracker

#### **Real-Time Features**
- Socket.IO integration
- Live order assignment
- GPS location tracking
- Status updates

#### **Delivery Management**
```typescript
// Real-time order assignment
socket.on("order-assigned", (order) => {
  // Add to driver's queue
});

// GPS tracking
navigator.geolocation.watchPosition((position) => {
  socket.emit("driver-location", {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    orderId: currentOrder.id
  });
});

// Status updates
socket.emit("status", {
  id: orderId,
  v: "out_for_delivery"
});
```

#### **Key Features**
- Order acceptance/rejection
- Navigation assistance
- Delivery confirmation
- Cash collection
- Earnings tracking

---

## 🔄 Authentication Flow

### Login Process
**File:** `app/(auth)/login/page.tsx`

1. User enters credentials
2. System validates and returns user data with role
3. Token and user info stored in Zustand store
4. Middleware checks role and redirects:
   - `admin` → `/admin`
   - `restaurant` → `/restaurant`
   - `user` → `/products`
   - `driver` → `/driver`

### Role Detection
```typescript
// From cookies
const userRole = request.cookies.get("user-role")?.value;

// From user object
const userCookie = request.cookies.get("user")?.value;
const parsed = JSON.parse(userCookie);
const role = parsed?.role; // 'user' | 'admin' | 'restaurant' | 'driver'
```

---

## 🛡️ Security & Permissions

### Middleware Protection
**File:** `middleware.ts`

```typescript
// Check if user has access to route
if (userRole) {
  const allowedRoutes = roleRoutes[userRole] || [];
  const hasAccess = allowedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (!hasAccess) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }
}
```

### API Route Protection
API routes check user role before processing:

```typescript
// Example: Admin-only API
if (user.role !== 'admin') {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 403 }
  );
}
```

---

## 📊 Role Comparison Matrix

| Feature | User | Admin | Restaurant | Driver |
|---------|------|-------|------------|--------|
| Browse Products | ✅ | ✅ | ✅ | ❌ |
| Place Orders | ✅ | ✅ | ❌ | ❌ |
| Manage Products | ❌ | ✅ | ✅ (Own) | ❌ |
| View All Orders | ❌ | ✅ | ✅ (Own) | ✅ (Assigned) |
| User Management | ❌ | ✅ | ❌ | ❌ |
| Restaurant Approval | ❌ | ✅ | ❌ | ❌ |
| Inventory Management | ❌ | ❌ | ✅ | ❌ |
| Delivery Management | ❌ | ✅ | ❌ | ✅ |
| Analytics | ❌ | ✅ | ✅ (Own) | ✅ (Own) |
| Dispute Resolution | ✅ (Raise) | ✅ (Resolve) | ✅ (Respond) | ❌ |
| Notifications | ✅ | ✅ | ✅ | ✅ |
| Profile Management | ✅ | ✅ | ✅ | ✅ |

---

## 🎨 UI/UX Differences

### User Interface
- **Theme**: Orange/Red gradient (brand colors)
- **Layout**: `UserLayoutClient` with header, cart, wishlist
- **Navigation**: Product categories, search, filters
- **Focus**: Shopping experience, product discovery

### Admin Interface
- **Theme**: Blue/Gray professional theme
- **Layout**: Sidebar navigation with dashboard
- **Navigation**: Management sections, analytics
- **Focus**: System control, data management

### Restaurant Interface
- **Theme**: Green/Blue business theme
- **Layout**: Restaurant-specific sidebar
- **Navigation**: Menu, orders, inventory, analytics
- **Focus**: Restaurant operations, order fulfillment

### Driver Interface
- **Theme**: Simple, mobile-first design
- **Layout**: Minimal, map-focused
- **Navigation**: Order list, map view
- **Focus**: Delivery efficiency, navigation

---

## 🔔 Real-Time Features

### Socket.IO Integration
**File:** `app/driver/page.tsx`

```typescript
const socket = io("/", { path: "/api/socket" });

// Events
socket.on("order-assigned", callback);    // Driver receives order
socket.on("order-status", callback);       // Status updates
socket.emit("driver-location", data);      // GPS updates
socket.emit("status", data);               // Delivery status
```

### Real-Time Updates
- **Users**: Order status, delivery tracking
- **Admins**: System notifications, new orders
- **Restaurants**: Incoming orders, inventory alerts
- **Drivers**: Order assignments, route updates

---

## 📱 Responsive Design

All role interfaces are fully responsive:
- **Mobile**: Optimized for on-the-go access
- **Tablet**: Enhanced layout for medium screens
- **Desktop**: Full-featured dashboard experience

---

## 🚀 Getting Started

### As a User
1. Visit `/login` or `/productlist`
2. Browse products
3. Add to cart
4. Checkout and place order
5. Track delivery

### As an Admin
1. Login with admin credentials
2. Redirected to `/admin`
3. Access all management features
4. Monitor system health

### As a Restaurant
1. Register restaurant account
2. Wait for admin approval
3. Login and access `/restaurant`
4. Set up menu and inventory
5. Start receiving orders

### As a Driver
1. Register as driver
2. Login and access `/driver`
3. Enable GPS tracking
4. Accept delivery assignments
5. Update delivery status

---

## 🔧 Configuration

### Adding a New Role

1. **Update User Interface**
```typescript
// lib/store/useUserStore.ts
interface User {
  role: 'user' | 'admin' | 'restaurant' | 'driver' | 'newrole';
}
```

2. **Add Routes**
```typescript
// middleware.ts
const roleRoutes: Record<string, string[]> = {
  // ... existing roles
  newrole: [
    "/newrole",
    "/newrole/dashboard",
  ],
};
```

3. **Create Route Group**
```
app/(newrole)/newrole/
  ├── page.tsx
  ├── layout.tsx
  └── ...
```

4. **Update Login Redirect**
```typescript
// middleware.ts
const redirectPath =
  userRole === "admin" ? "/admin" :
  userRole === "restaurant" ? "/restaurant" :
  userRole === "driver" ? "/driver" :
  userRole === "newrole" ? "/newrole" :
  "/products";
```

---

## 📊 Database Schema

### User Model
```typescript
{
  _id: ObjectId,
  email: string,
  name: string,
  role: 'user' | 'admin' | 'restaurant' | 'driver',
  password: string (hashed),
  phone: string,
  image: string,
  restaurant: {
    _id: ObjectId,
    isOpen: boolean,
    status: 'pending' | 'approved' | 'rejected'
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✅ Summary

The Gro-Delivery multi-role ecosystem provides:

1. **🎯 Clear Separation**: Distinct interfaces for each role
2. **🔐 Secure Access**: Role-based middleware protection
3. **📱 Responsive**: Works on all devices
4. **⚡ Real-Time**: Socket.IO for live updates
5. **🎨 Branded**: Consistent design language
6. **📊 Analytics**: Role-specific insights
7. **🔔 Notifications**: Real-time alerts
8. **🛡️ Secure**: Protected routes and APIs

Each role has a tailored experience optimized for their specific needs, creating an efficient and user-friendly platform for all stakeholders in the food delivery ecosystem.
