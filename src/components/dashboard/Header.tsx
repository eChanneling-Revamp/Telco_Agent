"use client";

import { useState } from "react";
import { Bell, User, ChevronDown, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  selectedAccount: string;
  onAccountChange: (account: string) => void;
  userEmail?: string;
  userName?: string;
}

export default function Header({
  selectedAccount,
  onAccountChange,
  userEmail = "",
  userName = "Agent",
}: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const displayName = userName || userEmail?.split("@")[0] || "Agent";

  const handleLogout = () => {
    console.log("Logging out...");
    router.push("/");
  };

  return (
    <header className="bg-white/20 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-white">Telco Agent</h1>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <button className="relative p-2 text-white hover:text-gray-200 transition">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              1
            </span>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-1 text-white hover:bg-white/30 bg-white/20 rounded-xl px-3 py-1 transition"
          >
            <span className="text-sm">{selectedAccount}</span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={() => {
                    onAccountChange("Account 1");
                    setIsMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Account 1
                </button>
                <button
                  onClick={() => {
                    onAccountChange("Account 2");
                    setIsMenuOpen(false);
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                >
                  Account 2
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <div
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 cursor-pointer hover:bg-white/20 rounded-xl px-3 py-1 transition"
          >
            <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-white text-sm font-medium">
                {displayName}
              </span>
              {userEmail && (
                <span className="text-white/70 text-xs">{userEmail}</span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-white" />
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
