import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Building2,
  MapPin,
  Tag,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatETB } from "@/lib/pricing";
import PropertyRowActions from "../PropertyRowActions";

export default async function AdminPropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!property || property.deletedAt) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/properties"
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-navy-50 text-navy-900 text-xs font-bold">
                {property.category}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  property.isPublished
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {property.isPublished ? "Published" : "Unpublished Draft"}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900 mt-1 truncate">
              {property.title}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Link
            href={`/admin/properties/${property.id}/edit`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-900 hover:bg-navy-800 text-gold-500 font-bold text-xs sm:text-sm transition-colors"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </Link>

          <PropertyRowActions
            propertyId={property.id}
            status={property.status}
            isPublished={property.isPublished}
            variant="detail"
          />
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Specs & Description */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gallery */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
            <h3 className="text-base font-bold text-navy-900 mb-4">
              Property Media
            </h3>
            {property.images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {property.images.map((img) => (
                  <div
                    key={img.id}
                    className="rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-100"
                  >
                    <img
                      src={img.url}
                      alt={img.altText || property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50 text-slate-400">
                <Building2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs sm:text-sm">
                  No images uploaded for this listing yet.
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-navy-900 border-b pb-3">
              Description
            </h3>
            <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
              {property.description}
            </p>
          </div>
        </div>

        {/* Right Column: Pricing, Location & Metadata */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-navy-900 font-bold text-base border-b pb-3">
              <Tag className="w-4 h-4 text-gold-600" />
              <h3>Pricing (ETB)</h3>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold">
                Total Asking Price
              </p>
              <p className="text-2xl font-extrabold text-navy-900 mt-0.5">
                {formatETB(property.totalPrice)}
              </p>
            </div>
            {property.pricePerSqm && (
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold">
                  Price per m²
                </p>
                <p className="text-sm font-bold text-slate-700">
                  {formatETB(property.pricePerSqm)} / m²
                </p>
              </div>
            )}
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
              Pricing Mode:{" "}
              <strong className="text-slate-700">{property.pricingMode}</strong>
            </div>
          </div>

          {/* Specifications Card */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-navy-900 border-b pb-3">
              Specifications
            </h3>
            <dl className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
              <div>
                <dt className="text-slate-500">Area</dt>
                <dd className="font-bold text-navy-900">
                  {property.areaSqm ? `${Number(property.areaSqm)} m²` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Bedrooms</dt>
                <dd className="font-bold text-navy-900">
                  {property.bedrooms ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Bathrooms</dt>
                <dd className="font-bold text-navy-900">
                  {property.bathrooms ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Parking</dt>
                <dd className="font-bold text-navy-900">
                  {property.parkingSpaces ?? "—"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Location & Private Admin Address */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-navy-900 font-bold text-base border-b pb-3">
              <MapPin className="w-4 h-4 text-gold-600" />
              <h3>Location</h3>
            </div>
            <div className="text-xs sm:text-sm space-y-2">
              <p>
                <span className="text-slate-500">Sub-City:</span>{" "}
                <strong className="text-navy-900">{property.subCity}</strong>
              </p>
              <p>
                <span className="text-slate-500">Neighbourhood:</span>{" "}
                <strong className="text-navy-900">
                  {property.neighbourhood}
                </strong>
              </p>
              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200 mt-2">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold text-xs mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Private Exact Address (Admin Only)</span>
                </div>
                <p className="text-xs text-amber-950">
                  {property.privateAddress || "No private address recorded."}
                </p>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs text-xs text-slate-500 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                Created: {new Date(property.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="font-mono text-[11px] break-all">ID: {property.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
