# 🔔 Notification System - Complete Guide

## Overview
A comprehensive notification system that allows admins to create, schedule, and manage notifications displayed to users across the platform.

## ✨ Features

### Admin Features
- **Create Notifications**: Draft, schedule, or publish immediately
- **Rich Content**: Title, message, icon, links, and call-to-action buttons
- **Notification Types**: Info, Success, Warning, Error, Announcement
- **Priority Levels**: Low, Medium, High
- **Status Management**: Draft, Scheduled, Active, Expired
- **Scheduling**: Set start date, end date, and scheduled publish date
- **Target Audience**: All users, New users, Active users, Premium users
- **Display Locations**: Home, Products, Profile, etc.
- **Analytics**: Track views and clicks for each notification
- **Full CRUD**: Create, Read, Update, Delete notifications

### User Features
- **Beautiful Display**: Animated notification banners with icons
- **Dismissible**: Users can dismiss notifications (saved in localStorage)
- **Responsive**: Works on all screen sizes
- **Auto-tracking**: Views and clicks tracked automatically
- **Priority Indicators**: High-priority notifications highlighted
- **Call-to-Action**: Optional links with custom text

## 📁 File Structure

```
d:\foody\
├── app/
│   ├── models/
│   │   └── Notification.ts                    # Mongoose model
│   ├── api/
│   │   └── notifications/
│   │       ├── route.ts                       # Main CRUD API
│   │       └── stats/
│   │           └── route.ts                   # Analytics API
│   └── (admin)/
│       └── admin/
│           └── notifications/
│               └── page.tsx                   # Admin management panel
└── components/
    └── NotificationBanner.tsx                 # User display component
```

## 🚀 Setup Instructions

### 1. Database is Ready
The Notification model is already created with all necessary fields.

### 2. Admin Panel Access
Navigate to: `/admin/notifications`

### 3. User Display
Notifications automatically appear on pages where `<NotificationBanner />` is integrated.

## 📝 How to Use (Admin)

### Creating a Notification

1. **Go to Admin Panel**: `/admin/notifications`
2. **Click "New Notification"**
3. **Fill in the form**:
   - **Title**: Short, catchy title (max 100 chars)
   - **Message**: Detailed message (max 500 chars)
   - **Icon**: Emoji or text icon (e.g., 🎉, 🔥, ⚡)
   - **Type**: Choose visual style
     - Info (blue)
     - Success (green)
     - Warning (yellow)
     - Error (red)
     - Announcement (purple)
   - **Status**:
     - **Draft**: Save without publishing
     - **Scheduled**: Auto-publish on scheduled date
     - **Active**: Publish immediately
     - **Expired**: Hide from users
   - **Priority**:
     - Low: Normal display
     - Medium: Standard priority
     - High: Shows "Important" badge
   - **Link** (optional): URL for call-to-action
   - **Link Text**: Button text (default: "Learn More")
   - **Start Date**: When to start showing
   - **End Date**: When to stop showing
   - **Scheduled Date**: Auto-activate on this date
   - **Target Audience**: Who sees it
   - **Display Location**: Where it appears

4. **Click "Create Notification"**

### Example Notifications

#### 1. Flash Sale Announcement
```
Title: 🔥 Flash Sale - 50% OFF!
Message: Limited time offer! Get 50% off on all groceries. Hurry, sale ends tonight!
Type: Announcement
Status: Active
Priority: High
Icon: 🔥
Link: /products
Link Text: Shop Now
Start Date: Today
End Date: Today + 1 day
```

#### 2. New Feature
```
Title: ✨ New Feature: Quick Checkout
Message: We've added express checkout for faster shopping. Try it now!
Type: Success
Status: Active
Priority: Medium
Icon: ✨
Link: /checkout
Link Text: Try Now
```

#### 3. Maintenance Notice
```
Title: ⚠️ Scheduled Maintenance
Message: Our website will be under maintenance on Sunday from 2 AM to 4 AM.
Type: Warning
Status: Scheduled
Priority: High
Icon: ⚠️
Scheduled Date: 2 days before maintenance
```

#### 4. Welcome Message
```
Title: 👋 Welcome to Gro-Delivery!
Message: Get 20% off on your first order. Use code: WELCOME20
Type: Info
Status: Active
Priority: Medium
Icon: 👋
Link: /products
Link Text: Start Shopping
Target Audience: New Users
```

## 🎨 Notification Types & Colors

