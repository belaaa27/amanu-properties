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
} from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface AdminSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Properties", href: "/admin/properties", icon: Building2 },
  { name: "Enquiries", href: "/admin/enquiries", icon: MessageSquare },
  { name: "Viewing Requests", href: "/admin/viewing-requests", icon: Calendar },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/admin/login");
        },
      },
    });
  };

  return (
    <aside className="w-64 bg-navy-900 text-white min-h-screen flex flex-col justify-between border-r border-navy-800 shadow-xl">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-navy-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-gold-500 text-navy-950 font-bold flex items-center justify-center text-lg shadow">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-wider text-sm text-gold-500">
                AMANU
              </span>
              <span className="text-xs text-slate-300 font-light -mt-1">
                ADMIN PORTAL
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gold-500/10 text-gold-500 border-l-4 border-gold-500"
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
      <div className="p-4 border-t border-navy-800">
        <div className="px-4 py-2 mb-2">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="text-sm font-medium text-white truncate">
            {user.name || user.email}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
        >
          <LogOut className="w-5 h-5 text-rose-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
