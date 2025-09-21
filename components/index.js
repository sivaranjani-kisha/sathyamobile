"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion, useAnimation, useInView } from "framer-motion";
import { ShoppingCartSimple, CaretDown } from "@phosphor-icons/react";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HiArrowRight } from "react-icons/hi";
import { FiChevronLeft, FiChevronRight, FiShoppingCart } from 'react-icons/fi';
import { Heart, ShoppingCart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Addtocart from "@/components/AddToCart";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from "swiper/modules";
import RecentlyViewedProducts from '@/components/RecentlyViewedProducts';

import 'swiper/css';
import 'swiper/css/navigation';
export default function HomeComponent() {
  function slugify(text) {
    return text
      ?.toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")        // replace spaces with -
      .replace(/[^\w\-]+/g, "")    // remove special chars
      .replace(/\-\-+/g, "-");     // collapse multiple -
  }
     const features = [
    { image: "/images/delivery-truck.png", title: "Free Shipping", description: "Free shipping all over the US" },
    { image: "/images/reputation.png", title: "100% Satisfaction", description: "Guaranteed satisfaction with every order" },
    { image: "/images/payment-protection.png", title: "Secure Payments", description: "We ensure secure transactions" },
    { image: "/images/support.png", title: "24/7 Support", description: "We're here to help anytime" },
  ];
    const scrollContainerRef = useRef(null);
    const containerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isBannerLoading, setIsBannerLoading] = useState(true);
    const [isFlashSalesLoading, setIsFlashSalesLoading] = useState(true);
    const [navigating, setNavigating] = useState(false);
    const [bannerData, setBannerData] = useState({
        banner: {
        items: []
        }
    });
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [flashSalesData, setFlashSalesData] = useState([]);
    const [brands, setBrands] = useState([]);
    const [isBrandsLoading, setIsBrandsLoading] = useState(true);
    const [scrollDirection, setScrollDirection] = useState('down');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState();
    const [parentCategories, setParentCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [categoryBanner, setCategoryBanner] = useState([]);

    // Cateogry Scroll
    const categoryScrollRef = useRef(null);

const scrollCategories = (direction) => {
  if (categoryScrollRef.current) {
    categoryScrollRef.current.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  }
};
    // Fetch banner data
    useEffect(() => {
        const fetchBannerData = async () => {
            setIsBannerLoading(true);
            try {
                const response = await fetch('/api/design/get?bannerType=topbanner&status=active');
                const data = await response.json();
                
                if (data.success && data.data.length > 0) {
                    const bannerItems = data.data.map(banner => ({
                        id: banner._id,
                        title: banner.title,
                        //buttonText: "Explore Shop",
                        buttonLink: banner.redirectUrl || "/shop",
                        bgImageUrl: banner.bgImageUrl,
                        bannerImageUrl: banner.bannerImageUrl
                    }));
                    setBannerData({
                        banner: {
                        items: bannerItems
                        }
                    });
                }
            } catch (error) {
                console.error("Error fetching banner data:", error);
                setBannerData({
                    banner: {
                        items: [{
                            id: 1,
                            title: "Grocery Order and Get Express Delivery",
                            // buttonText: "Explore Shop",
                            buttonLink: "/shop",
                            bgImageUrl: "/images/banner-img1.png",
                            bannerImageUrl: "/images/banner-product.png"
                        }]
                    }
                });
            } finally {
                setIsBannerLoading(false);
            }
        };

        const fetchFlashSales = async () => {
            setIsFlashSalesLoading(true);
            try {
                const response = await fetch('/api/design/get?bannerType=flashsale&status=active');
                const data = await response.json();
                
                if (data.success && data.data.length > 0) {
                    const salesItems = data.data.map(item => ({
                        id: item._id,
                        title: item.title,
                        productImage: item.bannerImageUrl,
                        bgImage: item.bgImageUrl,
                        redirectUrl: item.redirectUrl || "/shop"
                    }));
                    setFlashSalesData(salesItems);
                }
            } catch (error) {
                console.error("Error fetching flash sales:", error);
                setFlashSalesData([
                    {
                    id: "fs1",
                    title: "Summer Fruits Special",
                    productImage: "/images/summer-fruits.png",
                    bgImage: "/images/sale-bg1.jpg",
                    redirectUrl: "/summer-sale"
                    },
                    {
                        id: "fs2",
                        title: "Organic Vegetables",
                        productImage: "/images/veggies.png",
                        bgImage: "/images/sale-bg2.jpg",
                        redirectUrl: "/vegetables"
                    }
                ]);
            } finally {
                setIsFlashSalesLoading(false);
            }
        };

        const fetchBrands = async () => {
            setIsBrandsLoading(true);
            try {
                const response = await fetch('/api/brand/get');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (data.success) {
                    setBrands(data.brands || []);
                }
            } catch (error) {
                console.error("Error fetching brands:", error);
                setBrands([]);
            } finally {
                setIsBrandsLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch("/api/categories/get");
                const data = await response.json();
                setCategories(data);
                const parentCategories = data.filter(
                category => category.parentid === "none" && category.status === "Active"
                );
                setParentCategories(parentCategories);
                setSelectedCategory(parentCategories[0]);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
    
        const fetchProducts = async () => {
            try {
                const response = await fetch("/api/product/get");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
    
        const fetchCategoryBanners = async()=>{
            try {
                const response = await fetch("/api/design/get"); // your existing API
                const res = await response.json();
                const data = res.data;
        
                // 1. Find the banner with bannerType === 'categorybanner'
                const categoryBannerData = data.find(item => item.bannerType === "categorybanner");
        
                // 2. If found, set categoryImages array
                if (categoryBannerData && categoryBannerData.categoryImages) {
                setCategoryBanner(categoryBannerData.categoryImages);
                }
            } catch (error) {
                console.error("Error fetching category banners:", error);
            }
        }
        fetchCategoryBanners(); fetchBannerData(); fetchFlashSales(); fetchBrands(); fetchCategories(); fetchProducts();
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        setHasMounted(true);
      }, []);
    
      useEffect(() => {
        if (!hasMounted) return;
      
        const savedCategories = localStorage.getItem('headerCategories');
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        }
      
        const fetchCategories = async () => {
          try {
            const response = await fetch('/api/categories/get');
            const data = await response.json();
            const parentCategories = data.filter(
              (category) => category.parentid === "none" && category.status === "Active"
            );
            setCategories(parentCategories);
            localStorage.setItem('headerCategories', JSON.stringify(parentCategories));
          } catch (error) {
            console.error("Error fetching categories:", error);
          }
        };
      
        fetchCategories();
        checkAuthStatus();
      }, [hasMounted]);

    // Animation controls
    const controls = useAnimation();
    const refs = {
        banner: useRef(null),
        flashSales: useRef(null),
        delivery: useRef(null),
    };
    const checkAuthStatus = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
    
          const response = await fetch('/api/auth/check', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
    
          if (response.ok) {
            const data = await response.json();
            setIsLoggedIn(true);
            setUserData(data.user);
          } else {
            localStorage.removeItem('token');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error checking auth status:", error);
        }
      };
    const isInView = {
        banner: useInView(refs.banner, { once: true, amount: 0.1 }),
        flashSales: useInView(refs.flashSales, { once: true, amount: 0.1 }),
        delivery: useInView(refs.delivery, { once: true, amount: 0.1 }),
    };
    useEffect(() => {
        if (isInView.banner) {
          controls.start("visible");
        }
    }, [isInView.banner, controls]);

   
  const CustomPrevArrow = ({ onClick }) => (
    <button onClick={onClick} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md z-10 hover:bg-gray-600"> ◀ </button>
  );

  const CustomNextArrow = ({ onClick }) => (
    <button onClick={onClick} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full shadow-md z-10 hover:bg-gray-600"> ▶ </button>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
  };


    const flashSalesSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            { 
                breakpoint: 1024,
                settings: {
                slidesToShow: 2,
                }
            },
            {
                breakpoint: 768,
                settings: {
                slidesToShow: 1,
                }
            }
        ]
    };

    const brandSettings = {
  infinite: true,
  speed: 5000, // Continuous effect
  slidesToShow: 7, // Default for large screens
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 0,
  cssEase: "linear",
  arrows: false,
  pauseOnHover: false,

  responsive: [
    {
      breakpoint: 1024, // Tablets
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 768, // Mobile
      settings: {
        slidesToShow: 3,
      },
    },
    {
      breakpoint: 480, // Extra-small devices
      settings: {
        slidesToShow: 2,
      },
    },
  ],
};

    // const brandSettings = {
    //     infinite: true,
    //     speed: 5000, // Higher speed for continuous effect
    //     slidesToShow: 7, // Adjust according to your design
    //     slidesToScroll: 1,
    //     autoplay: true,
    //     autoplaySpeed: 0, // 0ms delay between scrolls
    //     cssEase: "linear", // Smooth continuous scroll
    //     arrows: false, // Optional: hide arrows
    //     pauseOnHover: false, // Optional: keep scrolling on hover
    // };

    // const brandSettings = {
    //     dots: false,
    //     infinite: true,
    //     speed: 500,
    //     slidesToShow: 7,
    //     slidesToScroll: 1,
    //     autoplay: true,
    //     autoplaySpeed: 4000,
    //     responsive: [
    //         { breakpoint: 1024, settings: { slidesToShow: 4 } },
    //         { breakpoint: 768, settings: { slidesToShow: 2 } },
    //         { breakpoint: 480, settings: { slidesToShow: 1 } }
    //     ]
    // };
    
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
            when: "beforeChildren",
            staggerChildren: 0.2
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
            duration: 0.5,
            ease: "easeOut"
            }
        }
    };
    
    const sectionVariants = {
        hiddenDown: { y: 50, opacity: 0 },
        hiddenUp: { y: -50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
            duration: 0.6,
            ease: "easeOut"
            }
        }
    };

    const categoryRef = useRef(null);

    const scrollLeft = () => {
        scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    };
      
    const scrollRight = () => {
        scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    };
    
    const getSubcategorySlugs = (parentId) => {
    return categories
        .filter(cat => cat.parentid === parentId)
        .map(sub => sub.category_slug);
    };

    const filteredProducts = selectedCategory
    ? (() => {
        const subCategories = categories.filter(
          cat => cat.parentid === selectedCategory._id
        );
        console.log(selectedCategory);
        const validCategoryIds = [
          selectedCategory._id,
          ...subCategories.map(sub => sub._id)
        ];
        return products.filter(product => 
          product.category && 
          validCategoryIds.includes(product.category.toString())
        );
    })() : products;



    const handleProductClick = (product) => {
        if (navigating) return;

        setNavigating(true);
        const stored = JSON.parse(localStorage.getItem('recentlyViewed')) || [];

        const alreadyViewed = stored.find((p) => p._id === product._id);

        const updated = alreadyViewed
            ? stored.filter((p) => p._id !== product._id)
            : stored;

        updated.unshift(product); // Add to beginning

        const limited = updated.slice(0, 10); // Limit to 10 recent products

        localStorage.setItem('recentlyViewed', JSON.stringify(limited));
    };

   // 1. Define the handler function with proper parameters
