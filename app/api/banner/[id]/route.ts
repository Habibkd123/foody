import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Banner from '@/app/models/Banner';

connectDB();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await Banner.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await Banner.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ error: 'Banner not found' }, { status: 404 });
    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
