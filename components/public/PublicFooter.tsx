import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Camera,
  Music2,
  Send,
  ArrowUpRight,
} from "lucide-react";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-gold-500/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <svg
                width="34"
                height="34"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M4 17L20 5L36 17"
                  stroke="#D4AF37"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 31L20 13L26 31M16.2 25H23.8"
                  stroke="#D4AF37"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="flex flex-col">
                <span className="font-serif text-lg tracking-[0.18em] font-semibold text-white leading-none">
                  AMANU
                </span>
                <span className="text-[10px] tracking-[0.28em] text-gold-400 uppercase font-medium mt-1">
                  Properties
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Amanu Properties helps people explore property opportunities in
              Addis Ababa, from family homes and apartments to villas and
              commercial properties. Discover listings and make informed
              property enquiries through a straightforward experience.
            </p>

            <div className="inline-flex items-center gap-2 text-xs text-gold-400/90 bg-navy-900/90 border border-gold-500/20 px-3.5 py-2 rounded-md">
              <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
              <span>Addis Ababa, Ethiopia</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
              Navigation
            </h3>

            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-slate-300 hover:text-gold-400 transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/properties"
                  className="text-slate-300 hover:text-gold-400 transition-colors"
                >
                  Browse Properties
                </Link>
              </li>

              <li>
                <Link
                  href="/properties?category=VILLA"
                  className="text-slate-300 hover:text-gold-400 transition-colors"
                >
                  Villas &amp; Houses
                </Link>
              </li>

              <li>
                <Link
                  href="/properties?category=APARTMENT"
                  className="text-slate-300 hover:text-gold-400 transition-colors"
                >
                  Apartments
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-slate-300 hover:text-gold-400 transition-colors"
                >
                  About Amanu Properties
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-slate-300 hover:text-gold-400 transition-colors"
                >
                  Contact &amp; Enquiries
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold-400">
              Get in Touch
            </h3>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
              {/* Online Enquiry */}
              <li className="flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <Link
                  href="/contact"
                  className="text-slate-200 hover:text-gold-400 transition-colors"
                >
                  Submit a Property Enquiry
                </Link>
              </li>

              {/* First Phone */}
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <a
                  href="tel:+251968080303"
                  className="hover:text-gold-400 transition-colors"
                >
                  +251 968 080 303
                </a>
              </li>

              {/* Second Phone */}
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <a
                  href="tel:+251711689709"
                  className="hover:text-gold-400 transition-colors"
                >
                  +251 711 689 709
                </a>
              </li>

              {/* Email */}
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <a
                  href="mailto:ammanuelteferra77@gmail.com"
                  className="break-all hover:text-gold-400 transition-colors"
                >
                  ammanuelteferra77@gmail.com
                </a>
              </li>

              {/* Telegram */}
              <li className="flex items-start gap-2.5">
                <Send className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <a
                  href="https://t.me/Amanio777"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 transition-colors inline-flex items-center gap-1"
                >
                  Telegram (@Amanio777)
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>

              {/* Instagram */}
              <li className="flex items-start gap-2.5">
                <Camera className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <a
                  href="https://www.instagram.com/ammanuel_teferra?vrfl=OTdrNGk0aXZpdG92"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 transition-colors inline-flex items-center gap-1"
                >
                  Instagram
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>

              {/* TikTok */}
              <li className="flex items-start gap-2.5">
                <Music2 className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                <a
                  href="https://www.tiktok.com/@ammanusha?_r=1&_t=ZN-9BQEDj1s5fK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold-400 transition-colors inline-flex items-center gap-1"
                >
                  TikTok
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>

            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              Property enquiries and viewing arrangements are available by
              appointment.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            &copy; {currentYear} Amanu Properties. All rights reserved.
          </p>

          <p className="text-center sm:text-right">
            Discover your next property with confidence.
          </p>
        </div>
      </div>
    </footer>
  );
}