const handleCategoryClick = useCallback((category) => (e) => {
    if (navigating) {
        e.preventDefault();
        return;
    }

    setNavigating(true);

    // Optional: Save to recently viewed categories
    // const stored = JSON.parse(localStorage.getItem('recentlyViewedCategories')) || [];
    // const updated = stored.filter(c => c._id !== category._id); // Remove if already exists
    // updated.unshift(category);
    // localStorage.setItem('recentlyViewedCategories', JSON.stringify(updated.slice(0, 10)));

    router.push(`/category/${category.category_slug}`);
}, [navigating, router]);



    // Handle route events
       useEffect(() => {
        const handleRouteChange = () => setNavigating(false);
    
        if (!router?.events?.on) return;
    
        router.events.on('routeChangeComplete', handleRouteChange);
        router.events.on('routeChangeError', handleRouteChange);
    
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
            router.events.off('routeChangeError', handleRouteChange);
        };
    }, [router]);


    const featuredCategory = parentCategories[0];
    const dealCategories = parentCategories.slice(1, 4);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;
    const [offers, setOffers] = useState([]);
    const [offerProducts, setOfferProducts] = useState([]);
    const bgClasses = ["bg-purple-50", "bg-green-50", "bg-amber-50", "bg-pink-50"];

    useEffect(() => {
      const fetchOfferProducts = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
    
          const res = await fetch('api/offers/offer-products', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            }
          });
          const data = await res.json();
  
          if (data.success) {
            setOfferProducts(data.data);
          }
        } catch (err) {
          console.error("Error loading offer products", err);
        }
      };
  
      fetchOfferProducts();
    }, []);
  
 
    return (
        <>

            {navigating && (
            <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black bg-opacity-30">
              <div className="p-4 rounded-lg shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-600 mx-auto"></div>
              </div>
            </div>
          )}
          {isLoading && (
            <div className="loading-overlay fixed inset-0 z-[9999] flex justify-center items-center bg-white">
              <div className="bounce-loader flex space-x-2">
                <div className="bounce1 w-3 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="bounce2 w-3 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                <div className="bounce3 w-3 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.4s]"></div>
              </div>
            </div>
          )}

            {/* main div start */}
            <div className={`relative transition-opacity duration-300 ${isLoading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`} ref={containerRef} >
              
                   
                 {/* Banner Section start */}
       <motion.section
  id="topbanner"
  ref={refs.banner}
  initial="hidden"
  animate="visible"
  variants={containerVariants}
  className="overflow-hidden pt-0 m-0"
>
  <div className="relative">
    {isBannerLoading ? (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    ) : bannerData.banner.items.length > 0 ? (
      bannerData.banner.items.length > 1 ? (
        <Slider {...settings} className="relative">
          {bannerData.banner.items.map((item) => (
            <motion.div
              key={item.id}
              className="relative w-full aspect-[2000/667]"
              variants={itemVariants}
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={item.bgImageUrl}
                  alt="Banner"
                  fill
                  quality={100}
                  className="object-fill w-full h-full"
                  style={{ objectPosition: "center 30%" }}
                  priority
                />
              </div>
            </motion.div>
          ))}
        </Slider>
      ) : (
        <motion.div
          className="p-4 md:p-6 relative aspect-[2000/667]"
          variants={itemVariants}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src={bannerData.banner.items[0].bgImageUrl}
              alt="Banner"
              fill
              className="object-fill w-full h-full"
              priority
            />
          </div>
        </motion.div>
      )
    ) : (
      <div className="p-6 text-center">
        <p className="text-lg">No active banners available</p>
      </div>
    )}
  </div>
</motion.section>

              {/* features code start */}
             {/* features code start */}
          <section className="pt-7 px-4 sm:px-6 md:px-6" id="features">
<div className="max-w-7xl mx-auto px-4">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
{features.map((feature, index) => (
  <div
    key={index}
    className="flex flex-col items-center cursor-pointer group"
    onMouseEnter={(e) => {
      const img = e.currentTarget.querySelector(".img-flip");
      if (img) img.style.transform = "rotateY(360deg)";
    }}
    onMouseLeave={(e) => {
      const img = e.currentTarget.querySelector(".img-flip");
      if (img) img.style.transform = "rotateY(0deg)";
    }}
  >
    {/* Image instead of Icon */}
    <div
      className="mb-4 img-flip"
      style={{
        transition: "transform 0.5s",
        transformStyle: "preserve-3d",
      }}
    >
      <img
        src={feature.image}
        alt={feature.title}
        className="w-16 h-16 object-contain"
      />
    </div>

    {/* Title */}
    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:transition-colors duration-300">
      {feature.title}
    </h3>

    {/* Description */}
    <p className="text-gray-600 text-sm leading-relaxed max-w-[250px] group-hover:transition-colors duration-300">
      {feature.description}
    </p>
  </div>
))}
</div>
</div>
</section>

<motion.section id="brands"
                      ref={refs.delivery} 
                      initial={scrollDirection === 'down' ? 'hiddenDown' : 'hiddenUp'} 
                      animate= 'visible' 
                      variants={sectionVariants} 
                      className="px-4 sm:px-6 md:px-6 pt-7"
                  >
                      <div>
                          <motion.div variants={containerVariants} className="  rounded-[23px] mx-2">
                              <motion.div variants={itemVariants} className="flex justify-between items-center mb-4">
                                  <h5 className= "text-lg font-semibold">Shop by Brands</h5>
                              </motion.div>

                              {isBrandsLoading ? (
                                  <div className="flex justify-center items-center h-32">
                                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                                  </div>
                              ) : (
                                  <motion.div variants={itemVariants}>
                                      <Slider {...brandSettings} className="brand-slider px-2 sm:px-[50px] relative">
                                          {brands.map((brand) => (
                                              <motion.div
                                                  key={brand.id}
                                                  className="p-4 flex justify-center items-center"
                                                  whileHover={{ scale: 1.1 }}
                                              >
                                              <div className="w-24 h-24 flex items-center justify-center overflow-hidden">
                                                <Link href={`/brand/${slugify(brand.brand_name)}`}>
                                                  <Image
                                                    src={`/uploads/Brands/${brand.image}`}
                                                    alt={brand.brand_name || "Brand Logo"}
                                                    width={100}
                                                    height={100}
                                                    className="object-contain w-full h-full cursor-pointer"
                                                    unoptimized
                                                  />
                                                </Link>
                                              </div>
                                              </motion.div>
                                          ))}
                                      </Slider>
                                  </motion.div>
                              )}
                          </motion.div>
                      </div>
                  </motion.section>
             {/* Existing offer code start */}

             {/* Existing offer code start */}
              {offerProducts.length > 0 && (
                <div className="px-2 py-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Exciting Offers</h2>
                    {offerProducts.length > 3 && (
                      <div className="flex gap-2">
                        {/* Optional navigation buttons */}
                      </div>
                    )}
                  </div>

                  {/* Mobile view: static grid */}
                  {offerProducts.length >= 3 && (
                    <div className="grid grid-cols-2 gap-4 sm:hidden">
                      {offerProducts.slice(0, 4).map((product, index) => (
                        <div
                          key={product._id}
                          className={`card rounded-lg shadow-sm h-[140px] min-h-[140px] flex overflow-hidden ${bgClasses[index % bgClasses.length]}`}
                        >
                          <div className="flex items-center">
                            <div className="w-1/3 p-2">
                              <Link href={`/product/${product.slug}`} className="block">
                                <div className="h-[100px] sm:h-[120px] md:h-[130px] bg-white flex items-center justify-center overflow-hidden rounded-md">
                                  <img
                                    src={`/uploads/products/${product.images?.[0]}` || "/placeholder.jpg"}
                                    alt={product.item_code}
                                    className="object-contain w-full h-full"
                                  />
                                </div>
                              </Link>
                            </div>
                            <div className="w-2/3 p-4">
                              <Link href={`/product/${product.slug}`} className="block">
                                <div className="text-sm line-clamp-2">{product.name}</div>
                              </Link>
                              <div className="mt-1">
                                <span className="text-sm font-medium text-gray-700">Rs.</span>
                                <span className="ml-1 font-semibold">{product.price}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-1">
                                <div className="text-sm font-medium text-gray-400 line-through whitespace-nowrap">
                                  <span className="text-sm font-medium text-gray-400">Rs.</span>
                                  {product.special_price ? product.price : product.price + 20}
                                </div>
                                <div className="text-xs font-semibold text-green-600 bg-white rounded px-2 py-0.5 whitespace-nowrap">
                                  {product.special_price ? "Special Offer" : "Limited Time"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Desktop view: Swiper */}
                  <div className="hidden sm:block">
                    {offerProducts.length && (
                      <Swiper
                        modules={[Navigation, Autoplay]}
                        navigation={{
                          nextEl: ".swiper-button-next",
                          prevEl: ".swiper-button-prev",
                        }}
                        autoplay={{
                          delay: 5000,
                          disableOnInteraction: false,
                        }}
                        slidesPerView={4}
                        spaceBetween={0}
                        loop={true}
                      >
                        {offerProducts.map((product, index) => (
                          <SwiperSlide key={product._id}>
                            <div
                              className={`card rounded-lg shadow-sm h-[140px] min-h-[140px] flex overflow-hidden ${bgClasses[index % bgClasses.length]}`}
                            >
                              <div className="flex items-center">
                                <div className="w-1/3 p-2">
                                  <Link href={`/product/${product.slug}`} className="block">
                                    <div className="h-[100px] sm:h-[120px] md:h-[130px] flex items-center justify-center overflow-hidden rounded-md">
                                      <img
                                        src={`/uploads/products/${product.images?.[0]}` || "/placeholder.jpg"}
                                        alt={product.item_code}
                                        className="object-contain w-full h-full"
                                      />
                                    </div>
                                  </Link>
                                </div>
                                <div className="w-2/3 p-4">
                                  <Link href={`/product/${product.slug}`} className="block">
                                    <div className="text-sm line-clamp-2">{product.name}</div>
                                  </Link>
                                  <div className="mt-1">
                                    <span className="text-sm font-medium text-gray-700">Rs.</span>
                                    <span className="ml-1 font-semibold">{product.price}</span>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <div className="text-sm font-medium text-gray-400 line-through whitespace-nowrap">
                                      <span className="text-sm font-medium text-gray-400">Rs.</span>
                                      {product.special_price ? product.price : product.price + 20}
                                    </div>
                                    <div className="text-sm font-semibold text-green-600 bg-white rounded px-2 whitespace-nowrap">
                                      {product.special_price ? "Special Offer" : "Limited Time"}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    )}
                  </div>
                </div>
              )}







               

                {/* flash sale section code start */}
                <motion.section
                ref={refs.flashSales}
                initial="hiddenDown"
                animate={isInView.flashSales ? "visible" : "hiddenDown"}
                variants={sectionVariants}
                id="flash-sales-section"
                className=""
                >
                {flashSalesData.filter(item => item.bgImage && item.productImage).length > 0 && (
                <div className="py-2">
                    <motion.div
                    variants={itemVariants}
                    className="section-heading flex justify-between items-center mb-4 p-2"
                    >
                    <h5 className="text-2xl font-bold text-red-500">Categories</h5>
                    {/* <a href="/shop" className="text-sm font-medium text-gray-700 hover:underline">
                        View All Deals
                    </a> */}
                    </motion.div>

                    {isFlashSalesLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                    </div>
                    ) : flashSalesData.length === 1 && flashSalesData[0].bgImage && flashSalesData[0].productImage ? (
                    <motion.div variants={itemVariants} className="px-2">
                        <motion.div
                        whileHover={{ y: -5 }}
                        className="relative p-6 rounded-lg shadow-lg h-full min-h-[250px] flex items-center overflow-hidden"
                        style={{
                            backgroundImage: `url(${flashSalesData[0].bgImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"
                        }}
                        >
                        <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-center">
                            <div className="w-full md:w-1/2 flex justify-center items-center overflow-hidden">
                            <Image
                                src={flashSalesData[0].productImage}
                                alt={flashSalesData[0].title}
                                width={180}
                                height={180}
                                className="object-contain max-h-[180px] transform transition-transform duration-300 hover:scale-110"
                            />
                            </div>
                            <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center mt-4 md:mt-0 md:pl-4">
                            <h6 className="text-xl font-semibold mb-2 text-gray-900">{flashSalesData[0].title}</h6>
                            <motion.a
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                href={flashSalesData[0].redirectUrl}
                                className="mt-auto px-4 py-2 bg-red-600 text-white rounded-full text-center hover:bg-red-700 transition"
                            >
                                Shop Now →
                            </motion.a>
                            </div>
                        </div>
                        </motion.div>
                    </motion.div>
                    ) : (
                    <motion.div variants={itemVariants}>
                        <Slider {...flashSalesSettings} className="flash-sales-slider relative">
                        {flashSalesData
                            .filter(item => item.bgImage && item.productImage)
                            .map(item => (
                            <div key={item.id} className="px-2">
                                <motion.div
                                className="relative p-6 rounded-lg shadow-lg h-full min-h-[250px] flex items-center overflow-hidden"
                                style={{
                                    backgroundImage: `url(${item.bgImage})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center"
                                }}
                                >
                                <div className="relative z-10 w-full flex flex-col md:flex-row items-center justify-center">
                                    <div className="w-full md:w-1/2 flex justify-center items-center overflow-hidden">
                                    <Image
                                        src={item.productImage}
                                        alt={item.title}
                                        width={180}
                                        height={180}
                                        className="object-contain max-h-[180px] transform transition-transform duration-300 hover:scale-110"
                                    />
                                    </div>
                                    <div className="w-full md:w-1/2 flex flex-col justify-center items-center text-center mt-4 md:mt-0 md:pl-4">
                                       <motion.h6 
                                            className="text-xl font-semibold mb-2 text-gray-900"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                                            >
                                            {item.title}
                                        </motion.h6>
                                    <motion.a
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={item.redirectUrl}
                                        className="mt-auto px-4 py-2 bg-red-500 text-white rounded-full text-center hover:bg-red-600 transition"
                                    >
                                        Shop Now →
                                    </motion.a>
                                    </div>
                                </div>
                                </motion.div>
                            </div>
                            ))}
                        </Slider>
                    </motion.div>
                    )}
                </div>
                )}
                </motion.section>


             


                {/* recomended product sections */}
               <motion.section className="mb-10 px-4 mt-5">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    {/* Section Header with scroll buttons */}
                    <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-red-500">Shop by Category Products</h2>
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


                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                      {parentCategories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-full border transition text-sm font-medium ${
                            selectedCategory?._id === category._id
                              ? "bg-red-600 text-white border-red-600"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {category.category_name}
                        </button>
                      ))}
                    </div>

                    {/* Product List */}
                    {filteredProducts.length === 0 ? (
                      <div className="text-center text-gray-500 font-medium py-10">
                        No products found for this category.
                      </div>
                    ) : (
                      <div className="relative">
                        {/* Scrollable container */}
                        <div
                          className="flex overflow-x-auto space-x-6 pb-2 no-scrollbar"
                          ref={scrollContainerRef}
                        >
                          {/* Optional Category Banner */}
                          {selectedCategory && (
                            <div className="w-[280px] shrink-0 bg-red-50 border border-red-100 rounded-lg p-4 flex flex-col justify-between">
                              <h3 className="text-lg font-semibold text-red-800 mb-3">
                                {selectedCategory.category_name}
                              </h3>
                              <div className="flex items-center justify-center py-4">
                                <img
                                  src={selectedCategory.image}
                                  alt={selectedCategory.category_name}
                                  className="h-32 object-contain"
                                />
                              </div>
                              <Link
                                href={`/category/${selectedCategory.category_slug || selectedCategory._id}`}
                                className="mt-4 block bg-red-600 text-white text-center py-2 rounded hover:bg-red-700 transition"
                              >
                                Shop Now →
                              </Link>
                            </div>
                          )}

                          {/* Product Cards */}
                         {filteredProducts
                          .filter((product) => product.status === "Active")
                          .map((product) => (
                            <div key={product._id} className="w-[280px] shrink-0">
                              <motion.div
                                whileHover={{ y: -3 }}
                                className="relative bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col h-full"
                              >
                                {product.special_price && (
                                  <span className="absolute top-3 left-3 text-xs bg-red-500 text-white px-2 py-0.5 rounded">
                                    {Math.round(((product.price - product.special_price) / product.price) * 100)}% OFF
                                  </span>
                                )}
                                        {/* Top-right Wishlist Icon */}
                                <div className="absolute top-3 right-3 z-10">
                                  <ProductCard productId={product._id} />
                                </div>

                                <div className="h-40 flex items-center justify-center mb-4">
                                  <img
                                    src={`/uploads/products/${product.images?.[0]}` || "/placeholder.jpg"}
                                    alt={product.images?.[0] || "Product image"}
                                    className="max-h-full object-contain"
                                  />
                                </div>
                                <Link
                                  href={`/product/${encodeURIComponent(product.slug || product._id)}`}
                                  className="font-semibold text-gray-800 hover:text-red-600 mb-2 line-clamp-2"
                                >
                                  {product.name}
                                </Link>
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
                                <div className="flex gap-2 mt-auto">
                                  <Addtocart productId={product._id} stockQuantity={product.quantity} className="flex-1" />
                                  <a
                                    href={`https://wa.me/?text=Check this out: ${product.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full flex items-center justify-center"
                                  >
                                    <svg className="w-5 h-5" viewBox="0 0 32 32" fill="currentColor">
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



                  <RecentlyViewedProducts />
                {/* Hot deal section - showing only parent categories */}
                
            </div>
        </>
    );
}