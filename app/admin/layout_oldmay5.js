"use client";

import { usePathname } from "next/navigation";
import AdminHeader from "@/app/admin/components/AdminHeader";
import AdminSider from "@/app/admin/components/AdminSider";
import AuthProvider from "@/app/admin/components/AuthProvider";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AuthProvider>
      {/* Outer container fills the screen */}
      <div className="flex h-screen overflow-hidden bg-gray-100">

        {/* Fixed Sidebar */}
        <div className="fixed top-0 left-0 h-full w-56 z-40">
          <AdminSider />
        </div>

        {/* Main wrapper (includes header + scrollable content)
        <div className="flex flex-col flex-1 ml-56 w-full"> */}

          {/* Fixed Header */}
          <div className="fixed top-0 left-56 right-0 z-50 h-14 ">
            <AdminHeader />
          </div>

          {/* Scrollable content (offset for fixed header) */}
          <main className="mt-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-8 py-6 bg-gray-100">
            {children}
          </main>
        </div>
      {/* </div> */}
    </AuthProvider>
  );
}
