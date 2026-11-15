"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const publicEnquirySchema = z.object({
  type: z
    .enum(["GENERAL", "PROPERTY_ENQUIRY", "VIEWING_REQUEST"])
    .default("GENERAL"),
  propertyId: z.string().optional().nullable(),
  fullName: z.string().trim().min(2, "Please enter your full name."),
  phone: z.string().trim().min(7, "Please enter a valid phone number."),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),
  preferredContactMethod: z
    .enum(["PHONE", "WHATSAPP", "TELEGRAM", "EMAIL"])
    .default("PHONE"),
  message: z
    .string()
    .trim()
    .max(2000, "Message is too long.")
    .optional()
    .default(""),
  preferredDate: z.string().optional().or(z.literal("")),
  preferredTimeSlot: z
    .enum(["MORNING", "AFTERNOON", "EVENING"])
    .optional()
    .or(z.literal("")),
});

export interface EnquiryActionResult {
  success: boolean;
  message: string;
}

export async function submitPublicEnquiry(
  formData: FormData,
): Promise<EnquiryActionResult> {
  try {
    const raw = {
      type: formData.get("type") || "GENERAL",
      propertyId: formData.get("propertyId") || null,
      fullName: formData.get("fullName") || "",
      phone: formData.get("phone") || "",
      email: formData.get("email") || "",
      preferredContactMethod: formData.get("preferredContactMethod") || "PHONE",
      message: formData.get("message") || "",
      preferredDate: formData.get("preferredDate") || "",
      preferredTimeSlot: formData.get("preferredTimeSlot") || "",
    };

    const parsed = publicEnquirySchema.safeParse(raw);
    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || "Please check the form fields.";
      return { success: false, message: firstError };
    }

    const data = parsed.data;

    // If a propertyId is provided, verify it exists, is published, and is not soft-deleted
    let verifiedPropertyId: string | null = null;
    if (data.propertyId && data.propertyId.trim() !== "") {
      const prop = await prisma.property.findFirst({
        where: {
          id: data.propertyId.trim(),
          isPublished: true,
          deletedAt: null,
        },
        select: { id: true },
      });

      if (!prop) {
        return {
          success: false,
          message:
            "The selected property is no longer available for enquiries.",
        };
      }
      verifiedPropertyId = prop.id;
    }

    // Parse preferredDate if provided
    let parsedDate: Date | null = null;
    if (data.preferredDate && data.preferredDate.trim() !== "") {
      const candidate = new Date(data.preferredDate);
      if (Number.isNaN(candidate.getTime())) {
        return {
          success: false,
          message: "Please select a valid preferred date.",
        };
      }
      parsedDate = candidate;
    }

    if (data.type === "VIEWING_REQUEST" && !parsedDate) {
      return {
        success: false,
        message:
          "Please select a preferred date for your property viewing request.",
      };
    }

    await prisma.enquiry.create({
      data: {
        type: data.type,
        propertyId: verifiedPropertyId,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email && data.email !== "" ? data.email : null,
        preferredContactMethod: data.preferredContactMethod,
        message:
          data.message && data.message !== ""
            ? data.message
            : data.type === "VIEWING_REQUEST"
              ? "Property viewing appointment requested."
              : "General property sales enquiry.",
        preferredDate: parsedDate,
        preferredTimeSlot: data.preferredTimeSlot || null,
        status: "NEW",
      },
    });

    return {
      success: true,
      message:
        data.type === "VIEWING_REQUEST"
          ? "Your viewing request has been submitted. Amanuel will contact you to confirm the schedule."
          : "Thank you for your enquiry. Your message has been recorded and Amanuel will reach out shortly.",
    };
  } catch (error) {
    console.error("Public enquiry submission error:", error);
    return {
      success: false,
      message:
        "We could not submit your request right now. Please try again in a moment.",
    };
  }
}
