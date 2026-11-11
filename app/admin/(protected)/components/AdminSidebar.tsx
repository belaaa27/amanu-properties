"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  X,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Properties", href: "/admin/properties", icon: Building2 },
  { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { name: "Viewing Requests", href: "/admin/viewing-requests", icon: Calendar },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({
  user,
  mobileOpen = false,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    if (onCloseMobile) onCloseMobile();
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/admin/login");
        },
      },
    });
  };

  const navContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Brand Header */}
        <div className="p-5 sm:p-6 border-b border-navy-800/80 flex items-center justify-between">
          <Link
            href="/admin"
            onClick={onCloseMobile}
            className="flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-gold-500 text-navy-950 font-black flex items-center justify-center text-xl shadow-md">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-wider text-sm text-gold-500">
                AMANU
              </span>
              <span className="text-[10px] text-slate-300 font-medium tracking-widest -mt-0.5">
                ADMIN PORTAL
              </span>
            </div>
          </Link>

          {/* Close Button for Mobile Drawer */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              aria-label="Close navigation drawer"
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-gold-500/15 text-gold-400 border-l-4 border-gold-500 shadow-xs"
                    : "text-slate-300 hover:bg-navy-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 ${isActive ? "text-gold-500" : "text-slate-400"}`}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-gold-500" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-navy-800/80 bg-navy-950/40">
        <div className="px-3 py-2 mb-2 bg-navy-800/50 rounded-lg">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Signed in as
          </p>
          <p className="text-xs font-semibold text-white truncate mt-0.5">
            {user.name || user.email}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar (visible on lg and above) */}
      <aside className="hidden lg:flex w-64 bg-navy-900 text-white min-h-screen flex-col border-r border-navy-800 shadow-xl shrink-0">
        {navContent}
      </aside>

      {/* 2. Mobile Drawer & Backdrop (visible on screen sizes < lg when mobileOpen is true) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-navy-950/80 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Off-canvas Drawer Panel */}
          <aside className="relative w-72 max-w-[80vw] bg-navy-900 text-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
