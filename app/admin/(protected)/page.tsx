import Link from "next/link";
import {
  Building2,
  MessageSquare,
  Calendar,
  PlusCircle,
  ArrowUpRight,
} from "lucide-react";

export default async function AdminDashboardPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Overview Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900">
            Dashboard Overview
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage real estate inventory, visitor inquiries, and appointment
            requests.
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-all cursor-pointer shrink-0 w-full sm:w-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Listings
            </span>
            <div className="p-2 sm:p-2.5 bg-navy-50 rounded-lg text-navy-900 border border-navy-100">
              <Building2 className="w-4 sm:w-5 h-4 sm:h-5 text-navy-900" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-navy-900">0</div>
          <p className="text-xs text-slate-500 mt-2">
            Properties listed for sale
          </p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Enquiries
            </span>
            <div className="p-2 sm:p-2.5 bg-amber-50 rounded-lg text-amber-700 border border-amber-100">
              <MessageSquare className="w-4 sm:w-5 h-4 sm:h-5 text-amber-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-navy-900">0</div>
          <p className="text-xs text-slate-500 mt-2">Received visitor leads</p>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              Viewing Requests
            </span>
            <div className="p-2 sm:p-2.5 bg-emerald-50 rounded-lg text-emerald-700 border border-emerald-100">
              <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-navy-900">0</div>
          <p className="text-xs text-slate-500 mt-2">
            Scheduled property viewings
          </p>
        </div>
      </div>

      {/* Quick Action Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-base sm:text-lg font-bold text-navy-900 mb-4">
            Recent Enquiries
          </h3>
          <div className="text-center py-10 sm:py-12 text-slate-400 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
            <MessageSquare className="w-7 sm:w-8 h-7 sm:h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs sm:text-sm text-slate-500">
              No visitor enquiries recorded yet.
            </p>
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-base sm:text-lg font-bold text-navy-900 mb-4">
            Quick Navigation
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/properties"
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-lg border border-slate-200 hover:border-gold-500 hover:bg-slate-50/80 transition-all text-xs sm:text-sm font-semibold text-navy-900"
            >
              <span>Manage Property Listings</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
            </Link>
            <Link
              href="/admin/enquiries"
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-lg border border-slate-200 hover:border-gold-500 hover:bg-slate-50/80 transition-all text-xs sm:text-sm font-semibold text-slate-700"
            >
              <span>Review Incoming Enquiries</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
            </Link>
            <Link
              href="/admin/viewing-requests"
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-lg border border-slate-200 hover:border-gold-500 hover:bg-slate-50/80 transition-all text-xs sm:text-sm font-semibold text-slate-700"
            >
              <span>Manage Viewing Schedules</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
