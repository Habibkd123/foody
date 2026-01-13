import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

export const runtime = 'nodejs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function getAuthFromCookies() {
  const cookieStore = await cookies();
  const role = cookieStore.get('user-role')?.value;
  const userId = cookieStore.get('user-id')?.value;

  if (!role || !userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return { ok: false as const, status: 401 as const, error: 'Unauthorized' };
  }

  return { ok: true as const, role: String(role).toLowerCase(), userId };
}

const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'disputes', resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthFromCookies();
    if (!auth.ok) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    // allow user/restaurant/admin to upload evidence
    if (!['user', 'restaurant', 'admin'].includes(auth.role)) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData.getAll('evidence') as any[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    const maxFiles = 6;
    const picked = files.slice(0, maxFiles);

    const results: any[] = [];
    for (const f of picked) {
      if (!f || typeof f === 'string') continue;
      const file = f as File;

      // soft validation
      const sizeOk = typeof file.size === 'number' ? file.size <= 10 * 1024 * 1024 : true;
      if (!sizeOk) {
        return NextResponse.json({ success: false, error: 'File size should be less than 10MB' }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadRes: any = await uploadToCloudinary(buffer);
      results.push({
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        originalName: file.name,
        size: file.size,
        mimeType: file.type,
      });
    }

    if (results.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid files uploaded' }, { status: 400 });
    }

    return NextResponse.json({ success: true, files: results }, { status: 200 });
  } catch (error: any) {
    console.error('Dispute evidence upload error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to upload files' }, { status: 500 });
  }
}
