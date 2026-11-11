"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { authClient } from "@/lib/auth-client";
import {
  Shield,
  Lock,
  Key,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await authClient.twoFactor.enable({
        password,
      });

      if (res.error) {
        setMessage({
          type: "error",
          text: res.error.message || "Failed to initiate 2FA setup.",
        });
      } else if (res.data) {
        // Explicit typing for Better Auth TOTP enable response
        const data = res.data as { totpURI?: string; backupCodes?: string[] };

        if (data.totpURI) {
          setTotpSecret(data.totpURI);

          // Render QR code locally via canvas/data URL
          const localQrUrl = await QRCode.toDataURL(data.totpURI, {
            width: 200,
            margin: 2,
            color: {
              dark: "#0B192C",
              light: "#FFFFFF",
            },
          });
          setQrCodeUrl(localQrUrl);
        }

        if (data.backupCodes) {
          setBackupCodes(data.backupCodes);
        }

        setMessage({
          type: "success",
          text: "Scan QR code with your authenticator app and enter the 6-digit verification code below.",
        });
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Error enabling 2FA";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await authClient.twoFactor.verifyOtp({
        code: totpCode,
      });

      if (res.error) {
        setMessage({
          type: "error",
          text: res.error.message || "Invalid OTP code.",
        });
      } else {
        setIs2FAEnabled(true);
        setQrCodeUrl(null);
        setMessage({
          type: "success",
          text: "Two-Factor Authentication successfully enabled for your account!",
        });
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Error verifying OTP";
      setMessage({ type: "error", text: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
          Admin Security Settings
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure administrative profile and Two-Factor Authentication
          options.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pb-6 border-b border-slate-100">
          <div className="p-3 bg-navy-50 rounded-full text-navy-900 w-fit shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-navy-900">
              Two-Factor Authentication (2FA)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Enhance login security using a Time-based One-Time Password (TOTP)
              authenticator application (e.g. Google Authenticator, 1Password).
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg flex items-start gap-3 border text-xs sm:text-sm ${
              message.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <p className="leading-relaxed">{message.text}</p>
          </div>
        )}

        {!is2FAEnabled && !qrCodeUrl && (
          <form onSubmit={handleEnable2FA} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Confirm Admin Password to Enable 2FA
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto py-2.5 px-6 bg-navy-900 hover:bg-navy-800 text-gold-500 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Key className="w-4 h-4" />
              )}
              <span>Setup 2FA Authenticator</span>
            </button>
          </form>
        )}

        {qrCodeUrl && (
          <div className="space-y-6 max-w-md border border-slate-200 p-4 sm:p-6 rounded-xl bg-slate-50/70">
            <div className="text-center">
              <h4 className="font-bold text-navy-900 mb-1 sm:mb-2 text-sm sm:text-base">
                Scan QR Code
              </h4>
              <p className="text-xs text-slate-500 mb-4 max-w-xs mx-auto">
                Open Google Authenticator or your password manager and scan this
                QR code.
              </p>
              <img
                src={qrCodeUrl}
                alt="2FA QR Code"
                className="mx-auto border p-2 bg-white rounded-lg shadow-xs max-w-[180px] sm:max-w-[200px]"
              />
            </div>

            {totpSecret && (
              <div className="text-[11px] sm:text-xs bg-white p-3 rounded-lg border border-slate-200 text-slate-600 font-mono break-all text-center">
                <span className="font-semibold block text-slate-400 font-sans mb-1 uppercase tracking-wider text-[10px]">
                  Provisioning URI / Secret Key:
                </span>
                {totpSecret}
              </div>
            )}

            <form onSubmit={handleVerify2FA} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="000000"
                  className="w-full py-2.5 text-center text-lg sm:text-xl font-mono tracking-widest rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>Verify & Activate 2FA</span>
              </button>
            </form>

            {backupCodes.length > 0 && (
              <div className="pt-4 border-t border-slate-200">
                <h5 className="text-xs font-bold text-navy-900 uppercase mb-1.5">
                  Emergency Backup Codes
                </h5>
                <p className="text-xs text-slate-500 mb-3">
                  Store these backup codes in a safe place. Each can be used
                  once if you lose access to your authenticator device.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono bg-white p-3 rounded-lg border border-slate-200 text-center">
                  {backupCodes.map((code, idx) => (
                    <span
                      key={idx}
                      className="text-slate-700 py-1 bg-slate-50 rounded border border-slate-100"
                    >
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-slate-600 space-y-1.5 pt-4 border-t border-slate-100">
          <p>
            <span className="font-semibold text-navy-900">Assigned Role:</span>{" "}
            Primary Administrator (`ADMIN`)
          </p>
          <p>
            <span className="font-semibold text-navy-900">
              Public Visitor Registration:
            </span>{" "}
            Disabled (`disableSignUp: true`)
          </p>
        </div>
      </div>
    </div>
  );
}
