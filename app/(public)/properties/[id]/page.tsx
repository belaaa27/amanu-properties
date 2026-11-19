import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Car,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { getPublicPropertyByIdOrSlug } from "@/lib/public-properties";
import { getSiteUrl } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import PropertyGallery from "@/components/public/PropertyGallery";
import PublicEnquiryForm from "@/components/public/PublicEnquiryForm";
import type { Metadata } from "next";

const CATEGORY_LABELS: Record<string, string> = {
  HOUSE: "House",
  APARTMENT: "Apartment",
  VILLA: "Villa",
  COMMERCIAL: "Commercial Property",
};

const STATUS_LABELS: Record<string, { text: string; badgeClass: string }> = {
  AVAILABLE: {
    text: "Available for Sale",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  RESERVED: {
    text: "Reserved",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
  },
  SOLD: {
    text: "Sold",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await getPublicPropertyByIdOrSlug(id);

  if (!property) {
    return {
      title: "Property Not Found",
      description:
        "The requested property listing is unavailable or no longer listed on Amanu Properties.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalPath = `/properties/${encodeURIComponent(property.slug.trim())}`;
  const description = `${CATEGORY_LABELS[property.category] || property.category} for sale in ${property.neighbourhood}, ${property.subCity}, Addis Ababa — ${property.formattedTotalPrice}.`;
  const primaryImage = property.images[0];
  const socialTitle = `${property.title} | Amanu Properties`;

  return {
    title: property.title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: "website",
      siteName: "Amanu Properties",
      locale: "en_ET",
      url: canonicalPath,
      title: socialTitle,
      description,
      ...(primaryImage
        ? {
            images: [
              {
                url: primaryImage.url,
                alt: primaryImage.altText || property.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: primaryImage ? "summary_large_image" : "summary",
      title: socialTitle,
      description,
      ...(primaryImage ? { images: [primaryImage.url] } : {}),
    },
  };
}

export default async function PublicPropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getPublicPropertyByIdOrSlug(id);

  // Return 404 for unpublished, soft-deleted, or nonexistent records
  if (!property) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const canonicalPropertyUrl = `${siteUrl}/properties/${encodeURIComponent(property.slug.trim())}`;
  const statusInfo = STATUS_LABELS[property.status] || STATUS_LABELS.AVAILABLE;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Properties",
        item: `${siteUrl}/properties`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: property.title,
        item: canonicalPropertyUrl,
      },
    ],
  };

  return (
    <div className="pb-16">
      <JsonLd data={breadcrumbJsonLd} />

      {/* Top Breadcrumb & Title Header */}
      <section className="bg-navy-950 text-white py-10 sm:py-12 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Link
            href="/properties"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gold-400 hover:text-gold-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Properties</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-gold-500 text-navy-950">
                  {CATEGORY_LABELS[property.category] || property.category}
                </span>
                <span
                  className={`px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider border rounded-full ${statusInfo.badgeClass}`}
                >
                  {statusInfo.text}
                </span>
              </div>

              <h1 className="font-serif text-2xl sm:text-4xl font-normal text-white leading-tight">
                {property.title}
              </h1>

              <p className="flex items-center gap-1.5 text-sm text-gold-400">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>
                  {property.neighbourhood}, {property.subCity}, Addis Ababa
                </span>
              </p>
            </div>

            <div className="lg:text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Asking Price (ETB)
              </p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">
                {property.formattedTotalPrice}
              </p>
              {property.formattedPricePerSqm && (
                <p className="text-xs text-gold-400 mt-0.5">
                  {property.formattedPricePerSqm}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Gallery, Specifications, Description, Approximate Area */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            <PropertyGallery images={property.images} title={property.title} />

            {/* Key Specifications Strip */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500 mb-4">
                Property Specifications
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-lg bg-ivory border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Maximize2 className="w-4 h-4 text-gold-600" />
                    <span>Total Area</span>
                  </div>
                  <p className="text-base sm:text-lg font-extrabold text-navy-900 mt-1">
                    {property.areaSqm !== null
                      ? `${property.areaSqm.toLocaleString()} m²`
                      : "—"}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-ivory border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <BedDouble className="w-4 h-4 text-gold-600" />
                    <span>Bedrooms</span>
                  </div>
                  <p className="text-base sm:text-lg font-extrabold text-navy-900 mt-1">
                    {property.bedrooms !== null ? property.bedrooms : "—"}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-ivory border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Bath className="w-4 h-4 text-gold-600" />
                    <span>Bathrooms</span>
                  </div>
                  <p className="text-base sm:text-lg font-extrabold text-navy-900 mt-1">
                    {property.bathrooms !== null ? property.bathrooms : "—"}
                  </p>
                </div>

                <div className="p-3.5 rounded-lg bg-ivory border border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Car className="w-4 h-4 text-gold-600" />
                    <span>Parking</span>
                  </div>
                  <p className="text-base sm:text-lg font-extrabold text-navy-900 mt-1">
                    {property.parkingSpaces !== null
                      ? `${property.parkingSpaces} ${property.parkingSpaces === 1 ? "Space" : "Spaces"}`
                      : "—"}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-4">
              <h2 className="font-serif text-xl font-bold text-navy-900 border-b border-slate-100 pb-3">
                Property Description
              </h2>
              <p className="text-sm sm:text-base text-slate-700 whitespace-pre-line leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Public Location Summary (Never exposes privateAddress) */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-navy-900 font-serif text-xl font-bold border-b border-slate-100 pb-3">
                <MapPin className="w-5 h-5 text-gold-600" />
                <h2>Location Overview</h2>
              </div>
              <p className="text-sm text-slate-700">
                Situated in <strong>{property.neighbourhood}</strong>,{" "}
                <strong>{property.subCity} Sub-City</strong>, Addis Ababa,
                Ethiopia.
              </p>
              {property.publicLat !== null && property.publicLng !== null && (
                <p className="text-xs text-slate-500">
                  Approximate Neighbourhood Coordinates:{" "}
                  {property.publicLat.toFixed(4)},{" "}
                  {property.publicLng.toFixed(4)}
                </p>
              )}
              <div className="flex items-start gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                <ShieldCheck className="w-4 h-4 text-navy-900 shrink-0 mt-0.5" />
                <span>
                  Exact street/house addresses are shared privately upon
                  confirming an on-site viewing appointment.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Pricing Summary & Enquiry / Viewing Request Form */}
          <aside className="lg:col-span-5 xl:col-span-4 space-y-6 lg:sticky lg:top-24">
            <div className="bg-navy-950 text-white rounded-xl p-6 border border-gold-500/30 shadow-md space-y-3">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-gold-400">
                <span className="inline-flex items-center gap-1.5 font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Property Sale</span>
                </span>
                <span>{statusInfo.text}</span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-white">
                {property.formattedTotalPrice}
              </p>
              {property.formattedPricePerSqm && (
                <p className="text-xs text-slate-300">
                  Unit Rate:{" "}
                  <strong className="text-gold-400">
                    {property.formattedPricePerSqm}
                  </strong>
                </p>
              )}
            </div>

            <PublicEnquiryForm
              propertyId={property.id}
              propertyTitle={property.title}
              defaultMode="PROPERTY_ENQUIRY"
            />
          </aside>
        </div>
      </div>
    </div>
  );
}
