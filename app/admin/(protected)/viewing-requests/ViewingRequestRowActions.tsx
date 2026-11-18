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
  Calendar,
  Clock,
  Building2,
  StickyNote,
  MessageSquare,
} from "lucide-react";
import {
  updateEnquiryStatus,
  saveEnquiryAdminNotes,
} from "../enquiries/actions";

export interface SerializedViewingRequestItem {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  preferredContactMethod: "PHONE" | "WHATSAPP" | "TELEGRAM" | "EMAIL";
  message: string | null;
  preferredDateIso: string | null;
  preferredTimeSlot: "MORNING" | "AFTERNOON" | "EVENING" | null;
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

const STATUS_BADGE_STYLES: Record<
  SerializedViewingRequestItem["status"],
  string
> = {
  NEW: "bg-amber-50 text-amber-800 border-amber-200",
  CONTACTED: "bg-sky-50 text-sky-800 border-sky-200",
  IN_PROGRESS: "bg-indigo-50 text-indigo-800 border-indigo-200",
  RESOLVED: "bg-emerald-50 text-emerald-800 border-emerald-200",
};

const CONTACT_METHOD_LABELS: Record<
  SerializedViewingRequestItem["preferredContactMethod"],
  string
> = {
  PHONE: "Phone Call",
  WHATSAPP: "WhatsApp",
  TELEGRAM: "Telegram",
  EMAIL: "Email",
};

const TIME_SLOT_LABELS: Record<
  NonNullable<SerializedViewingRequestItem["preferredTimeSlot"]>,
  string
> = {
  MORNING: "Morning (9:00 AM – 12:00 PM)",
  AFTERNOON: "Afternoon (1:00 PM – 4:00 PM)",
  EVENING: "Late Afternoon (4:00 PM – 6:00 PM)",
};

function formatDateOnlySafe(iso: string | null): string {
  if (!iso) return "Date not specified";
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

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

export default function ViewingRequestRowActions({
  request,
  layout,
}: {
  request: SerializedViewingRequestItem;
  layout: "table-row" | "mobile-card";
}) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<SerializedViewingRequestItem["status"]>(
    request.status,
  );
  const [notes, setNotes] = useState<string>(request.adminNotes ?? "");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isStatusPending, startStatusTransition] = useTransition();
  const [isNotesPending, startNotesTransition] = useTransition();

