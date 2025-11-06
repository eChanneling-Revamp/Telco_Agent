"use client";

import React, { useState } from "react";
import { Bell, Mail, MessageSquare } from "lucide-react"; // <-- 🟢 Import icons from lucide-react

export default function NotificationPreferences() {
  const [prefs, setPrefs] = useState({ push: true, email: true, sms: true });

  const togglePref = (key: keyof typeof prefs) =>
    setPrefs({ ...prefs, [key]: !prefs[key] });

  const items = [
    {
      key: "push",
      label: "Push Notifications",
      desc: "Receive notifications for new appointments",
      icon: <Bell className="w-5 h-5 text-green-600" />,
    },
    {
      key: "email",
      label: "Email Notifications",
      desc: "Receive booking confirmations and updates",
      icon: <Mail className="w-5 h-5 text-blue-600" />,
    },
    {
      key: "sms",
      label: "SMS Notifications",
      desc: "Receive SMS alerts for appointments",
      icon: <MessageSquare className="w-5 h-5 text-yellow-500" />,
    },
  ];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md flex-1">
      <h3 className="font-semibold text-gray-800 mb-4 text-lg">
        Notification Preferences
      </h3>
      <div className="space-y-4">
        {items.map(({ key, label, desc, icon }) => (
          <div
            key={key}
            className="flex items-center justify-between border-b pb-3"
          >
            <div className="flex items-center gap-3">
              {icon}
              <div>
                <p className="text-gray-700 font-medium text-sm">{label}</p>
                <p className="text-gray-500 text-xs">{desc}</p>
              </div>
            </div>

            <button
              onClick={() => togglePref(key as keyof typeof prefs)}
              className={`w-10 h-5 rounded-full transition-all ${
                prefs[key as keyof typeof prefs] ? "bg-green-500" : "bg-gray-300"
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
