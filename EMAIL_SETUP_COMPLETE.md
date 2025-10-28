# Email Setup Guide for Gro-Delivery Contact Form

## 📧 Complete Nodemailer Integration

Your contact form is now fully integrated with Nodemailer! Here's everything you need to know:

## 🚀 Installation

First, install nodemailer:

```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

## 🔧 Environment Variables Setup

Add these variables to your `.env` or `.env.local` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
ADMIN_EMAIL=admin@grodelivery.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📝 Gmail Setup (Recommended)

### Option 1: Using Gmail with App Password (Most Secure)

1. **Enable 2-Step Verification**:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the 16-character password
   - Use this as `EMAIL_PASS` in your `.env`

3. **Configure Environment Variables**:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your-16-char-app-password
ADMIN_EMAIL=youremail@gmail.com
```

### Option 2: Using Gmail with Less Secure Apps (Not Recommended)

1. Enable "Less secure app access" in Gmail settings
2. Use your regular Gmail password

## 📧 Other Email Providers

### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your-sendgrid-api-key
```

### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_USER=postmaster@your-domain.mailgun.org
EMAIL_PASS=your-mailgun-password
```

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

## ✨ Features Implemented

### 1. **Contact Form with Validation**
- Name, email, and message validation
- Email format validation
- Toast notifications for success/error
- Loading states during submission
- Form reset after successful submission

### 2. **Dual Email System**
- **Admin Notification**: Sends formatted email to admin with contact details
- **User Confirmation**: Sends thank you email to user with branding

### 3. **Email Templates**
- Professional HTML email templates
- Branded with Gro-Delivery colors and logo
- Responsive design
- Clear call-to-action buttons

### 4. **Error Handling**
- Graceful fallback if email fails
- Message still saved to database
- User notified of partial success
- Detailed error logging

## 🧪 Testing

### Test the Contact Form:

1. **Start your development server**:
```bash
npm run dev
```

2. **Navigate to Contact Section**:
   - Scroll to "Get in Touch" section
   - Fill in the form
   - Submit

3. **Check Results**:
   - Toast notification appears
   - Check admin email inbox
   - Check user email inbox for confirmation

### Test Email Configuration:

Create a test file `test-email.js`:

```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-app-password'
  }
});

transporter.sendMail({
  from: 'your-email@gmail.com',
  to: 'test@example.com',
  subject: 'Test Email',
  text: 'This is a test email from Gro-Delivery'
}, (error, info) => {
  if (error) {
    console.log('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
```

Run: `node test-email.js`

## 🔒 Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use App Passwords** instead of regular passwords
3. **Enable 2FA** on email accounts
4. **Rotate passwords** regularly
5. **Use environment-specific** configurations
6. **Validate all inputs** before sending emails
7. **Rate limit** contact form submissions

## 📊 Database Integration

Messages are saved to MongoDB with:
- Name
- Email
- Subject
- Message
- Timestamp

Model location: `app/models/ContactMessage.ts`

## 🎨 Email Customization

### Modify Admin Email Template:
Edit `sendEmailToAdmin` function in `app/api/contact/route.ts`

### Modify User Confirmation Email:
Edit `sendConfirmationEmail` function in `app/api/contact/route.ts`

### Styling:
- Inline CSS in HTML templates
- Gradient backgrounds matching brand colors
- Responsive design for mobile devices

## 🐛 Troubleshooting

### Email Not Sending:

1. **Check Environment Variables**:
```bash
echo $EMAIL_USER
echo $EMAIL_HOST
```

2. **Verify SMTP Settings**:
   - Correct host and port
   - Valid credentials
   - Firewall not blocking port 587

3. **Check Logs**:
   - Server console for errors
   - Email provider logs

### Common Errors:

**"Invalid login"**:
- Use App Password, not regular password
- Enable 2FA first

**"Connection timeout"**:
- Check firewall settings
- Verify port 587 is open
- Try port 465 with `secure: true`

**"Self-signed certificate"**:
- Add `tls: { rejectUnauthorized: false }` (development only)

## 📱 Production Deployment

### Vercel:
1. Add environment variables in Vercel dashboard
2. Redeploy application

### Other Platforms:
1. Set environment variables in platform settings
2. Ensure SMTP ports are not blocked
3. Use production email service (SendGrid, Mailgun)

## 🎯 Next Steps

1. ✅ Install nodemailer
2. ✅ Configure environment variables
3. ✅ Test email sending
4. ✅ Customize email templates
5. ✅ Set up production email service
6. ✅ Monitor email delivery rates

## 📞 Support

If you encounter issues:
1. Check server logs
2. Verify environment variables
3. Test SMTP connection
4. Review email provider documentation

---

**Your contact form is now ready to send beautiful, professional emails! 🎉**
