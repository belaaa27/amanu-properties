"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const updateEnquiryStatusSchema = z.object({
  id: z.string().uuid("Invalid enquiry identifier."),
  status: z.enum(["NEW", "CONTACTED", "IN_PROGRESS", "RESOLVED"]),
});

const updateAdminNotesSchema = z.object({
  id: z.string().uuid("Invalid enquiry identifier."),
  adminNotes: z
    .string()
    .max(5000, "Internal administrator notes must not exceed 5,000 characters.")
    .transform((val) => val.trim()),
});

export interface AdminEnquiryMutationResult {
  success: boolean;
  message: string;
}

export async function updateEnquiryStatus(
  id: string,
  status: "NEW" | "CONTACTED" | "IN_PROGRESS" | "RESOLVED",
): Promise<AdminEnquiryMutationResult> {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return {
        success: false,
        message: "Unauthorized: Administrator session required.",
      };
    }

    const parsed = updateEnquiryStatusSchema.safeParse({ id, status });
    if (!parsed.success) {
      return {
        success: false,
        message:
          parsed.error.issues[0]?.message || "Invalid status update input.",
      };
    }

    const existing = await prisma.enquiry.findUnique({
      where: { id: parsed.data.id },
      select: { id: true },
    });

    if (!existing) {
      return {
        success: false,
        message: "Enquiry record was not found.",
      };
    }

    await prisma.enquiry.update({
      where: { id: parsed.data.id },
      data: { status: parsed.data.status },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin/viewing-requests");

    return {
      success: true,
      message: "Status updated successfully.",
    };
  } catch (error) {
    console.error("Failed to update enquiry status:", error);
    return {
      success: false,
      message: "An unexpected error occurred while updating the status.",
    };
  }
}

export async function saveEnquiryAdminNotes(
  id: string,
  adminNotes: string,
): Promise<AdminEnquiryMutationResult> {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return {
        success: false,
        message: "Unauthorized: Administrator session required.",
      };
    }

    const parsed = updateAdminNotesSchema.safeParse({ id, adminNotes });
    if (!parsed.success) {
      return {
        success: false,
        message:
          parsed.error.issues[0]?.message || "Invalid internal notes input.",
      };
    }

    const existing = await prisma.enquiry.findUnique({
      where: { id: parsed.data.id },
      select: { id: true },
    });

    if (!existing) {
      return {
        success: false,
        message: "Enquiry record was not found.",
      };
    }

    await prisma.enquiry.update({
      where: { id: parsed.data.id },
      data: {
        adminNotes:
          parsed.data.adminNotes === "" ? null : parsed.data.adminNotes,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/enquiries");
    revalidatePath("/admin/viewing-requests");

    return {
      success: true,
      message: "Internal notes saved.",
    };
  } catch (error) {
    console.error("Failed to save enquiry admin notes:", error);
    return {
      success: false,
      message: "An unexpected error occurred while saving internal notes.",
    };
  }
}
