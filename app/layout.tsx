import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Amanu Properties | Real Estate Sales in Addis Ababa",
    template: "%s | Amanu Properties",
  },
  description:
    "Real estate discovery and property sales platform in Addis Ababa, Ethiopia.",
  openGraph: {
    type: "website",
    siteName: "Amanu Properties",
    locale: "en_ET",
    url: siteUrl,
    title: "Amanu Properties | Real Estate Sales in Addis Ababa",
    description:
      "Real estate discovery and property sales platform in Addis Ababa, Ethiopia.",
  },
  twitter: {
    card: "summary",
    title: "Amanu Properties | Real Estate Sales in Addis Ababa",
    description:
      "Real estate discovery and property sales platform in Addis Ababa, Ethiopia.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-navy-900">
        {children}
      </body>
    </html>
  );
}
