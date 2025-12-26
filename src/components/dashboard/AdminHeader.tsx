"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, ChevronDown, LogOut, Settings } from "lucide-react";

interface AdminHeaderProps {
  title?: string;
}

interface AdminData {
  id: number;
  email: string;
  name: string;
  role?: string;
}

export default function AdminHeader({
  title = "Admin Portal",
}: AdminHeaderProps) {
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch admin data when component mounts
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAdminData(data.user);
      } else {
        // If not authenticated, redirect to admin login
        router.push("/admin/login");
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      router.push("/admin/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Redirect to admin login page
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/admin/login");
    }
  };

  // Display name logic
  const displayName =
    adminData?.name || adminData?.email?.split("@")[0] || "Admin";
  const adminEmail = adminData?.email || "";
  const adminRole = adminData?.role || "admin";

  return (
    <header className="bg-white px-6 py-4 flex justify-between items-center text-black shadow-md">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">{title}</h1>
      </div>

      <div className="flex items-center space-x-6">
        {/* User Menu */}
        <div className="relative">
          <div
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-xl px-3 py-1 transition"
          >
            <div className="h-8 w-8 bg-black/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-black" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-black text-sm font-medium">
                {displayName}
              </span>
              {adminEmail && (
                <span className="text-black/70 text-xs">{adminEmail}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-black" />
          </div>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{adminEmail}</p>
                  {adminRole && (
                    <p className="text-xs text-blue-600 font-medium mt-1 capitalize">
                      {adminRole}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    console.log("Settings clicked");
                    setIsUserMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
