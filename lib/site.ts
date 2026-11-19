const DEFAULT_PRODUCTION_URL = "https://amanu-properties.vercel.app";

/**
 * Resolves a clean, normalized site base URL without trailing slashes.
 * Guarantees that localhost URLs are never emitted in production canonicals,
 * robots.txt, or sitemap.xml outputs.
 */
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
  ];

  for (const candidate of candidates) {
    if (!candidate) continue;
    const trimmed = candidate.trim().replace(/\/+$/, "");
    if (!trimmed) continue;

    try {
      const parsed = new URL(trimmed);
      const isLocalhost =
        parsed.hostname === "localhost" ||
        parsed.hostname === "127.0.0.1" ||
        parsed.hostname === "0.0.0.0";

      if (!isLocalhost) {
        return `${parsed.protocol}//${parsed.host}`;
      }
    } catch {
      // Ignore malformed URL candidate and fall through to verified default
    }
  }

  return DEFAULT_PRODUCTION_URL;
}
