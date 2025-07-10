// components/Header.jsx
'use client';

import { motion } from 'framer-motion';
import Link from "next/link";
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from "@/context/WishlistContext";
import HeaderNav from "@/components/HeaderNav";
import { useHeaderdetails } from "@/context/HeaderContext";

// Icons - Consolidated imports and removed unused ones
import { 
  FiSearch, 
  FiMapPin, 
  FiHeart, 
  FiShoppingCart, 
  FiUser, 
  FiMenu, 
  FiX, 
  FiChevronDown,
  FiChevronRight,
} from "react-icons/fi";
import { 
  FaPhoneAlt, 
  FaFacebookF, 
  FaInstagram,
  FaShoppingBag,
  FaHeart,
  FaShoppingCart,
  FaSearch,
  FaUserShield,
  FaCircleChevronLeft, 
  FaCircleChevronRight
} from "react-icons/fa";
import { 
  IoLogOut, 
  IoCartOutline, 
  IoCog 
} from "react-icons/io5";

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Header = () => {
  // State management - organized related states together
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { userData,isLoggedIn, setIsLoggedIn, setUserData,isAdmin,setIsAdmin } = useHeaderdetails();
  
  // Auth related states
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  // const [userData, setUserData] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  
  // Search states
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  
  // Forgot password states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotOTP, setForgotOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  
  // Loading states
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  
  // Error states
  const [formError, setFormError] = useState('');
  const [error, setError] = useState('');
  
  // Context hooks
  const { wishlistCount } = useWishlist();
  const { cartCount, updateCartCount } = useCart();
  
  // Refs
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Announcement messages
  const messages = [
    "Welcome to our store! Enjoy the best deals and quality products.",
    "Free shipping on orders over $50. Shop now and save more!",
  ];
  const [current, setCurrent] = useState(0);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  // Check auth status
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
        if(data.role == "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
         setUserData(data.user);
      } else {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() && selectedCategory === 'All Categories') {
      return;
    }
    
    const searchParams = new URLSearchParams();
    
    if (searchQuery.trim()) {
      searchParams.append('query', searchQuery.trim());
    }
    
    if (selectedCategory !== 'All Categories') {
      searchParams.append('category', selectedCategory);
    }
    
    router.push(`/search?${searchParams.toString()}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  // Announcement carousel effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Handle auth submission
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setError('');
    setLoadingAuth(true);

    try {
      const endpoint = activeTab === 'login' ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if(data.token){
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        if(data.user.role == "admin"){
          setIsAdmin(true);
        }else{
          setIsAdmin(false);
        }
        setUserData(data.user);
        setShowAuthModal(false);
        setFormData({
          name: '',
          email: '',
          mobile: '',
          password: ''
        });
        
        // Update cart count after login
        const cartResponse = await fetch('/api/cart/count', {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });
        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          updateCartCount(cartData.count);
        }
      }else{
        setShowAuthModal(true);
        setActiveTab('login');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAuth(false);
    }
  };

  // Component mount effect
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Fetch categories and check auth status
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

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    updateCartCount(0);
  };

  // Mobile menu categories
  const mobileCategories = [
    { name: "Mobiles", href: "/category/mobiles", subcategories: true },
    { name: "Tablets", href: "/category/tablets" },
    { name: "Accessories", href: "/category/accessories", subcategories: true },
    { name: "Smart TV", href: "/category/smart-tv", subcategories: true },
  ];

  return (
    <header className="sticky top-0 z-50">
      {/* Top Announcement Bar */}
      <div className="header-top text-white py-2 text-sm bg-gradient-to-r from-[#ed3237] to-[#c11116]">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="header-left">
            <p className="top-message hidden md:flex items-center">
              <FaPhoneAlt className="mr-2" />
              Call us now <a href="tel:+919047048777" className="ml-1 font-medium">+91 9047048777</a>
            </p>
            <p className="top-message flex md:hidden items-center">
              <FaPhoneAlt className="mr-2" />
              <a href="tel:+919047891777" className="font-medium">+91 90478 91777</a>
            </p>
          </div>

          <div className="header-right flex items-center">
            <div className="header-dropdown mx-2 px-1">
              <div className="header-menu">
                <ul className="flex space-x-4">
                  <li><Link href="/pre-book" className="hover:text-gray-300">Pre Book</Link></li>
                  <li><Link href="/all-stores" className="hover:text-gray-300">Our Stores</Link></li>
                  <li><Link href="/view-compare" id="compare_id" className="hover:text-gray-300">Compare (0)</Link></li>
                  <li><Link href="/contact" className="hover:text-gray-300">Contact</Link></li>
                </ul>
              </div>
            </div>

            <span className="separator mx-2 h-4 w-px bg-gray-600"></span>

            <div className="social-icons flex space-x-2">
              <a href="https://www.facebook.com/SathyaRetail.mobiles/" className="social-icon w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 hover:bg-red-600" target="_blank" rel="noopener noreferrer">
                <FaFacebookF size={12} />
              </a>
              <a href="https://www.instagram.com/sathyamobiles.store/" className="social-icon w-6 h-6 flex items-center justify-center rounded-full bg-gray-700 hover:bg-pink-600" target="_blank" rel="noopener noreferrer">
                <FaInstagram size={12} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-middle bg-white py-3 shadow-sm">
        <div className="container mx-auto flex items-center">
          {/* Left: Logo + Mobile Menu */}
          <div className="header-left flex items-center mr-5 pl-4">
            <button
              className="mobile-menu-toggler md:hidden mr-3 text-gray-700"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <FiMenu size={22} />
            </button>
            <Link href="/" className="logo">
               <img src="/user/sathya.png" alt="Logo" className="h-3 w-auto" />
            </Link>
          </div>

          {/* Center: Navigation */}
         <HeaderNav />

          {/* Right: Icons */}
          <div className="flex items-center gap-4 ma-15">
            {/* Search Bar */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-2 py-3 min-w-[220px]">
              <form onSubmit={handleSearch} className="flex items-center w-full">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent flex-1 outline-none text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button type="submit" aria-label="Submit search">
                  <FiSearch size={18} className="text-gray-500" />
                </button>
              </form>
            </div>


            {/* User Actions */}
            <div className="flex items-center gap-2 relative" ref={dropdownRef}>
              {/* Account Button */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-2 text-gray-700 hover:text-red-600"
                aria-label="Account menu"
              >
                <FiUser size={20} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-xl z-50 transition-all">
                  <div className="py-2 px-2">
                    
                    {isLoggedIn ? (
                      <>
                      {isAdmin && (
                                              <>
                                                <Link
                                                  href="/admin/dashboard"
                                                  className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm text-gray-700 hover:bg-red-50 transition-colors">
                                                  <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-customred text-white">
                                                    <FaUserShield className="w-3 h-3 sm:w-4 sm:h-4" />
                                                  </span>
                                                  Admin Panel
                                                </Link>
                                              </>
                                            )}
                        <Link
                          href="/order"
                          className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm text-gray-700 hover:bg-red-50 transition-colors"
                        >
                          <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-red-600 text-white">
                            <FaShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                          </span>
                          My Orders
                        </Link>
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 sm:gap-3 w-full text-left px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm text-gray-700 hover:bg-red-50 transition-colors"
                        >
                          <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-red-600 text-white">
                            <IoLogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                          </span>
                          Logout
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setShowAuthModal(true);
                          setDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 sm:gap-3 w-full text-left px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm text-gray-700 hover:bg-red-50 transition-colors"
                      >
                        <span className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full bg-red-600 text-white">
                          <FiUser className="w-3 h-3 sm:w-4 sm:h-4" />
                        </span>
                        Sign In
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-red-600"
                aria-label="Shopping cart"
              >
                <FiShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link
                href="/wishlist"
                className="relative flex items-center p-1 sm:p-0"
              >
                <FaHeart size={18} className="" />
                {wishlistCount > 0 && (
                  <span
                    className="absolute -top-3 -right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {wishlistCount}
                  </span>
                )}
              </Link>



            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-red-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto pt-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <Link href="/" className="logo">
                <Image 
                  src="/user/sathya.png" 
                  alt="Sathya Mobiles" 
                  width={120}
                  height={40}
                />
              </Link>
              <button 
                onClick={toggleMobileMenu} 
                className="text-gray-700"
                aria-label="Close menu"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="mb-4">
              <form onSubmit={handleSearch} className="flex items-center bg-gray-100 rounded-lg shadow overflow-hidden border">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 text-xs text-gray-700 bg-white border-r border-gray-300 outline-none"
                >
                  <option value="All Categories">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.category_name}>
                      {cat.category_name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 px-3 py-2 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="px-3 text-red-600"
                  aria-label="Search"
                >
                  <FaSearch />
                </button>
              </form>
            </div>

            <nav className="main-nav-mobile">
              <ul className="space-y-2">
                <li><Link href="/" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded">Home</Link></li>
                
                {mobileCategories.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href} 
                      className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded flex justify-between items-center"
                    >
                      {item.name}
                      {item.subcategories && <FiChevronRight />}
                    </Link>
                  </li>
                ))}
                
                <li><Link href="/offer/weekend-offer" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded">Weekend Offer</Link></li>
                <li><Link href="/pre-book" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded">Pre Book</Link></li>
                <li><Link href="/all-stores" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded">Our Stores</Link></li>
                <li><Link href="/view-compare" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded">Compare (0)</Link></li>
                <li><Link href="/contact" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded">Contact</Link></li>
                
                <li>
                  <Link href="/wishlist" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded flex items-center">
                    <FaHeart className="mr-2 text-red-600" /> Wishlist
                    {wishlistCount > 0 && (
                      <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded flex items-center">
                    <FaShoppingCart className="mr-2 text-red-600" /> Cart
                    {cartCount > 0 && (
                      <span className="ml-auto bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
                {isLoggedIn ? (
                  <>
                    <li>
                      <Link href="/user/orders" className="block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded flex items-center">
                        <FaShoppingBag className="mr-2 text-red-600" /> My Orders
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded flex items-center"
                      >
                        <IoLogOut className="mr-2 text-red-600" /> Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <button
                      onClick={() => {
                        setShowAuthModal(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full block py-2 px-3 text-gray-800 hover:bg-gray-100 rounded flex items-center"
                    >
                      <FiUser className="mr-2 text-red-600" /> Sign In
                    </button>
                  </li>
                )}
              </ul>
            </nav>

            <div className="mt-6 pt-4 border-t">
              <div className="social-icons flex space-x-4 justify-center">
                <a href="https://www.facebook.com/SathyaRetail.mobiles/" className="social-icon w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-600 hover:text-white" target="_blank" rel="noopener noreferrer">
                  <FaFacebookF size={16} />
                </a>
                <a href="https://www.instagram.com/sathyamobiles.store/" className="social-icon w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-pink-600 hover:text-white" target="_blank" rel="noopener noreferrer">
                  <FaInstagram size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-96 max-w-full relative">
            <button 
              onClick={() => {
                setShowAuthModal(false);
                setFormError('');
                setError('');
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="flex gap-4 mb-6 border-b">
              <button
                className={`pb-2 px-1 ${
                  activeTab === 'login' 
                    ? 'border-b-2 border-red-500 text-red-600' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`pb-2 px-1 ${
                  activeTab === 'register'
                    ? 'border-b-2 border-red-500 text-red-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('register')}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {activeTab === 'register' && (
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              {activeTab === 'register' && (
                <input
                  type="tel"
                  placeholder="Mobile"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                  className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
              )}
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                required
                minLength={6}
              />
              
              {(formError || error) && (
                <div className="text-red-500 text-sm">
                  {formError || error}
                </div>
              )}

              <button
                type="submit"
                disabled={loadingAuth}
                className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-400 transition-colors duration-200"
              >
                {loadingAuth ? 'Processing...' : activeTab === 'login' ? 'Login' : 'Register'}
              </button>

              {activeTab === 'login' && (
                <div className="text-center mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAuthModal(false);
                      setShowForgotPasswordModal(true);
                      setForgotStep(1);
                      setForgotPasswordEmail(formData.email || '');
                      setForgotOTP('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setForgotPasswordMessage('');
                      setForgotPasswordError('');
                    }}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full relative">
            <button
              onClick={() => setShowForgotPasswordModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              aria-label="Close modal"
            >
              &times;
            </button>

            {/* STEP 1: Enter Email */}
            {forgotStep === 1 && (
              <>
                <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setForgotPasswordError('');
                    setForgotPasswordMessage('');
                    setForgotPasswordLoading(true);

                    try {
                      const res = await fetch('/api/auth/request-reset', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: forgotPasswordEmail }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Error sending OTP');

                      setForgotPasswordMessage('OTP sent to your email.');
                      setForgotStep(2);
                    } catch (err) {
                      setForgotPasswordError(err.message);
                    } finally {
                      setForgotPasswordLoading(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {forgotPasswordError && (
                    <p className="text-red-500 text-sm">{forgotPasswordError}</p>
                  )}
                  {forgotPasswordMessage && (
                    <p className="text-green-500 text-sm">{forgotPasswordMessage}</p>
                  )}
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
                  >
                    {forgotPasswordLoading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              </>
            )}

            {/* STEP 2: Enter OTP */}
            {forgotStep === 2 && (
              <>
                <h2 className="text-lg font-semibold mb-4">Enter OTP</h2>
                <p className="text-sm mb-2">Email: <strong>{forgotPasswordEmail}</strong></p>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setForgotPasswordError('');
                    setForgotPasswordMessage('');
                    if (!forgotOTP.trim()) {
                      setForgotPasswordError('Please enter OTP.');
                      return;
                    }
                    setForgotPasswordLoading(true);

                    try {
                      const res = await fetch('/api/auth/verify-otp', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          email: forgotPasswordEmail,
                          otp: forgotOTP,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Invalid OTP');

                      setForgotPasswordMessage('OTP verified. Please set your new password.');
                      setForgotStep(3);
                    } catch (err) {
                      setForgotPasswordError(err.message);
                    } finally {
                      setForgotPasswordLoading(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={forgotOTP}
                    onChange={(e) => setForgotOTP(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {forgotPasswordError && (
                    <p className="text-red-500 text-sm">{forgotPasswordError}</p>
                  )}
                  {forgotPasswordMessage && (
                    <p className="text-green-500 text-sm">{forgotPasswordMessage}</p>
                  )}
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
                  >
                    {forgotPasswordLoading ? 'Validating...' : 'Validate OTP'}
                  </button>
                </form>
              </>
            )}

            {/* STEP 3: New Password */}
            {forgotStep === 3 && (
              <>
                <h2 className="text-lg font-semibold mb-4">Set New Password</h2>
                <p className="text-sm mb-2">Email: <strong>{forgotPasswordEmail}</strong></p>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setForgotPasswordError('');
                    setForgotPasswordMessage('');
                    if (newPassword !== confirmPassword) {
                      setForgotPasswordError('Passwords do not match.');
                      return;
                    }
                    setForgotPasswordLoading(true);

                    try {
                      const res = await fetch('/api/auth/reset-password', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          email: forgotPasswordEmail,
                          otp: forgotOTP,
                          newPassword,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.message || 'Error resetting password');

                      setForgotPasswordMessage('Password reset successful.');
                      setTimeout(() => {
                        setShowForgotPasswordModal(false);
                        setShowAuthModal(true);
                      }, 1500);
                    } catch (err) {
                      setForgotPasswordError(err.message);
                    } finally {
                      setForgotPasswordLoading(false);
                    }
                  }}
                  className="space-y-4"
                >
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  {forgotPasswordError && (
                    <p className="text-red-500 text-sm">{forgotPasswordError}</p>
                  )}
                  {forgotPasswordMessage && (
                    <p className="text-green-500 text-sm">{forgotPasswordMessage}</p>
                  )}
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 disabled:bg-gray-400"
                  >
                    {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;