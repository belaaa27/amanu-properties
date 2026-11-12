import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import EditPropertyForm from "./EditPropertyForm";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!property || property.deletedAt) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex items-center justify-between bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            href={`/admin/properties/${property.id}`}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-navy-900">
              Edit Property Listing
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Update specifications, pricing, images, and status for{" "}
              {property.title}.
            </p>
          </div>
        </div>
      </div>

      <EditPropertyForm
        property={{
          id: property.id,
          title: property.title,
          description: property.description,
          category: property.category,
          status: property.status,
          subCity: property.subCity,
          neighbourhood: property.neighbourhood,
          privateAddress: property.privateAddress,
          publicLat: property.publicLat,
          publicLng: property.publicLng,
          areaSqm: property.areaSqm ? Number(property.areaSqm) : null,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          parkingSpaces: property.parkingSpaces,
          pricingMode: property.pricingMode,
          totalPrice: property.totalPrice ? Number(property.totalPrice) : null,
          pricePerSqm: property.pricePerSqm
            ? Number(property.pricePerSqm)
            : null,
          isPublished: property.isPublished,
          isFeatured: property.isFeatured,
          images: property.images.map((img) => ({
            id: img.id,
            cloudinaryId: img.cloudinaryId,
            url: img.url,
            altText: img.altText || "",
          })),
        }}
      />
    </div>
  );
}
