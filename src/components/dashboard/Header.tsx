"use client";

import { useState, useEffect } from "react";
import { Bell, User, ChevronDown, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  selectedAccount: string;
  onAccountChange: (account: string) => void;
}

interface UserData {
  id: number;
  email: string;
  name: string;
}

export default function Header({
  selectedAccount,
  onAccountChange,
}: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/me");

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      } else {
        // If not authenticated, redirect to login
        router.push("/");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      localStorage.removeItem("userEmail");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
    }
  };

  // Display name logic
  const displayName =
    userData?.name || userData?.email?.split("@")[0] || "Agent";
  const userEmail = userData?.email || "";

  // // Show loading state
  // if (isLoading) {
  //   return (
  //     <header className="bg-green-800 px-6 py-4 flex justify-between items-center">
  //       <div className="flex items-center space-x-4">
  //         <h1 className="text-xl font-semibold text-white">Telco Agent</h1>
  //       </div>
  //       <div className="flex items-center space-x-6">
  //         <div className="h-8 w-8 bg-white/20 rounded-full animate-pulse"></div>
  //       </div>
  //     </header>
  //   );
  // }

  return (
    <header className="bg-white px-6 py-4 flex justify-between items-center text-black shadow-md">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold ">Telco Agent</h1>
      </div>
      <div className="flex items-center space-x-6">
        {/* Notifications */}
        <div className="relative">
          <button className="relative p-2 text-black hover:text-gray-200 transition">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              1
            </span>
          </button>
        </div>

        {/* User Menu */}
        <div className="relative">
          <div
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 cursor-pointer hover:bg-white/20 rounded-xl px-3 py-1 transition"
          >
            <div className="h-8 w-8 bg-black/10 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-black" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-black text-sm font-medium">
                {displayName}
              </span>
              {userEmail && (
                <span className="text-black/70 text-xs">{userEmail}</span>
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
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
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
