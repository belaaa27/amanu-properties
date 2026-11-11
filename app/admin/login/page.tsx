"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Shield, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [isTotpRequired, setIsTotpRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isTotpRequired) {
        // Submit 2FA verification code
        const res = await authClient.twoFactor.verifyOtp({
          code: totpCode,
        });

        if (res.error) {
          setError(res.error.message || "Invalid 2FA authentication code.");
        } else {
          router.push("/admin");
          router.refresh();
        }
      } else {
        // Password authentication
        const res = await authClient.signIn.email({
          email,
          password,
        });

        if (res.error) {
          setError(
            res.error.message || "Invalid credentials. Please try again.",
          );
        } else {
          // Check if TOTP is requested by server response
          if (
            (res.data as unknown as { twoFactorRedirect?: boolean })
              ?.twoFactorRedirect
          ) {
            setIsTotpRequired(true);
          } else {
            router.push("/admin");
            router.refresh();
          }
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during authentication.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-100">
        {/* Brand Banner Header */}
        <div className="bg-navy-900 p-8 text-center border-b border-gold-500/20">
          <div className="inline-flex w-12 h-12 rounded-full bg-gold-500 text-navy-950 font-black text-2xl items-center justify-center mb-3 shadow-lg">
            A
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            AMANU PROPERTIES
          </h2>
          <p className="text-xs text-gold-500 uppercase tracking-widest mt-1 font-semibold">
            Administrator Secure Portal
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-6 p-4 rounded-md bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {!isTotpRequired ? (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@amanuproperties.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-sm text-slate-900"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="text-center mb-4">
                  <Shield className="w-10 h-10 text-gold-500 mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-slate-800">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter the 6-digit verification code from your authenticator
                    app.
                  </p>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="000000"
                  className="w-full px-4 py-3 text-center text-2xl tracking-widest font-mono rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-slate-900"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy-900 hover:bg-navy-800 text-gold-500 font-bold rounded-md transition-all shadow-md flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : isTotpRequired ? (
                "Verify Code & Sign In"
              ) : (
                "Sign In to Portal"
              )}
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-400">
            Authorized administrative personnel only. Unauthorized access
            attempts are monitored and logged.
          </p>
        </div>
      </div>
    </div>
  );
}
