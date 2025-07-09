// api/wishlist/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Wishlist from "@/models/ecom_wishlist_info";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const { productId } = await req.json();

    // Check if already in wishlist
    const existingItem = await Wishlist.findOne({  userId, productId });
    if (existingItem) {
  
      const items = await Wishlist.find({  userId }).lean();
      const count = items.length;
  
      return NextResponse.json(
        { items, count },
        { status: 200 }
      );
    }

    // Add to wishlist
    const wishlistItem = new Wishlist({  userId, productId });
    await wishlistItem.save();

    const items = await Wishlist.find({ userId }).lean();
    const count = items.length;

    return NextResponse.json(
      { 
        message: "Added to wishlist", 
        count,
        items 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to add to wishlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const { productId } = await req.json();

    // Remove from wishlist
    await Wishlist.findOneAndDelete({  userId, productId });

    const items = await Wishlist.find({ userId }).lean();
    const count = items.length;

    return NextResponse.json(
      { 
        message: "Removed from wishlist", 
        count,
        items 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await connectDB();

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { items: [], count: 0 },
        { status: 200 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const items = await Wishlist.find({  userId }).lean();
    const count = items.length;

    return NextResponse.json(
      { items, count },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { items: [], count: 0 },
      { status: 200 }
    );
  }
}