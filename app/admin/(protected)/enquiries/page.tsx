import { MessageSquare } from "lucide-react";

export default function AdminEnquiriesPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
          Visitor Enquiries
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Track and respond to client property enquiries.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-8 sm:p-12 text-center text-slate-400">
        <MessageSquare className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 opacity-30 text-navy-900" />
        <h3 className="text-base sm:text-lg font-bold text-slate-700">
          No Enquiries Found
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
          Visitor lead form submissions will automatically populate this
          administrative view.
        </p>
      </div>
    </div>
  );
}
