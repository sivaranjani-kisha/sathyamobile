// components/CategoryProducts.jsx
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Addtocart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import Image from "next/image";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { HiArrowRight } from 'react-icons/hi';

const CategoryProducts = () => {
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [brandMap, setBrandMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [navigating, setNavigating] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const categoryScrollRefs = useRef({});
  const [isMobile, setIsMobile] = useState(false);

  const priorityCategories = ["air-conditioner", "mobile-phones", "television", "refrigerator", "washing-machine"];
  
  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getSanitizedImage = (img) => {
    if (!img || img.trim() === "") return null;
    const parts = img.split(",");
    const lastImg = parts[parts.length - 1].trim();
    return lastImg.replace(/\s+/g, "_");
  };

  const categoryStyles = {
    "air-conditioner": {
      backgroundImage: "/uploads/categories/category-darling-img/air-conditoner-one.jpg",
      borderColor: "#060F16",
      showallCategoryLink: "/category/large-appliance/air-conditioner",
      bgColor: "#f0f9ff",
      subcategoryList: [
        { categoryname: "Cassette AC", category_slug: "/category/large-appliance/air-conditioner/cassette-ac" },
        { categoryname: "Inverter AC", category_slug: "/category/large-appliance/air-conditioner/inverter-ac" },
        { categoryname: "Split AC", category_slug: "/category/large-appliance/air-conditioner/split-ac" },
        { categoryname: "Window AC", category_slug: "/category/large-appliance/air-conditioner/window-ac" },
      ],
    },
    "mobile-phones": {
      backgroundImage: "/uploads/categories/category-darling-img/smartphone.png",
      borderColor: "#68778B",
      showallCategoryLink: "/category/mobiles-accessories/mobile-phones",
      bgColor: "#f8fafc",
      subcategoryList: [
        { categoryname: "Smart Phone", category_slug: "/category/mobiles-accessories/mobile-phones/smart-phone" },
        { categoryname: "Tablet", category_slug: "/category/mobiles-accessories/mobile-phones/tablet" },
      ],
    },
    "television": {
      backgroundImage: "/uploads/categories/category-darling-img/television-one.jpg",
      borderColor: "#A9A097",
      showallCategoryLink: "/category/televisions/television",
      bgColor: "#fef7ed",
      subcategoryList: [
        { categoryname: "FULL HD", category_slug: "/category/televisions/television/full-hd" },
        { categoryname: "HD Ready", category_slug: "/category/televisions/television/hd-ready" },
        { categoryname: "ULTRA HD", category_slug: "/category/televisions/television/ultra-hd" },
      ],
    },
    "refrigerator": {
      backgroundImage: "/uploads/categories/category-darling-img/refirgrator-two.jpg",
      borderColor: "#5C8B99",
      showallCategoryLink: "/category/large-appliance/refrigerator",
      bgColor: "#f0fdfa",
      subcategoryList: [
        { categoryname: "Bottom Mount", category_slug: "/category/large-appliance/refrigerator/bottom-mount" },
        { categoryname: "Deep Freezer", category_slug: "/category/large-appliance/refrigerator/deep-freezer" },
        { categoryname: "Double Door", category_slug: "/category/large-appliance/refrigerator/double-door" },
        { categoryname: "Mini Fridge", category_slug: "/category/large-appliance/refrigerator/mini-fridge" },
        { categoryname: "Side by Side", category_slug: "/category/large-appliance/refrigerator/side-by-side" },
        { categoryname: "Single Door", category_slug: "/category/large-appliance/refrigerator/single-door" },
        { categoryname: "Triple Door", category_slug: "/category/large-appliance/refrigerator/triple-door" },
      ],
    },
    "washing-machine": {
      backgroundImage: "/uploads/categories/category-darling-img/washine-machine-one.jpg",
      borderColor: "#69AEA2",
      showallCategoryLink: "/category/large-appliance/washing-machine",
      bgColor: "#f0fdf4",
      subcategoryList: [
        { categoryname: "Front Loading", category_slug: "/category/large-appliance/washing-machine/front-loading" },
        { categoryname: "Top Loading", category_slug: "/category/large-appliance/washing-machine/top-loading" },
        { categoryname: "Semi Automatic", category_slug: "/category/large-appliance/washing-machine/semi-automatic" },
      ],
    },
    "dishwasher": {
      backgroundImage: "/uploads/categories/category-darling-img/washine-machine-one.jpg",
      borderColor: "#69AEA2",
      showallCategoryLink: "/category/large-appliance/dishwasher",
      bgColor: "#f0fdf4",
      subcategoryList: [
        { categoryname: "12 PLACE SETTING", category_slug: "/category/large-appliance/dishwasher/12-place-setting" },
        { categoryname: "13 PLACE SETTING", category_slug: "/category/large-appliance/dishwasher/13-place-setting" },
        { categoryname: "14 PLACE SETTING", category_slug: "/category/large-appliance/dishwasher/14-place-setting" },
        { categoryname: "15 PLACE SETTING", category_slug: "/category/large-appliance/dishwasher/15-place-setting" },
        { categoryname: "16 PLACE SETTING", category_slug: "/category/large-appliance/dishwasher/16-place-setting" }
      ],
    },
  };

  const scrollLeft = (categoryId) => {
    if (categoryScrollRefs.current[categoryId]) {
      const scrollAmount = isMobile ? 200 : 250;
      categoryScrollRefs.current[categoryId].scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = (categoryId) => {
    if (categoryScrollRefs.current[categoryId]) {
      const scrollAmount = isMobile ? 200 : 250;
      categoryScrollRefs.current[categoryId].scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleProductClick = (product) => {
    setNavigating(true);
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updated = [product, ...recentlyViewed.filter(p => p._id !== product._id)].slice(0, 10);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  const BanneritemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/categoryproduct/settings");
        const result = await response.json();
        console.log("result");
        console.log(result);
        if (result.ok) {
          setCategoryProducts(result.data);
          // Set first category as active by default
          if (result.data.length > 0) {
            setActiveCategory(result.data[0]._id);
          }
        }

        const brandResponse = await fetch("/api/brand");
        const brandResult = await brandResponse.json();
        if (!brandResult.error) {
          const map = {};
          brandResult.data.forEach((b) => { map[b._id] = b.brand_name; });
          setBrandMap(map);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (categoryProducts.length === 0) return null;

  // Get active category data
  const activeCategoryData = categoryProducts.find(cp => cp._id === activeCategory);

  return (
    <>
      {navigating && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-30">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600"></div>
        </div>
      )}
      
      <motion.section 
        id="category-products" 
        initial="hidden" 
        animate="visible" 
        className="mb-6 px-3 sm:px-6 mt-4"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-6 shadow-sm">
          {/* Header */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              Shop by Category
            </h2>
          </div>

          {/* Category Tabs - Horizontal Scroll for Mobile */}
         <div className="relative mb-4 sm:mb-6">
          <div className="flex justify-center overflow-x-auto pb-2 space-x-2 scrollbar-hide snap-x">
            <div className="flex overflow-x-auto space-x-2 no-scrollbar px-2 sm:justify-center snap-x">
  {categoryProducts.map((categoryProduct) => {
    const category = categoryProduct.subcategoryId;
    if (!category) return null;

    const isActive = activeCategory === categoryProduct._id;
    const categoryStyle = categoryStyles[category.category_slug] || {
      borderColor: '#1F3A8C',
      bgColor: '#f3f4f6'
    };

    return (
      <button
        key={categoryProduct._id}
        onClick={() => setActiveCategory(categoryProduct._id)}
        className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full border text-xs sm:text-sm font-medium transition-all duration-300 shadow-sm transform active:scale-95 snap-start
          ${isActive 
            ? 'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:shadow-md' 
            : 'bg-white text-gray-700 border-gray-300 hover:bg-red-50 hover:border-red-400 hover:text-red-600 hover:shadow-sm'
          }`}
        style={{ borderColor: isActive ? categoryStyle.borderColor : '' }}
      >
        <span className="whitespace-nowrap">{category.category_name}</span>
      </button>
    );
  })}
</div>

          </div>
        </div>


          {/* Active Category Products Section */}
          {activeCategoryData && (() => {
            const category = activeCategoryData.subcategoryId;
            const products = activeCategoryData.products || [];
            const alignment = activeCategoryData.alignment || "left";
            
            if (!category || products.length === 0) return null;
            
            const categoryStyle = categoryStyles[category.category_slug] || {
              backgroundImage: '/uploads/small-appliance-banner.webp',
              borderColor: '#1F3A8C',
              bgColor: '#f3f4f6'
            };
            
            const sanitizedCategoryImage = getSanitizedImage(activeCategoryData.categoryImage);
            const sanitizedBackgroundImage = getSanitizedImage(categoryStyle.backgroundImage);
            const finalBgUrl = sanitizedCategoryImage || sanitizedBackgroundImage || "/default-image.jpg";
            
            const visibleDesktopCount = 5;
            const fewProducts = products.length > 0 && products.length < visibleDesktopCount;

            return (
              <div key={activeCategoryData._id} className="space-y-3 sm:space-y-4">
                {/* Category Header with Navigation */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 px-1">
                    {category.category_name}
                  </h3>

                  <div className="flex items-center justify-between sm:justify-end space-x-3">
                    <Link
                      href={activeCategoryData.categoryRedirectUrl || `/category/${category.category_slug}`}
                      className="flex items-center text-xs sm:text-sm text-red-600 hover:underline font-medium px-1"
                      onClick={() => setNavigating(true)}
                    >
                      View All
                      <HiArrowRight className="ml-1 text-xs sm:text-sm" />
                    </Link>

                    {/* Navigation Buttons - Hidden on mobile if very few products */}
                    {products.length > 2 && (
                      <div className="flex space-x-1 sm:space-x-2">
                        <button
                          onClick={() => scrollLeft(activeCategoryData._id)}
                          className="p-1.5 sm:p-2 border border-gray-300 rounded-full hover:bg-red-600 hover:text-white transition text-xs"
                        >
                          <FiChevronLeft size={isMobile ? 14 : 18} />
                        </button>
                        <button
                          onClick={() => scrollRight(activeCategoryData._id)}
                          className="p-1.5 sm:p-2 border border-gray-300 rounded-full hover:bg-red-600 hover:text-white transition text-xs"
                        >
                          <FiChevronRight size={isMobile ? 14 : 18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Products Section */}
                <div className="flex">
                   {/* Category Banner Card - Responsive Height */}
                    <motion.div 
                      variants={BanneritemVariants}
                      className="w-48 sm:w-64 md:w-80 shrink-0 rounded-lg overflow-hidden shadow-md border snap-start mr-6"
                      style={{ 
                        borderColor: categoryStyle.borderColor,
                        backgroundColor: categoryStyle.bgColor,
                        height: isMobile ? '320px' : '420px'
                      }}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={finalBgUrl}
                          alt={category.category_name}
                          fill
                          className="object-cover rounded-lg"
                          priority
                          sizes="(max-width: 640px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg" />
                        <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 text-white">
                          <h3 className="text-sm sm:text-lg font-bold mb-2">
                            {category.category_name}
                          </h3>
                          <Link
                            href={activeCategoryData.categoryRedirectUrl || `/category/${category.category_slug}`}
                            className="bg-white hover:bg-gray-100 text-red-700 text-xs sm:text-sm font-semibold py-1.5 sm:py-2 px-3 sm:px-4 rounded w-fit transition"
                            onClick={() => setNavigating(true)}
                          >
                            Shop Now →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  <div
                    className="flex overflow-x-auto space-x-3 sm:space-x-4 md:space-x-6 pb-3 scrollbar-hide scroll-smooth snap-x"
                    ref={(el) => (categoryScrollRefs.current[activeCategoryData._id] = el)}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                   

                    {/* Product Cards - Responsive Height */}
                    {products.map((product) => (
                      <motion.div
                        key={product._id}
                        variants={BanneritemVariants}
                        className="w-36 sm:w-44 md:w-56 shrink-0 snap-start"
                        style={{ height: isMobile ? '320px' : '420px' }}
                      >
                        <div className="relative bg-white flex flex-col justify-between p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-red-500 hover:shadow-md transition-all cursor-pointer h-full">
                          {/* Discount Badge */}
                          {Number(product.special_price) > 0 && Number(product.special_price) < Number(product.price) && (
                            <span className="absolute top-1.5 left-1.5 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded z-10">
                              -{Math.round(100 - (Number(product.special_price) / Number(product.price)) * 100)}%
                            </span>
                          )}

                          {/* Wishlist */}
                          <div className="absolute top-1.5 right-1.5 z-10">
                            <ProductCard productId={product._id} />
                          </div>

                          {/* Product Image */}
                          <div className="relative aspect-square bg-white mt-4 sm:mt-5 flex-shrink-0">
                            <Link
                              href={`/product/${product.slug}`}
                              onClick={() => handleProductClick(product)}
                            >
                              {product.images?.[0] && (
                                <Image
                                  src={product.images[0].startsWith("http") ? product.images[0] : `/uploads/products/${product.images[0]}`}
                                  alt={product.name}
                                  fill
                                  className="object-contain p-1 sm:p-2"
                                  sizes="(max-width: 640px) 50vw, 33vw"
                                  unoptimized
                                />
                              )}
                            </Link>
                          </div>

                          {/* Product Info */}
                          <div className="flex flex-col flex-grow mt-1 sm:mt-2 min-h-0">
                            {/* Brand Name */}
                            <h4 className="text-xs text-gray-500 mb-1 uppercase truncate">
                              <Link href={`/brand/${brandMap[product.brand]?.toLowerCase().replace(/\s+/g, "-") || ""}`} className="hover:text-red-600">
                                {brandMap[product.brand] || ""}
                              </Link>
                            </h4>

                            {/* Product Name */}
                            <Link
                              href={`/product/${product.slug}`}
                              onClick={() => handleProductClick(product)}
                              className="font-medium text-gray-900 hover:text-red-600 mb-1 sm:mb-2 line-clamp-2 text-xs sm:text-sm leading-tight flex-grow"
                            >
                              {product.name}
                            </Link>

                            {/* Price */}
                            <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2 flex-shrink-0">
                              <span className="text-sm sm:text-base font-bold text-red-600">
                                ₹ {(product.special_price > 0 && product.special_price < product.price
                                  ? Math.round(product.special_price)
                                  : Math.round(product.price)
                                ).toLocaleString()}
                              </span>
                              {product.special_price > 0 && product.special_price < product.price && (
                                <span className="text-xs sm:text-sm text-gray-500 line-through">
                                  ₹ {Math.round(product.price).toLocaleString()}
                                </span>
                              )}
                            </div>

                            {/* Stock Status */}
                            <p className={`text-xs mb-2 sm:mb-3 flex-shrink-0 ${product.stock_status === "In Stock" ? "text-green-600" : "text-red-600"}`}>
                              {product.stock_status}
                              {product.stock_status === "In Stock" && product.quantity ? `, ${product.quantity} units` : ""}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center justify-between gap-1 sm:gap-2 mt-auto flex-shrink-0">
                              <Addtocart
                                productId={product._id}
                                stockQuantity={product.quantity}
                                special_price={product.special_price}
                                className="flex-1 text-xs sm:text-sm py-1.5 sm:py-2"
                              />
                              <a
                                href={`https://wa.me/919942699800?text=${encodeURIComponent(`Check Out This Product: ${typeof window !== 'undefined' ? window.location.origin : ''}/product/${product.slug}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-green-500 hover:bg-green-600 text-white p-1.5 sm:p-2 rounded-full flex items-center justify-center transition flex-shrink-0"
                              >
                                <svg className="w-3 h-1 sm:w-4 sm:h-4" viewBox="0 0 32 32" fill="currentColor">
                                  <path d="M16.003 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.773.736 5.368 2.009 7.629L2 30l6.565-2.643A13.254 13.254 0 0016.003 29.333C23.36 29.333 29.333 23.36 29.333 16c0-7.36-5.973-13.333-13.33-13.333zm7.608 18.565c-.32.894-1.87 1.749-2.574 1.865-.657.104-1.479.148-2.385-.148-.55-.175-1.256-.412-2.162-.812-3.8-1.648-6.294-5.77-6.49-6.04-.192-.269-1.55-2.066-1.55-3.943 0-1.878.982-2.801 1.33-3.168.346-.364.75-.456 1.001-.456.25 0 .5.002.719.013.231.01.539-.088.845.643.32.768 1.085 2.669 1.18 2.863.096.192.16.423.03.683-.134.26-.2.423-.39.65-.192.231-.413.512-.589.689-.192.192-.391.401-.173.788.222.392.986 1.625 2.116 2.636 1.454 1.298 2.682 1.7 3.075 1.894.393.192.618.173.845-.096.23-.27.975-1.136 1.237-1.527.262-.392.524-.32.894-.192.375.13 2.35 1.107 2.75 1.308.393.205.656.308.75.48.096.173.096 1.003-.224 1.897z" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </motion.section>
    </>
  );
};

export default CategoryProducts;