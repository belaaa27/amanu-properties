import { prisma } from "@/lib/prisma";
import { formatETB } from "@/lib/pricing";
import type {
  PropertyCategory,
  PropertyStatus,
  PricingMode,
} from "../generated/prisma/client";

export const ADDIS_SUB_CITIES = [
  "Bole",
  "Kirkos",
  "Yeka",
  "Nifas Silk-Lafto",
  "Arada",
  "Lideta",
  "Gulele",
  "Akaki Kality",
  "Kolfe Keranio",
  "Lemi Kura",
] as const;

export interface PublicPropertyCardData {
  id: string;
  title: string;
  slug: string;
  category: PropertyCategory;
  status: PropertyStatus;
  subCity: string;
  neighbourhood: string;
  areaSqm: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  pricingMode: PricingMode;
  formattedTotalPrice: string;
  formattedPricePerSqm: string | null;
  isFeatured: boolean;
  primaryImage: {
    url: string;
    altText: string;
  } | null;
}

export interface PublicPropertyDetailData extends PublicPropertyCardData {
  description: string;
  publicLat: number | null;
  publicLng: number | null;
  createdAt: string;
  images: {
    id: string;
    url: string;
    altText: string;
  }[];
}

/**
 * Strictly enforces public visibility:
 * - Must be published (isPublished: true)
 * - Must not be soft-deleted (deletedAt: null)
 * - Never selects privateAddress
 */
function mapRecordToPublicCard(record: {
  id: string;
  title: string;
  slug: string;
  category: PropertyCategory;
  status: PropertyStatus;
  subCity: string;
  neighbourhood: string;
  areaSqm: unknown;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  pricingMode: PricingMode;
  pricePerSqm: unknown;
  totalPrice: unknown;
  isFeatured: boolean;
  images: { url: string; altText: string | null }[];
}): PublicPropertyCardData {
  const areaNum =
    record.areaSqm !== null && record.areaSqm !== undefined
      ? Number(record.areaSqm)
      : null;
  const totalPriceNum =
    record.totalPrice !== null && record.totalPrice !== undefined
      ? Number(record.totalPrice)
      : null;
  const pricePerSqmNum =
    record.pricePerSqm !== null && record.pricePerSqm !== undefined
      ? Number(record.pricePerSqm)
      : null;

  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    category: record.category,
    status: record.status,
    subCity: record.subCity,
    neighbourhood: record.neighbourhood,
    areaSqm: areaNum,
    bedrooms: record.bedrooms,
    bathrooms: record.bathrooms,
    parkingSpaces: record.parkingSpaces,
    pricingMode: record.pricingMode,
    formattedTotalPrice: formatETB(totalPriceNum),
    formattedPricePerSqm:
      pricePerSqmNum && pricePerSqmNum > 0
        ? `${formatETB(pricePerSqmNum)} / m²`
        : null,
    isFeatured: record.isFeatured,
    primaryImage: record.images[0]
      ? {
          url: record.images[0].url,
          altText: record.images[0].altText || record.title,
        }
      : null,
  };
}

/**
 * Fetches up to 4 genuinely featured properties (isFeatured: true, isPublished: true, deletedAt: null).
 */
export async function getFeaturedPublicProperties(): Promise<
  PublicPropertyCardData[]
