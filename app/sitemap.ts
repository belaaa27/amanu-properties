import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/properties`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    const publishedProperties = await prisma.property.findMany({
      where: {
        isPublished: true,
        deletedAt: null,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const propertyRoutes: MetadataRoute.Sitemap = publishedProperties
      .filter(
        (property) =>
          typeof property.slug === "string" && property.slug.trim().length > 0,
      )
      .map((property) => ({
        url: `${siteUrl}/properties/${encodeURIComponent(property.slug.trim())}`,
        lastModified:
          property.updatedAt instanceof Date ? property.updatedAt : now,
        changeFrequency: "weekly",
        priority: 0.8,
      }));

    return [...staticRoutes, ...propertyRoutes];
  } catch {
    // Safely degrade to static public routes without exposing database details
    return staticRoutes;
  }
}
