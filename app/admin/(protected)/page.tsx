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
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Overview</h2>
          <p className="text-sm text-slate-500">
            Manage real estate inventory, leads, and client requests.
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-sm rounded-md shadow transition-colors w-fit"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Properties
            </span>
            <div className="p-2 bg-navy-50 rounded-md text-navy-900">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-navy-900">0</div>
          <p className="text-xs text-slate-500 mt-2">
            Active properties listed for sale
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Enquiries
            </span>
            <div className="p-2 bg-amber-50 rounded-md text-amber-700">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-navy-900">0</div>
          <p className="text-xs text-slate-500 mt-2">
            Visitor enquiry messages
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Viewing Requests
            </span>
            <div className="p-2 bg-emerald-50 rounded-md text-emerald-700">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-navy-900">0</div>
          <p className="text-xs text-slate-500 mt-2">
            Scheduled property viewing appointments
          </p>
        </div>
      </div>

      {/* Activity & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-navy-900 mb-4">
            Recent Enquiries
          </h3>
          <div className="text-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-md">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No visitor enquiries recorded yet.</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-navy-900 mb-4">
            Quick Management
          </h3>
          <div className="space-y-3">
            <Link
              href="/admin/properties"
              className="flex items-center justify-between p-4 rounded-md border border-slate-100 hover:border-gold-500 hover:bg-slate-50 transition-all text-sm font-semibold text-slate-700"
            >
              <span>Manage Property Listings</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/admin/enquiries"
              className="flex items-center justify-between p-4 rounded-md border border-slate-100 hover:border-gold-500 hover:bg-slate-50 transition-all text-sm font-semibold text-slate-700"
            >
              <span>Review Incoming Enquiries</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>
            <Link
              href="/admin/viewing-requests"
              className="flex items-center justify-between p-4 rounded-md border border-slate-100 hover:border-gold-500 hover:bg-slate-50 transition-all text-sm font-semibold text-slate-700"
            >
              <span>Manage Viewing Schedules</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