> {
  const records = await prisma.property.findMany({
    where: {
      isPublished: true,
      deletedAt: null,
      isFeatured: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      status: true,
      subCity: true,
      neighbourhood: true,
      areaSqm: true,
      bedrooms: true,
      bathrooms: true,
      parkingSpaces: true,
      pricingMode: true,
      pricePerSqm: true,
      totalPrice: true,
      isFeatured: true,
      images: {
        orderBy: { displayOrder: "asc" },
        take: 1,
        select: {
          url: true,
          altText: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    take: 4,
  });

  return records.map(mapRecordToPublicCard);
}

export interface PublicPropertyFilterParams {
  q?: string;
  category?: string;
  subCity?: string;
  neighbourhood?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  bathrooms?: string;
  minArea?: string;
  parking?: string;
  sort?: string;
  page?: string;
}

export async function searchPublicProperties(
  params: PublicPropertyFilterParams,
  pageSize = 9,
) {
  const query = (params.q || "").trim();
  const category = params.category || "";
  const subCity = (params.subCity || "").trim();
  const neighbourhood = (params.neighbourhood || "").trim();
  const minPrice =
    params.minPrice && Number(params.minPrice) > 0
      ? Number(params.minPrice)
      : null;
  const maxPrice =
    params.maxPrice && Number(params.maxPrice) > 0
      ? Number(params.maxPrice)
      : null;
  const minBedrooms =
    params.bedrooms && Number(params.bedrooms) > 0
      ? Number(params.bedrooms)
      : null;
  const minBathrooms =
    params.bathrooms && Number(params.bathrooms) > 0
      ? Number(params.bathrooms)
      : null;
  const minArea =
    params.minArea && Number(params.minArea) > 0
      ? Number(params.minArea)
      : null;
  const minParking =
    params.parking && Number(params.parking) > 0
      ? Number(params.parking)
      : null;
  const sort = params.sort || "newest";
  const currentPage = Math.max(1, Number(params.page) || 1);

  const whereClause = {
    isPublished: true,
    deletedAt: null,
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { subCity: { contains: query } },
            { neighbourhood: { contains: query } },
            { description: { contains: query } },
          ],
        }
      : {}),
    ...(category &&
    ["HOUSE", "APARTMENT", "VILLA", "COMMERCIAL"].includes(category)
      ? { category: category as PropertyCategory }
      : {}),
    ...(subCity ? { subCity } : {}),
    ...(neighbourhood ? { neighbourhood: { contains: neighbourhood } } : {}),
    ...(minPrice !== null || maxPrice !== null
      ? {
          totalPrice: {
            ...(minPrice !== null ? { gte: minPrice } : {}),
            ...(maxPrice !== null ? { lte: maxPrice } : {}),
          },
        }
      : {}),
    ...(minBedrooms !== null ? { bedrooms: { gte: minBedrooms } } : {}),
    ...(minBathrooms !== null ? { bathrooms: { gte: minBathrooms } } : {}),
    ...(minArea !== null ? { areaSqm: { gte: minArea } } : {}),
    ...(minParking !== null ? { parkingSpaces: { gte: minParking } } : {}),
  };

  const orderBy =
    sort === "price_asc"
      ? { totalPrice: "asc" as const }
      : sort === "price_desc"
        ? { totalPrice: "desc" as const }
        : sort === "area_desc"
          ? { areaSqm: "desc" as const }
          : { createdAt: "desc" as const };

  const [totalCount, records] = await Promise.all([
    prisma.property.count({ where: whereClause }),
    prisma.property.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        status: true,
        subCity: true,
        neighbourhood: true,
        areaSqm: true,
        bedrooms: true,
        bathrooms: true,
        parkingSpaces: true,
        pricingMode: true,
        pricePerSqm: true,
        totalPrice: true,
        isFeatured: true,
        images: {
          orderBy: { displayOrder: "asc" },
          take: 1,
          select: {
            url: true,
            altText: true,
          },
        },
      },
      orderBy,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    items: records.map(mapRecordToPublicCard),
    totalCount,
    currentPage,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  };
}

/**
 * Fetches a single public property by ID or slug.
 * Returns null if unpublished, soft-deleted, or nonexistent.
 * Never selects privateAddress.
 */
export async function getPublicPropertyByIdOrSlug(
  idOrSlug: string,
): Promise<PublicPropertyDetailData | null> {
  const record = await prisma.property.findFirst({
    where: {
      isPublished: true,
      deletedAt: null,
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      category: true,
      status: true,
      subCity: true,
      neighbourhood: true,
      publicLat: true,
      publicLng: true,
      areaSqm: true,
      bedrooms: true,
      bathrooms: true,
      parkingSpaces: true,
      pricingMode: true,
      pricePerSqm: true,
      totalPrice: true,
      isFeatured: true,
      createdAt: true,
      images: {
        orderBy: { displayOrder: "asc" },
        select: {
          id: true,
          url: true,
          altText: true,
        },
      },
    },
  });

  if (!record) return null;

  const base = mapRecordToPublicCard(record);

  return {
    ...base,
    description: record.description,
    publicLat: record.publicLat,
    publicLng: record.publicLng,
    createdAt: record.createdAt.toISOString(),
    images: record.images.map((img, index) => ({
      id: img.id,
      url: img.url,
      altText: img.altText || `${record.title} - Photo ${index + 1}`,
    })),
  };
}
