'use client';
import ProductDetailsSection from "@/components/ProductDetailsSection";
import RelatedProducts from "@/components/RelatedProducts";
import {  useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { FaShoppingCart, FaHeart, FaShareAlt, FaRupeeSign, FaCartPlus, FaBell } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";
import { IoFastFoodOutline, IoReload, IoCardOutline, IoShieldCheckmark, IoStorefront } from "react-icons/io5";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Addtocart from "@/components/AddToCart";
import ProductBreadcrumb from "@/components/ProductBreadcrumb";
import RazorpayOffers from "@/components/RazorpayOffers";

export default function ProductPage() {
  const { slug } = useParams();
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showEMIModal, setShowEMIModal] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);


  // In your ProductPage component, add these state variables near the top:
const [selectedFrequentProducts, setSelectedFrequentProducts] = useState([]);
const [cartTotal, setCartTotal] = useState(0);
const [selectedWarranty, setSelectedWarranty] = useState(null);
const [selectedExtendedWarranty, setSelectedExtendedWarranty] = useState(null);



// Add this function to handle frequent product selection
const toggleFrequentProduct = (product) => {
  setSelectedFrequentProducts(prev => {
    const existingIndex = prev.findIndex(p => p._id === product._id);
    if (existingIndex >= 0) {
      return prev.filter(p => p._id !== product._id);
    } else {
      return [...prev, product];
    }
  });
};

//  Add this useEffect to calculate the cart total whenever selected products change
useEffect(() => {
  let total = product ? (product.special_price || product.price) * quantity : 0;

  selectedFrequentProducts.forEach(item => {
    total += (item.special_price || item.price);
  });

  if (selectedWarranty) total += selectedWarranty;
  if (selectedExtendedWarranty) total += selectedExtendedWarranty;

  setCartTotal(total);
}, [selectedFrequentProducts, product, quantity, selectedWarranty, selectedExtendedWarranty]);


