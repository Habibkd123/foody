import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Banner from '@/app/models/Banner';

connectDB();

export async function PUT(request: NextRequest,
   { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json();
    const { id } = await params;
    console.log("Banner id:", id);
    console.log("Banner data:", body);
    const updated = await Banner.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    console.log("Banner updated:", updated);
    if (!updated) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    console.log("Banner updated:", err);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await Banner.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}

