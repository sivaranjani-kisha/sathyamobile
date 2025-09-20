"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState(null); // track hovered category

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
    <div className="hidden lg:flex items-center space-x-3 ml-4 whitespace-nowrap relative">
      {/* HOME link */}
      <Link
        href="/"
        className="text-[#222529] hover:text-red-500 font-bold text-[12px] uppercase py-[21px] tracking-[0.5px]"
      >
        HOME
      </Link>

      {/* Top Categories */}
      {!loading &&
        topCategories.map((topCat) => (
          <div
            key={topCat._id}
            className="relative"
            onMouseEnter={() => setActiveCat(topCat)} // open mega menu
            onMouseLeave={() => setActiveCat(null)} // close mega menu
          >
            <Link
              href={`/category/${topCat.category_slug}`}
              className="flex items-center text-[#222529] hover:text-red-500 font-bold text-[12px] uppercase py-[21px] tracking-[0.5px]"
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
          </div>
        ))}

      {/* Mega Menu */}
      {activeCat && getSubcategories(activeCat._id).length > 0 && (
        <div
          className="absolute left-0 top-full bg-white shadow-xl border-t z-50 w-full flex"
          onMouseEnter={() => setActiveCat(activeCat)} // keep open if mouse inside
          onMouseLeave={() => setActiveCat(null)} // close if leave
        >
          {/* Subcategory Columns */}
          <div className="flex-1 flex">
            {Array.from(
              { length: Math.ceil(getSubcategories(activeCat._id).length / 10) },
              (_, colIndex) => {
                const isRed = colIndex % 2 === 1; // alternate colors
                return (
                  <div
                    key={colIndex}
                    className={`flex-1 px-4 py-3 border-r flex flex-col ${
                      isRed ? "bg-red-50" : "bg-white"
                    }`}
                  >
                    {getSubcategories(activeCat._id)
                      .slice(colIndex * 10, colIndex * 10 + 10)
                      .map((subcat) => (
                        <Link
                          key={subcat._id}
                          href={`/category/${activeCat.category_slug}/${subcat.category_slug}`}
                          className="text-[#222529] hover:text-red-500 font-bold text-[12px] uppercase mb-2"
                        >
                          {subcat.category_name.toUpperCase()}
                        </Link>
                      ))}
                  </div>
                );
              }
            )}
          </div>

          {/* Right Side Image */}
          <div className="w-56 flex items-center justify-center bg-white">
            <img
              src={activeCat.navImage}
              alt={activeCat.category_name}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