| Type | Color | Use Case |
|------|-------|----------|
| Info | Blue | General information, tips |
| Success | Green | Achievements, confirmations |
| Warning | Yellow | Important notices, cautions |
| Error | Red | Critical alerts, issues |
| Announcement | Purple | Major updates, events |

## 📊 Analytics

Each notification tracks:
- **View Count**: How many times it was displayed
- **Click Count**: How many times the link was clicked
- **CTR**: Click-through rate (calculated)

View stats in the admin panel for each notification.

## 🔧 API Endpoints

### GET /api/notifications
**User Endpoint**: Fetch active notifications
```javascript
// Query params:
// - location: 'home' | 'products' | 'profile'
// - admin: 'true' (for admin panel)

fetch('/api/notifications?location=home')
```

### POST /api/notifications
**Admin Only**: Create notification
```javascript
fetch('/api/notifications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'New Sale!',
    message: 'Check out our deals',
    type: 'announcement',
    status: 'active',
    priority: 'high',
    // ... other fields
  })
})
```

### PUT /api/notifications
**Admin Only**: Update notification
```javascript
fetch('/api/notifications', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'notification_id',
    title: 'Updated Title',
    // ... other fields to update
  })
})
```

### DELETE /api/notifications
**Admin Only**: Delete notification
```javascript
fetch('/api/notifications?id=notification_id', {
  method: 'DELETE'
})
```

### POST /api/notifications/stats
**Track Analytics**: Record views/clicks
```javascript
fetch('/api/notifications/stats', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    notificationId: 'notification_id',
    action: 'view' // or 'click'
  })
})
```

## 🎯 Integration Guide

### Add to Any Page

```tsx
import NotificationBanner from '@/components/NotificationBanner'

export default function YourPage() {
  return (
    <div>
      {/* Add notification banner */}
      <NotificationBanner location="products" />
      
      {/* Your page content */}
      <div>...</div>
    </div>
  )
}
```

### Locations
- `home` - Homepage
- `products` - Product listing pages
- `profile` - User profile
- `checkout` - Checkout page
- Custom locations as needed

## 🎨 Customization

### Modify Styles
Edit `components/NotificationBanner.tsx`:
- Change colors in `getStyles()` function
- Adjust animations in `<style jsx>`
- Modify layout in JSX

### Add New Types
1. Update model: `app/models/Notification.ts`
2. Update API validation
3. Update admin form options
4. Add styles in NotificationBanner

## 📱 User Experience

### How Users See Notifications
1. Notifications appear at the top of the page
2. Animated slide-down entrance
3. Can be dismissed with X button
4. Dismissed state saved in localStorage
5. High-priority notifications show "Important" badge
6. Optional link button for call-to-action

### Dismissal Behavior
- Dismissed notifications won't show again
- Stored in browser localStorage
- Per-device (not synced across devices)
- Clear localStorage to see dismissed notifications again

## 🔒 Security Notes

1. **Admin Only**: Only admins can create/edit/delete
2. **Validation**: All inputs validated on server
3. **Sanitization**: HTML/XSS protection needed (add if required)
4. **Rate Limiting**: Consider adding for API endpoints

## 🐛 Troubleshooting

### Notifications Not Showing
1. Check notification status is "active"
2. Verify start/end dates are correct
3. Check display location matches page
4. Clear localStorage if dismissed
5. Check browser console for errors

### Admin Panel Issues
1. Verify admin authentication
2. Check MongoDB connection
3. Review server logs
4. Ensure all dependencies installed

### Analytics Not Tracking
1. Check API endpoint is accessible
2. Verify notification ID is valid
3. Review network tab for failed requests

## 📈 Best Practices

1. **Keep it Short**: Users scan, don't read
2. **Clear CTA**: Make action obvious
3. **Timing**: Schedule for peak hours
4. **Priority**: Use "High" sparingly
5. **Testing**: Preview before publishing
6. **Analytics**: Monitor performance
7. **Cleanup**: Remove expired notifications

## 🎉 Example Use Cases

1. **Flash Sales**: Time-sensitive offers
2. **New Products**: Product launches
3. **Maintenance**: Downtime notices
4. **Features**: New functionality
5. **Events**: Special occasions
6. **Promotions**: Discount codes
7. **Updates**: Platform changes
8. **Onboarding**: Welcome messages

---

**Your notification system is now ready to use! 🚀**

Start creating engaging notifications to keep your users informed and engaged!
