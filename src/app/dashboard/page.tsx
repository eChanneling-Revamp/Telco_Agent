"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/dashboard/Header";
import SideBar from "@/components/dashboard/SideBar";
import StatCard from "@/components/dashboard/StatCard";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ChartCard from "@/components/dashboard/ChartCard";
import {
  ChartNoAxesColumn,
  TrendingUp,
  Calendar,
  CircleX,
  RefreshCcw,
} from "lucide-react";
import { dailyBookings, weeklyTrends } from "@/lib/data";

// Separate the component that uses useSearchParams
function DashboardContent() {
  const searchParams = useSearchParams();
  const [selectedAccount, setSelectedAccount] = useState<string>("default");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      setUserEmail(email);
    }
  }, [searchParams]);

  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <SideBar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          selectedAccount={selectedAccount}
          onAccountChange={setSelectedAccount}
        />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-2 mb-6 text-black">
            <span className="text-sm">Dashboard</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              title="Today's Bookings"
              value={42}
              change="+12% vs last week"
              icon={
                <div className="p-2 rounded-full bg-green-100">
                  <Calendar size={20} className="text-green-600" />
                </div>
              }
              trend="up"
            />
            <StatCard
              title="Cancellations"
              value={8}
              change="3% vs last week"
              icon={
                <div className="p-2 rounded-full bg-red-100">
                  <CircleX size={20} className="text-red-400" />
                </div>
              }
              trend="down"
            />
            <StatCard
              title="Refunds"
              value={5}
              change="+0.5% vs last week"
              icon={
                <div className="p-2 rounded-full bg-orange-100">
                  <RefreshCcw size={20} className="text-orange-400" />
                </div>
              }
              trend="up"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <QuickActions />
            </div>
            <div className="lg:col-span-2">
              <RecentActivity />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title={
                <div className="flex items-center gap-2">
                  <ChartNoAxesColumn size={20} className="text-green-600" />
                  <span>Daily Booking Statistics</span>
                </div>
              }
              type="bar"
              data={dailyBookings}
              xKey="day"
              yKey="bookings"
            />
            <ChartCard
              title={
                <div className="flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600" />
                  <span>Weekly Trends</span>
                </div>
              }
              type="line"
              data={weeklyTrends}
              xKey="week"
              yKey="value"
            />
          </div>
        </main>
      </div>
    </div>
  );
}

// Main component with Suspense wrapper
const DashboardPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-[#eaeaea]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
};

export default DashboardPage;
