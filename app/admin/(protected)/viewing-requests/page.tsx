import Link from "next/link";
import {
  Calendar,
  Search,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import ViewingRequestRowActions, {
  type SerializedViewingRequestItem,
} from "./ViewingRequestRowActions";
import type { EnquiryStatus } from "../../../../generated/prisma/client";

const PAGE_SIZE = 10;

export default async function AdminViewingRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = (params.q || "").trim();
  const status = params.status || "";
  const currentPage = Math.max(1, Number(params.page) || 1);

  const whereClause = {
    type: "VIEWING_REQUEST" as const,
    ...(status &&
    ["NEW", "CONTACTED", "IN_PROGRESS", "RESOLVED"].includes(status)
      ? { status: status as EnquiryStatus }
      : {}),
    ...(query
      ? {
          OR: [
            { fullName: { contains: query } },
            { phone: { contains: query } },
            { email: { contains: query } },
            { message: { contains: query } },
            {
              property: {
                is: {
                  title: { contains: query },
                },
              },
            },
          ],
        }
      : {}),
  };

  const [totalCount, viewingRequests] = await Promise.all([
    prisma.enquiry.count({ where: whereClause }),
    prisma.enquiry.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            id: true,
            title: true,
            subCity: true,
            neighbourhood: true,
            deletedAt: true,
          },
        },
      },
      orderBy: [{ preferredDate: "asc" }, { createdAt: "desc" }],
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const hasActiveFilters = Boolean(query || status);

  const serializedRequests: SerializedViewingRequestItem[] =
    viewingRequests.map((item) => ({
      id: item.id,
      fullName: item.fullName,
      phone: item.phone,
      email: item.email,
      preferredContactMethod: item.preferredContactMethod,
      message: item.message,
      preferredDateIso: item.preferredDate
        ? item.preferredDate.toISOString()
        : null,
      preferredTimeSlot: item.preferredTimeSlot,
      status: item.status,
      adminNotes: item.adminNotes,
      createdAtIso: item.createdAt.toISOString(),
      property: item.property
        ? {
            id: item.property.id,
            title: item.property.title,
            subCity: item.property.subCity,
            neighbourhood: item.property.neighbourhood,
            deletedAtIso: item.property.deletedAt
              ? item.property.deletedAt.toISOString()
              : null,
          }
        : null,
    }));

  const buildPageHref = (pageNum: number) => {
    const sp = new URLSearchParams();
    if (query) sp.set("q", query);
    if (status) sp.set("status", status);
    sp.set("page", String(pageNum));
    return `/admin/viewing-requests?${sp.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
            Viewing Appointments
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Schedule, coordinate, and manage on-site property viewing requests (
            {totalCount} total).
          </p>
        </div>
        {hasActiveFilters && (
          <Link
            href="/admin/viewing-requests"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 w-full sm:w-auto shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </Link>
        )}
      </div>

      {/* Server-Rendered GET Filter Bar */}
      <form
        method="GET"
        action="/admin/viewing-requests"
        className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search visitor name, phone, email, or property..."
            className="w-full pl-10 pr-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <select
          name="status"
          defaultValue={status}
          aria-label="Filter by viewing request status"
          className="px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <option value="">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
        </select>

        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-gold-500 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          Filter Appointments
        </button>
      </form>

      {/* Empty State vs Data List */}
      {serializedRequests.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-8 sm:p-12 text-center text-slate-400">
          <Calendar className="w-10 sm:w-12 h-10 sm:h-12 mx-auto mb-3 opacity-30 text-navy-900" />
          <h3 className="text-base sm:text-lg font-bold text-slate-700">
            No Appointments Scheduled
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            {hasActiveFilters
              ? "No property viewing requests match your active search or filter criteria."
              : "Requested viewing dates and time slots submitted by potential buyers will appear here."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Visitor &amp; Contact</th>
                    <th className="py-3.5 px-4">Requested Property</th>
                    <th className="py-3.5 px-4">
                      Preferred Date &amp; Time Slot
                    </th>
                    <th className="py-3.5 px-4">Submitted</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">
                      Details &amp; Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {serializedRequests.map((request) => (
                    <ViewingRequestRowActions
                      key={request.id}
                      request={request}
                      layout="table-row"
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Cards */}
          <div className="lg:hidden space-y-4">
            {serializedRequests.map((request) => (
              <ViewingRequestRowActions
                key={request.id}
                request={request}
                layout="mobile-card"
              />
            ))}
          </div>

          {/* Server-Side Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-xs text-xs sm:text-sm">
              <span className="text-slate-600">
                Page <strong className="text-navy-900">{currentPage}</strong> of{" "}
                <strong className="text-navy-900">{totalPages}</strong>
              </span>
              <div className="flex items-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={buildPageHref(currentPage - 1)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </Link>
                )}
                {currentPage < totalPages && (
                  <Link
                    href={buildPageHref(currentPage + 1)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
