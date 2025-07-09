import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  blog_name: { type: String, required: true },
  blog_slug: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "ecom_category_infos", required: true },
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Check if the model already exists before compiling it
const Blog = mongoose.models.ecom_blog_info || mongoose.model("ecom_blog_info", BlogSchema);

export default Blog;