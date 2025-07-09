"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories/get");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper to get subcategories
  const getSubcategories = (parentId) =>
    categories.filter(
      (cat) => cat.parentid === parentId && cat.status === "Active"
    );

  const topCategories = categories.filter(
    (cat) => cat.parentid === "none" && cat.status === "Active"
  );

  return (
   <div className="hidden lg:flex items-center space-x-8 ml-8">
  {/* Home Link */}
  <Link
    href="/"
    className="text-[#222529] hover:text-red-500 font-bold text-xs py-[21px] transition-colors uppercase"
  >
    Home
  </Link>

  {/* Dynamic Categories */}
  {!loading &&
    topCategories.map((topCat) => {
      const subcategories = getSubcategories(topCat._id);

      // No subcategories: simple link
      if (subcategories.length === 0) {
        return (
          <Link
            key={topCat._id}
            href={`/category/${topCat.category_slug}`}
            className="text-[#222529] hover:text-red-500 font-bold text-xs py-[21px] transition-colors uppercase"
          >
            {topCat.category_name}
          </Link>
        );
      }

      // With subcategories: mega menu
      return (
        <div key={topCat._id} className="relative group">
          <Link
            href={`/category/${topCat.category_slug}`}
            className="flex items-center text-[#222529] hover:text-red-500 font-bold text-xs py-[21px] transition-colors uppercase"
          >
            {topCat.category_name}
            <svg
              className="ml-1 h-4 w-4"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </Link>

          {/* Mega Menu */}
<div
  className="absolute left-0 top-full hidden group-hover:flex w-[600px] bg-white shadow-xl border mt-2 z-50"
>
  <div className="flex w-full">
    {/* Subcategories */}
    <div className="flex-1 py-3 px-4">
      <div className="grid grid-cols-2 gap-2">
        {subcategories.map((subcat) => (
          <Link
            key={subcat._id}
            href={`/category/${topCat.category_slug}/${subcat.category_slug}`}
            className="block text-[#222529] hover:text-red-500 text-xs font-bold uppercase mb-1"
          >
            {subcat.category_name}
          </Link>
        ))}
      </div>
    </div>
    {/* Right Image */}
    <div className="w-48 flex items-center justify-center p-2 border-l">
     <img
  src={topCat.image}
  alt={topCat.category_name}
  className="max-w-full max-h-32 object-contain"
/>
    </div>
  </div>
</div>

        </div>
      );
    })}
</div>


  );
}
