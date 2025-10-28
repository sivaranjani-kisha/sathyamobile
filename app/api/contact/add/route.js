import dbConnect from "@/lib/db";
import Contact from "@/models/ecom_contact_info";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, subject, mobile_number, message } = body;

    if (!name || !subject || !mobile_number || !message) {
      return Response.json({ message: "All fields are required" }, { status: 400 });
    }

    const newContact = new Contact({
      name,
      subject,
      mobile_number,
      message,
      status: "active",
    });

    await newContact.save();

    return Response.json({ message: "Message sent successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error saving contact:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
