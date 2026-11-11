import Link from "next/link";
import { PlusCircle, Building2 } from "lucide-react";

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
            Properties Inventory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, edit, publish, or archive property listings.
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs sm:text-sm rounded-lg shadow-xs transition-colors shrink-0 w-full sm:w-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Property</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-8 sm:p-12 text-center text-slate-400">
        <Building2 className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 opacity-30 text-navy-900" />
        <h3 className="text-base sm:text-lg font-bold text-slate-700">
          No Properties Listed
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
          Property listings added here will be managed by the administrator
          before being published to the public portal.
        </p>
      </div>
    </div>
  );
}
