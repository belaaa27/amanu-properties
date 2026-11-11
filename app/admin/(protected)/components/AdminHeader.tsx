"use client";

import { Menu } from "lucide-react";

interface AdminHeaderProps {
  onOpenMobileMenu: () => void;
}

export default function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile Hamburger Button */}
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-gold-500 cursor-pointer shrink-0"
        >
          <Menu className="w-5 h-5 text-navy-900" />
        </button>

        {/* Brand Header / Title */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded bg-gold-500 text-navy-950 font-bold flex items-center justify-center text-sm shadow-xs shrink-0 lg:hidden">
            A
          </div>
          <h1 className="text-base sm:text-lg font-bold text-navy-900 truncate">
            <span className="hidden sm:inline">Amanu Properties </span>Dashboard
          </h1>
        </div>
      </div>

      {/* Session Status Badge */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-emerald-50 border border-emerald-200 px-2.5 sm:px-3 py-1 rounded-full shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[10px] sm:text-xs font-semibold text-emerald-800 uppercase tracking-wider">
          <span className="hidden sm:inline">Admin </span>Active
        </span>
      </div>
    </header>
  );
}
