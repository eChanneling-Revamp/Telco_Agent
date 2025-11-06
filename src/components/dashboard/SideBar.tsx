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
        className={`flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 
          ${
            isActive
              ? "bg-gradient-to-r from-green-300 to-indigo-400"
              : "hover:bg-white/20"
          }`}
      >
        {children}
      </Link>
    );
  };

  return (
    <div
      className="w-64 h-screen text-white flex flex-col"
      style={{
        backgroundImage: `url('/assets/bg.png')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="">
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={220}
          height={100}
          className="mx-auto my-4"
        />
      </div>

      <div className="px-8 flex-1">
        <NavLink href="/dashboard">
          <Home size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink href="/AppointmentBooking">
          <Calendar size={20} />
          <span>Appointment Booking</span>
        </NavLink>

        <NavLink href="/Appointments">
          <ClipboardList size={20} />
          <span>Appointment Management</span>
        </NavLink>

        <NavLink href="/reports">
          <ChartNoAxesColumnIncreasing size={20} />
          <span>Reports</span>
        </NavLink>

        <NavLink href="/receipts">
          <Receipt size={20} />
          <span>Receipts</span>
        </NavLink>

        <NavLink href="/directory">
          <Building size={20} />
          <span>Directory</span>
        </NavLink>

        <NavLink href="/Settings">
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>

      <div className="w-full text-xs text-center bg-white/20 backdrop-blur-sm py-2">
        © 2025 Sri Lanka Telecom eChanneling
      </div>
    </div>
  );
};

export default SideBar;
