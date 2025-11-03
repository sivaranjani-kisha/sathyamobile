// api/categoryproduct/get/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import CategoryProduct from "@/models/categoryproduct";
import Category from "@/models/ecom_category_info";
import Product from "@/models/product";

export async function GET() {
  try {
    await connectDB();

    // Step 1: Get all active category products
    const categoryProducts = await CategoryProduct.find({ status: "Active" })
      .sort({ position: 1 })
      .lean();

    // Step 2: Collect all subcategory and product IDs
    const subcategoryIds = categoryProducts.map(cp => cp.subcategoryId);
    const allProductIds = categoryProducts.flatMap(cp => cp.products || []);

    // Step 3: Fetch all subcategories
    const subcategories = await Category.find({
      _id: { $in: subcategoryIds },
    })
      .select("category_name category_slug parentid")
      .lean();

    // Step 4: Fetch all valid products
    const validProducts = await Product.find({
      _id: { $in: allProductIds },
      // quantity: { $gt: 2 },
      // special_price: { $gt: 2 },
    })
      .select("name slug images price special_price quantity stock_status brand category")
      .lean();

    // Step 5: Build maps for faster lookups
    const subcategoryMap = {};
    subcategories.forEach(cat => {
      subcategoryMap[cat._id.toString()] = cat;
    });

    const productMap = {};
    validProducts.forEach(prod => {
      productMap[prod._id.toString()] = prod;
    });

    // Step 6: Combine everything
    const categoryProductsWithData = categoryProducts.map(cp => {
      // Find subcategory (if exists)
      const subcategory = subcategoryMap[cp.subcategoryId?.toString()];

      // Find and filter valid products
      const filteredProducts = (cp.products || [])
        .map(pid => productMap[pid.toString()])
        .filter(Boolean);

      // Determine the final category info
      let finalCategory = subcategory;

      // Fallback to product.category if subcategory missing
      if (!finalCategory && filteredProducts.length > 0) {
        const sampleProduct = filteredProducts[0];
        if (sampleProduct.category) {
          finalCategory = {
            _id: sampleProduct.category._id || sampleProduct.category,
            category_name: sampleProduct.category.category_name || "Unknown Category",
            category_slug: sampleProduct.category.category_slug || "",
            parentid: sampleProduct.category.parentid || null,
          };
        }
      }

      return {
        ...cp,
        subcategoryId: finalCategory, // can be category or subcategory
        products: filteredProducts,
      };
    });

    // ✅ Step 7: Show all (don’t filter out anything)
    return NextResponse.json(
      {
        ok: true,
        data: categoryProductsWithData,
        validProducts,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching category products:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
