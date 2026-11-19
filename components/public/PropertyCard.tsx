import Link from "next/link";
import {
  BedDouble,
  Bath,
  Maximize2,
  MapPin,
  Building2,
  ArrowRight,
} from "lucide-react";
import type { PublicPropertyCardData } from "@/lib/public-properties";

const CATEGORY_LABELS: Record<string, string> = {
  HOUSE: "House",
  APARTMENT: "Apartment",
  VILLA: "Villa",
  COMMERCIAL: "Commercial",
};

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  AVAILABLE: {
    label: "FOR SALE",
    className: "bg-navy-950/90 text-white border border-gold-500/40",
  },
  RESERVED: {
    label: "RESERVED",
    className: "bg-amber-600/95 text-white border border-amber-300/40",
  },
  SOLD: {
    label: "SOLD",
    className: "bg-slate-800/95 text-slate-200 border border-slate-500/40",
  },
};

export default function PropertyCard({
  property,
}: {
  property: PublicPropertyCardData;
}) {
  const statusBadge = STATUS_CONFIG[property.status] || STATUS_CONFIG.AVAILABLE;
  const propertyHref = `/properties/${encodeURIComponent(property.slug.trim())}`;

  return (
    <article className="group bg-white rounded-none sm:rounded-sm border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Property Photograph */}
      <Link
        href={propertyHref}
        className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden block"
      >
        {property.primaryImage ? (
          <img
            src={property.primaryImage.url}
            alt={property.primaryImage.altText}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-navy-900/5 text-slate-400 p-4 text-center">
            <Building2 className="w-9 h-9 text-navy-900/30 mb-1.5" />
            <span className="text-xs font-medium text-slate-500">
              Photograph Pending
            </span>
          </div>
        )}

        {/* Top-Left Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 text-[10px] font-bold tracking-[0.14em] uppercase shadow-sm ${statusBadge.className}`}
          >
            {statusBadge.label}
          </span>
          <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase bg-white/95 text-navy-900 shadow-sm">
            {CATEGORY_LABELS[property.category] || property.category}
          </span>
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link
            href={propertyHref}
            className="block font-serif text-lg font-semibold text-navy-900 group-hover:text-gold-600 transition-colors line-clamp-1"
          >
            {property.title}
          </Link>

          <p className="flex items-center gap-1 text-xs font-medium text-gold-600 mt-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {property.neighbourhood}, {property.subCity}
            </span>
          </p>
        </div>

        {/* Specifications & ETB Price Footer */}
        <div className="pt-3.5 border-t border-slate-100 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              {property.bedrooms !== null && (
                <span
                  className="inline-flex items-center gap-1"
                  title="Bedrooms"
                >
                  <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {property.bedrooms}{" "}
                    {property.bedrooms === 1 ? "Bed" : "Beds"}
                  </span>
                </span>
              )}
              {property.bathrooms !== null && (
                <span
                  className="inline-flex items-center gap-1"
                  title="Bathrooms"
                >
                  <Bath className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {property.bathrooms}{" "}
                    {property.bathrooms === 1 ? "Bath" : "Baths"}
                  </span>
                </span>
              )}
              {property.areaSqm !== null && (
                <span
                  className="inline-flex items-center gap-1"
                  title="Total Area"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{property.areaSqm.toLocaleString()} m²</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-end justify-between gap-2 pt-1">
            <div>
              <p className="text-base sm:text-lg font-extrabold text-navy-900 leading-tight">
                {property.formattedTotalPrice}
              </p>
              {property.formattedPricePerSqm && (
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {property.formattedPricePerSqm}
                </p>
              )}
            </div>

            <Link
              href={propertyHref}
              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-navy-900 hover:text-gold-600 transition-colors shrink-0"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
