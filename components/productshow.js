"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi";
import { useEffect, useRef, useState } from "react";
import Addtocart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";

export default function CategoryProductSection() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const scrollContainerRef = useRef(null);

  // Scroll buttons
  const scrollLeft = () => {
    scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  // ✅ Fetch categories, products, and brands (no API change)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, brandRes] = await Promise.all([
          fetch("/api/categories/get"),
          fetch("/api/product/get"),
          fetch("/api/brand/get"),
        ]);
        const catData = await catRes.json();
        const prodData = await prodRes.json();
        const brandData = await brandRes.json();

        setCategories(catData);
        setProducts(prodData);
        setBrands(brandData?.brands || []);

        // ✅ Set default selected category
        const parentCats = catData.filter(
          (cat) => cat.parentid === "none" && cat.status === "Active"
        );
        if (parentCats.length > 0) setSelectedCategory(parentCats[0]);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // ✅ Recursive get descendant categories
  const getDescendantIds = (categoryId) => {
    const all = [categoryId];
    const children = categories.filter((c) => c.parentid === categoryId);
    for (const child of children) {
      all.push(...getDescendantIds(child._id));
    }
    return all;
  };

  // ✅ Filter products by selected category
  useEffect(() => {
    if (!selectedCategory || products.length === 0) return;
    const descendantIds = getDescendantIds(selectedCategory._id);
    const filtered = products.filter(
      (p) =>
        p.status === "Active" &&
        p.category &&
        descendantIds.includes(p.category.toString())
    );
    setFilteredProducts(filtered);
  }, [selectedCategory, products, categories]);

  // ✅ Parent categories only
  const parentCategories = categories.filter(
    (c) => c.parentid === "none" && c.status === "Active"
  );

  // ✅ Find brand name by brand_id
  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId?.toString());
    return brand ? brand.brand_name : "";
  };

  return (
    <motion.section className="mb-10 px-4 mt-5">
      <div className="bg-white rounded-xl border border-red-200 p-6 shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-500">
            Shop by Category Products
          </h2>
          
        </div>

        {/* 🔴 Category Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-2">
          {parentCategories.map((category) => (
            <button
              key={category._id}
              onClick={() => setSelectedCategory(category)}
              className={`flex items-center gap-2 px-6 py-2 rounded-full border text-sm font-medium transition-all duration-300 shadow-sm ${
                selectedCategory?._id === category._id
                  ? "bg-[#e20e0e] text-white border-[#e20e0e] scale-105"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {/* <Image
                src={
                  category.image
                    ? `/uploads/categories/${category.image}`
                    : "/noimage.jpg"
                }
                alt={category.category_name}
                width={24}
                height={24}
                className="rounded-full object-contain"
                onError={(e) => (e.target.src = "/noimage.jpg")}
              /> */}
              <span>{category.category_name}</span>
            </button>
          ))}
        </div>
        {/* <div className="flex justify-end  items-center space-x-3 mb-2">
          {selectedCategory && (
            <Link
              href={`/category/${selectedCategory.category_slug}`}
              className="flex items-center text-sm text-red-600 hover:underline font-medium"
            >
              View All Products
              <HiArrowRight className="ml-1 text-base" />
            </Link>
          )}
          <button
            onClick={scrollLeft}
            className="p-2 border border-gray-300 rounded-full hover:bg-red-600 hover:text-white transition"
          >
            <FiChevronLeft size={18} />
          </button>
          <button
            onClick={scrollRight}
            className="p-2 border border-gray-300 rounded-full hover:bg-red-600 hover:text-white transition"
          >
            <FiChevronRight size={18} />
          </button>
        </div> */}

        <div className="flex justify-between items-center mb-2">
          {/* ✅ Left side — Category Name */}
          {selectedCategory && (
            <h3 className="text-lg font-semibold text-red-800">
              {selectedCategory.category_name}
            </h3>
          )}

          {/* ✅ Right side — View All + Arrows */}
          <div className="flex items-center space-x-3">
            {selectedCategory && (
              <Link
                href={`/category/${selectedCategory.category_slug}`}
                className="flex items-center text-sm text-red-600 hover:underline font-medium"
              >
                View All Products
                <HiArrowRight className="ml-1 text-base" />
              </Link>
            )}

            <button
              onClick={scrollLeft}
              className="p-2 border border-gray-300 rounded-full hover:bg-red-600 hover:text-white transition"
            >
              <FiChevronLeft size={18} />
            </button>

            <button
              onClick={scrollRight}
              className="p-2 border border-gray-300 rounded-full hover:bg-red-600 hover:text-white transition"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* 🛒 Product List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center text-gray-500 font-medium py-10">
            No products found for this category.
          </div>
        ) : (
          <div className="relative">
            <div
              className="flex overflow-x-auto space-x-6 pb-2 no-scrollbar"
              ref={scrollContainerRef}
            >
              {/* Category Banner */}
              {selectedCategory && (
                <div className="w-[280px] shrink-0 bg-red-50 border border-red-100 rounded-lg p-4 flex flex-col justify-between">
                 {/*  <h3 className="text-lg font-semibold text-red-800 mb-3">
                    {selectedCategory.category_name}
                  </h3> */}
                  <div className="flex items-center justify-center py-4">
                     <img
                    src={
                      selectedCategory?.image
                        ? `${selectedCategory.image}`
                        : "/noimage.jpg"
                    }
                    alt={selectedCategory?.category_name || "Category image"}
                    className="h-32 object-contain"
                    onError={(e) => {
                      e.target.onerror = null; // Prevents infinite loop
                      e.target.src = "/noimage.jpg";
                    }}
                  />
                  </div>
                  <Link
                    href={`/category/${selectedCategory.category_slug}`}
                    className="mt-4 block bg-red-600 text-white text-center py-2 rounded hover:bg-red-700 transition"
                  >
                    Shop Now →
                  </Link>
                </div>
              )}

              {/* Product Cards */}
              {filteredProducts.map((product) => (
                <div key={product._id} className="w-[280px] shrink-0">
                  <motion.div
                    /* whileHover={{ y: -3 }} */
                    className="relative bg-white border border-gray-200 hover:border-[#e20e0e] rounded-lg shadow-sm p-8 flex flex-col h-full"
                  >
                    {product.special_price && (
                      <span className="absolute top-3 left-3 text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                        {Math.round(
                          ((product.price - product.special_price) /
                            product.price) *
                            100
                        )}
                        % OFF
                      </span>
                    )}

                    {/* Wishlist */}
                    <div className="absolute top-3 right-3 z-10">
                      <ProductCard productId={product._id} />
                    </div>

                    {/* Product Image */}
                    <div className="h-75 flex items-center justify-center mb-4">
                      <Link
                        href={`/product/${encodeURIComponent(
                          product.slug || product._id
                        )}`}
                      >
                        <img
                          src={
                            product.images?.[0]
                              ? `/uploads/products/${product.images[0]}`
                              : "/noimage.jpg"
                          }
                          alt={product.name || "Product image"}
                          className="max-h-full object-contain"
                          onError={(e) => (e.target.src = "/noimage.jpg")}
                        />
                      </Link>
                    </div>

                    {/* ✅ Brand Name */}
                    <p className="text-sm text-gray-600 font-medium mb-1 uppercase tracking-wide">
                      {getBrandName(product.brand_id)}
                    </p>

                    {/* Product Name */}
                    <Link
                      href={`/product/${encodeURIComponent(
                        product.slug || product._id
                      )}`}
                      className="font-semibold text-red-800 hover:text-red-600 mb-2 line-clamp-2"
                    >
                      {product.name}
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-bold text-red-600">
                        Rs. {product.special_price || product.price}
                      </span>
                      {product.special_price && (
                        <span className="text-sm text-gray-400 line-through">
                          Rs. {product.price}
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <Addtocart
                        productId={product._id}
                        stockQuantity={product.quantity}
                        className="flex-1"
                      />
                      <a
                        href={`https://wa.me/?text=Check this out: ${product.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full flex items-center justify-center"
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 32 32"
                          fill="currentColor"
                        >
                          <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.773.736 5.368 2.009 7.629L2 30l6.565-2.643A13.254 13.254 0 0016.003 29.333C23.36 29.333 29.333 23.36 29.333 16c0-7.36-5.973-13.333-13.33-13.333zm7.608 18.565c-.32.894-1.87 1.749-2.574 1.865-.657.104-1.479.148-2.385-.148-.55-.175-1.256-.412-2.162-.812-3.8-1.648-6.294-5.77-6.49-6.04-.192-.269-1.55-2.066-1.55-3.943 0-1.878.982-2.801 1.33-3.168.346-.364.75-.456 1.001-.456.25 0 .5.002.719.013.231.01.539-.088.845.643.32.768 1.085 2.669 1.18 2.863.096.192.16.423.03.683-.134.26-.2.423-.39.65-.192.231-.413.512-.589.689-.192.192-.391.401-.173.788.222.392.986 1.625 2.116 2.636 1.454 1.298 2.682 1.7 3.075 1.894.393.192.618.173.845-.096.23-.27.975-1.136 1.237-1.527.262-.392.524-.32.894-.192.375.13 2.35 1.107 2.75 1.308.393.205.656.308.75.48.096.173.096 1.003-.224 1.897z" />
                        </svg>
                      </a>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
