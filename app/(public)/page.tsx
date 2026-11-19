import Link from "next/link";
import {
  Search,
  MapPin,
  ShieldCheck,
  Tag,
  CalendarCheck,
  ArrowRight,
  Building2,
} from "lucide-react";
import {
  ADDIS_SUB_CITIES,
  getFeaturedPublicProperties,
} from "@/lib/public-properties";
import PropertyCard from "@/components/public/PropertyCard";
import type { Metadata } from "next";

const homeTitle =
  "Amanu Properties | Residential & Commercial Property Sales in Addis Ababa";
const homeDescription =
  "Discover houses, apartments, villas, and commercial properties for sale in Addis Ababa with transparent ETB pricing and direct viewing arrangements.";

export const metadata: Metadata = {
  title: {
    absolute: homeTitle,
  },
  description: homeDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Amanu Properties",
    locale: "en_ET",
    url: "/",
    title: homeTitle,
    description: homeDescription,
  },
  twitter: {
    card: "summary",
    title: homeTitle,
    description: homeDescription,
  },
};

export default async function HomePage() {
  const featuredProperties = await getFeaturedPublicProperties();

  return (
    <div>
      {/* HERO SECTION (Inspired by Harmony Real Estate visual composition) */}
      <section className="relative bg-navy-950 text-white overflow-hidden">
        {/* Authentic Architectural / Residence Photography with Deep Navy Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt="Modern architectural residence exterior"
            className="w-full h-full object-cover object-center opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950/95 via-navy-950/80 to-navy-950/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="max-w-3xl space-y-5">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.26em] text-gold-400">
              Addis Ababa Real Estate Sales
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight leading-[1.12] text-white uppercase">
              Find Your Place.
              <br />
              Discover Your Future.
            </h1>
            <p className="text-sm sm:text-base text-slate-200 max-w-xl leading-relaxed">
              Explore houses, apartments, villas, and commercial properties for
              sale across Addis Ababa—presented with clear ETB pricing and
              direct personal guidance from Amanuel.
            </p>
          </div>

          {/* INTEGRATED PROPERTY SEARCH BAR (Submits via GET to /properties) */}
          <form
            action="/properties"
            method="GET"
            aria-label="Search Properties"
            className="mt-10 sm:mt-12 bg-navy-950/90 backdrop-blur-md border border-gold-500/40 p-4 sm:p-5 shadow-2xl"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
              {/* Location (Sub-city) */}
              <div className="lg:col-span-3">
                <label
                  htmlFor="hero-subCity"
                  className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400 mb-1.5"
                >
                  Sub-City
                </label>
                <select
                  id="hero-subCity"
                  name="subCity"
                  defaultValue=""
                  className="w-full bg-transparent border-b border-slate-600 focus:border-gold-500 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="" className="bg-navy-900 text-white">
                    All Addis Ababa Sub-Cities
                  </option>
                  {ADDIS_SUB_CITIES.map((sc) => (
                    <option
                      key={sc}
                      value={sc}
                      className="bg-navy-900 text-white"
                    >
                      {sc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Property Type */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="hero-category"
                  className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400 mb-1.5"
                >
                  Property Type
                </label>
                <select
                  id="hero-category"
                  name="category"
                  defaultValue=""
                  className="w-full bg-transparent border-b border-slate-600 focus:border-gold-500 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="" className="bg-navy-900 text-white">
                    Any Type
                  </option>
                  <option value="HOUSE" className="bg-navy-900 text-white">
                    House
                  </option>
                  <option value="APARTMENT" className="bg-navy-900 text-white">
                    Apartment
                  </option>
                  <option value="VILLA" className="bg-navy-900 text-white">
                    Villa
                  </option>
                  <option value="COMMERCIAL" className="bg-navy-900 text-white">
                    Commercial
                  </option>
                </select>
              </div>

              {/* Max Price (ETB) */}
              <div className="lg:col-span-3">
                <label
                  htmlFor="hero-maxPrice"
                  className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400 mb-1.5"
                >
                  Max Budget (ETB)
                </label>
                <input
                  id="hero-maxPrice"
                  name="maxPrice"
                  type="number"
                  min={0}
                  step="100000"
                  placeholder="No Maximum"
                  className="w-full bg-transparent border-b border-slate-600 focus:border-gold-500 py-2 text-sm text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              {/* Bedrooms */}
              <div className="lg:col-span-1">
                <label
                  htmlFor="hero-bedrooms"
                  className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400 mb-1.5"
                >
                  Beds
                </label>
                <select
                  id="hero-bedrooms"
                  name="bedrooms"
                  defaultValue=""
                  className="w-full bg-transparent border-b border-slate-600 focus:border-gold-500 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="" className="bg-navy-900 text-white">
                    Any
                  </option>
                  <option value="1" className="bg-navy-900 text-white">
                    1+
                  </option>
                  <option value="2" className="bg-navy-900 text-white">
                    2+
                  </option>
                  <option value="3" className="bg-navy-900 text-white">
                    3+
                  </option>
                  <option value="4" className="bg-navy-900 text-white">
                    4+
                  </option>
                  <option value="5" className="bg-navy-900 text-white">
                    5+
                  </option>
                </select>
              </div>

              {/* Bathrooms */}
              <div className="lg:col-span-1">
                <label
                  htmlFor="hero-bathrooms"
                  className="block text-[10px] font-bold uppercase tracking-[0.18em] text-gold-400 mb-1.5"
                >
                  Baths
                </label>
                <select
                  id="hero-bathrooms"
                  name="bathrooms"
                  defaultValue=""
                  className="w-full bg-transparent border-b border-slate-600 focus:border-gold-500 py-2 text-sm text-white focus:outline-none"
                >
                  <option value="" className="bg-navy-900 text-white">
                    Any
                  </option>
                  <option value="1" className="bg-navy-900 text-white">
                    1+
                  </option>
                  <option value="2" className="bg-navy-900 text-white">
                    2+
                  </option>
                  <option value="3" className="bg-navy-900 text-white">
                    3+
                  </option>
                  <option value="4" className="bg-navy-900 text-white">
                    4+
                  </option>
                </select>
              </div>

              {/* Search Submit */}
              <div className="lg:col-span-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs uppercase tracking-[0.14em] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* FEATURED LISTINGS SECTION (Strictly genuinely featured, published, non-deleted properties) */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
                Selected Portfolio
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal uppercase tracking-wide text-navy-900 mt-1">
                Featured Listings
              </h2>
            </div>

            <Link
              href="/properties"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold-600 hover:text-navy-900 transition-colors"
            >
              <span>View All Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 bg-ivory p-10 text-center space-y-3">
              <Building2 className="w-10 h-10 mx-auto text-navy-900/30" />
              <h3 className="font-serif text-lg font-semibold text-navy-900">
                Featured Listings Coming Soon
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                No properties are currently highlighted as featured. Explore our
                full property catalogue to view available listings in Addis
                Ababa.
              </p>
              <div className="pt-2">
                <Link
                  href="/properties"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-900 text-gold-400 text-xs font-bold uppercase tracking-wider hover:bg-navy-800 transition-colors"
                >
                  <span>Browse All Properties</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* NAVY VALUE PILLARS BAND (Matching Harmony Real Estate footer-top strip) */}
      <section className="bg-navy-950 text-white py-12 sm:py-14 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-2.5 border border-gold-500/40 text-gold-400 shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                  Addis Ababa Focus
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Sub-city and neighbourhood discovery across Bole, Yeka,
                  Kirkos, Nifas Silk-Lafto, and beyond.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 border border-gold-500/40 text-gold-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                  Personal Service
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Direct communication with Amanuel—no automated call centers or
                  unnecessary middlemen.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 border border-gold-500/40 text-gold-400 shrink-0">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                  Clear ETB Pricing
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Transparent asking prices in Ethiopian Birr, including
                  per-square-metre figures where applicable.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2.5 border border-gold-500/40 text-gold-400 shrink-0">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                  Direct Viewings
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Request an on-site property viewing online without creating an
                  account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PERSONAL INTRODUCTION & ENQUIRY CTA */}
      <section className="py-16 sm:py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden border border-slate-200 shadow-md bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
                  alt="Residential interior and architectural living space"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
                About Amanu Properties
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-navy-900 leading-tight">
                A Personal Approach to Buying Property in Addis Ababa
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Amanu Properties is an independent property sales platform
                operated by Amanuel. Whether you are searching for a family
                residence, an apartment, a villa, or a commercial space, every
                listing is curated for clear specifications, honest pricing in
                ETB, and straightforward viewing arrangements.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-bold uppercase tracking-[0.16em] transition-colors"
                >
                  <span>Make an Enquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-navy-900/30 hover:border-navy-900 text-navy-900 text-xs font-bold uppercase tracking-[0.16em] transition-colors"
                >
                  <span>Learn More</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
