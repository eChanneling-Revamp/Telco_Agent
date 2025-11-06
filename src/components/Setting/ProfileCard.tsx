"use client";
import React from "react";

const ProfileCard = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center">
      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl mb-4">
        👤
      </div>
      <h2 className="font-semibold text-gray-800 text-lg">Sarah Thompson</h2>
      <p className="text-sm text-gray-500">Telco Agent</p>
      <p className="text-sm text-green-500 mt-1">ID: TCA-2025-001</p>
    </div>
  );
};

export default ProfileCard;
