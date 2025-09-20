import Category from "@/models/ecom_category_info";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const categories = await Category.find({});
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}