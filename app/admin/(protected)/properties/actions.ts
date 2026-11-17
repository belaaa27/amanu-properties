"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { calculatePropertyPricing } from "@/lib/pricing";
import { destroyCloudinaryAsset } from "@/lib/cloudinary";

// Revalidate public pages affected by property changes.
function revalidatePublicPropertyPages() {
  revalidatePath("/");
  revalidatePath("/properties");
}

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

const imageItemSchema = z.object({
  id: z.string().optional(),
  cloudinaryId: z.string().min(1),
  url: z.string().url(),
  altText: z.string().optional().default(""),
  isNewUpload: z.boolean().optional(),
});

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
    isPublished: z.coerce.boolean().default(false),

    // Serialized JSON array of ManagedPropertyImage items
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

function parseSubmittedImages(rawImages?: string) {
  if (!rawImages || rawImages.trim() === "") return [];

  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(rawImages);
  } catch {
    throw new Error("Invalid property images payload.");
  }

  const validated = z.array(imageItemSchema).safeParse(parsedJson);

  if (!validated.success) {
    throw new Error("One or more property image entries are invalid.");
  }

  // Deduplicate by cloudinaryId while preserving administrator display order
  const seen = new Set<string>();

  return validated.data.filter((item) => {
    if (seen.has(item.cloudinaryId)) return false;
    seen.add(item.cloudinaryId);
    return true;
  });
}

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
  const imageList = parseSubmittedImages(data.images);

  // Apply pricing rules validation & computation
  const computedPricing = calculatePropertyPricing({
    pricingMode: data.pricingMode,
    areaSqm: data.areaSqm,
    pricePerSqm: data.pricePerSqm,
    totalPrice: data.totalPrice,
  });

  const slug = generateSlug(data.title);

  try {
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
            cloudinaryId: img.cloudinaryId,
            altText: img.altText.trim() || data.title,
            displayOrder: idx,
          })),
        },
      },
    });
  } catch (dbError) {
    // Safe rollback: clean up newly uploaded Cloudinary images if MySQL persistence fails
    await Promise.allSettled(
      imageList
        .filter((img) => img.isNewUpload)
        .map((img) => destroyCloudinaryAsset(img.cloudinaryId)),
    );

    throw dbError;
  }

  revalidatePath("/admin/properties");
  revalidatePublicPropertyPages();

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
  const submittedImages = parseSubmittedImages(data.images);

  // Verify property exists and is not soft-deleted, including owned images
  const existing = await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
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

  // Determine which existing DB images were kept vs removed
  const keptExistingIds = new Set(
    submittedImages.filter((img) => img.id).map((img) => img.id as string),
  );

  const removedDbImages = existing.images.filter(
    (img) => !keptExistingIds.has(img.id),
  );

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Update core property fields
      await tx.property.update({
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

      // 2. Delete removed image rows in DB (scoped strictly to propertyId: id)
      if (removedDbImages.length > 0) {
        await tx.propertyImage.deleteMany({
          where: {
            propertyId: id,
            id: { in: removedDbImages.map((img) => img.id) },
          },
        });
      }

      // 3. Upsert / reorder kept images and create newly uploaded images
      for (let idx = 0; idx < submittedImages.length; idx++) {
        const item = submittedImages[idx];

        const ownedExisting = item.id
          ? existing.images.find((dbImg) => dbImg.id === item.id)
          : undefined;

        if (ownedExisting) {
          await tx.propertyImage.update({
            where: { id: ownedExisting.id },
            data: {
              displayOrder: idx,
              altText: item.altText.trim() || data.title,
            },
          });
        } else {
          await tx.propertyImage.create({
            data: {
              propertyId: id,
              cloudinaryId: item.cloudinaryId,
              url: item.url,
              altText: item.altText.trim() || data.title,
              displayOrder: idx,
            },
          });
        }
      }
    });
  } catch (dbError) {
    // Safe rollback: clean up only newly uploaded images from this failed update attempt
    await Promise.allSettled(
      submittedImages
        .filter((img) => img.isNewUpload)
        .map((img) => destroyCloudinaryAsset(img.cloudinaryId)),
    );

    throw dbError;
  }

  // Only AFTER DB transaction succeeds, delete removed assets from Cloudinary.
  if (removedDbImages.length > 0) {
    const deletionResults = await Promise.allSettled(
      removedDbImages.map((img) => destroyCloudinaryAsset(img.cloudinaryId)),
    );

    const failedDeletions = deletionResults.filter(
      (res): res is PromiseRejectedResult => res.status === "rejected",
    );

    if (failedDeletions.length > 0) {
      revalidatePath("/admin/properties");
      revalidatePath(`/admin/properties/${id}`);
      revalidatePublicPropertyPages();

      throw new Error(
        `Property updated in database, but ${failedDeletions.length} removed image(s) failed to delete from Cloudinary: ${failedDeletions[0].reason}`,
      );
    }
  }

  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${id}`);
  revalidatePublicPropertyPages();

  redirect("/admin/properties");
}

export async function togglePublishProperty(id: string, isPublished: boolean) {
  const session = await requireAdminSession();

  if (!session) throw new Error("Unauthorized");

  const property = await prisma.property.findUnique({ where: { id } });

  if (!property || property.deletedAt) {
    throw new Error("Property not found");
  }

  await prisma.property.update({
    where: { id },
    data: { isPublished: !isPublished },
  });

  revalidatePath("/admin/properties");
  revalidatePublicPropertyPages();
}

export async function updatePropertyStatus(
  id: string,
  status: "AVAILABLE" | "RESERVED" | "SOLD",
) {
  const session = await requireAdminSession();

  if (!session) throw new Error("Unauthorized");

  const property = await prisma.property.findUnique({ where: { id } });

  if (!property || property.deletedAt) {
    throw new Error("Property not found");
  }

  await prisma.property.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin/properties");
  revalidatePublicPropertyPages();
}

export async function softDeleteProperty(id: string) {
  const session = await requireAdminSession();

  if (!session) throw new Error("Unauthorized");

  const property = await prisma.property.findUnique({ where: { id } });

  if (!property) {
    throw new Error("Property not found");
  }

  await prisma.property.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      isPublished: false,
    },
  });

  revalidatePath("/admin/properties");
  revalidatePublicPropertyPages();
}
