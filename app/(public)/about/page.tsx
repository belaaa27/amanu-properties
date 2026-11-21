import Link from "next/link";
import {
  ShieldCheck,
  Compass,
  Handshake,
  ArrowRight,
  UserCheck,
} from "lucide-react";
import { getSiteUrl } from "@/lib/site";
import JsonLd from "@/components/seo/JsonLd";
import type { Metadata } from "next";

const aboutTitle =
  "About Amanu Properties | Independent Real Estate Sales in Addis Ababa";
const aboutDescription =
  "Learn about Amanu Properties, an independent property discovery and sales business operated by Amanuel in Addis Ababa, Ethiopia.";

export const metadata: Metadata = {
  title: {
    absolute: aboutTitle,
  },
  description: aboutDescription,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "website",
    siteName: "Amanu Properties",
    locale: "en_ET",
    url: "/about",
    title: aboutTitle,
    description: aboutDescription,
  },
  twitter: {
    card: "summary",
    title: aboutTitle,
    description: aboutDescription,
  },
};

export default function AboutPage() {
  const siteUrl = getSiteUrl();

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
        name: "About",
        item: `${siteUrl}/about`,
      },
    ],
  };

  return (
    <div className="pb-16">
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero Header */}
      <section className="bg-navy-950 text-white py-14 sm:py-20 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-400">
            Personal &amp; Independent Real Estate
          </p>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal uppercase tracking-wide mt-2 max-w-3xl leading-tight">
            About Amanu Properties
          </h1>
          <p className="text-sm sm:text-base text-slate-300 mt-4 max-w-2xl leading-relaxed">
            A dedicated property discovery and sales platform operated by
            Amanuel in Addis Ababa, Ethiopia—built on clarity, direct
            communication, and respectful service.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 space-y-16">
        {/* Who We Are & Personal Introduction */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
              Our Purpose
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-navy-900">
              Focused Exclusively on Property Sales in Addis Ababa
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Amanu Properties makes discovering and enquiring about residential
              and commercial properties in Addis Ababa simpler and more
              transparent. We present selected property opportunities, including
              houses, apartments, villas, and commercial spaces.
            </p>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Each listing provides essential property details, asking prices in
              Ethiopian Birr (ETB), and neighbourhood information to help
              prospective buyers explore their options and arrange viewings.
            </p>

            {/* Personal Introduction Card */}
            <div className="p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3 mt-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-navy-900 text-gold-400">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-navy-900">
                    Ammanuel Tefera
                  </h3>
                  <p className="text-xs text-slate-500">
                    Founder &amp; Property Professional | Amanu Properties
                  </p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed">
                Ammanuel Tefera holds a Bachelor of Science degree in Computer
                Science from Arsi University. His professional background
                combines technology support, communication, problem-solving, and
                exposure to real estate sales and marketing.
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                His experience includes an ICT internship at Arsi University,
                volunteer service as a System Administration Assistant at
                Rehoboth General Hospital, and work as a Liaison Officer at
                Metropolitan Real Estate.
              </p>

              <p className="text-sm text-slate-600 leading-relaxed">
                Bringing together his technical knowledge and professional
                experience, Ammanuel aims to make property discovery and
                enquiries through Amanu Properties straightforward, informative,
                and professional.
              </p>
            </div>
          </div>

          {/* Architectural Photo */}
          <div className="lg:col-span-6">
            <div className="aspect-[4/5] max-w-lg mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
              <img
                src="/images/ammanuel-tefera.jpg"
                alt="Ammanuel Tefera"
                loading="lazy"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <section className="space-y-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
              How We Work
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-navy-900 mt-1">
              Guiding Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="p-2.5 w-fit rounded-lg bg-navy-900 text-gold-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-900">
                Clear Discovery
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Search and filter properties by Addis Ababa sub-city,
                neighbourhood, category, area, and ETB price without
                registration barriers.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="p-2.5 w-fit rounded-lg bg-navy-900 text-gold-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-900">
                Respect for Privacy
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Public listings share sub-city and neighbourhood context while
                safeguarding private exact street addresses until a viewing is
                arranged.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="p-2.5 w-fit rounded-lg bg-navy-900 text-gold-400">
                <Handshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-navy-900">
                Direct Accountability
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every enquiry and viewing request goes directly to Amanuel for
                personal follow-up via your preferred communication channel.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-navy-950 text-white rounded-xl p-8 sm:p-12 border border-gold-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white">
              Ready to Explore Available Properties?
            </h2>
            <p className="text-sm text-slate-300">
              Browse current listings in Addis Ababa or reach out with your
              property requirements.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold uppercase tracking-[0.16em] transition-colors"
            >
              <span>Browse Properties</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gold-500/50 hover:border-gold-400 text-gold-400 text-xs font-bold uppercase tracking-[0.16em] transition-colors"
            >
              <span>Contact Amanuel</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
