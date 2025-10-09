"use client";

import { useState } from "react";
import { Bell, User, ChevronDown } from "lucide-react";

export default function Header({
  selectedAccount,
  onAccountChange,
}: {
  selectedAccount: string;
  onAccountChange: (account: string) => void;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/20 px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold text-white">Telco Agent</h1>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <button className="relative p-2 text-white hover:text-gray-900">
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              1
            </span>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-1 text-white hover:text-gray-900 bg-white/20 rounded-xl px-3 py-1"
          >
            <span>Select Account</span>
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
        <div className="flex items-center space-x-2 cursor-pointer">
          <div className="h-8 w-8 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <ChevronDown className="h-4 w-4 text-white" />
        </div>
      </div>
    </header>
  );
}
