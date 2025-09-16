import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Category from "@/app/models/Category";
import Product from "@/app/models/Product";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const type = request.nextUrl.searchParams.get("type");
    if (!type) {
      return NextResponse.json(
        { error: "Category type is required" ,message:"Category type is required",success:false },
        { status: 200 }
      );
    }

    let products = [];
    let category = null;

    switch (type.toLowerCase()) {
      case "new arrivals":
        // latest products by createdAt
        products = await Product.find().sort({ createdAt: -1 }).limit(20);
        break;

      case "best sellers":
        // top products by rating + reviews
        products = await Product.find()
          .sort({ totalReviews: -1, rating: -1 })
          .limit(20);
        break;

      case "see all":
        products = await Product.find();
        break;

      default:
        // Match category either by type or name
        category = await Category.findOne({
          $or: [
            { type: { $regex: new RegExp("^" + type + "$", "i") } },
            { name: { $regex: new RegExp("^" + type + "$", "i") } },
          ],
        });

        if (!category) {
          return NextResponse.json(
            { error: "Category not found",message:"Category not found",success:false ,products:[]},
            { status: 200 }
          );
        }

        products = await Product.find({ category: category._id });
    }
    if(products.length === 0){
      return NextResponse.json(
        { error: "No products Available",message:"No products Available",success:false ,products:[] ,category:null},
        { status: 200 }
      );
    }

    return NextResponse.json({
      category: category || null,
      products,
      success:true,
      message: "Products fetched successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal Server Error",message:"Internal Server Error",success:false ,products:[],category:null},
      { status: 500 }
    );
  }
}
