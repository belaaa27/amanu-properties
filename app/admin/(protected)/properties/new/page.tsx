import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewPropertyForm from "./NewPropertyForm";

export default function NewPropertyPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/properties"
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
              Add New Property
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Create a real estate listing for Addis Ababa sales.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Client Form */}
      <NewPropertyForm />
    </div>
  );
}
