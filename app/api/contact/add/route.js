import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactModel from "@/models/ecom_contact_info";

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, subject, mobile_number, message, status } = body;

    if (!name || !subject || !mobile_number || !message) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingContact = await ContactModel.findOne({ mobile_number });
    if (existingContact) {
      return NextResponse.json(
        { success: false, message: "This mobile number is already registered" },
        { status: 409 }
      );
    }

    const newContact = new ContactModel({
      name,
      subject,
      mobile_number,
      message,
      status: status || "active",
    });

    await newContact.save();

    return NextResponse.json(
      {
        success: true,
        message: "Contact added successfully",
        data: newContact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding contact:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
