import Link from "next/link";
import { PlusCircle, Building2 } from "lucide-react";

export default function AdminPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">
            Properties Inventory
          </h2>
          <p className="text-sm text-slate-500">
            Create, edit, publish, or archive property listings.
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-sm rounded-md shadow transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Property</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center text-slate-400">
        <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-navy-900" />
        <h3 className="text-lg font-bold text-slate-700">
          No Properties Listed
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
          Property listings added here will be managed by the administrator
          before being published to the public portal.
        </p>
      </div>
    </div>
  );
}
