import { Calendar } from "lucide-react";

export default function AdminViewingRequestsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-navy-900">
          Viewing Appointments
        </h2>
        <p className="text-sm text-slate-500">
          Schedule and manage on-site property viewings.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center text-slate-400">
        <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30 text-navy-900" />
        <h3 className="text-lg font-bold text-slate-700">
          No Appointments Scheduled
        </h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
          Requested viewing dates and time slots submitted by potential buyers
          will appear here.
        </p>
      </div>
    </div>
  );
}
