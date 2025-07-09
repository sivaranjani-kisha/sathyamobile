import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/product";

export async function POST(req) {
  try {
    await connectDB();

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { status: "Inactive" }, // 👈 Soft delete by updating status
      { new: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product inactivated successfully" }, { status: 200 });
  } catch (error) {
    console.error("🔥 Error inactivating product:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
