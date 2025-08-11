// import { NextRequest, NextResponse } from "next/server";
// import path from "path";
// import fs from "fs";
// import Category from "@/app/models/Category";

// const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads/categories");

// export async function POST(request: NextRequest) {
//   try {
//     const formData = await request.formData();

//     const file = formData.get("image");
//     const name = formData.get("name");
//     console.log(`Received file: ${file}`);

//     if (!file || typeof file === "string") {
//       return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
//     }

//     // @ts-ignore
//     const buffer = Buffer.from(await file.arrayBuffer());
//     const filePath = path.join(UPLOAD_DIR, file.name);

//     if (!fs.existsSync(UPLOAD_DIR)) {
//       fs.mkdirSync(UPLOAD_DIR, { recursive: true });
//     }
//     fs.writeFileSync(filePath, buffer);
//     if (!filePath) {
//       return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 });
//     }
//     await Category.create({
//       image: `/uploads/categories/${file.name}`,
//       name: name || "Default Category Name",
//     });
//     console.log(`File saved to: ${filePath}`);
//     return NextResponse.json({ success: true, fileName: file.name });
//   } catch (error) {
//     // console.error(error);
//     return NextResponse.json({ success: false, error: error }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import Category from "@/app/models/Category";
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
    const file = formData.get("image");
    const name = formData.get("name");

    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary using stream
    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });

    const uploadRes: any = await uploadToCloudinary();

    // Save in DB
    await Category.create({
      image: uploadRes.secure_url,
      name: name || "Default Category Name",
    });

    return NextResponse.json({
      success: true,
      fileUrl: uploadRes.secure_url,
      message: "Category image uploaded successfully"
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: "Failed to upload file" }, { status: 500 });
  }
}
