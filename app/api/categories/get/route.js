// import dbConnect from "@/lib/db";
// import Category from "@/models/ecom_category_info";
// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await dbConnect();
//      const categories = await Category.find().sort({ position: 1 });
//     //const categories = await Category.find();
//     return NextResponse.json(categories, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching categories:", error);
//     return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
//   }
// }
// app/api/categories/get/route.js
import dbConnect from "@/lib/db";
import Category from "@/models/ecom_category_info";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    // Get categories sorted by position
    const categories = await Category.find().sort({ position: 1 });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}