import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import Pincode from "@/app/models/Pincode";

// PATCH /api/pincode/serviceable
export async function PATCH(request: NextRequest) {
  await connectDB();
  const { pincode, serviceable } = await request.json(); // expects pincode string & serviceable bool

  if (!pincode || typeof serviceable !== "boolean") {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const updated = await Pincode.findOneAndUpdate(
    { pincode },
    { serviceable },
    { new: true }
  );

  return NextResponse.json(updated);
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const serviceable = searchParams.get("serviceable");

    const filter: any = {};
    if (serviceable !== null) {
      filter.serviceable = serviceable === "true";
    }

    const pincodes = await Pincode.find(filter);

    return NextResponse.json(pincodes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed" }, { status: 500 });
  }
}

// PATCH /api/pincode/district
// export async function PATCH(request: NextRequest) {
//   await connectDB();
//   const { district, serviceable } = await request.json();

//   if (!district || typeof serviceable !== "boolean") {
//     return NextResponse.json({ error: "Invalid data" }, { status: 400 });
//   }

//   const updated = await Pincode.updateMany(
//     { city: district },
//     { serviceable }
//   );
//   return NextResponse.json({
//     message: `Serviceable updated for ${updated.modifiedCount} pincodes in ${district}`,
//   });
// }
