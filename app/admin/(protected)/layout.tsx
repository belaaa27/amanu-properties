import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import AdminSidebar from "./components/AdminSidebar";

export const metadata = {
  title: "Admin Portal | Amanu Properties",
  description: "Administrator management portal for Amanu Properties",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Strict Server-Side Authorization Guard
  const session = await requireAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <AdminSidebar user={session.user} />

      {/* Main Content Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-xl font-bold text-navy-900">
            Amanu Properties Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
              Admin Session Active
            </span>
          </div>
        </header>
        <div className="p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
}
