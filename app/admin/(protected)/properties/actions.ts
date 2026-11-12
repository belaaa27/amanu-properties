"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { calculatePropertyPricing } from "@/lib/pricing";

// Helper to treat empty form strings ("") as null instead of coercing "" -> 0
const emptyToNull = (val: unknown) =>
  val === "" || val === undefined || val === null ? null : val;

const optionalPositiveNumber = z.preprocess(
  emptyToNull,
  z.coerce.number().positive("Value must be greater than 0.").nullable(),
);

const optionalNonNegativeInt = z.preprocess(
  emptyToNull,
  z.coerce.number().int().nonnegative().nullable(),
);

const optionalFloat = z.preprocess(emptyToNull, z.coerce.number().nullable());

// Zod validation schema for Property creation & editing
const propertySchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters long."),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters long."),
    category: z.enum(["HOUSE", "APARTMENT", "VILLA", "COMMERCIAL"]),
    status: z.enum(["AVAILABLE", "RESERVED", "SOLD"]).default("AVAILABLE"),

    // Location
    subCity: z.string().min(2, "Sub-city is required."),
    neighbourhood: z.string().min(2, "Neighbourhood is required."),
    privateAddress: z.string().optional().nullable(),
    publicLat: optionalFloat,
    publicLng: optionalFloat,

    // Specs
    areaSqm: optionalPositiveNumber,
    bedrooms: optionalNonNegativeInt,
    bathrooms: optionalNonNegativeInt,
    parkingSpaces: optionalNonNegativeInt,

    // Pricing
    pricingMode: z.enum(["TOTAL_ONLY", "PER_SQM_ONLY", "EXPLICIT_BOTH"]),
    pricePerSqm: optionalPositiveNumber,
    totalPrice: optionalPositiveNumber,

    // Publishing & Feature Flags
    isFeatured: z.coerce.boolean().default(false),
    isPublished: z.coerce.boolean().default(false), // New properties unpublished by default

    // Images (Cloudinary URLs or IDs passed as JSON or comma-separated strings)
    images: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.pricingMode === "TOTAL_ONLY") {
      if (data.totalPrice === null || data.totalPrice <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["totalPrice"],
          message:
            "Total price is required and must be greater than 0 for TOTAL_ONLY pricing.",
        });
      }
    } else if (data.pricingMode === "PER_SQM_ONLY") {
      if (data.pricePerSqm === null || data.pricePerSqm <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pricePerSqm"],
          message:
            "Price per square metre is required and must be greater than 0 for PER_SQM_ONLY pricing.",
        });
      }
      if (data.areaSqm === null || data.areaSqm <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["areaSqm"],
          message:
            "Area (m²) is required and must be greater than 0 for PER_SQM_ONLY pricing.",
        });
      }
    } else if (data.pricingMode === "EXPLICIT_BOTH") {
      if (data.areaSqm === null || data.areaSqm <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["areaSqm"],
          message:
            "Area (m²) is required and must be greater than 0 for EXPLICIT_BOTH pricing.",
        });
      }
      if (data.pricePerSqm === null || data.pricePerSqm <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pricePerSqm"],
          message:
            "Price per square metre is required and must be greater than 0 for EXPLICIT_BOTH pricing.",
        });
      }
      if (data.totalPrice === null || data.totalPrice <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["totalPrice"],
          message:
            "Total price is required and must be greater than 0 for EXPLICIT_BOTH pricing.",
        });
      }
    }
  });

function generateSlug(title: string): string {
  const clean = title
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  return `${clean}-${randomSuffix}`;
}

