import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    subject: { 
      type: String, 
      required: true, 
      trim: true 
    },
    mobile_number: { 
      type: String, 
      required: true,
      match: [/^\d{10}$/, "Please fill a valid 10-digit mobile number"],
    },
    message: { 
      type: String, 
      required: true, 
      trim: true 
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.models.ecom_contact_infos ||
  mongoose.model("ecom_contact_infos", ContactSchema);
