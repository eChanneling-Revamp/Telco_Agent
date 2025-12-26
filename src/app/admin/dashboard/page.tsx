"use client";

import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/dashboard/AdminSidebar";
import AdminHeader from "@/components/dashboard/AdminHeader";
import {
  Users,
  UserPlus,
  UserX,
  Calendar,
  DollarSign,
  Activity,
} from "lucide-react";

interface DashboardStats {
  totalAgents: number;
  activeAgents: number;
  suspendedAgents: number;
  todayAppointments: number;
  refundRequests: number;
  recentActivity: Array<{
    id: number;
    agentName: string;
    patientName: string;
    action: string;
    timestamp: string;
  }>;
}

const NewAdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/newauth/admin/dashboard-stats", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard statistics");
      }

      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.message || "Failed to load dashboard statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    if (!timestamp) return "N/A";

    const date = new Date(
      timestamp.endsWith("Z") ? timestamp : `${timestamp}Z`
    );
    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 30) return "Just now";

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
  };

  return (
    <div className="flex h-screen bg-[#eaeaea]">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-y-auto p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Statistic Cards */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm p-6 animate-pulse"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl mr-4"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 text-black">
              {/* Total Agents Registered */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-blue-100 mr-4">
                    <UserPlus className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">
                      Total Agents Registered
                    </p>
                    <p className="text-2xl font-bold">
                      {stats?.totalAgents || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Agents */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-green-100 mr-4">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Active Agents</p>
                    <p className="text-2xl font-bold">
                      {stats?.activeAgents || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Suspended Agents */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-yellow-100 mr-4">
                    <UserX className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Suspended Agents</p>
                    <p className="text-2xl font-bold">
                      {stats?.suspendedAgents || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Appointments Today */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-purple-100 mr-4">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">
                      Total Appointments Today
                    </p>
                    <p className="text-2xl font-bold">
                      {stats?.todayAppointments || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Refund Requests */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-red-100 mr-4">
                    <DollarSign className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Refund Requests</p>
                    <p className="text-2xl font-bold">
                      {stats?.refundRequests || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* System Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-xl bg-indigo-100 mr-4">
                    <Activity className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">System Activity</p>
                    <p className="text-2xl font-bold">
                      {stats && stats.todayAppointments > 0 ? "High" : "Normal"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recent Agent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 text-black">
            <h2 className="text-xl font-semibold mb-6">
              Recent Agent Activity
            </h2>
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start pb-6 border-b border-gray-200 animate-pulse"
                  >
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-48"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : stats && stats.recentActivity.length > 0 ? (
              <div className="space-y-6">
                {stats.recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex justify-between items-start pb-6 border-b border-gray-200 last:border-b-0 last:pb-0"
                  >
                    <div className="flex gap-4">
                      {/* <div className={`p-2 rounded-lg h-fit ${
                        activity.action.includes('Booked') ? 'bg-green-100' : 
                        activity.action.includes('Cancelled') ? 'bg-red-100' : 'bg-blue-100'
                      }`}> */}
                      {/* <Activity className={`w-4 h-4 ${
                          activity.action.includes('Booked') ? 'text-green-600' : 
                          activity.action.includes('Cancelled') ? 'text-red-600' : 'text-blue-600'
                        }`} /> */}
                      {/* </div> */}
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1">
                          Agent {activity.agentName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          <span
                            className={`font-medium ${
                              activity.action.includes("Cancelled")
                                ? "text-red-500"
                                : "text-green-600"
                            }`}
                          >
                            {activity.action}
                          </span>{" "}
                          for {activity.patientName}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatTimeAgo(activity.timestamp)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No recent activity found.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NewAdminDashboard;
