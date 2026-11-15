"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, PhoneCall } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Buy / Properties", href: "/properties" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function PublicNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-40 bg-navy-950/95 backdrop-blur-md border-b border-gold-500/20 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Amanu Properties Custom Architectural A-Monogram Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 rounded-lg"
          >
            <svg
              width="38"
              height="38"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="shrink-0 transition-transform duration-200 group-hover:scale-105"
            >
              {/* Architectural Roofline & Frame */}
              <path
                d="M4 17L20 5L36 17"
                stroke="#D4AF37"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 14V34H31V14"
                stroke="#D4AF37"
                strokeWidth="1.5"
                strokeOpacity="0.55"
              />
              {/* Architectural A-Monogram */}
              <path
                d="M14 31L20 13L26 31M16.2 25H23.8"
                stroke="#D4AF37"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl tracking-[0.18em] font-semibold text-white leading-none">
                AMANU
              </span>
              <span className="text-[10px] tracking-[0.28em] text-gold-400 uppercase font-medium mt-1">
                Properties
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-8"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs uppercase tracking-[0.16em] font-medium transition-colors py-1 border-b-2 ${
                    active
                      ? "text-gold-400 border-gold-500"
                      : "text-slate-200 border-transparent hover:text-gold-400"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Prominent Enquiry CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-navy-950 text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-200"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Get in Touch</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="md:hidden p-2.5 rounded-lg text-slate-200 hover:text-gold-400 hover:bg-navy-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-navy-900 border-t border-gold-500/20 px-4 pt-3 pb-6 space-y-2">
          <nav
            aria-label="Mobile Navigation"
            className="flex flex-col space-y-1"
          >
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm uppercase tracking-wider font-medium transition-colors ${
                    active
                      ? "bg-navy-800 text-gold-400 border-l-4 border-gold-500"
                      : "text-slate-200 hover:bg-navy-800/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 px-1">
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gold-500 text-navy-950 font-bold text-xs uppercase tracking-[0.16em] rounded-lg shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Enquire or Book Viewing</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
