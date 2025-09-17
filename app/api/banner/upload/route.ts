import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Helper function to upload a single file to Cloudinary
const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "banners" },
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
    const formData = await request.formData();
    const files = formData.getAll("image") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files uploaded" },
        { status: 400 }
      );
    }

    // Process all files in parallel
    const uploadPromises = files.map(async (file) => {
      if (typeof file === "string") {
        throw new Error("Invalid file format");
      }
      
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadRes: any = await uploadToCloudinary(buffer);
      
      return {
        success: true,
        url: uploadRes.secure_url,
        publicId: uploadRes.public_id,
        originalName: file.name,
        size: file.size,
        mimeType: file.type
      };
    });

    const results = await Promise.all(uploadPromises);

    return NextResponse.json({
      success: true,
      message: `${results.length} file(s) uploaded successfully`,
      files: results
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to upload files" 
      },
      { status: 500 }
    );
  }
}
