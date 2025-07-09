"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

import { FiChevronRight, FiClock, FiCheckCircle, FiTruck, FiShoppingBag, FiXCircle } from 'react-icons/fi';
import { RiAccountCircleFill } from "react-icons/ri";
import { ToastContainer, toast } from 'react-toastify';
import { FaAddressBook } from "react-icons/fa";
import { HiShoppingBag } from "react-icons/hi2";
import { FaHeart } from "react-icons/fa6";
import { AuthModal } from '@/components/AuthModal';

export default function Order() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setShowAuthModal(true);
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        const response = await fetch(`/api/orders/get?status=${activeFilter === 'all' ? '' : activeFilter}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders data');
        }

        const data = await response.json();
        setFilteredOrders(data.orders || []);
      } catch (error) {
        toast.error("Failed to load orders data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeFilter]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleBuyAgain = () => {
    router.push('/');
  };

  const handleCancelOrder = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowAuthModal(true);
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel order');
      }

      // Update local state
      if (activeFilter === 'pending') {
        // Remove from pending view
        setFilteredOrders(prev => prev.filter(order => order._id !== orderId));
      } else {
        // Update status in all/cancelled view
        setFilteredOrders(prev => 
          prev.map(order => 
            order._id === orderId ? { ...order, order_status: 'cancelled' } : order
          )
        );
      }

      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={5000} />
      
      {/* Mobile Header */}
      <div className="lg:hidden bg-white py-4 px-4 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">My Orders</h2>
      </div>
      
      {/* Desktop Header */}
      <div className="hidden lg:block bg-blue-50 py-6 px-8 flex justify-between items-center border-b border-gray-200 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
        <div className="flex items-center space-x-2 text-sm mt-1">
          <span className="text-gray-600">🏠 Home</span>
          <FiChevronRight className="text-gray-400" />
          <span className="text-gray-500">Shop</span>
          <FiChevronRight className="text-gray-400" />
          <span className="text-customBlue font-medium">Orders</span>
        </div>
      </div>

      <div className="container mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar Navigation - Mobile Dropdown */}
          {/* <div className="lg:hidden mb-4">
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-700"
              onChange={(e) => {
                if (e.target.value === 'orders') return;
                router.push(`/${e.target.value}`);
              }}
              value="orders"
            >
              <option value="orders">My Orders</option>
              <option value="wishlist">Wishlist</option>
            </select>
          </div> */}
          
          {/* Sidebar Navigation - Desktop */}
          <div className="hidden lg:block w-full lg:w-72 flex-shrink-0">
            <div className="bg-white p-6 rounded-xl border border-gray-200 hover:border-customBlue transition-all duration-300 shadow-sm">
              <h3 className="text-lg font-semibold text-customBlue mb-6 pb-2 border-b border-gray-100">My Account</h3>
              <nav className="space-y-2">
                <Link href="/order" className="w-full flex items-center gap-2 px-5 py-3 text-base font-medium text-gray-600 rounded-lg hover:text-customBlue hover:bg-blue-100 hover:pl-6 transition-all">
                  <HiShoppingBag className="text-customBlue text-xl" />
                  <span>Orders</span>
                </Link>
                <Link href="/wishlist" className="w-full flex items-center gap-2 px-5 py-3 text-base font-medium text-gray-600 rounded-lg hover:text-customBlue hover:bg-blue-100 hover:pl-6 transition-all">
                  <FaHeart className="text-customBlue text-xl" />
                  <span>Wishlist</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 hover:border-customBlue transition-all duration-300 shadow-sm">
              {/* Order Filters */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6 pb-2 sm:pb-4 border-b border-gray-100 overflow-x-auto pb-2">
                {['all', 'pending', 'shipped', 'delivered', 'cancelled'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium flex items-center whitespace-nowrap ${
                      activeFilter === filter
                        ? filter === 'all'
                          ? 'bg-customBlue text-white'
                          : filter === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : filter === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : filter === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filter === 'pending' && <FiClock className="mr-1" />}
                    {filter === 'shipped' && <FiTruck className="mr-1" />}
                    {filter === 'delivered' && <FiCheckCircle className="mr-1" />}
                    {filter === 'cancelled' && <FiXCircle className="mr-1" />}
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {/* Orders List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-customBlue mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading your orders...</p>
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <FiShoppingBag className="mx-auto text-4xl text-gray-300 mb-3 sm:mb-4" />
                  <h3 className="text-lg font-medium text-gray-700">No orders found</h3>
                  <p className="text-gray-500 mt-1 text-sm sm:text-base">
                    {activeFilter === 'all' 
                      ? "You haven't placed any orders yet" 
                      : `No ${activeFilter} orders found`}
                  </p>
                  <Link href="/products" className="mt-4 sm:mt-6 inline-block px-4 sm:px-6 py-2 bg-customBlue text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  {filteredOrders.map((order) => (
                    <div key={order._id} className="p-3 sm:p-5 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Product Image */}
                        <div className="w-full sm:w-24 md:w-32 flex-shrink-0">
                          {order.order_details?.[0]?.image ? (
                            <img
                              src={`/uploads/products/${order.order_details[0].image}`}
                              alt={order.order_details[0].product_name || 'Product'}
                              className="w-full h-24 sm:h-32 object-contain rounded-lg border border-gray-200"
                            />
                          ) : (
                            <div className="w-full h-24 sm:h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FiShoppingBag className="text-xl sm:text-2xl text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Order Details */}
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                            <div>
                              <p className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Order #{order.order_number}</p>
                              <h3 className="font-medium text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">
                                {order.order_details?.[0]?.product_name || 'Product'}
                                {order.order_details?.length > 1 && ` + ${order.order_details.length - 1} more`}
                              </h3>
                              <p className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">₹{order.order_amount}</p>
                            </div>

                            {/* Status Badge */}
                            <div className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium self-start ${
                              order.order_status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.order_status === 'shipped'
                                ? 'bg-blue-100 text-blue-800'
                                : order.order_status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {order.order_status === 'delivered' ? (
                                <span className="flex items-center">
                                  <FiCheckCircle className="mr-1 text-xs" /> Delivered
                                </span>
                              ) : order.order_status === 'shipped' ? (
                                <span className="flex items-center">
                                  <FiTruck className="mr-1 text-xs" /> Shipped
                                </span>
                              ) : order.order_status === 'cancelled' ? (
                                <span className="flex items-center">
                                  <FiXCircle className="mr-1 text-xs" /> Cancelled
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <FiClock className="mr-1 text-xs" /> Pending
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Order Meta */}
                          <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                            <div className="flex items-center text-gray-600">
                              <FiTruck className="mr-2 text-gray-400 text-xs sm:text-sm" />
                              <span>
                                {order.order_status === 'delivered'
                                  ? `Delivered on ${formatDate(order.updatedAt)}`
                                  : order.order_status === 'shipped'
                                  ? `Shipped on ${formatDate(order.updatedAt)}`
                                  : order.order_status === 'cancelled'
                                  ? `Cancelled on ${formatDate(order.cancelled_at || order.updatedAt)}`
                                  : `Order placed on ${formatDate(order.createdAt)}`}
                              </span>
                            </div>
                            <div className="text-gray-600 flex items-center gap-1 sm:gap-2">
                              <span>Payment:</span>
                              {order.payment_type === 'online' ? (
                                <span className="inline-flex items-center px-2 py-0.5 sm:py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                                  <FiCheckCircle className="mr-1 text-xs" /> Paid
                                </span>
                              ) : (
                                <span className="text-gray-700 capitalize">{order.payment_type || 'Not specified'}</span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
                            <button 
                              onClick={handleBuyAgain}
                              className="px-3 sm:px-4 py-1 sm:py-2 bg-blue-50 text-customBlue rounded-md hover:bg-blue-100 transition-colors flex items-center text-xs sm:text-sm"
                            >
                              <FiShoppingBag className="mr-1 sm:mr-2 text-xs sm:text-sm" />
                              Buy Again
                            </button>
                            {order.order_status === 'pending' && (
                              <button 
                                onClick={() => handleCancelOrder(order._id)}
                                className="px-3 sm:px-4 py-1 sm:py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-50 transition-colors text-xs sm:text-sm"
                              >
                                Cancel Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false);
            window.location.reload();
          }}
          error={authError}
        />
      )}
    </div>
  );
}