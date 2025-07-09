"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Moon, ChevronLeft } from "lucide-react";
import Image from "next/image";

export default function TopBar() {
  const [theme, setTheme] = useState("light");
  const [showLogout, setShowLogout] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setAdminName(user.name || "Admin");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogout(false);
    router.push("login");
  };

  return (
    <div className="sticky top-0 left-0 right-0 print:hidden z-50 h-16 dark:bg-gray-800 bg-white shadow-sm">
      <nav className="flex-1 ml-14 px-8">
        <div className="flex items-center justify-between h-full">
          {/* Left Section - Empty for now */}
          <div className="flex-1 max-w-2xl"></div>

          {/* Right Section */}
          <div className="flex items-center gap-4 ml-4">
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                className="flex items-center rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowLogout(!showLogout)}
              >
                <Image
                  src="/assets/images/admin-logo-1.jpg"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <span className="hidden xl:block ml-2 text-left">
                  <span className="block font-medium text-gray-600 dark:text-gray-400">
                    Admin ▼
                  </span>
                </span>
              </button>

              {/* Logout Dropdown */}
              {showLogout && (
                <div className="fixed right-8 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
                  <ul className="py-1">
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}