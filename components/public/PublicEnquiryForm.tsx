"use client";

import { useState } from "react";
import {
  Send,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { submitPublicEnquiry } from "@/app/(public)/actions";

interface PublicEnquiryFormProps {
  propertyId?: string;
  propertyTitle?: string;
  defaultMode?: "GENERAL" | "PROPERTY_ENQUIRY" | "VIEWING_REQUEST";
}

export default function PublicEnquiryForm({
  propertyId,
  propertyTitle,
  defaultMode = propertyId ? "PROPERTY_ENQUIRY" : "GENERAL",
}: PublicEnquiryFormProps) {
  const [enquiryType, setEnquiryType] = useState<
    "GENERAL" | "PROPERTY_ENQUIRY" | "VIEWING_REQUEST"
  >(defaultMode);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("type", enquiryType);
    if (propertyId) {
      formData.set("propertyId", propertyId);
    }

    const res = await submitPublicEnquiry(formData);
    setResult(res);
    setLoading(false);

    if (res.success) {
      form.reset();
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-5">
      <div>
        <h3 className="font-serif text-xl font-bold text-navy-900">
          {propertyId ? "Enquire or Arrange a Viewing" : "Send an Enquiry"}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {propertyTitle
            ? `Interested in "${propertyTitle}"? Submit your details below—no account required.`
            : "Have a question about buying property in Addis Ababa? Reach out directly to Amanuel."}
        </p>
      </div>

      {/* Mode Switcher */}
      <div
        role="tablist"
        aria-label="Enquiry Type"
        className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg"
      >
        <button
          type="button"
          role="tab"
          aria-selected={enquiryType !== "VIEWING_REQUEST"}
          onClick={() =>
            setEnquiryType(propertyId ? "PROPERTY_ENQUIRY" : "GENERAL")
          }
          className={`py-2 px-3 rounded-md text-xs font-bold transition-all cursor-pointer ${
            enquiryType !== "VIEWING_REQUEST"
              ? "bg-navy-900 text-gold-400 shadow-xs"
              : "text-slate-600 hover:text-navy-900"
          }`}
        >
          Property Enquiry
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={enquiryType === "VIEWING_REQUEST"}
          onClick={() => setEnquiryType("VIEWING_REQUEST")}
          className={`py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            enquiryType === "VIEWING_REQUEST"
              ? "bg-navy-900 text-gold-400 shadow-xs"
              : "text-slate-600 hover:text-navy-900"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Request Viewing</span>
        </button>
      </div>

      {result && (
        <div
          role="status"
          className={`p-4 rounded-lg border text-xs sm:text-sm flex items-start gap-2.5 ${
            result.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          )}
          <p className="leading-relaxed">{result.message}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="enquiry-fullName"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
          >
            Full Name *
          </label>
          <input
            id="enquiry-fullName"
            name="fullName"
            type="text"
            required
            placeholder="Your full name"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="enquiry-phone"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
            >
              Phone Number *
            </label>
            <input
              id="enquiry-phone"
              name="phone"
              type="tel"
              required
              placeholder="+251 9..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div>
            <label
              htmlFor="enquiry-email"
              className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
            >
              Email (Optional)
            </label>
            <input
              id="enquiry-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="enquiry-contactMethod"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
          >
            Preferred Contact Method
          </label>
          <select
            id="enquiry-contactMethod"
            name="preferredContactMethod"
            defaultValue="PHONE"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="PHONE">Phone Call</option>
            <option value="WHATSAPP">WhatsApp</option>
            <option value="TELEGRAM">Telegram</option>
            <option value="EMAIL">Email</option>
          </select>
        </div>

        {enquiryType === "VIEWING_REQUEST" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3.5 rounded-lg bg-amber-50/60 border border-gold-500/30">
            <div>
              <label
                htmlFor="enquiry-preferredDate"
                className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1"
              >
                Preferred Date *
              </label>
              <input
                id="enquiry-preferredDate"
                name="preferredDate"
                type="date"
                required={enquiryType === "VIEWING_REQUEST"}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label
                htmlFor="enquiry-timeSlot"
                className="block text-xs font-bold uppercase tracking-wider text-navy-900 mb-1"
              >
                Preferred Time Slot
              </label>
              <select
                id="enquiry-timeSlot"
                name="preferredTimeSlot"
                defaultValue="MORNING"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-navy-900 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="MORNING">Morning (9:00 AM – 12:00 PM)</option>
                <option value="AFTERNOON">Afternoon (1:00 PM – 4:00 PM)</option>
                <option value="EVENING">
                  Late Afternoon (4:00 PM – 6:00 PM)
                </option>
              </select>
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="enquiry-message"
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1"
          >
            Message {enquiryType === "VIEWING_REQUEST" ? "(Optional)" : "*"}
          </label>
          <textarea
            id="enquiry-message"
            name="message"
            rows={4}
            required={enquiryType !== "VIEWING_REQUEST"}
            placeholder={
              enquiryType === "VIEWING_REQUEST"
                ? "Any notes regarding your preferred viewing schedule..."
                : "Tell us what you are looking for or ask a question about this property..."
            }
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-5 bg-navy-900 hover:bg-navy-800 text-gold-400 font-bold text-xs uppercase tracking-[0.16em] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>
                {enquiryType === "VIEWING_REQUEST"
                  ? "Request Viewing"
                  : "Submit Enquiry"}
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
