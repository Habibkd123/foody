import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectDB from '@/lib/mongodb';
import User from '@/app/models/User';

function requireAdminSecret(req: NextRequest) {
  const header = req.headers.get('x-admin-secret');
  const envSecret = process.env.ADMIN_SECRET;
  if (!envSecret) return true; // if not configured, allow (optional hardening by setting ADMIN_SECRET)
  return header === envSecret;
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_PORT === '465',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

export async function POST(req: NextRequest) {
  try {
    if (!requireAdminSecret(req)) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { subject, html, text, userIds, sendToAll } = body || {};

    if (!subject || (!html && !text)) {
      return NextResponse.json({ success: false, message: 'subject and html or text required' }, { status: 400 });
    }

    await connectDB();

    // Loosen typing to accommodate Mongoose lean() results
    let users: any[];

    if (sendToAll) {
      users = await User.find({}, { email: 1, firstName: 1, lastName: 1, _id: 0 }).lean();
    } else if (Array.isArray(userIds) && userIds.length > 0) {
      users = await User.find({ _id: { $in: userIds } }, { email: 1, firstName: 1, lastName: 1, _id: 0 }).lean();
    } else {
      return NextResponse.json({ success: false, message: 'Provide userIds or set sendToAll=true' }, { status: 400 });
    }

    const transporter = createTransporter();

    let sent = 0;
    let failed = 0;

    for (const u of users) {
      if (!u?.email) continue;
      try {
        await transporter.sendMail({
          from: `Gro-Delivery Admin <${process.env.EMAIL_USER}>`,
          to: u.email,
          subject,
          text: text || undefined,
          html: html || undefined,
        });
        sent++;
      } catch (e) {
        console.error('Email send failed for', u.email, e);
        failed++;
      }
    }

    return NextResponse.json({ success: true, total: users.length, sent, failed });
  } catch (e) {
    console.error('Admin reminders error', e);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
