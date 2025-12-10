"use client";
import React from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Users,
  UserPlus,
  ClipboardList,
  LogOut,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const NavLink = ({
    href,
    children,
  }: {
    href: string;
    children: React.ReactNode;
  }) => {
    const isActive =
      pathname === href ||
      (pathname?.startsWith(`${href}/`) &&
        !(href === "/admin/users" && pathname === "/admin/users/new"));

    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 
          ${
            isActive
              ? "bg-blue-950 text-white"
              : "text-black/90 hover:bg-blue-50"
          }`}
      >
        {children}
      </Link>
    );
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <div className="w-64 h-screen text-white flex flex-col relative bg-white/90">
      <div className="absolute inset-0 pointer-events-none" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="px-6 pt-6 pb-4">
          <Image
            src="/assets/logo.png"
            alt="eChanneling Logo"
            width={200}
            height={40}
            className="object-contain"
          />
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavLink href="/admin/dashboard">
            <Home size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </NavLink>

          <NavLink href="/admin/users">
            <Users size={20} />
            <span className="text-sm font-medium">Manage Agents</span>
          </NavLink>

          <NavLink href="/admin/users/new">
            <UserPlus size={20} />
            <span className="text-sm font-medium">Add New Agent</span>
          </NavLink>

          <NavLink href="/admin/appointments">
            <ClipboardList size={20} />
            <span className="text-sm font-medium">All Appointments</span>
          </NavLink>
        </nav>

        <div className="px-4 pb-4 space-y-1 border-t border-black/30 pt-4 text-black">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-black rounded-lg transition-colors duration-200 hover:bg-blue-50 w-full text-left"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>

          <button className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-black hover:bg-blue-50 w-full text-left">
            <HelpCircle size={20} />
            <span className="text-sm font-medium">Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
