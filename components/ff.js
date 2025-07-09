// components/Header.jsx
'use client';

import { motion } from 'framer-motion';
import Link from "next/link";
import Image from 'next/image';

import { FiSearch, FiMapPin, FiHeart, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { FaBars, FaShoppingBag } from "react-icons/fa";
import { FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState, useRef, useEffect } from 'react';
import { IoLogOut } from "react-icons/io5";
import { FaCircleChevronLeft, FaCircleChevronRight, FaLocationDot } from "react-icons/fa6";
import { useCart } from '@/context/CartContext';
import { useWishlist } from "@/context/WishlistContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { useRouter } from 'next/navigation';

import { Navigation } from 'swiper/modules';
import SideNavbar from '@/components/sideNavbar';

const Header = () => {
  const [category, setCategory] = useState('All Categories');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { wishlistCount } = useWishlist();
  const { cartCount, updateCartCount } = useCart();
  const dropdownRef = useRef(null);
  const [activeTab, setActiveTab] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Forgot password state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordOTP, setForgotPasswordOTP] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: OTP, 3: new password

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

  const router = useRouter();

  const handleSearch = () => {
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
      handleSearch();
    }
  };

  const messages = [
    "Welcome to our store! Enjoy the best deals and quality products.",
    "Free shipping on orders over $50. Shop now and save more!",
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 20000);
    return () => clearInterval(interval);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: ''
  });
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [formError, setFormError] = useState('');
  const [error, setError] = useState('');

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

      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingAuth(false);
    }
  };

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    updateCartCount(0);
  };

  // Handle send OTP for password reset
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordMessage('');
    setForgotPasswordLoading(true);

    try {
      const response = await fetch('/api/auth/send-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotPasswordEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setForgotPasswordMessage('OTP has been sent to your email');
      setForgotPasswordStep(2);
    } catch (err) {
      setForgotPasswordError(err.message);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Handle OTP verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordMessage('');
    setForgotPasswordLoading(true);

    try {
      const response = await fetch('/api/auth/verify-reset-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: forgotPasswordEmail,
          otp: forgotPasswordOTP 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      setForgotPasswordMessage('OTP verified successfully');
      setForgotPasswordStep(3);
    } catch (err) {
      setForgotPasswordError(err.message);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Handle password reset
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setForgotPasswordError('');
    setForgotPasswordMessage('');
    setForgotPasswordLoading(true);

    if (newPassword !== confirmPassword) {
      setForgotPasswordError('Passwords do not match');
      setForgotPasswordLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: forgotPasswordEmail,
          otp: forgotPasswordOTP,
          newPassword: newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setForgotPasswordMessage('Password has been reset successfully');
      setTimeout(() => {
        setShowForgotPasswordModal(false);
        setShowAuthModal(true);
        resetForgotPasswordState();
      }, 2000);
    } catch (err) {
      setForgotPasswordError(err.message);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  // Reset forgot password state
  const resetForgotPasswordState = () => {
    setForgotPasswordEmail('');
    setForgotPasswordOTP('');
    setNewPassword('');
    setConfirmPassword('');
    setForgotPasswordMessage('');
    setForgotPasswordError('');
    setForgotPasswordStep(1);
    setForgotPasswordLoading(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Announcement Bar */}
      <div className={`bg-white text-orange-500 px-4 py-1 overflow-hidden relative w-full ${isMobileMenuOpen ? 'hidden' : ''}`}>
        <div className="relative w-full overflow-hidden h-4 flex items-center">
          <motion.div
            key={current}
            initial={{ x: '100%' }}
            animate={{ x: '-100%' }}
            transition={{ ease: 'linear', duration: 20 }}
            className="absolute whitespace-nowrap flex items-center space-x-2 pr-4"
          >
            <img src="/user/bea.png" alt="Logo" className="h-4 w-auto" />
            <p className="font-medium text-xs sm:text-sm whitespace-nowrap">{messages[current]}</p>
          </motion.div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`${isMobileMenuOpen ? "fixed inset-0 mt-0 pt-0 z-50 overflow-y-auto" : "bg-customBlue px-4 sm:px-6 md:px-6 py-2 sticky top-0 z-40"}`}>
        {/* ... rest of your existing header code ... */}

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
              >
                &times;
              </button>

              <div className="flex gap-4 mb-6 border-b">
                <button
                  className={`pb-2 px-1 ${
                    activeTab === 'login' 
                      ? 'border-b-2 border-blue-500 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('login')}
                >
                  Login
                </button>
                <button
                  className={`pb-2 px-1 ${
                    activeTab === 'register'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveTab('register')}
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    setShowAuthModal(false);
                    setShowForgotPasswordModal(true);
                    setForgotPasswordEmail(formData.email || '');
                  }}
                  className="text-xs text-blue-500 hover:underline mt-1"
                >
                  Forgot Password?
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {/* ... existing auth form ... */}
              </form>
            </div>
          </div>
        )}

        {/* Forgot Password Modal */}
        {showForgotPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 max-w-full relative">
              <button
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  resetForgotPasswordState();
                }}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>

              <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>

              {forgotPasswordStep === 1 && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {forgotPasswordError && (
                    <div className="text-red-500 text-sm">{forgotPasswordError}</div>
                  )}
                  {forgotPasswordMessage && (
                    <div className="text-green-500 text-sm">{forgotPasswordMessage}</div>
                  )}
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                  >
                    {forgotPasswordLoading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </form>
              )}

              {forgotPasswordStep === 2 && (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
                    <input
                      type="text"
                      placeholder="Enter the 6-digit OTP"
                      value={forgotPasswordOTP}
                      onChange={(e) => setForgotPasswordOTP(e.target.value)}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {forgotPasswordError && (
                    <div className="text-red-500 text-sm">{forgotPasswordError}</div>
                  )}
                  {forgotPasswordMessage && (
                    <div className="text-green-500 text-sm">{forgotPasswordMessage}</div>
                  )}
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                  >
                    {forgotPasswordLoading ? 'Verifying...' : 'Verify OTP'}
                  </button>
                </form>
              )}

              {forgotPasswordStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  {forgotPasswordError && (
                    <div className="text-red-500 text-sm">{forgotPasswordError}</div>
                  )}
                  {forgotPasswordMessage && (
                    <div className="text-green-500 text-sm">{forgotPasswordMessage}</div>
                  )}
                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
                  >
                    {forgotPasswordLoading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;