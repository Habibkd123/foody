import { NextRequest, NextResponse } from 'next/server';
import { applicableOffersForProduct } from '@/app/lib/offers';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const offers = await applicableOffersForProduct(id);
    return NextResponse.json({ success: true, data: offers });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || 'Server error' }, { status: 500 });
  }
}
