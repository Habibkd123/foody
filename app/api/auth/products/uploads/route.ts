import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import Product from "@/app/models/Product";

const UPLOAD_DIR = path.resolve(process.cwd(), "public/uploads/products");

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Get all files (supposing multiple images input named "images")
    const files = formData.getAll("images");

    if (files.length === 0) {
      return NextResponse.json({ success: false, error: "No images uploaded" }, { status: 400 });
    }

    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const savedImagePaths: string[] = [];

    for (const file of files) {
      if (typeof file === "string") continue; // skip invalid

      // @ts-ignore
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(UPLOAD_DIR, fileName);

      fs.writeFileSync(filePath, buffer);
      savedImagePaths.push(`/uploads/products/${fileName}`);
    }



    return NextResponse.json({ success: true, imagesAdded: savedImagePaths, message: "Images uploaded successfully" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to upload images" }, { status: 500 });
  }
}
