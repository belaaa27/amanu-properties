import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Building2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import {
  ADDIS_SUB_CITIES,
  searchPublicProperties,
  type PublicPropertyFilterParams,
} from "@/lib/public-properties";
import PropertyCard from "@/components/public/PropertyCard";
import type { Metadata } from "next";

const propertiesTitle = "Properties for Sale in Addis Ababa";
const propertiesDescription =
  "Browse houses, apartments, villas, and commercial properties for sale in Addis Ababa. Filter by sub-city, neighbourhood, price in ETB, bedrooms, and area.";

export const metadata: Metadata = {
  title: propertiesTitle,
  description: propertiesDescription,
  alternates: {
    canonical: "/properties",
  },
  openGraph: {
    type: "website",
    siteName: "Amanu Properties",
    locale: "en_ET",
    url: "/properties",
    title: `${propertiesTitle} | Amanu Properties`,
    description: propertiesDescription,
  },
  twitter: {
    card: "summary",
    title: `${propertiesTitle} | Amanu Properties`,
    description: propertiesDescription,
  },
};

export default async function PublicPropertiesPage({
  searchParams,
}: {
  searchParams: Promise<PublicPropertyFilterParams>;
}) {
  const params = await searchParams;
  const { items, totalCount, currentPage, totalPages } =
    await searchPublicProperties(params, 9);

  const hasActiveFilters = Boolean(
    params.q ||
    params.category ||
    params.subCity ||
    params.neighbourhood ||
    params.minPrice ||
    params.maxPrice ||
    params.bedrooms ||
    params.bathrooms ||
    params.minArea ||
    params.parking ||
    (params.sort && params.sort !== "newest"),
  );

  const buildPageHref = (pageNum: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && key !== "page") {
        sp.set(key, value);
      }
    });
    sp.set("page", String(pageNum));
    return `/properties?${sp.toString()}`;
  };

  return (
    <div className="pb-16">
      {/* Page Banner */}
      <section className="bg-navy-950 text-white py-12 sm:py-16 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-400">
            Addis Ababa Sales Catalogue
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal uppercase tracking-wide mt-2">
            Properties for Sale
          </h1>
          <p className="text-sm text-slate-300 mt-2 max-w-2xl">
            Filter available houses, apartments, villas, and commercial
            properties by sub-city, neighbourhood, ETB price range, and
            specifications.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 space-y-8">
        {/* Comprehensive Filter & Sort Panel */}
        <form
          method="GET"
          action="/properties"
          aria-label="Filter Properties"
          className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-navy-900 font-bold text-sm">
              <SlidersHorizontal className="w-4 h-4 text-gold-600" />
              <span>Search &amp; Filter Listings</span>
            </div>
            {hasActiveFilters && (
              <Link
                href="/properties"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-navy-900"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Keyword Search */}
            <div className="lg:col-span-2">
              <label
                htmlFor="filter-q"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                Keyword Search
              </label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="filter-q"
                  name="q"
                  type="text"
                  defaultValue={params.q || ""}
                  placeholder="Title, neighbourhood, or feature..."
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="filter-category"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                Property Category
              </label>
              <select
                id="filter-category"
                name="category"
                defaultValue={params.category || ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="">All Categories</option>
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>

            {/* Sub-City */}
            <div>
              <label
                htmlFor="filter-subCity"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                Addis Ababa Sub-City
              </label>
              <select
                id="filter-subCity"
                name="subCity"
                defaultValue={params.subCity || ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="">All Sub-Cities</option>
                {ADDIS_SUB_CITIES.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </select>
            </div>

            {/* Neighbourhood */}
            <div>
              <label
                htmlFor="filter-neighbourhood"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                Neighbourhood
              </label>
              <input
                id="filter-neighbourhood"
                name="neighbourhood"
                type="text"
                defaultValue={params.neighbourhood || ""}
                placeholder="e.g. Bole Medhanealem, CMC..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            {/* Min Price */}
            <div>
              <label
                htmlFor="filter-minPrice"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                Min Price (ETB)
              </label>
              <input
                id="filter-minPrice"
                name="minPrice"
                type="number"
                min={0}
                step="100000"
                defaultValue={params.minPrice || ""}
                placeholder="0"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            {/* Max Price */}
            <div>
              <label
                htmlFor="filter-maxPrice"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                Max Price (ETB)
              </label>
              <input
                id="filter-maxPrice"
                name="maxPrice"
                type="number"
                min={0}
                step="100000"
                defaultValue={params.maxPrice || ""}
                placeholder="Any"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            {/* Sort By */}
            <div>
              <label
                htmlFor="filter-sort"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                Sort Results
              </label>
              <select
                id="filter-sort"
                name="sort"
                defaultValue={params.sort || "newest"}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="newest">Newest Listings</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_desc">Largest Area (m²)</option>
              </select>
            </div>
          </div>

          {/* Secondary Numeric Specs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 pt-2 border-t border-slate-100 items-end">
            <div>
              <label
                htmlFor="filter-bedrooms"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                Min Bedrooms
              </label>
              <select
                id="filter-bedrooms"
                name="bedrooms"
                defaultValue={params.bedrooms || ""}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-bathrooms"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                Min Bathrooms
              </label>
              <select
                id="filter-bathrooms"
                name="bathrooms"
                defaultValue={params.bathrooms || ""}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="filter-minArea"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                Min Area (m²)
              </label>
              <input
                id="filter-minArea"
                name="minArea"
                type="number"
                min={0}
                defaultValue={params.minArea || ""}
                placeholder="e.g. 120"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            <div>
              <label
                htmlFor="filter-parking"
                className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1"
              >
                Min Parking
              </label>
              <select
                id="filter-parking"
                name="parking"
                defaultValue={params.parking || ""}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm text-navy-900 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            <div className="col-span-2 sm:col-span-4 lg:col-span-1">
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-gold-400 font-bold text-xs uppercase tracking-[0.16em] rounded-lg transition-colors cursor-pointer"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>

        {/* Results Count Header */}
        <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600">
          <p>
            Showing <strong className="text-navy-900">{items.length}</strong> of{" "}
            <strong className="text-navy-900">{totalCount}</strong> published{" "}
            {totalCount === 1 ? "property" : "properties"}
          </p>
        </div>

        {/* Listings Grid */}
        {items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
            <Building2 className="w-12 h-12 mx-auto text-navy-900/25" />
            <h2 className="font-serif text-xl font-bold text-navy-900">
              No Matching Properties Found
            </h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {hasActiveFilters
                ? "Try broadening your sub-city, price range, or bedroom criteria to view more listings."
                : "No properties are currently published on the public catalogue. Please check back soon or submit a general enquiry."}
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              {hasActiveFilters && (
                <Link
                  href="/properties"
                  className="px-5 py-2.5 rounded-lg border border-slate-300 text-xs font-bold uppercase tracking-wider text-navy-900 hover:bg-slate-50"
                >
                  Clear All Filters
                </Link>
              )}
              <Link
                href="/contact"
                className="px-5 py-2.5 rounded-lg bg-navy-900 text-gold-400 text-xs font-bold uppercase tracking-wider hover:bg-navy-800"
              >
                Submit a Property Request
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {items.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Property Listing Pagination"
            className="flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-xs text-xs sm:text-sm"
          >
            <span className="text-slate-600">
              Page <strong className="text-navy-900">{currentPage}</strong> of{" "}
              <strong className="text-navy-900">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              {currentPage > 1 && (
                <Link
                  href={buildPageHref(currentPage - 1)}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg border border-slate-300 text-navy-900 font-semibold hover:bg-slate-50"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </Link>
              )}
              {currentPage < totalPages && (
                <Link
                  href={buildPageHref(currentPage + 1)}
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg border border-slate-300 text-navy-900 font-semibold hover:bg-slate-50"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </div>
  );
}
