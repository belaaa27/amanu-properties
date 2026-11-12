import Link from "next/link";
import {
  PlusCircle,
  Building2,
  Search,
  Eye,
  Edit,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatETB } from "@/lib/pricing";
import PropertyRowActions from "./PropertyRowActions";
import type {
  PropertyCategory,
  PropertyStatus,
} from "../../../../generated/prisma/client";

const PAGE_SIZE = 10;

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    status?: string;
    published?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = (params.q || "").trim();
  const category = params.category || "";
  const status = params.status || "";
  const published = params.published || "";
  const currentPage = Math.max(1, Number(params.page) || 1);

  const whereClause = {
    deletedAt: null,
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { slug: { contains: query } },
            { subCity: { contains: query } },
            { neighbourhood: { contains: query } },
          ],
        }
      : {}),
    ...(category &&
    ["HOUSE", "APARTMENT", "VILLA", "COMMERCIAL"].includes(category)
      ? { category: category as PropertyCategory }
      : {}),
    ...(status && ["AVAILABLE", "RESERVED", "SOLD"].includes(status)
      ? { status: status as PropertyStatus }
      : {}),
    ...(published === "true"
      ? { isPublished: true }
      : published === "false"
        ? { isPublished: false }
        : {}),
  };

  const [totalCount, properties] = await Promise.all([
    prisma.property.count({ where: whereClause }),
    prisma.property.findMany({
      where: whereClause,
      include: {
        images: {
          orderBy: { displayOrder: "asc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const buildPageHref = (pageNum: number) => {
    const sp = new URLSearchParams();
    if (query) sp.set("q", query);
    if (category) sp.set("category", category);
    if (status) sp.set("status", status);
    if (published) sp.set("published", published);
    sp.set("page", String(pageNum));
    return `/admin/properties?${sp.toString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
            Properties Inventory
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, edit, publish, or archive Addis Ababa property listings (
            {totalCount} total).
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs sm:text-sm rounded-lg shadow-xs transition-colors w-full sm:w-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Property</span>
        </Link>
      </div>

      {/* Pure Server-Side GET Filter Bar (No onChange/onClick handlers) */}
      <form
        method="GET"
        action="/admin/properties"
        className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
      >
        <div className="relative lg:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search title, slug, sub-city..."
            className="w-full pl-10 pr-3.5 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
          />
        </div>

        <select
          name="category"
          defaultValue={category}
          aria-label="Filter by category"
          className="px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <option value="">All Categories</option>
          <option value="HOUSE">House</option>
          <option value="APARTMENT">Apartment</option>
          <option value="VILLA">Villa</option>
          <option value="COMMERCIAL">Commercial</option>
        </select>

        <select
          name="status"
          defaultValue={status}
          aria-label="Filter by availability status"
          className="px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
        >
          <option value="">All Statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="SOLD">Sold</option>
        </select>

        <div className="flex gap-2">
          <select
            name="published"
            defaultValue={published}
            aria-label="Filter by publication status"
            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
          >
            <option value="">All Visibility</option>
            <option value="true">Published</option>
            <option value="false">Unpublished</option>
          </select>

          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-gold-500 font-bold text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Empty State */}
      {properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-10 sm:p-12 text-center text-slate-400">
          <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30 text-navy-900" />
          <h3 className="text-base sm:text-lg font-bold text-slate-700">
            No Properties Found
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1">
            {query || category || status || published
              ? "No property listings match your active search or filter criteria."
              : "Property listings added here will be managed by the administrator before being published to the public portal."}
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
                    <th className="py-3.5 px-4">Property</th>
                    <th className="py-3.5 px-4">Category & Location</th>
                    <th className="py-3.5 px-4">Asking Price (ETB)</th>
                    <th className="py-3.5 px-4">Visibility</th>
                    <th className="py-3.5 px-4">Status & Quick Actions</th>
                    <th className="py-3.5 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {properties.map((property) => {
                    const thumb = property.images[0]?.url;
                    return (
                      <tr
                        key={property.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                              {thumb ? (
                                <img
                                  src={thumb}
                                  alt={property.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Building2 className="w-5 h-5 text-slate-400" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <Link
                                href={`/admin/properties/${property.id}`}
                                className="font-bold text-navy-900 hover:text-gold-600 line-clamp-1"
                              >
                                {property.title}
                              </Link>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {property.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded bg-navy-50 text-navy-900 text-[11px] font-bold">
                            {property.category}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-slate-600 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              {property.subCity}, {property.neighbourhood}
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-navy-900">
                            {formatETB(property.totalPrice)}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {property.pricingMode.replace("_", " ")}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              property.isPublished
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {property.isPublished ? "Published" : "Draft"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <PropertyRowActions
                            propertyId={property.id}
                            status={property.status}
                            isPublished={property.isPublished}
                            variant="table"
                          />
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={`/admin/properties/${property.id}`}
                              title="View property details"
                              className="p-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            <Link
                              href={`/admin/properties/${property.id}/edit`}
                              title="Edit property"
                              className="p-2 rounded-lg border border-slate-200 text-navy-900 hover:bg-slate-100 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Cards */}
          <div className="lg:hidden space-y-4">
            {properties.map((property) => {
              const thumb = property.images[0]?.url;
              return (
                <div
                  key={property.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3.5"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-navy-50 text-navy-900 text-[10px] font-bold">
                          {property.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            property.isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {property.isPublished ? "Published" : "Draft"}
                        </span>
                      </div>
                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="font-bold text-sm text-navy-900 hover:text-gold-600 block mt-1 line-clamp-2"
                      >
                        {property.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {property.subCity}, {property.neighbourhood}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-sm font-extrabold text-navy-900">
                        {formatETB(property.totalPrice)}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {property.pricingMode.replace("_", " ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/properties/${property.id}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/properties/${property.id}/edit`}
                        className="px-3 py-1.5 rounded-lg bg-navy-900 text-gold-500 text-xs font-bold hover:bg-navy-800"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100">
                    <PropertyRowActions
                      propertyId={property.id}
                      status={property.status}
                      isPublished={property.isPublished}
                      variant="table"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
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
