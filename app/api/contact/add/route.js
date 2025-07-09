import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactModel from "@/models/ecom_contact_info";

export async function POST(request) {
  try {
    await dbConnect(); // Ensure DB connection

    const body = await request.json();
    const { name, email_address, mobile_number, message,status } = body;

    // Validate fields
    if (!name || !email_address || !mobile_number || !message) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    // Check for existing contact
    const existingContact = await ContactModel.findOne({ name });
    if (existingContact) {
      return NextResponse.json({ success: false, message: "Contact already exists" }, { status: 400 });
    }

    // Create new contact
   // const newContact = await ContactModel.create({ name, email_address, mobile_number, message });
  const newContact = new ContactModel({
      name,
      email_address,
      mobile_number,
      message,
      status
    });

    await newContact.save();
    return NextResponse.json({ success: true, message: "Contact added successfully", data: newContact }, { status: 201 });
  } catch (error) {
    console.error("Error adding contact:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
