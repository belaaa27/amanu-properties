import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Camera,
  Music2,
  Send,
  ArrowUpRight,
} from "lucide-react";

import PublicEnquiryForm from "@/components/public/PublicEnquiryForm";

export const metadata = {
  title: "Contact & Property Enquiries | Amanu Properties",
  description:
    "Contact Amanu Properties for residential and commercial property enquiries and viewing requests in Addis Ababa, Ethiopia.",
};

export default function ContactPage() {
  return (
    <div className="pb-16">
      {/* Header Banner */}
      <section className="bg-navy-950 text-white py-14 sm:py-16 border-b border-gold-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold-400">
            Get in Touch
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl font-normal uppercase tracking-wide mt-2">
            Contact Us
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mt-3 max-w-2xl leading-relaxed">
            Have a property in mind? Contact Amanu Properties to make an
            enquiry, learn more about a listing, or arrange a property viewing
            in Addis Ababa.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5 space-y-6">
            {/* Introduction */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
                We&apos;re Here to Help
              </p>

              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-navy-900">
                Let&apos;s Discuss Your Property Needs
              </h2>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Whether you&apos;re exploring available properties or have
                questions about a particular listing, get in touch with us.
                Share your requirements, and let&apos;s discuss the next step.
              </p>
            </div>

            {/* Business Contact Details */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
              <h3 className="font-serif text-xl font-bold text-navy-900 border-b border-slate-100 pb-3">
                Contact Information
              </h3>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 shrink-0">
                  <MapPin className="w-5 h-5 text-gold-600" />
                </div>

                <div>
                  <p className="font-bold text-sm text-navy-900">Location</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Addis Ababa, Ethiopia
                  </p>
                </div>
              </div>

              {/* Phone Numbers */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 shrink-0">
                  <Phone className="w-5 h-5 text-gold-600" />
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-sm text-navy-900">Phone</p>

                  <div className="flex flex-col gap-1.5 mt-2">
                    <a
                      href="tel:+251968080303"
                      className="text-sm text-slate-600 hover:text-gold-600 transition-colors w-fit"
                    >
                      +251 968 080 303
                    </a>

                    <a
                      href="tel:+251711689709"
                      className="text-sm text-slate-600 hover:text-gold-600 transition-colors w-fit"
                    >
                      +251 711 689 709
                    </a>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 shrink-0">
                  <Mail className="w-5 h-5 text-gold-600" />
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-sm text-navy-900">Email</p>

                  <a
                    href="mailto:ammanuelteferra77@gmail.com"
                    className="text-sm text-slate-600 hover:text-gold-600 transition-colors mt-1 inline-block break-all"
                  >
                    ammanuelteferra77@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Send className="w-5 h-5 text-gold-500 shrink-0 mt-1" />
                <div>
                  <p className="text-sm font-medium text-slate-800">Telegram</p>
                  <a
                    href="https://t.me/Amanio777"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-gold-600 transition-colors"
                  >
                    @Amanio777
                  </a>
                </div>
              </div>

              {/* Social Media */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 shrink-0">
                  <MessageCircle className="w-5 h-5 text-gold-600" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm text-navy-900">Follow Us</p>

                  <div className="flex flex-col gap-3 mt-3">
                    {/* Instagram */}
                    <a
                      href="https://www.instagram.com/ammanuel_teferra?vrfl=OTdrNGk0aXZpdG92"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 text-sm text-slate-600 hover:text-gold-600 transition-colors group"
                    >
                      <span className="flex items-center gap-2">
                        <Camera size={18} />
                        Instagram
                      </span>

                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>

                    {/* TikTok */}
                    <a
                      href="https://www.tiktok.com/@ammanusha?_r=1&_t=ZN-9BQEDj1s5fK"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 text-sm text-slate-600 hover:text-gold-600 transition-colors group"
                    >
                      <span className="flex items-center gap-2">
                        <Music2 className="w-4 h-4" />
                        TikTok
                      </span>

                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Viewing Hours */}
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-50 shrink-0">
                  <Clock className="w-5 h-5 text-gold-600" />
                </div>

                <div>
                  <p className="font-bold text-sm text-navy-900">
                    Viewing & Contact Hours
                  </p>

                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    Monday – Saturday
                  </p>

                  <p className="text-sm text-slate-600">Morning & Afternoon</p>

                  <p className="text-xs text-slate-500 mt-1">
                    By appointment. Please contact us to arrange a suitable
                    time.
                  </p>
                </div>
              </div>
            </div>

            {/* How to Enquire */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
              <h3 className="font-serif text-xl font-bold text-navy-900">
                How It Works
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center text-xs font-bold shrink-0">
                    01
                  </span>

                  <div>
                    <p className="text-sm font-bold text-navy-900">
                      Share Your Requirements
                    </p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Tell us your preferred location, property type, and
                      approximate budget.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center text-xs font-bold shrink-0">
                    02
                  </span>

                  <div>
                    <p className="text-sm font-bold text-navy-900">
                      Send Your Enquiry
                    </p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Complete the enquiry form with your contact details and
                      property requirements.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="w-7 h-7 rounded-full bg-navy-900 text-gold-400 flex items-center justify-center text-xs font-bold shrink-0">
                    03
                  </span>

                  <div>
                    <p className="text-sm font-bold text-navy-900">
                      Arrange the Next Step
                    </p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      Discuss the property and arrange a viewing at a mutually
                      suitable time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Email CTA */}
            <a
              href="mailto:ammanuelteferra77@gmail.com"
              className="flex items-center justify-between gap-3 rounded-xl bg-navy-950 p-5 text-white hover:bg-navy-900 transition-colors group"
            >
              <div>
                <p className="text-xs uppercase tracking-wider text-gold-400 font-bold">
                  Have a Question?
                </p>

                <p className="font-serif text-lg mt-1">Send Us an Email</p>
              </div>

              <ArrowUpRight className="w-5 h-5 text-gold-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Right Column: Database-Backed Enquiry Form */}
          <div className="lg:col-span-7">
            <PublicEnquiryForm defaultMode="GENERAL" />
          </div>
        </div>
      </div>
    </div>
  );
}
