"use client";
import React, { useState } from "react";

const PersonalInfoForm = () => {
  const [formData, setFormData] = useState({
    firstName: "Sarah",
    lastName: "Thompson",
    email: "sarah.thompson@telecom.com",
    phone: "+94 71 234 5678",
  });

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex-1">
      <h3 className="font-semibold text-gray-800 mb-4">Personal Information</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-500">First Name</label>
          <input
            value={formData.firstName}
            className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500">Last Name</label>
          <input
            value={formData.lastName}
            className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm text-gray-500">Email Address</label>
        <input
          value={formData.email}
          className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm text-gray-500">Phone Number</label>
        <input
          value={formData.phone}
          className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-400"
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
