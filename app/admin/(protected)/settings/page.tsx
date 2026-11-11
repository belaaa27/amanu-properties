import { Settings, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
        <h2 className="text-2xl font-bold text-navy-900">
          Admin Account Settings
        </h2>
        <p className="text-sm text-slate-500">
          Configure administrative profile and authentication options.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="p-3 bg-navy-50 rounded-full text-navy-900">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-900">
              Two-Factor Authentication (2FA)
            </h3>
            <p className="text-xs text-slate-500">
              Enhance login security using a Time-based One-Time Password (TOTP)
              authenticator application.
            </p>
          </div>
        </div>

        <div className="text-sm text-slate-600 space-y-2">
          <p>
            <span className="font-semibold text-slate-800">Role:</span> Primary
            Administrator (`ADMIN`)
          </p>
          <p>
            <span className="font-semibold text-slate-800">
              Public Visitor Registration:
            </span>{" "}
            Disabled (`disableSignUp: true`)
          </p>
        </div>
      </div>
    </div>
  );
}
