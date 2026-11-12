import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminSession } from "@/lib/auth";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_BYTES,
  destroyCloudinaryAsset,
  generateCloudinaryUploadSignature,
} from "@/lib/cloudinary";

const signRequestSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.enum(ALLOWED_IMAGE_MIME_TYPES, {
    message:
      "Unsupported image format. Allowed formats: JPEG, PNG, WebP, AVIF.",
  }),
  fileSize: z
    .number()
    .int()
    .positive("File size must be greater than 0 bytes.")
    .max(
      MAX_IMAGE_SIZE_BYTES,
      "Image exceeds the 8 MB maximum file size limit.",
    ),
});

const cleanupRequestSchema = z.object({
  cloudinaryId: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator access required." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = signRequestSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue =
        parsed.error.issues[0]?.message || "Invalid image upload metadata.";
      return NextResponse.json({ error: firstIssue }, { status: 400 });
    }

    const signedParams = generateCloudinaryUploadSignature();
    return NextResponse.json(signedParams, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to generate Cloudinary upload signature.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator access required." },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = cleanupRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid Cloudinary asset identifier." },
        { status: 400 },
      );
    }

    await destroyCloudinaryAsset(parsed.data.cloudinaryId);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to delete Cloudinary asset.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
