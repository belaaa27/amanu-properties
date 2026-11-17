"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import QRCode from "qrcode";
import { authClient } from "@/lib/auth-client";
import {
  Shield,
  Lock,
  Key,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

type StatusMessage = {
  type: "success" | "error";
  text: string;
};

export default function AdminSettingsPage() {
  // Change Administrator Password
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<StatusMessage | null>(
    null,
  );

  // Two-Factor Authentication
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [totpSecret, setTotpSecret] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<StatusMessage | null>(null);

  // Change Administrator Password
  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setPasswordMessage({
        type: "error",
        text: "Please complete all password fields.",
      });
      return;
    }

    if (newPassword.length < 8 || newPassword.length > 128) {
      setPasswordMessage({
        type: "error",
        text: "New password must be between 8 and 128 characters long.",
      });
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirmation do not match.",
      });
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password must be different from your current password.",
      });
      return;
    }

    setPasswordLoading(true);

    try {
      const res = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (res.error) {
        setPasswordMessage({
          type: "error",
          text: res.error.message || "Failed to update administrator password.",
        });
      } else {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");

        setShowCurrentPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);

        setPasswordMessage({
          type: "success",
          text: "Administrator password updated successfully. Other active sessions have been signed out.",
        });
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while changing password.";

      setPasswordMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // Enable Two-Factor Authentication
  const handleEnable2FA = async (e: FormEvent<HTMLFormElement>) => {
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
        const data = res.data as {
          totpURI?: string;
          backupCodes?: string[];
        };

        if (data.totpURI) {
          setTotpSecret(data.totpURI);

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
          text: "Scan the QR code with your authenticator app and enter the 6-digit verification code below.",
        });
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Error enabling 2FA";

      setMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  // Verify Two-Factor Authentication
  const handleVerify2FA = async (e: FormEvent<HTMLFormElement>) => {
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
        setTotpCode("");

        setMessage({
          type: "success",
          text: "Two-Factor Authentication successfully enabled for your account!",
        });
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Error verifying OTP";

      setMessage({
        type: "error",
        text: errorMsg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div>
        <h2 className="text-xl font-bold text-navy-900">
          Admin Security Settings
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure administrative profile and Two-Factor Authentication
          options.
        </p>
      </div>

      {/* Section 1 — Change Administrator Password */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pb-6 border-b border-slate-100">
          <div className="p-3 bg-navy-50 rounded-full text-navy-900 w-fit shrink-0">
            <Key className="w-6 h-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-navy-900">
              Change Administrator Password
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Update your administrator password (8–128 characters). Other
              active sessions will be revoked upon change.
            </p>
          </div>
        </div>

        {passwordMessage && (
          <div
            role="status"
            className={`p-4 rounded-lg flex items-start gap-3 border text-xs sm:text-sm ${
              passwordMessage.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-rose-50 border-rose-200 text-rose-800"
            }`}
          >
            {passwordMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}

            <p className="leading-relaxed">{passwordMessage.text}</p>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          {/* Current Password */}
          <div>
            <label
              htmlFor="admin-current-password"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Current Password
            </label>

            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                id="admin-current-password"
                type={showCurrentPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />

              <button
                type="button"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                aria-label={
                  showCurrentPassword
                    ? "Hide current password"
                    : "Show current password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label
              htmlFor="admin-new-password"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              New Password
            </label>

            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                id="admin-new-password"
                type={showNewPassword ? "text" : "password"}
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />

              <button
                type="button"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showNewPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label
              htmlFor="admin-confirm-new-password"
              className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
            >
              Confirm New Password
            </label>

            <div className="relative">
              <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                id="admin-confirm-new-password"
                type={showConfirmPassword ? "text" : "password"}
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? "Hide password confirmation"
                    : "Show password confirmation"
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={passwordLoading}
            className="w-full sm:w-auto py-2.5 px-6 bg-navy-900 hover:bg-navy-800 text-gold-500 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {passwordLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}

            <span>
              {passwordLoading ? "Updating Password..." : "Change Password"}
            </span>
          </button>
        </form>
      </div>

      {/* Section 2 — Two-Factor Authentication */}
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
            role="status"
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

        {/* 2FA Setup */}
        {!is2FAEnabled && !qrCodeUrl && (
          <form onSubmit={handleEnable2FA} className="space-y-4 max-w-md">
            <div>
              <label
                htmlFor="admin-2fa-password"
                className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2"
              >
                Confirm Admin Password to Enable 2FA
              </label>

              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                <input
                  id="admin-2fa-password"
                  type="password"
                  required
                  autoComplete="current-password"
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
              className="w-full sm:w-auto py-2.5 px-6 bg-navy-900 hover:bg-navy-800 text-gold-500 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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

        {/* QR Code and OTP Verification */}
        {qrCodeUrl !== null && (
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
                <label
                  htmlFor="admin-2fa-code"
                  className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center"
                >
                  Enter 6-Digit Verification Code
                </label>

                <input
                  id="admin-2fa-code"
                  type="text"
                  required
                  maxLength={6}
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  autoComplete="one-time-code"
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="000000"
                  className="w-full py-2.5 text-center text-lg sm:text-xl font-mono tracking-widest rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}

                <span>Verify & Activate 2FA</span>
              </button>
            </form>
          </div>
        )}

        {/* Emergency Backup Codes */}
        {backupCodes.length > 0 && (
          <div className="pt-4 border-t border-slate-200 max-w-md">
            <h5 className="text-xs font-bold text-navy-900 uppercase mb-1.5">
              Emergency Backup Codes
            </h5>

            <p className="text-xs text-slate-500 mb-3">
              Store these backup codes in a safe place. Each can be used once if
              you lose access to your authenticator device.
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

        {is2FAEnabled && (
          <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
            Two-Factor Authentication is enabled.
          </div>
        )}

        {/* Administrator Information */}
        <div className="text-xs text-slate-600 space-y-1.5 pt-4 border-t border-slate-100">
          <p>
            <span className="font-semibold text-navy-900">Assigned Role:</span>{" "}
            Primary Administrator (
            <code className="text-xs font-mono">ADMIN</code>)
          </p>

          <p>
            <span className="font-semibold text-navy-900">
              Public Visitor Registration:
            </span>{" "}
            Disabled (
            <code className="text-xs font-mono">disableSignUp: true</code>)
          </p>
        </div>
      </div>
    </div>
  );
}
