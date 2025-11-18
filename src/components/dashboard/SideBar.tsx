"use client";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  Settings,
  Building,
  ClipboardList,
  ChartNoAxesColumnIncreasing,
  Receipt,
  Users,
  LogOut,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

const SideBar = () => {
  const pathname = usePathname();

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    const isActive = pathname === href;

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 
          ${
            isActive
              ? "bg-gradient-to-r from-[#12E62B]/80 to-[#3B16F4]/80 text-white"
              : "text-white/90 hover:bg-white/10"
          }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div
      className="w-1/6 h-screen text-white flex flex-col relative"
      style={{
        backgroundImage: `url('/assets/bg.png')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="px-6 pt-6 pb-4">
          <Image
            src="/assets/logo.png"
            alt="ChannelLog Logo"
            width={200}
            height={40}
            className="object-contain"
          />
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavLink href="/dashboard">
            <Home size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </NavLink>

          <NavLink href="/AppointmentBooking">
            <Calendar size={20} />
            <span className="text-sm font-medium">Appointment Booking</span>
          </NavLink>

          <NavLink href="/BulkBooking">
            <Users size={20} />
            <span className="text-sm font-medium">Bulk Booking</span>
          </NavLink>

          <NavLink href="/Appointments">
            <ClipboardList size={20} />
            <span className="text-sm font-medium">Appointment Management</span>
          </NavLink>

          <NavLink href="/reports">
            <ChartNoAxesColumnIncreasing size={20} />
            <span className="text-sm font-medium">Reports</span>
          </NavLink>

          <NavLink href="/receipts">
            <Receipt size={20} />
            <span className="text-sm font-medium">Receipts</span>
          </NavLink>

          <NavLink href="/directory">
            <Building size={20} />
            <span className="text-sm font-medium">Directory</span>
          </NavLink>

          <NavLink href="/Settings">
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </NavLink>
        </nav>

        <div className="px-4 pb-4 space-y-1 border-t border-white/30 pt-4">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-white/90 hover:bg-white/10 w-full text-left">
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-white/90 hover:bg-white/10 w-full text-left">
            <HelpCircle size={20} />
            <span className="text-sm font-medium">Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
