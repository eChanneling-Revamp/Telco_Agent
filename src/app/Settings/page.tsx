"use client";

import React, { useState } from "react";
import Header from "@/components/dashboard/Header";
import SideBar from "@/components/dashboard/SideBar";
import Breadcrumb from "@/components/ApointmentManagement/Breadcrumb";

function ProfileCard() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md flex flex-col items-center">
      <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-5xl mb-4">
        👤
      </div>
      <h2 className="font-semibold text-gray-800 text-xl">Sarah Thompson</h2>
      <p className="text-base text-gray-500">Telco Agent</p>
      <p className="text-base text-green-500 mt-1">ID: TCA-2025-001</p>
    </div>
  );
}

function PersonalInfoForm() {
  const [formData] = useState({
    firstName: "Sarah",
    lastName: "Thompson",
    email: "sarah.thompson@telecom.com",
    phone: "+94 71 234 5678",
  });

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md flex-1">
      <h3 className="font-semibold text-gray-800 mb-4 text-lg">
        Personal Information
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500">First Name</label>
          <div className="mt-1 relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6"
              />
            </svg>
            <input
              value={formData.firstName}
              className="w-full border rounded-lg p-3 pl-10 text-base focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-500">Last Name</label>
          <div className="mt-1 relative">
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6"
              />
            </svg>
            <input
              value={formData.lastName}
              className="w-full border rounded-lg p-3 pl-10 text-base focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm text-gray-500">Email Address</label>
        <div className="mt-1 relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-800"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 4H4a1 1 0 00-1 1v14a1 1 0 001 1h16a1 1 0 001-1V5a1 1 0 00-1-1zm-1.4 3L12 11.2 5.4 7h13.2zM5 18V8.6l6.6 4.1a1 1 0 001 0L19 8.6V18H5z" />
          </svg>
          <input
            value={formData.email}
            className="w-full border rounded-lg p-3 pl-10 text-base focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm text-gray-500">Phone Number</label>
        <div className="mt-1 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-700"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2 4.5A1.5 1.5 0 013.5 3h3a1.5 1.5 0 011.415 1.05l1.14 3.42a1.5 1.5 0 01-.353 1.56l-1.12 1.12a11.25 11.25 0 006.268 6.268l1.12-1.12a1.5 1.5 0 011.56-.353l3.42 1.14A1.5 1.5 0 0121 19.5v1a1.5 1.5 0 01-1.5 1.5h-1.5C9.268 21 3 14.732 3 6V4.5z"
            />
          </svg>

          <input
            value={formData.phone}
            className="w-full border rounded-lg p-3 pl-10 text-base focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>
    </div>
  );
}

function SecurityForm() {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-md">
      <h3 className="font-semibold text-gray-800 mb-4 text-lg">Security</h3>

      <div className="mb-3">
        <label className="block text-sm text-gray-500">Current Password</label>
        <input
          type="password"
          className="w-full mt-1 border rounded-lg p-3 text-base focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm text-gray-500">New Password</label>
        <input
          type="password"
          className="w-full mt-1 border rounded-lg p-3 text-base focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm text-gray-500">Confirm Password</label>
        <input
          type="password"
          className="w-full mt-1 border rounded-lg p-3 text-base focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex justify-end">
        <button className="px-8 py-3 rounded-full bg-gradient-to-r from-[#23DE4F] to-[#330FFB] text-white font-medium hover:opacity-95 transition transform hover:shadow-md active:scale-95">
          Change Password
        </button>
      </div>
    </div>
  );
}

function NotificationPreferences() {
  const [prefs, setPrefs] = useState({ push: true, email: true, sms: true });

  const togglePref = (key: keyof typeof prefs) =>
    setPrefs({ ...prefs, [key]: !prefs[key] });

  const items = [
    {
      key: "push",
      label: "Push Notifications",
      desc: "Receive notifications for new appointments",
      icon: (
        <svg
          className="h-7 w-7 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
    },
    {
      key: "email",
      label: "Email Notifications",
      desc: "Receive booking confirmations and updates",
      icon: (
        <svg
          className="h-7 w-7 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      key: "sms",
      label: "SMS Notifications",
      desc: "Receive SMS alerts for appointments",
      icon: (
        <svg
          className="h-7 w-7 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4-.84L3 20l1.16-4.36A7.966 7.966 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md flex-1">
      <h3 className="font-semibold text-gray-800 mb-4 text-lg">
        Notification Preferences
      </h3>
      <div className="space-y-4">
        {items.map(({ key, label, desc, icon }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {icon}
              <div>
                <p className="text-gray-700 font-medium text-sm">{label}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            </div>
            <button
              onClick={() => togglePref(key as keyof typeof prefs)}
              className={`w-10 h-5 rounded-full transition-all ${
                prefs[key as keyof typeof prefs]
                  ? "bg-green-500"
                  : "bg-gray-300"
              }`}
            >
              <div
                className={`h-5 w-5 bg-white rounded-full transform transition-all ${
                  prefs[key as keyof typeof prefs] ? "translate-x-5" : ""
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
export default function Settings() {
  const [selectedAccount, setSelectedAccount] = useState("Agent");

  const handleAccountChange = (account: string) => {
    setSelectedAccount(account);
  };

  return (
    <div
      className="flex h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url('/assets/bg.png')`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <SideBar />

      {/* Main area */}
      <div className="flex-1 flex flex-col relative z-10">
        <Header />

        <main className="flex-1 overflow-y-auto p-2">
          <div className="min-h-screen p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-6 text-white">
              <span className="text-sm opacity-70">Dashboard</span>
              <span className="opacity-70">›</span>
              <span className="text-sm">Settings</span>
            </div>
            <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
              <div className="col-span-1 space-y-6">
                <ProfileCard />
                <SecurityForm />
              </div>
              <div className="col-span-2 space-y-6">
                <PersonalInfoForm />
                <NotificationPreferences />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
