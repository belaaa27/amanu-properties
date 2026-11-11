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
        const res = await authClient.signIn.email({
          email,
          password,
        });

        if (res.error) {
          setError(
            res.error.message || "Invalid credentials. Please try again.",
          );
        } else {
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
    <div className="min-h-screen bg-navy-950 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md bg-white rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden border border-slate-200/80">
        {/* Brand Banner Header */}
        <div className="bg-navy-900 p-6 sm:p-8 text-center border-b border-gold-500/30">
          <div className="inline-flex w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold-500 text-navy-950 font-black text-xl sm:text-2xl items-center justify-center mb-2.5 sm:mb-3 shadow-md">
            A
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            AMANU PROPERTIES
          </h2>
          <p className="text-[10px] sm:text-xs text-gold-500 uppercase tracking-widest mt-1 font-semibold">
            Administrator Portal
          </p>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-8">
          {error && (
            <div className="mb-5 sm:mb-6 p-3.5 sm:p-4 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm">
              <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-rose-600 shrink-0 mt-0.5" />
              <p className="text-rose-700 leading-relaxed">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            {!isTotpRequired ? (
              <>
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5 sm:mb-2">
                    Administrator Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@amanuproperties.com"
                      className="w-full pl-10 sm:pl-11 pr-3.5 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-xs sm:text-sm text-navy-900 bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5 sm:mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 sm:w-5 h-4 sm:h-5 text-slate-400 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 sm:pl-11 pr-3.5 sm:pr-4 py-2.5 sm:py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 text-xs sm:text-sm text-navy-900 bg-slate-50/50"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="text-center mb-4">
                  <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-gold-500 mx-auto mb-2" />
                  <h3 className="text-base sm:text-lg font-bold text-navy-900">
                    Two-Factor Authentication
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter the 6-digit code from your authenticator app.
                  </p>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value)}
                  placeholder="000000"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-center text-xl sm:text-2xl tracking-widest font-mono rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-gold-500 text-navy-950 bg-white"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 sm:py-3 px-4 bg-navy-900 hover:bg-navy-800 text-gold-500 font-bold rounded-lg transition-all shadow-md flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 cursor-pointer"
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

        {/* Footer */}
        <div className="bg-slate-50/80 px-6 sm:px-8 py-3.5 sm:py-4 border-t border-slate-100 text-center">
          <p className="text-[11px] sm:text-xs text-slate-500">
            Authorized administrative access only.
          </p>
        </div>
      </div>
    </div>
  );
}
