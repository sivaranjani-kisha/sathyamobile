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
  const [isLoading, setIsLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const scrollContainerRef = useRef(null);

  // Category styles with background images and colors
  const categoryStyles = {
    "air-conditioner": { 
      backgroundImage: "/uploads/categories/category-darling-img/air-conditoner-one.jpg", 
      borderColor: "#060F16",
      bgColor: "#f0f9ff"
    },
    "mobile-phones": { 
      backgroundImage: "/uploads/categories/category-darling-img/smartphone.png", 
      borderColor: "#68778B",
      bgColor: "#f8fafc"
    },
    "television": { 
      backgroundImage: "/uploads/categories/category-darling-img/television-one.jpg", 
      borderColor: "#A9A097",
      bgColor: "#fef7ed"
    },
    "refrigerator": { 
      backgroundImage: "/uploads/categories/category-darling-img/refirgrator-two.jpg", 
      borderColor: "#5C8B99",
      bgColor: "#f0fdfa"
    },
    "washing-machine": { 
      backgroundImage: "/uploads/categories/category-darling-img/washine-machine-one.jpg", 
      borderColor: "#69AEA2",
      bgColor: "#f0fdf4"
    }
  };

  // Scroll functionality
  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  // Handle product click for recently viewed
  const handleProductClick = (product) => {
    setNavigating(true);
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updated = [product, ...recentlyViewed.filter(p => p._id !== product._id)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  // Get correct image path with fallback
  const getImagePath = (imagePath, type = 'product') => {
    if (!imagePath) return '/noimage.jpg';
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // Remove leading slash if present to avoid double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    
    // Construct proper path based on type
    if (type === 'brand') {
      return `/uploads/Brands/${cleanPath}`;
    } else if (type === 'category') {
      return `/uploads/categories/${cleanPath}`;
    } else {
      return `/uploads/products/${cleanPath}`;
    }
  };

  // Animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
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

        // Set default selected category
        const parentCats = catData.filter(
          (cat) => cat.parentid === "none" && cat.status === "Active"
        );
        if (parentCats.length > 0) setSelectedCategory(parentCats[0]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get descendant categories
  const getDescendantIds = (categoryId) => {
    const all = [categoryId];
    const children = categories.filter((c) => c.parentid === categoryId);
    for (const child of children) {
      all.push(...getDescendantIds(child._id));
    }
    return all;
  };

  // Filter products by selected category
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

  // Parent categories only
  const parentCategories = categories.filter(
    (c) => c.parentid === "none" && c.status === "Active"
  );

  // Find brand name by brand_id
  const getBrandName = (brandId) => {
    const brand = brands.find((b) => b.id === brandId?.toString());
    return brand ? brand.brand_name : "";
  };

  // Get brand image
  const getBrandImage = (brandId) => {
    const brand = brands.find((b) => b.id === brandId?.toString());
    return brand?.image ? getImagePath(brand.image, 'brand') : null;
  };

  // Get category style
  const getCategoryStyle = (category) => {
    return categoryStyles[category.category_slug] || {
      backgroundImage: '/uploads/small-appliance-banner.webp',
      borderColor: '#1F3A8C',
      bgColor: '#f3f4f6'
    };
  };

  // Custom Image component with error handling
  const SafeImage = ({ src, alt, className, fill = false, width, height, ...props }) => {
    const [imgSrc, setImgSrc] = useState(src);
    const [hasError, setHasError] = useState(false);

    const handleError = () => {
      if (!hasError) {
        setImgSrc('/noimage.jpg');
        setHasError(true);
      }
    };

    if (fill) {
      return (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={className}
          onError={handleError}
          {...props}
        />
      );
    }

    return (
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onError={handleError}
        {...props}
      />
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <>
      {navigating && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-30">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}

      <motion.section 
        initial="hidden"
        animate="visible"
        className="mb-10 px-4 sm:px-6 mt-5"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Shop by Category
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {parentCategories.map((category) => {
              const style = getCategoryStyle(category);
              return (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-2 rounded-full border text-sm font-medium transition-all duration-300 shadow-sm ${
                    selectedCategory?._id === category._id
                      ? "bg-red-600 text-white border-red-600 scale-105"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                  style={{
                    borderColor: selectedCategory?._id === category._id ? style.borderColor : undefined
                  }}
                >
                  {category.image && (
                    <SafeImage
                      src={getImagePath(category.image, 'category')}
                      alt={category.category_name}
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                  )}
                  <span>{category.category_name}</span>
                </button>
              );
            })}
          </div>

          {/* Category Header with Navigation */}
          {selectedCategory && (
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {selectedCategory.category_name}
              </h3>

              <div className="flex items-center space-x-3">
                <Link
                  href={`/category/${selectedCategory.category_slug}`}
                  className="flex items-center text-sm text-red-600 hover:underline font-medium"
                  onClick={() => setNavigating(true)}
                >
                  View All Products
                  <HiArrowRight className="ml-1 text-base" />
                </Link>

                <div className="flex space-x-2">
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
            </div>
          )}

          {/* Products Section */}
          {filteredProducts.length === 0 ? (
            <div className="text-center text-gray-500 font-medium py-10">
              No products found for this category.
            </div>
          ) : (
            <div className="relative">
              <div
                className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 scrollbar-hide scroll-smooth"
                ref={scrollContainerRef}
              >
                {/* Category Banner Card */}
            {selectedCategory && (
  <motion.div 
    variants={itemVariants}
    className="w-64 sm:w-80 shrink-0 rounded-lg overflow-hidden shadow-md border h-72 sm:h-96"
    style={{ 
      borderColor: getCategoryStyle(selectedCategory).borderColor,
      backgroundColor: getCategoryStyle(selectedCategory).bgColor
    }}
  >
    <div className="relative w-full h-full">
      <SafeImage
        src={
          selectedCategory.image 
            ? getImagePath(selectedCategory.image, 'category')
            : getCategoryStyle(selectedCategory).backgroundImage
        }
        alt={selectedCategory.category_name}
        fill
        className="object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg" />
      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white">
        <h3 className="text-lg font-bold mb-2">
          {selectedCategory.category_name}
        </h3>
        <Link
          href={`/category/${selectedCategory.category_slug}`}
          className="bg-white hover:bg-gray-100 text-red-700 text-sm font-semibold py-2 px-4 rounded w-fit transition"
          onClick={() => setNavigating(true)}
        >
          Shop Now →
        </Link>
      </div>
    </div>
  </motion.div>
)}



                {/* Product Cards */}
                {filteredProducts.slice(0, 15).map((product) => {
                  const brandName = getBrandName(product.brand_id);
                  
                  return (
                    <motion.div
                      key={product._id}
                      variants={itemVariants}
                      className="w-44 sm:w-56 shrink-0"
                    >
                      <div className="relative bg-white flex flex-col justify-between p-3 rounded-lg border border-gray-200 hover:border-red-500 hover:shadow-md transition-all cursor-pointer h-full">
                        {/* Discount Badge */}
                        {product.special_price > 0 && product.special_price < product.price && (
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            -{Math.round(100 - (Number(product.special_price) / Number(product.price)) * 100)}%
                          </span>
                        )}

                        {/* Wishlist */}
                        <div className="absolute top-2 right-2 z-10">
                          <ProductCard productId={product._id} />
                        </div>

                        {/* Product Image */}
                        <div className="relative aspect-square bg-white mt-5">
                          <Link
                            href={`/product/${product.slug}`}
                            onClick={() => handleProductClick(product)}
                          >
                            <SafeImage
                              src={getImagePath(product.images?.[0], 'product')}
                              alt={product.name}
                              fill
                              className="object-contain p-2"
                              sizes="(max-width: 640px) 50vw, 33vw"
                            />
                          </Link>
                        </div>

                        {/* Product Info */}
                        <div className="flex flex-col flex-grow">
                          {/* Brand Name - Added above product name */}
                          {brandName && (
                            <Link 
                              href={`/brand/${brandName.toLowerCase().replace(/\s+/g, "-")}`}
                              className="text-xs text-gray-500 mb-1 uppercase hover:text-blue-600 transition-colors"
                            >
                              {brandName}
                            </Link>
                          )}

                          {/* Product Name */}
                          <Link
                            href={`/product/${product.slug}`}
                            onClick={() => handleProductClick(product)}
                            className="font-medium text-gray-900 hover:text-red-600 mb-2 line-clamp-2 text-sm leading-tight"
                          >
                            {product.name}
                          </Link>

                          {/* Price */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-base font-bold text-red-600">
                              ₹ {(product.special_price > 0 && product.special_price < product.price
                                ? Math.round(product.special_price)
                                : Math.round(product.price)
                              ).toLocaleString()}
                            </span>
                            {product.special_price > 0 && product.special_price < product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹ {Math.round(product.price).toLocaleString()}
                              </span>
                            )}
                          </div>

                          {/* Stock Status */}
                          <p className={`text-xs mb-3 ${product.stock_status === "In Stock" ? "text-green-600" : "text-red-600"}`}>
                            {product.stock_status}
                            {product.stock_status === "In Stock" && product.quantity ? `, ${product.quantity} units` : ""}
                          </p>

                          {/* Actions */}
                          <div className="flex items-center justify-between gap-2 mt-auto">
                            <Addtocart
                              productId={product._id}
                              stockQuantity={product.quantity}
                              special_price={product.special_price}
                              className="flex-1 text-sm py-2"
                            />
                            <a
                              href={`https://wa.me/919865555000?text=${encodeURIComponent(
                                `Check Out This Product: ${typeof window !== 'undefined' ? window.location.origin : ''}/product/${product.slug}`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full flex items-center justify-center transition"
                            >
                              <svg className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor">
                                <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.773.736 5.368 2.009 7.629L2 30l6.565-2.643A13.254 13.254 0 0016.003 29.333C23.36 29.333 29.333 23.36 29.333 16c0-7.36-5.973-13.333-13.33-13.333zm7.608 18.565c-.32.894-1.87 1.749-2.574 1.865-.657.104-1.479.148-2.385-.148-.55-.175-1.256-.412-2.162-.812-3.8-1.648-6.294-5.77-6.49-6.04-.192-.269-1.55-2.066-1.55-3.943 0-1.878.982-2.801 1.33-3.168.346-.364.75-.456 1.001-.456.25 0 .5.002.719.013.231.01.539-.088.845.643.32.768 1.085 2.669 1.18 2.863.096.192.16.423.03.683-.134.26-.2.423-.39.65-.192.231-.413.512-.589.689-.192.192-.391.401-.173.788.222.392.986 1.625 2.116 2.636 1.454 1.298 2.682 1.7 3.075 1.894.393.192.618.173.845-.096.23-.27.975-1.136 1.237-1.527.262-.392.524-.32.894-.192.375.13 2.35 1.107 2.75 1.308.393.205.656.308.75.48.096.173.096 1.003-.224 1.897z" />
                              </svg>
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.section>
    </>
  );
}