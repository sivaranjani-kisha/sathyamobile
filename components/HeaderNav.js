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

  // Function to chunk brands into groups of 10
  const chunkBrands = (brands, chunkSize = 10) => {
    const chunks = [];
    for (let i = 0; i < brands.length; i += chunkSize) {
      chunks.push(brands.slice(i, i + chunkSize));
    }
    return chunks;
  };

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
      {activeCat && (getSubcategories(activeCat._id).length > 0 || activeCat.brands?.length > 0) && (
        <div
          className="absolute left-0 top-full bg-white shadow-xl border-t z-50 w-full flex"
          onMouseEnter={() => setActiveCat(activeCat)} // keep open if mouse inside
          onMouseLeave={() => setActiveCat(null)} // close if leave
        >
          <div className="flex-1 flex">
            {/* Main Category Name Section */}
            {getSubcategories(activeCat._id).length > 0 && (
              <div className="w-48 flex flex-col px-4 py-3 border-r bg-white">
                <h3 className="text-[14px] font-bold text-[#222529] mb-3 uppercase ">
                  {activeCat.category_name.toUpperCase()}
                </h3>
                <div className="flex flex-col gap-2">
                  {getSubcategories(activeCat._id).map((subcat) => (
                    <Link
                      key={subcat._id}
                      href={`/category/${activeCat.category_slug}/${subcat.category_slug}`}
                      className="text-[12px] text-[#222529] hover:text-red-500 font-semibold uppercase"
                    >
                      {subcat.category_name.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Brands Section with alternating background colors */}
            {activeCat.brands && activeCat.brands.length > 0 && (
              <div className="flex-1 flex">
                {chunkBrands(activeCat.brands).map((brandChunk, chunkIndex) => (
                  <div 
                    key={chunkIndex}
                    className={`flex-1 flex flex-col px-4 py-3 border-r ${
                      chunkIndex % 2 === 0 ? 'bg-red-50' : 'bg-white'
                    }`}
                  >
                    <h3 className="text-[14px] font-bold text-[#222529] mb-3 uppercase  ">
                      {chunkIndex === 0 ? 'BRANDS' : `BRANDS ${chunkIndex + 1}`}
                    </h3>
                    <div className="flex flex-col gap-2">
                      {brandChunk.map((brand) => (
                        <Link
                          key={brand._id}
                          href={`/brand/${brand.brand_slug || brand._id}`}
                          className="text-[12px] text-[#222529] hover:text-red-500 font-semibold uppercase"
                        >
                          {brand.brand_name?.toUpperCase()}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Side Image */}
          {activeCat.navImage && (
            <div className="w-56 flex items-center justify-center bg-white">
              <img
                src={activeCat.navImage}
                alt={activeCat.category_name}
                className="w-full h-full object-contain"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}