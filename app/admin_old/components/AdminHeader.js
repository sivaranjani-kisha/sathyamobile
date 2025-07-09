"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Moon, Sun, ChevronLeft, Menu } from "lucide-react";
import Image from "next/image";

export default function TopBar({ toggleSidebar }: { toggleSidebar?: () => void }) {
  const [theme, setTheme] = useState("light");
  const [showLogout, setShowLogout] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  // Fetch admin name from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAdminName(user.name || "Admin");
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogout(false);
    router.push("/login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('.profile-dropdown')) {
        setShowLogout(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed ml-0 md:ml-24 left-0 right-0 print:hidden z-50 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <nav className="flex-1 px-4 md:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Left Section - Menu Toggle and Search */}
          <div className="flex items-center gap-4">
            {/* Sidebar toggle button */}
            <button 
              onClick={toggleSidebar}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="text-gray-600 dark:text-gray-300" />
            </button>

            {/* Search Bar - Optional */}
            {/* <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Search..."
              />
            </div> */}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="text-gray-600 dark:text-gray-300" />
              )}
            </button>

            {/* Notifications - Optional */}
            {/* <button className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <Bell className="text-gray-600 dark:text-gray-300" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button> */}

            {/* Profile Dropdown */}
            <div className="profile-dropdown relative">
              <button
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setShowLogout(!showLogout)}
              >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                  <Image
                    src="/assets/images/admin-logo-1.jpg"
                    alt="User"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-600 dark:text-gray-300">
                  {adminName}
                </span>
              </button>

              {/* Dropdown Menu */}
              {showLogout && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-600">
                  <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                    Signed in as <span className="font-medium">{adminName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}