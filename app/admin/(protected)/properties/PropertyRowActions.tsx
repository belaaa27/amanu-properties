"use client";

import { useState, useTransition } from "react";
import { Trash2, Globe, GlobeLock, Loader2 } from "lucide-react";
import {
  togglePublishProperty,
  updatePropertyStatus,
  softDeleteProperty,
} from "./actions";

interface PropertyRowActionsProps {
  propertyId: string;
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  isPublished: boolean;
  variant?: "table" | "detail";
}

export default function PropertyRowActions({
  propertyId,
  status,
  isPublished,
  variant = "table",
}: PropertyRowActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextStatus = e.target.value as "AVAILABLE" | "RESERVED" | "SOLD";
    startTransition(async () => {
      await updatePropertyStatus(propertyId, nextStatus);
    });
  };

  const handleTogglePublish = () => {
    startTransition(async () => {
      await togglePublishProperty(propertyId, isPublished);
    });
  };

  const handleConfirmDelete = () => {
    startTransition(async () => {
      await softDeleteProperty(propertyId);
      setConfirmDelete(false);
    });
  };

  if (variant === "detail") {
    return (
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <select
          name="status"
          aria-label="Property availability status"
          value={status}
          disabled={isPending}
          onChange={handleStatusChange}
          className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-xs sm:text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
        >
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="SOLD">Sold</option>
        </select>

        <button
          type="button"
          disabled={isPending}
          onClick={handleTogglePublish}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold border transition-colors cursor-pointer disabled:opacity-50 ${
            isPublished
              ? "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
              : "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
          }`}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPublished ? (
            <GlobeLock className="w-4 h-4" />
          ) : (
            <Globe className="w-4 h-4" />
          )}
          <span>{isPublished ? "Unpublish" : "Publish"}</span>
        </button>

        {!confirmDelete ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        ) : (
          <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-300 px-2.5 py-1.5 rounded-lg">
            <span className="text-xs font-semibold text-rose-800">
              Archive?
            </span>
            <button
              type="button"
              disabled={isPending}
              onClick={handleConfirmDelete}
              className="px-2 py-1 rounded bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 cursor-pointer disabled:opacity-50"
            >
              Yes
            </button>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setConfirmDelete(false)}
              className="px-2 py-1 rounded bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
            >
              No
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Status Selector */}
      <select
        name="status"
        aria-label="Property availability status"
        value={status}
        disabled={isPending}
        onChange={handleStatusChange}
        className="px-2.5 py-1.5 rounded-md border border-slate-300 bg-white text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-gold-500 disabled:opacity-50"
      >
        <option value="AVAILABLE">Available</option>
        <option value="RESERVED">Reserved</option>
        <option value="SOLD">Sold</option>
      </select>

      {/* Publish / Unpublish Toggle */}
      <button
        type="button"
        disabled={isPending}
        onClick={handleTogglePublish}
        title={isPublished ? "Unpublish listing" : "Publish listing"}
        className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold border transition-colors cursor-pointer disabled:opacity-50 ${
          isPublished
            ? "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100"
            : "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100"
        }`}
      >
        {isPending ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : isPublished ? (
          <GlobeLock className="w-3.5 h-3.5" />
        ) : (
          <Globe className="w-3.5 h-3.5" />
        )}
        <span>{isPublished ? "Unpublish" : "Publish"}</span>
      </button>

      {/* Inline Soft-Delete Confirmation */}
      {!confirmDelete ? (
        <button
          type="button"
          disabled={isPending}
          onClick={() => setConfirmDelete(true)}
          title="Soft delete property"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-bold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      ) : (
        <div className="inline-flex items-center gap-1 bg-rose-50 border border-rose-300 px-2 py-1 rounded-md">
          <span className="text-[11px] font-semibold text-rose-800">
            Delete?
          </span>
          <button
            type="button"
            disabled={isPending}
            onClick={handleConfirmDelete}
            className="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700 cursor-pointer disabled:opacity-50"
          >
            Yes
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => setConfirmDelete(false)}
            className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 text-[11px] font-semibold hover:bg-slate-50 cursor-pointer"
          >
            No
          </button>
        </div>
      )}
    </div>
  );
}
