import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import ContactMessage from '@/app/models/ContactMessage';
import nodemailer from 'nodemailer';

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false, // for dev only
    },
  });
};


// Send email to admin
const sendEmailToAdmin = async (name: string, email: string, subject: string, message: string) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    replyTo: email,
    subject: `Contact Form: ${subject || 'New Message'}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
            .info-row { margin: 10px 0; padding: 10px; background: white; border-left: 4px solid #f97316; }
            .label { font-weight: bold; color: #f97316; }
            .message-box { background: white; padding: 15px; margin-top: 15px; border-radius: 4px; border: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🛒 New Contact Form Submission - Gro-Delivery</h2>
            </div>
            <div class="content">
              <div class="info-row">
                <span class="label">Name:</span> ${name}
              </div>
              <div class="info-row">
                <span class="label">Email:</span> ${email}
              </div>
              <div class="info-row">
                <span class="label">Subject:</span> ${subject || 'No subject'}
              </div>
              <div class="message-box">
                <p class="label">Message:</p>
                <p>${message.replace(/\n/g, '<br>')}</p>
              </div>
              <p style="margin-top: 20px; color: #666; font-size: 12px;">
                This email was sent from the Gro-Delivery contact form.
              </p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  return await transporter.sendMail(mailOptions);
};

// Send confirmation email to user
const sendConfirmationEmail = async (name: string, email: string) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: `"Gro-Delivery Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Thank you for contacting Gro-Delivery',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .logo { font-size: 24px; font-weight: bold; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #f97316; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🛒 Gro-Delivery</div>
              <h2>Thank You for Reaching Out!</h2>
            </div>
            <div class="content">
              <p>Dear ${name},</p>
              <p>Thank you for contacting Gro-Delivery. We have received your message and our team will get back to you as soon as possible.</p>
              <p>We typically respond within 24-48 hours during business days.</p>
              <p>In the meantime, feel free to browse our fresh products and amazing deals:</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" class="button">Visit Our Store</a>
              <p>If you have any urgent concerns, please call us at: <strong>+91 9876543210</strong></p>
              <div class="footer">
                <p>Best regards,<br><strong>Gro-Delivery Support Team</strong></p>
                <p>This is an automated message. Please do not reply to this email.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `
  };

  return await transporter.sendMail(mailOptions);
};

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, subject, message } = body || {};

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ 
        success: false, 
        error: 'Name, email and message are required' 
      }, { status: 400 });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email address' 
      }, { status: 400 });
    }

    // Save to database
    const doc = await ContactMessage.create({ name, email, subject, message });

    // Send emails
    try {
      // Send email to admin
      await sendEmailToAdmin(name, email, subject || 'New Contact Message', message);
      
      // Send confirmation email to user
      await sendConfirmationEmail(name, email);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Message sent successfully! Check your email for confirmation.',
        data: doc 
      }, { status: 201 });
    } catch (emailError: any) {
      console.error('Email sending error:', emailError);
      
      // Message saved but email failed
      return NextResponse.json({ 
        success: true, 
        message: 'Message saved but email notification failed. We will still respond to your message.',
        data: doc,
        emailError: emailError.message
      }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to submit message' 
    }, { status: 500 });
  }
}
