import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Pincode from "@/app/models/Pincode";


export async function GET(req: NextRequest, { params }: { params: Promise<{ pincode: string }> }) {
  try {
    await connectDB();

    const { pincode } = await params;
    const result = await Pincode.findOne({ pincode });

    if (!result) {
      return NextResponse.json({ error: "Pincode not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}