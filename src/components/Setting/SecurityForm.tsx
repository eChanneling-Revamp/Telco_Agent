"use client";
import React from "react";

const SecurityForm = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="font-semibold text-gray-800 mb-4">Security</h3>

      <div className="mb-3">
        <label className="block text-sm text-gray-500">Current Password</label>
        <input
          type="password"
          className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm text-gray-500">New Password</label>
        <input
          type="password"
          className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm text-gray-500">Confirm Password</label>
        <input
          type="password"
          className="w-full mt-1 border rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-400"
        />
      </div>

      <button className=" bg-blue-900 text-white rounded-lg px-4 py-2 text-sm">
        Change Password
      </button>
    </div>
  );
};

export default SecurityForm;