  const handleStatusChange = (
    nextStatus: SerializedViewingRequestItem["status"],
  ) => {
    const previousStatus = status;
    setStatus(nextStatus);
    setFeedback(null);

    startStatusTransition(async () => {
      const res = await updateEnquiryStatus(request.id, nextStatus);
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
      const res = await saveEnquiryAdminNotes(request.id, notes);
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
        {/* Viewing Request Notes & Visitor Contact */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-gold-600" />
              <span>Visitor Viewing Notes</span>
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              Preferred Contact:{" "}
              <strong className="text-navy-900">
                {CONTACT_METHOD_LABELS[request.preferredContactMethod]}
              </strong>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {request.message || "No additional scheduling notes provided."}
          </p>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <strong className="text-navy-900">{request.phone}</strong>
            </span>
            {request.email && (
              <span className="inline-flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{request.email}</span>
              </span>
            )}
          </div>
        </div>

        {/* Internal Administrator Notes */}
        <form
          onSubmit={handleSaveNotes}
          className="lg:col-span-5 bg-white rounded-lg border border-slate-200 p-4 space-y-3 flex flex-col justify-between"
        >
          <div className="space-y-2">
            <label
              htmlFor={`viewing-admin-notes-${request.id}`}
              className="text-xs font-bold uppercase tracking-wider text-navy-900 flex items-center gap-1.5"
            >
              <StickyNote className="w-3.5 h-3.5 text-gold-600" />
              <span>Internal Administrator Notes</span>
            </label>
            <textarea
              id={`viewing-admin-notes-${request.id}`}
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record confirmed appointment time, seller coordination, or visit outcome..."
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
          {/* Status & Submitted Timestamp */}
          <div className="flex items-start justify-between gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_BADGE_STYLES[status]}`}
            >
              {status.replace("_", " ")}
            </span>
            <span className="text-[11px] text-slate-400">
              Submitted {formatDateTimeSafe(request.createdAtIso)}
            </span>
          </div>

          {/* Requested Schedule Banner */}
          <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-navy-900">
              <Calendar className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span>{formatDateOnlySafe(request.preferredDateIso)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-700">
              <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>
                {request.preferredTimeSlot
                  ? TIME_SLOT_LABELS[request.preferredTimeSlot]
                  : "Flexible time slot"}
              </span>
            </div>
          </div>

          {/* Visitor Info */}
          <div>
            <h3 className="font-bold text-sm text-navy-900">
              {request.fullName}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
              <span>{request.phone}</span>
              {request.email && <span>• {request.email}</span>}
              <span>
                • Via {CONTACT_METHOD_LABELS[request.preferredContactMethod]}
              </span>
            </div>
          </div>

          {/* Linked Property */}
          <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
            {request.property ? (
              <div className="flex items-start gap-2">
                <Building2 className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  {request.property.deletedAtIso ? (
                    <span className="font-semibold text-slate-600">
                      {request.property.title}{" "}
                      <span className="text-[10px] text-rose-600">
                        (Archived Listing)
                      </span>
                    </span>
                  ) : (
                    <Link
                      href={`/admin/properties/${request.property.id}`}
                      className="font-bold text-navy-900 hover:text-gold-600 line-clamp-1"
                    >
                      {request.property.title}
                    </Link>
                  )}
                  <p className="text-[11px] text-slate-500">
                    {request.property.subCity}, {request.property.neighbourhood}
                  </p>
                </div>
              </div>
            ) : (
              <span className="text-slate-500 italic">
                General viewing request (no specific property linked)
              </span>
            )}
          </div>

          {/* Status Selector & Expand */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <select
                aria-label="Viewing request status"
                value={status}
                disabled={isStatusPending}
                onChange={(e) =>
                  handleStatusChange(
                    e.target.value as SerializedViewingRequestItem["status"],
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
              <span>{expanded ? "Hide Details" : "Notes & Details"}</span>
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
          <div className="font-bold text-navy-900">{request.fullName}</div>
          <div className="text-xs text-slate-600 mt-0.5">{request.phone}</div>
          {request.email && (
            <div className="text-xs text-slate-500">{request.email}</div>
          )}
          <span className="inline-block mt-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
            {CONTACT_METHOD_LABELS[request.preferredContactMethod]}
          </span>
        </td>

        {/* Linked Property */}
        <td className="py-3.5 px-4 max-w-xs">
          {request.property ? (
            <div>
              {request.property.deletedAtIso ? (
                <p className="text-xs font-semibold text-slate-600">
                  {request.property.title}{" "}
                  <span className="text-[10px] text-rose-600">(Archived)</span>
                </p>
              ) : (
                <Link
                  href={`/admin/properties/${request.property.id}`}
                  className="text-xs font-bold text-navy-900 hover:text-gold-600 line-clamp-1 block"
                >
                  {request.property.title}
                </Link>
              )}
              <p className="text-[11px] text-slate-500 mt-0.5">
                {request.property.subCity}, {request.property.neighbourhood}
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              General viewing request (no property linked)
            </p>
          )}
        </td>

        {/* Preferred Date & Time Slot */}
        <td className="py-3.5 px-4">
          <div className="inline-flex items-center gap-1.5 font-bold text-xs text-navy-900">
            <Calendar className="w-3.5 h-3.5 text-gold-600 shrink-0" />
            <span>{formatDateOnlySafe(request.preferredDateIso)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-600 mt-1">
            <Clock className="w-3 h-3 text-slate-400 shrink-0" />
            <span>
              {request.preferredTimeSlot
                ? TIME_SLOT_LABELS[request.preferredTimeSlot]
                : "Flexible time slot"}
            </span>
          </div>
          {notes.trim() !== "" && (
            <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold">
              <StickyNote className="w-3 h-3" />
              <span>Has Admin Note</span>
            </span>
          )}
        </td>

        {/* Submitted Timestamp */}
        <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
          {formatDateTimeSafe(request.createdAtIso)}
        </td>

        {/* Status Selector */}
        <td className="py-3.5 px-4">
          <div className="flex items-center gap-2">
            <select
              aria-label="Viewing request status"
              value={status}
              disabled={isStatusPending}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as SerializedViewingRequestItem["status"],
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

        {/* Expand Details & Notes */}
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
