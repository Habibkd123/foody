import { NextRequest, NextResponse } from "next/server";
import Product from "@/app/models/Product";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images");

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: "No images uploaded" }, { status: 400 });
    }

    const savedImagePaths: string[] = [];

    for (const file of files) {
      if (typeof file === "string") continue;

      const buffer = Buffer.from(await file.arrayBuffer());

      // Cloudinary stream upload
      const uploadToCloudinary = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });

      const uploadRes: any = await uploadToCloudinary();
      savedImagePaths.push(uploadRes.secure_url);
    }

    return NextResponse.json({ success: true, imagesAdded: savedImagePaths }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to upload images" }, { status: 500 });
  }
}
