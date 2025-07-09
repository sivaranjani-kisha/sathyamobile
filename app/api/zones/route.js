import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Zone from "@/models/zone";

export async function GET() {
  await connectDB();
  const zones = await Zone.find().sort({ createdAt: -1 });
  return NextResponse.json(zones);
}

export async function POST(req) {
  await connectDB();
  const { zone_name, slug, status } = await req.json();

  if (!zone_name || !slug) {
    return NextResponse.json(
      { error: "Zone name and slug are required" },
      { status: 400 }
    );
  }

  const existing = await Zone.findOne({ slug });
  if (existing) {
    return NextResponse.json(
      { error: "Slug already exists" },
      { status: 409 }
    );
  }

  const newZone = await Zone.create({ zone_name, slug, status });
  return NextResponse.json(newZone);
}