export async function createProperty(formData: FormData) {
  const session = await requireAdminSession();
  if (!session) {
    throw new Error("Unauthorized: Administrator access required.");
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = propertySchema.safeParse(rawData);

  if (!parsed.success) {
    throw new Error(
      `Validation Error: ${JSON.stringify(parsed.error.format())}`,
    );
  }

  const data = parsed.data;

  // Apply pricing rules validation & computation
  const computedPricing = calculatePropertyPricing({
    pricingMode: data.pricingMode,
    areaSqm: data.areaSqm,
    pricePerSqm: data.pricePerSqm,
    totalPrice: data.totalPrice,
  });

  const slug = generateSlug(data.title);

  // Parse images if provided
  let imageList: { url: string; cloudinaryId: string; altText?: string }[] = [];
  if (data.images) {
    try {
      imageList = JSON.parse(data.images);
    } catch {
      // fallback if not JSON
    }
  }

  await prisma.property.create({
    data: {
      title: data.title,
      slug,
      description: data.description,
      category: data.category,
      status: data.status,
      subCity: data.subCity,
      neighbourhood: data.neighbourhood,
      privateAddress: data.privateAddress || null,
      publicLat: data.publicLat || null,
      publicLng: data.publicLng || null,
      areaSqm: computedPricing.areaSqm,
      bedrooms: data.bedrooms || null,
      bathrooms: data.bathrooms || null,
      parkingSpaces: data.parkingSpaces || null,
      pricingMode: computedPricing.pricingMode,
      pricePerSqm: computedPricing.pricePerSqm,
      totalPrice: computedPricing.totalPrice,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished,
      images: {
        create: imageList.map((img, idx) => ({
          url: img.url,
          cloudinaryId: img.cloudinaryId || `amanu_${Date.now()}_${idx}`,
          altText: img.altText || data.title,
          displayOrder: idx,
        })),
      },
    },
  });

  revalidatePath("/admin/properties");
  redirect("/admin/properties");
}

export async function updateProperty(id: string, formData: FormData) {
  const session = await requireAdminSession();
  if (!session) {
    throw new Error("Unauthorized: Administrator access required.");
  }

  const rawData = Object.fromEntries(formData.entries());
  const parsed = propertySchema.safeParse(rawData);

  if (!parsed.success) {
    throw new Error(
      `Validation Error: ${JSON.stringify(parsed.error.format())}`,
    );
  }

  const data = parsed.data;

  // Verify property exists and is not soft-deleted
  const existing = await prisma.property.findUnique({
    where: { id },
  });

  if (!existing || existing.deletedAt) {
    throw new Error("Property not found or has been deleted.");
  }

  const computedPricing = calculatePropertyPricing({
    pricingMode: data.pricingMode,
    areaSqm: data.areaSqm,
    pricePerSqm: data.pricePerSqm,
    totalPrice: data.totalPrice,
  });

  await prisma.property.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      status: data.status,
      subCity: data.subCity,
      neighbourhood: data.neighbourhood,
      privateAddress: data.privateAddress || null,
      publicLat: data.publicLat || null,
      publicLng: data.publicLng || null,
      areaSqm: computedPricing.areaSqm,
      bedrooms: data.bedrooms || null,
      bathrooms: data.bathrooms || null,
      parkingSpaces: data.parkingSpaces || null,
      pricingMode: computedPricing.pricingMode,
      pricePerSqm: computedPricing.pricePerSqm,
      totalPrice: computedPricing.totalPrice,
      isFeatured: data.isFeatured,
      isPublished: data.isPublished,
    },
  });

  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${id}`);
  redirect("/admin/properties");
}

export async function togglePublishProperty(id: string, isPublished: boolean) {
  const session = await requireAdminSession();
  if (!session) throw new Error("Unauthorized");

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property || property.deletedAt) throw new Error("Property not found");

  await prisma.property.update({
    where: { id },
    data: { isPublished: !isPublished },
  });

  revalidatePath("/admin/properties");
}

export async function updatePropertyStatus(
  id: string,
  status: "AVAILABLE" | "RESERVED" | "SOLD",
) {
  const session = await requireAdminSession();
  if (!session) throw new Error("Unauthorized");

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property || property.deletedAt) throw new Error("Property not found");

  await prisma.property.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/properties");
}

export async function softDeleteProperty(id: string) {
  const session = await requireAdminSession();
  if (!session) throw new Error("Unauthorized");

  const property = await prisma.property.findUnique({ where: { id } });
  if (!property) throw new Error("Property not found");

  await prisma.property.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isPublished: false, // Automatically unpublish upon deletion
    },
  });

  revalidatePath("/admin/properties");
}