useEffect(() => {
  const fetchFeaturedProducts = async () => {
    if (!product?.featured_products?.length) return;

    const res = await fetch('/api/product/featured', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: product.featured_products }),
    });

    const data = await res.json();
    setFeaturedProducts(data);
  };
  

  fetchFeaturedProducts();
}, [product]);

  const [selectedImage, setSelectedImage] = useState(null);

      useEffect(() => {
        if (product?.images?.[0]) {
          setSelectedImage(`/uploads/products/${product.images[0]}`);
        }
      }, [product]);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0, visible: false });
  const imgRef = useRef(null);
  const zoomContainerRef = useRef(null);
  const [showReplacementModal, setShowReplacementModal] = useState(false);
  const [showWarrantyModal, setshowWarrantyModal] = useState(false);
  const [showGstInvoiceModal, setshowGstInvoiceModal] = useState(false);
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/product/${slug}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // If API returns an array, find the product with matching slug
        if (Array.isArray(data)) {
          const foundProduct = data.find(p => p.slug === slug);
          if (!foundProduct) {
            throw new Error("Product not found");
          }
          setProduct(foundProduct);
        } 
        // If API returns a single product object
        else if (data && data.slug) {
          setProduct(data);
        }
        else {
          throw new Error("Invalid product data");
        }
  
        if (product?.images?.length > 0) {
          setSelectedImage(`/uploads/products/${product.images[0]}`);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Something went wrong");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
  
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  
  

  const handleThumbnailClick = (index) => {
    const imagePath = product.images?.[index];
    if (imagePath) {
      setSelectedImage(`/uploads/products/${imagePath}`);
    }
  };
  const handleMouseMove = (e) => {
    if (!imgRef.current || !zoomContainerRef.current) return;
  
    const { left, top, width, height } = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
  
    setZoomPosition({ x, y, visible: true });
  };
  
  const handleMouseLeave = () => {
    setZoomPosition((prev) => ({ ...prev, visible: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">{error}</h2>
          <Link href="/" className="mt-4 inline-flex items-center text-blue-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!product || !product.name ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <Link href="/" className="mt-4 inline-flex items-center text-blue-600">
            ← Back to Homee
          </Link>
        </div>
      </div>
    );
  }

  if (!product || !product.images) {
    return null; // or return a skeleton/loading spinner
  }
  

  return (
    <div className="bg-white min-h-screen overflow-x-hidden">
      {/* 🟠 Wishlist Header Bar */}
      {/* <div className="bg-blue-50 py-6 px-8 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Shop Details</h2>
        <div className="flex items-center space-x-2">
          <Link href="/" className="text-gray-600 hover:text-blue-600">🏠 Home</Link>
          <span className="text-gray-500">›</span>
          <span className="text-blue-600 font-semibold">Shop Details</span>
        </div>
      </div> */}

      <div className="container mx-auto px-4 py-8">
         {/* Breadcrumb - moved outside the grid but inside container */}
         <ProductBreadcrumb product={product} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Section - Product Image with Zoom */}
          <div className="md:col-span-4 relative sticky top-20">
            <div className="border border-gray-400 rounded-lg">
               {/* Main Image with fixed aspect ratio */}
          <div className="relative aspect-square w-full px-7">
            <img
              src={selectedImage || "/no-image.jpg"}
              alt={product?.name || "Product"}
              className="w-full h-full object-contain rounded-xl"
              ref={imgRef}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/no-image.jpg";
              }}
            />
          </div>
          {/* Zoom Box */}
          {zoomPosition.visible && (
            <div
              className="absolute left-full top-0 ml-4 w-[300px] h-[300px] border border-gray-300 bg-white shadow-lg overflow-hidden"
              ref={zoomContainerRef}
            >
              <img
                src={selectedImage || "/no-image.jpg"}
                alt="Zoomed"
                className="absolute w-[400%] h-[400%] object-cover"
                style={{
                  left: `-${zoomPosition.x * 3}%`,
                  top: `-${zoomPosition.y * 3}%`
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/no-image.jpg";
                }}
              />
            </div>
          )}

            </div>
            
           
        

        {/* Thumbnails */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-2 -mt-1">
          {product.images?.length > 0 ? (
            product.images.map((image, index) => (
              <div key={index} className="flex-shrink-0">
                <img
                  src={`/uploads/products/${image}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 border border-gray-400 rounded-lg cursor-pointer hover:scale-110 transition-transform duration-300 object-cover"
                  onClick={() => handleThumbnailClick(index)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/no-image.jpg";
                  }}
                />
              </div>
            ))
          ) : (
            <img
              src="/no-image.jpg"
              alt="No Thumbnail"
              className="w-20 h-20 border border-gray-400 rounded-lg object-cover"
            />
          )}
        </div>
          </div>


          {/* Middle Section */}
          <div className="md:col-span-5">
            <h1 className="text-1xl font-semibold">{product.name}</h1>
            <div className="mt-2 pb-3 border-b border-gray-400">
            {/* Top Row - Item Code and Quantity Label */}
            <div className="flex items-center space-x-2 text-sm mb-1">
              <span className="text-gray-500 text-xs">{product.item_code}</span>
              <p className="text-gray-700 font-semibold">Quantity:</p>
            </div>

            {/* Bottom Row - All elements in one line */}
            <div className="flex items-center gap-4">
              {/* Price Section */}
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-customBlue">
                  Rs.{product.special_price || product.price}
                </span>
                {product.special_price && (
                  <span className="text-gray-500 line-through text-sm">
                    Rs.{product.price}
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center border border-gray-300 rounded-full h-8">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="px-2 py-1 border-r text-xs"
                >
                  -
                </button>
                <span className="px-2 py-1 text-xs w-6 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="px-2 py-1 border-l text-xs"
                >
                  +
                </button>
              </div>

              {/* Add to Cart Button */}
              <div className="flex-shrink-0">
                <Addtocart
                    productId={product._id}
                    quantity={quantity}
                    additionalProducts={selectedFrequentProducts.map(p => p._id)}
                    warranty={selectedWarranty}
                    extendedWarranty={selectedExtendedWarranty}
                    selectedFrequentProducts={selectedFrequentProducts}
                  />

              </div>

              {/* Action Buttons */}
                <div className="flex items-center gap-1">
                            <ProductCard productId={product._id} />
                              <button className="w-6 h-6 flex items-center justify-center rounded-full transition duration-300 ease-in-out bg-gray-200 hover:bg-blue-600 text-blue-600 hover:text-white">
                                <FaShareAlt size={10} />
                              </button>
                              <button className="w-6 h-6 flex items-center justify-center rounded-full transition duration-300 ease-in-out bg-gray-200 hover:bg-blue-600 text-blue-600 hover:text-white">
                                <FaBell size={10} />
                              </button>
                            </div>
            </div>
          </div>
            {/* <p className="text-gray-700 text-sm mt-3 font-medium">
              {product.sku || "N/A"}
            </p> */}
            
            {/* Color Variant Section */}
            {/* <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Colour Variant:</h3>
              <div className="flex gap-[10px] mt-1">
              {product.variants && product.variants.length > 0 ? (
                  product.variants.slice(0, 3).map((variant, index) => (
                    <div key={index} className="w-[80px] h-[80px] flex items-center justify-center">
                      <img 
                        src={variant.image} 
                        alt={`Variant ${index + 1}`} 
                        className="w-full h-full object-cover border border-gray-300 rounded-md"
                        
                      />
                    </div>
                  ))
                ) : (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="w-[80px] h-[80px] bg-gray-200 rounded-md" />
                  ))
                )}
              </div>
            </div> */}

            {product.variants && product.variants.length > 0 && (
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Colour Variant:</h3>
                <div className="flex gap-[10px] mt-1">
                  {product.variants.slice(0, 3).map((variant, index) => (
                    <div key={index} className="w-[80px] h-[80px] flex items-center justify-center">
                      <img 
                        src={variant.image} 
                        alt={`Variant ${index + 1}`} 
                        className="w-full h-full object-cover border border-gray-300 rounded-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Stock Alert */}
            <div className="mt-4">
              {/* <p className="font-semibold">⚠ Products are almost sold out</p> */}

              {product.quantity < 5 ? (
                <p className="font-semibold text-red-600">⚠ Products are almost sold out</p>
              ) : (
                <p className="font-semibold text-green-600">✅ In stock. Order anytime.</p>
              )}
              <p className="text-gray-600 text-sm mt-1">Available only: <span className="font-bold">{product.quantity}</span></p>
            </div>

            {/* Add this code right after the Stock Alert section */}
              {/* <div className="border-2 border-customBlue rounded-lg overflow-hidden bg-blue-50 shadow-md mt-4">
              
                <div className="bg-customBlue px-4 py-3 rounded-t-lg">
                  <h3 className="text-base font-semibold text-white">
                    EMI OPTIONS AVAILABLE
                  </h3>
                </div>

               
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img 
                        src="/emi-bank-logos.png" 
                        alt="Bank Logos" 
                        className="h-6 w-auto"
                      />
                      <span className="text-sm text-blue-700">
                        From <span className="font-bold">₹{Math.floor((product.special_price || product.price) / 6)}</span>/month
                      </span>
                    </div>
                    <button className="text-sm font-semibold text-blue-700 hover:underline">
                      View Plans
                    </button>
                  </div>
                  <p className="text-xs text-blue-600">
                    Credit Card EMI available on orders above ₹5,000
                  </p>
                </div>
              </div> */}

{/* <h4><b>Available offers</b></h4> */}
                  
                           
                           <RazorpayOffers amount={product.special_price} />
 
 


{/* EMI Modal */}
{showEMIModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg w-full max-w-md mx-4">
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-semibold">EMI Options</h3>
        <button 
          onClick={() => setShowEMIModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Credit Card EMI</h4>
          <div className="space-y-3">
            {[
              { bank: 'HDFC Bank', tenure: '3 Months', emi: Math.floor((product.special_price || product.price) / 3) },
              { bank: 'ICICI Bank', tenure: '6 Months', emi: Math.floor((product.special_price || product.price) / 6) },
              { bank: 'SBI Card', tenure: '9 Months', emi: Math.floor((product.special_price || product.price) / 9) },
              { bank: 'Axis Bank', tenure: '12 Months', emi: Math.floor((product.special_price || product.price) / 12) },
            ].map((option, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{option.bank}</div>
                  <div className="text-xs text-gray-500">{option.tenure}</div>
                </div>
                <div className="font-semibold">₹{option.emi}/month</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-4">
          <h4 className="font-medium text-sm mb-2">Debit Card EMI</h4>
          <div className="space-y-3">
            {[
              { bank: 'Kotak Bank', tenure: '6 Months', emi: Math.floor((product.special_price || product.price) / 6) },
              { bank: 'IndusInd Bank', tenure: '9 Months', emi: Math.floor((product.special_price || product.price) / 9) },
            ].map((option, index) => (
              <div key={index} className="flex justify-between items-center p-2 border rounded">
                <div>
                  <div className="font-medium text-sm">{option.bank}</div>
                  <div className="text-xs text-gray-500">{option.tenure}</div>
                </div>
                <div className="font-semibold">₹{option.emi}/month</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-4 border-t text-sm">
        <p className="text-gray-600 mb-2">* Interest rates may vary based on your bank's policies</p>
        <button 
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium"
          onClick={() => setShowEMIModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

            {/* Product More Info */}

            <div className="mt-4 bg-gray-50 p-4 rounded-md">
  <div 
    className="flex items-center justify-between cursor-pointer"
    onClick={() => setShowMoreInfo(!showMoreInfo)}
  >
    <h3 className="text-sm font-semibold text-gray-900">MORE INFO</h3>
    <svg 
      className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showMoreInfo ? 'transform rotate-180' : ''}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  </div>

  {showMoreInfo && (
    <div className="mt-3">
      <div className="flex flex-row gap-4">
        {/* Image Section (Left) */}
        <div className="w-[30%] flex-shrink-0">
          <img
            src={selectedImage || "/user/placeholder.png"}
            alt={product?.name || "Product"}
            className="w-full h-auto max-w-[150px] max-h-[150px] object-contain rounded-md border border-gray-200 mx-auto"
          />
        </div>
        
        {/* Content Section (Right) */}
        <div className="w-[70%] flex flex-col">
          {/* Brand Information */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Brand</h4>
            <p className="text-gray-700 text-sm">
              {product.brand || "No brand information available"}
            </p>
          </div>

          {/* Quantity Information */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-1">Available Quantity</h4>
            <p className="text-gray-700 text-sm">
              {product.quantity ? `${product.quantity} units available` : "Out of stock"}
            </p>
            {product.quantity && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div 
                  className="bg-green-600 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, product.quantity)}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )}
</div>

            <div className="border-b border-gray-400 mt-2"></div>

            {/* Product feature section */}

            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowFeatures(!showFeatures)}
              >
                <h3 className="text-sm font-semibold text-gray-900">PRODUCT FEATURES</h3>
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showFeatures ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
    
                {showFeatures && (
                <div className="mt-3">
                  <div className="flex flex-row gap-4">
                      {/* Product Description */}
                      <p className="text-gray-700 text-sm text-justify">
                        {product.key_specifications ? 
                          product.key_specifications.split(' ').slice(0, 50).join(' ') + (product.description.split(' ').length > 50 ? '...' : '') 
                          : "No Features available"
                        }
                      </p>
                    </div>
                </div>
              )}
            </div>

            <div className="border-b border-gray-400 mt-2"></div>

            {/* Product highlight section */}
            {/* <div className="mt-4 bg-gray-50 p-4 rounded-md">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setShowHighlights(!showHighlights)}
                >
                  <h3 className="text-sm font-semibold text-gray-900">PRODUCT HIGHLIGHTS</h3>
                  <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showHighlights ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                  {showHighlights && (
                    <div className="mt-3">
                      {product.highlights && product.highlights.trim() !== '' ? (
                        <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-600">
                          {product.highlights
                            .split('\n')
                            .filter(item => item.trim() !== '')
                            .map((item, index) => (
                              <li key={index}>{item.trim()}</li>
                            ))}
                        </ol>
                      ) : (
                        <p className="text-xs text-gray-500">No highlights available.</p>
                      )}
                    </div>
                  )}
            </div> */}
            <div className="mt-4 bg-gray-50 p-4 rounded-md">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowHighlights(!showHighlights)}
              >
                <h3 className="text-sm font-semibold text-gray-900">PRODUCT HIGHLIGHTS</h3>
                <svg 
                  className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showHighlights ? 'transform rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {showHighlights && (
                <div className="mt-3">
                  {product.product_highlights && product.product_highlights.length > 0 ? (
                    <ol className="list-decimal pl-5 space-y-1 text-xs text-gray-600">
                      {product.product_highlights.map((item, index) => (
                        <li key={index}>{item.trim()}</li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-xs text-gray-500">No highlights available.</p>
                  )}
                </div>
              )}
            </div>

          <div className="border-b border-gray-400 mt-2"></div>

            {/* Coupons */}
            {/* <div className="mt-4">
              <div className="flex items-center justify-between border border-blue-400 rounded-md p-2 mb-3">
                <div className="flex items-center gap-1">
                  //  <span className="text-gray-600 text-sm">➕</span> 
                  <span className="inline-flex items-center justify-center w-4 h-4 text-white bg-gray-600 rounded-full text-lg">+</span>

                  <span className="text-gray-700 text-xs">Mfr. coupon. $3.00 off 5</span>
                </div>
                <button className="text-blue-500 text-xs font-semibold hover:underline">
                  View Details
                </button>
              </div>
              <div className="mt-1 text-gray-900 text-xs font-medium">
                <p>Buy 1, Get 1 FREE</p>
                <p>Buy 1, Get 1 FREE</p>
              </div>
            </div> */}

       <div className="mt-4">
  {/* Responsive 3 Boxes Section */}
  <div className="mt-3 flex flex-col md:flex-row md:justify-between gap-2 space-y-2 md:space-y-0">
    {/* Replacement Box */}
    <div
      className="flex items-start bg-blue-50 border border-blue-200 rounded-md p-4 w-full md:w-1/3 shadow-sm cursor-pointer"
      onClick={() => setShowReplacementModal(true)}
    >
      <span className="text-blue-500 text-xl mr-3 mt-1">🔁</span>
      <div>
        <div className="text-sm font-semibold text-blue-800">Replacement</div>
        <div className="text-xs text-blue-600">in 7 days</div>
      </div>
    </div>

    {/* Warranty Box */}
    <div
      className="flex items-start bg-blue-50 border border-blue-200 rounded-md p-4 w-full md:w-1/3 shadow-sm cursor-pointer"
      onClick={() => setshowWarrantyModal(true)}
    >
      <span className="text-green-500 text-xl mr-3 mt-1">🛡️</span>
      <div>
        <div className="text-sm font-semibold text-blue-800">Warranty</div>
        <div className="text-xs text-blue-600">in 1 Year</div>
      </div>
    </div>

    {/* GST Invoice Box */}
    <div
      className="flex items-start bg-blue-50 border border-blue-200 rounded-md p-4 w-full md:w-1/3 shadow-sm cursor-pointer"
      onClick={() => setshowGstInvoiceModal(true)}
    >
      <span className="text-yellow-500 text-xl mr-3 mt-1">📄</span>
      <div>
        <div className="text-sm font-semibold text-blue-800">GST Invoice</div>
        <div className="text-xs text-blue-600">Available</div>
      </div>
    </div>
  </div>

            {/* Modal */}
            {showReplacementModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-semibold text-blue-800">Replacement</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700 text-xl"
                      onClick={() => setShowReplacementModal(false)}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="mt-4 text-sm text-gray-700 space-y-2 max-h-[60vh] scrollbar-hide overflow-y-auto">
                    <p>Please go through the mentioned Replacement policy before placing an order.</p>
                    <p>
                      Should you receive an item with physical damages, please note that you should
                      contact us within 48 hours, (In the case of Brands like Apple, 24 hours), without
                      using the product and without breaching Poorvika's Online Replacement Policy. If
                      you fail to follow these, the replacement claim will become void.
                    </p>
                    <p>
                      Products you purchased from Poorvika Online are only eligible for Replacement, under
                      the following conditions during delivery:
                    </p>
                    <ul className="list-disc pl-6">
                      <li>Physical Damage to the Product</li>
                      <li>Defective Product</li>
                      <li>Wrong product received</li>
                      <li>Broken Seal</li>
                    </ul>
                    <p className="font-semibold">Replacement of Mobile Phone:</p>
                    <p>
                      In case you receive an item that is not in perfect condition, please contact us
                      immediately. Important - DO NOT INSERT THE SIM and DO NOT CONNECT TO WIFI (Adhering
                      to Poorvika's Online Replacement Policy).
                    </p>
                    <p className="font-semibold">Void Claim:</p>
                    <p>
                      Please note that if you do not abide by Poorvika Online's Replacement Policy and/or
                      on ignoring your duties as stated above, you agree that your claim for replacement
                      will become a VOID CLAIM.
                    </p>
                  </div>

                  {/* Modal Footer */}
                  <div className="mt-6 flex justify-end border-t pt-3">
                    <a
                      href="/cancellation-refund-policy"
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      Know More
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Modal */}
            {showWarrantyModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-semibold text-blue-800">Warranty</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700 text-xl"
                      onClick={() => setshowWarrantyModal(false)}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="mt-4 text-sm text-gray-700 space-y-2 max-h-[60vh] scrollbar-hide overflow-y-auto">
                    <p>1 Year manufacturer warranty for device and 6 months manufacturer warranty for in-box accessories.</p>
                  </div>

                  {/* Modal Footer */}
                  <div className="mt-6 flex justify-end border-t pt-3">
                    <a
                      href="/privacypolicy"
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      Know More
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Modal */}
            {showGstInvoiceModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-lg font-semibold text-blue-800">GST Invoice</h2>
                    <button
                      className="text-gray-500 hover:text-gray-700 text-xl"
                      onClick={() => setshowGstInvoiceModal(false)}
                    >
                      &times;
                    </button>
                  </div>

                  {/* Modal Content */}
                  <div className="mt-4 text-sm text-gray-700 space-y-2 max-h-[60vh] scrollbar-hide overflow-y-auto">
                    <p>Click here to know more about our T & C</p>
                  </div>

                  {/* Modal Footer */}
                  <div className="mt-6 flex justify-end border-t pt-3">
                    <a
                      href="/shipping"
                      className="text-sm text-blue-600 font-medium hover:underline"
                    >
                      Know More
                    </a>
                  </div>
                </div>
              </div>
            )}
  {/* Modals - Keep your existing code for modals */}
</div>








          </div>

          {/* Right Section - Seller Info */}
          <div className="md:col-span-3 border border-gray-300 rounded-lg shadow-md bg-white mb-14 w-full max-w-sm max-h-[490px] overflow-y-scroll scrollbar-hide">
      {/* Update the frequently bought together section to include AddToCart functionality: */}
{featuredProducts?.length > 0 && (
  <div className="px-4 py-4"> 
    <h3 className="font-semibold text-sm text-gray-800 underline mb-4">
      Frequently Bought Together:
    </h3>

    {featuredProducts.map((item) => (
      <div key={item._id} className="flex items-start mb-4">
        <input 
          type="checkbox" 
          className="mt-2 mr-3" 
          checked={selectedFrequentProducts.some(p => p._id === item._id)}
          onChange={() => toggleFrequentProduct(item)}
        />
        <div className="flex items-start gap-3">
          {item.images?.[0] && (
            <img
              src={`/uploads/products/${item.images[0]}`}
              alt={item.name}
              className="w-16 h-16 object-contain"
            />
          )}
          <div className="text-sm">
            <div className="text-gray-800 font-medium">
              {item.name.length > 20 ? `${item.name.substring(0, 20)}...` : item.name.padEnd(20, ' ')}
            </div>
            <div className="text-orange-600 font-medium">Buy Together for</div>
            <div className="text-gray-800 font-semibold">
              ₹ {item.special_price || item.price}
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
)}



            {/* Protection Plan */}
           {(product?.warranty || product?.extended_warranty) && (
  <div className="border-t border-gray-300 px-4 py-4">
    <h4 className="text-sm font-semibold text-orange-600 mb-2">
      Want to protect your product?
    </h4>

    {product?.warranty && (
      <>
        <p className="text-sm font-bold text-gray-800 underline mb-2">
          Accidental and Liquid Damage Protection Plan
        </p>
        <div className="text-sm text-gray-800 space-y-2 mb-4">
          <div className="flex items-center">
            <input type="radio" name="protection" className="mr-2" onChange={() => setSelectedWarranty(product.warranty)} />
            <label>
              1 Year Accidental And Liquid Damage
              <span className="text-green-600 font-bold ml-2">
                ₹ {product.warranty}
              </span>
            </label>
          </div>
        </div>
      </>
    )}

    {product?.extended_warranty && (
      <>
        <p className="text-sm font-bold text-gray-800 underline mb-2">
          Extended Warranty
        </p>
        <div className="text-sm text-gray-800">
          <div className="flex items-center">
            <input type="radio" name="warranty" className="mr-2" onChange={() => setSelectedExtendedWarranty(product.extended_warranty)} />
            <label>
              1 Year Extended Warranty Protection
              <span className="text-green-600 font-bold ml-2">
                ₹ {product.extended_warranty}
              </span>
            </label>
          </div>
        </div>
      </>
    )}
  </div>
)}
            {/* <div className="mt-4 px-4">
              <div className="flex items-center justify-between bg-customBlue text-white px-3 py-2 rounded-full">
                <div className="flex items-center gap-2">
                  <div className="bg-white p-1.5 rounded-full flex items-center justify-center w-8 h-8">
                    <IoStorefront className="text-blue-600 text-lg" />
                  </div>
                  <span className="text-sm font-medium whitespace-nowrap">By {product.brand || "Marketpro"}</span>
                </div>
                <div className="flex-shrink-0">
                  <button className="bg-white text-blue-600 text-xs font-medium px-3 py-1 rounded-full border border-white whitespace-nowrap">
                    View Store
                  </button>
                </div>
              </div>
            </div> */}

      <div className="mt-5 px-2">
  <div className="flex items-center justify-between bg-customBlue text-white px-4 py-2 rounded-full shadow-sm w-full">

    {/* Left - Cart Icon + Label */}
    <div className="flex items-center space-x-2">
      <FaCartPlus  className="text-white w-5 h-5" />
      <span className="text-lg font-semibold">Cart Total</span>
    </div>

    {/* Right - Price + View Cart link below */}
    <div className="flex flex-col items-end leading-tight">
      <span className="text-md font-semibold">₹{cartTotal.toLocaleString()}</span>
      <Link href="/cart" className="text-[12px] text-blue-100 hover:underline mt-0.5">
        View Cart
      </Link>
    </div>

  </div>
</div>


            <div className="border-b border-gray-300 w-full mt-4"></div>

            <div className="rounded-b-lg w-full bg-gray-100">
              {[
                { icon: TbTruckDelivery, title: "Fast Delivery", desc: "Lightning-fast shipping, guaranteed." },
                { icon: IoReload, title: "Free 90-day returns", desc: "Shop risk-free with easy returns." },
                { icon: IoStorefront, title: "Pickup available", desc: "Usually ready in 24 hours" },
                { icon: IoCardOutline, title: "Payment", desc: "Secure online and cash payments." },
                { icon: IoShieldCheckmark, title: "Warranty", desc: product.warranty || "Guaranteed product quality." },
              ].map(({ icon: Icon, title, desc }, index) => (
                <div key={index}>
                  {index !== 0 && <div className="border-b border-gray-400 w-full mt-1"></div>}
                  <div className="flex items-center gap-4 px-6 py-4 w-full">
                    <div className="bg-white p-3 rounded-full border border-gray-300 shadow-sm flex items-center justify-center">
                      <Icon className="text-lg text-blue-600" />
                    </div>
                    <div className="flex-1 w-full min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 break-words">{title}</h4>  
                      <p className="text-sm text-gray-700 break-words">{desc}</p>  
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ProductDetailsSection product={product} />
            <RelatedProducts 
              currentProductId={product._id} 
              categoryId={product.category?._id || product.category} 
            />
      </div>
    </div>
    
  );
}


