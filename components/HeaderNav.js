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

  const getSubcategories = (parentId) =>
    categories.filter(
      (cat) => cat.parentid === parentId && cat.status === "Active"
    );

  const topCategories = categories.filter(
    (cat) => cat.parentid === "none" && cat.status === "Active"
  );

  return (
    <div className="hidden lg:flex items-center space-x-0 lg:space-x-3 xl:space-x-3 ml-4 whitespace-nowrap">
      {/* HOME link */}
      <Link
        href="/"
        className="text-[#222529] hover:text-red-500 font-bold text-[12px] uppercase py-[21px] transition-colors px-0 xl:px-1 tracking-[0.5px]"
      >
        HOME
      </Link>

      {/* Dynamic categories */}
      {!loading &&
        topCategories.map((topCat) => {
          const subcategories = getSubcategories(topCat._id);

          /* ---------- Top-level category without subcategories ---------- */
          if (subcategories.length === 0) {
            return (
              <Link
                key={topCat._id}
                href={`/category/${topCat.category_slug}`}
                className="text-[#222529] hover:text-red-500 font-bold text-[12px] uppercase py-[21px] transition-colors px-0 xl:px-1 tracking-[0.5px]"
              >
                {topCat.category_name.toUpperCase()}
              </Link>
            );
          }

          /* ---------- Top-level category with subcategories (mega-menu) ---------- */
          return (
            <div key={topCat._id} className="relative group">
              <Link
                href={`/category/${topCat.category_slug}`}
                className="flex items-center text-[#222529] hover:text-red-500 font-bold text-[12px] uppercase py-[21px] transition-colors px-0 xl:px-1 tracking-[0.5px]"
              >
                {topCat.category_name.toUpperCase()}
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

              {/* Invisible buffer to keep menu open on hover */}
              <div className="absolute left-0 right-0 h-4 top-full"></div>

              {/* Mega menu */}
              <div className="absolute left-0 top-[calc(100%+1rem)] hidden group-hover:flex w-[600px] bg-white shadow-xl border z-50">
                <div className="flex w-full">
                  {/* Subcategories column */}
                  <div className="flex-1 py-3 px-4">
                    <div className="grid grid-cols-2 gap-2">
                      {subcategories.map((subcat) => (
                        <Link
                          key={subcat._id}
                          href={`/category/${topCat.category_slug}/${subcat.category_slug}`}
                          className="block text-[#222529] hover:text-red-500 font-bold text-[12px] uppercase tracking-[0.5px] mb-1"
                        >
                          {subcat.category_name.toUpperCase()}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Right-side image */}
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
