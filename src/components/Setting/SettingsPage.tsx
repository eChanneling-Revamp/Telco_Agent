"use client";
import React from "react";
import ProfileCard from "./ProfileCard";
import PersonalInfoForm from "./PersonalInfoForm";
import SecurityForm from "./SecurityForm";
import NotificationPreferences from "./NotificationPreferences";

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-teal-300 p-8">
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
  );
};

export default SettingsPage;
