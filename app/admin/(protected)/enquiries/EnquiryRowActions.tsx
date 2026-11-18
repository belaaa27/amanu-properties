"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MessageSquare,
  Building2,
  StickyNote,
} from "lucide-react";
import { updateEnquiryStatus, saveEnquiryAdminNotes } from "./actions";

export interface SerializedEnquiryItem {
  id: string;
  type: "GENERAL" | "PROPERTY_ENQUIRY" | "VIEWING_REQUEST";
  fullName: string;
  phone: string;
  email: string | null;
  preferredContactMethod: "PHONE" | "WHATSAPP" | "TELEGRAM" | "EMAIL";
  message: string | null;
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "RESOLVED";
  adminNotes: string | null;
  createdAtIso: string;
  property: {
    id: string;
    title: string;
    subCity: string;
    neighbourhood: string;
    deletedAtIso: string | null;
  } | null;
}

const STATUS_BADGE_STYLES: Record<SerializedEnquiryItem["status"], string> = {
  NEW: "bg-amber-50 text-amber-800 border-amber-200",
  CONTACTED: "bg-sky-50 text-sky-800 border-sky-200",
  IN_PROGRESS: "bg-indigo-50 text-indigo-800 border-indigo-200",
  RESOLVED: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

const CONTACT_METHOD_LABELS: Record<
  SerializedEnquiryItem["preferredContactMethod"],
  string
> = {
  PHONE: "Phone Call",
  WHATSAPP: "WhatsApp",
  TELEGRAM: "Telegram",
  EMAIL: "Email",
};

function formatDateTimeSafe(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function EnquiryRowActions({
  enquiry,
  layout,
}: {
  enquiry: SerializedEnquiryItem;
  layout: "table-row" | "mobile-card";
}) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<SerializedEnquiryItem["status"]>(
    enquiry.status,
  );
  const [notes, setNotes] = useState<string>(enquiry.adminNotes ?? "");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isStatusPending, startStatusTransition] = useTransition();
  const [isNotesPending, startNotesTransition] = useTransition();

  const handleStatusChange = (nextStatus: SerializedEnquiryItem["status"]) => {
    const previousStatus = status;
    setStatus(nextStatus);
    setFeedback(null);

    startStatusTransition(async () => {
      const res = await updateEnquiryStatus(enquiry.id, nextStatus);
      if (!res.success) {
        setStatus(previousStatus);
        setFeedback({ type: "error", text: res.message });
      } else {
        setFeedback({ type: "success", text: res.message });
      }
    });
  };

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    startNotesTransition(async () => {
      const res = await saveEnquiryAdminNotes(enquiry.id, notes);
      setFeedback({
        type: res.success ? "success" : "error",
        text: res.message,
      });
    });
  };

  const renderExpandedDetails = () => (
    <div className="bg-slate-50/90 border-t border-slate-200 p-4 sm:p-5 space-y-4">
      {feedback && (
        <div
          role="status"
          className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Full Customer Message & Contact Summary */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-gold-600" />
              <span>Full Visitor Message</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              Preferred Channel:{" "}
              <strong className="text-navy-900">
                {CONTACT_METHOD_LABELS[enquiry.preferredContactMethod]}
              </strong>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {enquiry.message || "No additional message text provided."}
          </p>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <strong className="text-navy-900">{enquiry.phone}</strong>
            </span>
            {enquiry.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{enquiry.email}</span>
              </span>
            )}
          </div>
        </div>

        {/* Administrator Internal Notes Form */}
        <form
          onSubmit={handleSaveNotes}
          className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-4 space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <label
              htmlFor={`admin-notes-${enquiry.id}`}
              className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5"
            >
              <StickyNote className="w-3.5 h-3.5 text-gold-600" />
              <span>Internal Administrator Notes</span>
            </label>
            <textarea
              id={`admin-notes-${enquiry.id}`}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record call outcomes, follow-up reminders, or buyer preferences (private to admin)..."
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isNotesPending}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-gold-500 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isNotesPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (layout === "mobile-card") {
    return (
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 space-y-3.5">
          {/* Header Badges & Timestamp */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded bg-navy-50 text-navy-900 text-[10px] font-bold uppercase`}
              >
                {enquiry.type === "PROPERTY_ENQUIRY"
                  ? "Property Enquiry"
                  : "General Enquiry"}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_BADGE_STYLES[status]}`}
              >
                {status.replace("_", " ")}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 shrink-0">
              {formatDateTimeSafe(enquiry.createdAtIso)}
            </span>
          </div>

          {/* Visitor Info */}
          <div>
            <h3 className="font-bold text-sm text-navy-900">
              {enquiry.fullName}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
              <span>{enquiry.phone}</span>
              {enquiry.email && <span>• {enquiry.email}</span>}
              <span>
                • Via {CONTACT_METHOD_LABELS[enquiry.preferredContactMethod]}
              </span>
            </div>
          </div>

          {/* Linked Property */}
          <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {enquiry.property ? (
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  {enquiry.property.deletedAtIso ? (
                    <span className="font-semibold text-slate-600">
                      {enquiry.property.title}{" "}
                      <span className="text-[10px] text-rose-600">
                        (Archived Listing)
                      </span>
                    </span>
                  ) : (
                    <Link
                      href={`/admin/properties/${enquiry.property.id}`}
                      className="font-bold text-navy-900 hover:text-gold-600 line-clamp-1"
                    >
                      {enquiry.property.title}
                    </Link>
                  )}
                  <p className="text-[11px] text-slate-500">
                    {enquiry.property.subCity}, {enquiry.property.neighbourhood}
                  </p>
                </div>
              </div>
            ) : (
              <span className="text-slate-500 italic">
                General inquiry (no specific property linked)
              </span>
            )}
          </div>

          {/* Message Preview */}
          {enquiry.message && (
            <p className="text-xs text-slate-600 line-clamp-2">
              {enquiry.message}
            </p>
          )}

          {/* Status Selector & Expand Trigger */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <select
                aria-label="Enquiry status"
                value={status}
                disabled={isStatusPending}
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value as SerializedEnquiryItem["status"],
                  )
                }
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
              >
                <option value="NEW">New</option>
                <option value="CONTACTED">Contacted</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
              {isStatusPending && (
                <Loader2 className="w-4 h-4 animate-spin text-navy-900" />
              )}
            </div>

            <button
              type="button"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-navy-900 hover:bg-slate-50 cursor-pointer"
            >
              <span>{expanded ? "Hide Details" : "Message & Notes"}</span>
              {expanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {expanded && renderExpandedDetails()}
      </div>
    );
  }

  return (
    <>
      <tr className="hover:bg-slate-50/70 transition-colors align-top">
        {/* Visitor & Contact */}
        <td className="py-3.5 px-4">
          <div className="font-bold text-navy-900">{enquiry.fullName}</div>
          <div className="text-xs text-slate-600 mt-0.5">{enquiry.phone}</div>
          {enquiry.email && (
            <div className="text-xs text-slate-500">{enquiry.email}</div>
          )}
          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
            {CONTACT_METHOD_LABELS[enquiry.preferredContactMethod]}
          </span>
        </td>

        {/* Classification & Linked Property */}
        <td className="py-3.5 px-4 max-w-xs">
          <span className="inline-block px-2 py-0.5 rounded bg-navy-50 text-navy-900 text-[10px] font-bold uppercase">
            {enquiry.type === "PROPERTY_ENQUIRY"
              ? "Property Enquiry"
              : "General Enquiry"}
          </span>

          {enquiry.property ? (
            <div className="mt-1.5">
              {enquiry.property.deletedAtIso ? (
                <p className="text-xs font-semibold text-slate-600">
                  {enquiry.property.title}{" "}
                  <span className="text-[10px] text-rose-600">(Archived)</span>
                </p>
              ) : (
                <Link
                  href={`/admin/properties/${enquiry.property.id}`}
                  className="text-xs font-bold text-navy-900 hover:text-gold-600 line-clamp-1 block"
                >
                  {enquiry.property.title}
                </Link>
              )}
              <p className="text-[11px] text-slate-500">
                {enquiry.property.subCity}, {enquiry.property.neighbourhood}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic mt-1.5">
              General inquiry (no property linked)
            </p>
          )}
        </td>

        {/* Message Preview & Notes Indicator */}
        <td className="py-3.5 px-4 max-w-sm">
          <p className="text-xs text-slate-700 line-clamp-2">
            {enquiry.message || "No message text."}
          </p>
          {notes.trim() !== "" && (
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold">
              <StickyNote className="w-3 h-3" />
              <span>Has Admin Note</span>
            </span>
          )}
        </td>

        {/* Received Timestamp */}
        <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
          {formatDateTimeSafe(enquiry.createdAtIso)}
        </td>

        {/* Status Selector */}
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-2">
            <select
              aria-label="Enquiry status"
              value={status}
              disabled={isStatusPending}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as SerializedEnquiryItem["status"],
                )
              }
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50 ${STATUS_BADGE_STYLES[status]}`}
            >
              <option value="NEW">New</option>
              <option value="CONTACTED">Contacted</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
            </select>
            {isStatusPending && (
              <Loader2 className="w-4 h-4 animate-spin text-navy-900" />
            )}
          </div>
        </td>

        {/* Expand Details / Notes */}
        <td className="py-3.5 px-4 text-right whitespace-nowrap">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-xs font-bold text-navy-900 transition-colors cursor-pointer"
          >
            <span>{expanded ? "Close" : "View & Notes"}</span>
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>
        </td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan={6} className="p-0">
            {renderExpandedDetails()}
          </td>
        </tr>
      )}
    </>
  );
}
