import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Zone from "@/models/zone";

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const { zone_name, slug, status } = await req.json();

  const existingZone = await Zone.findById(id);
  if (!existingZone) {
    return NextResponse.json({ error: "Zone not found" }, { status: 404 });
  }

  existingZone.zone_name = zone_name;
  existingZone.slug = slug;
  existingZone.status = status;

  await existingZone.save();

  return NextResponse.json(existingZone);
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = params;

  const zone = await Zone.findById(id);

  if (!zone) {
    return NextResponse.json({ error: "Zone not found" }, { status: 404 });
  }

  // If already inactive, return message
  if (zone.status === "Inactive") {
    return NextResponse.json({ message: "Zone is already inactive" });
  }

  zone.status = "Inactive";
  await zone.save();

  return NextResponse.json({ message: "Zone status set to Inactive" });
}
