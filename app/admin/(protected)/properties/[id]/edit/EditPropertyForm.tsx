"use client";

import { useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { updateProperty } from "../../actions";
import PropertyImageManager, {
  ManagedPropertyImage,
} from "../../PropertyImageManager";

const addisSubCities = [
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
];

interface EditablePropertyData {
  id: string;
  title: string;
  description: string;
  category: "HOUSE" | "APARTMENT" | "VILLA" | "COMMERCIAL";
  status: "AVAILABLE" | "RESERVED" | "SOLD";
  subCity: string;
  neighbourhood: string;
  privateAddress: string | null;
  publicLat: number | null;
  publicLng: number | null;
  areaSqm: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpaces: number | null;
  pricingMode: "TOTAL_ONLY" | "PER_SQM_ONLY" | "EXPLICIT_BOTH";
  totalPrice: number | null;
  pricePerSqm: number | null;
  isPublished: boolean;
  isFeatured: boolean;
  images: ManagedPropertyImage[];
}

export default function EditPropertyForm({
  property,
}: {
  property: EditablePropertyData;
}) {
  const [title, setTitle] = useState(property.title);
  const [pricingMode, setPricingMode] = useState<
    "TOTAL_ONLY" | "PER_SQM_ONLY" | "EXPLICIT_BOTH"
  >(property.pricingMode);
  const [images, setImages] = useState<ManagedPropertyImage[]>(property.images);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("images", JSON.stringify(images));

    try {
      await updateProperty(property.id, formData);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update property.";
      setError(message);
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-navy-900 border-b pb-3">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Property Title *
              </label>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category *
              </label>
              <select
                name="category"
                defaultValue={property.category}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              >
                <option value="HOUSE">House</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="COMMERCIAL">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Status *
              </label>
              <select
                name="status"
                defaultValue={property.status}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Description *
              </label>
              <textarea
                name="description"
                defaultValue={property.description}
                required
                rows={5}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-navy-900 border-b pb-3">
            Location (Addis Ababa)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Sub-City *
              </label>
              <select
                name="subCity"
                defaultValue={property.subCity}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              >
                {addisSubCities.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Neighbourhood *
              </label>
              <input
                type="text"
                name="neighbourhood"
                defaultValue={property.neighbourhood}
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Private Exact Address (Admin Only)
              </label>
              <input
                type="text"
                name="privateAddress"
                defaultValue={property.privateAddress || ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Public Latitude
              </label>
              <input
                type="number"
                step="any"
                name="publicLat"
                defaultValue={property.publicLat ?? ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Public Longitude
              </label>
              <input
                type="number"
                step="any"
                name="publicLng"
                defaultValue={property.publicLng ?? ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-navy-900 border-b pb-3">
            Property Specifications
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Area (m²)
              </label>
              <input
                type="number"
                step="0.01"
                name="areaSqm"
                defaultValue={property.areaSqm ?? ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                name="bedrooms"
                defaultValue={property.bedrooms ?? ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                name="bathrooms"
                defaultValue={property.bathrooms ?? ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Parking
              </label>
              <input
                type="number"
                name="parkingSpaces"
                defaultValue={property.parkingSpaces ?? ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Pricing Configuration */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-navy-900 border-b pb-3">
            Pricing (ETB Currency)
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Pricing Mode *
            </label>
            <select
              name="pricingMode"
              value={pricingMode}
              onChange={(e) =>
                setPricingMode(
                  e.target.value as
                    | "TOTAL_ONLY"
                    | "PER_SQM_ONLY"
                    | "EXPLICIT_BOTH",
                )
              }
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
            >
              <option value="TOTAL_ONLY">Total Price Only</option>
              <option value="PER_SQM_ONLY">Price Per Square Metre Only</option>
              <option value="EXPLICIT_BOTH">
                Explicit Both (Manual Total & Per Sqm)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Total Asking Price (ETB)
              </label>
              <input
                type="number"
                step="0.01"
                name="totalPrice"
                defaultValue={property.totalPrice ?? ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Price Per Sqm (ETB)
              </label>
              <input
                type="number"
                step="0.01"
                name="pricePerSqm"
                defaultValue={property.pricePerSqm ?? ""}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Property Image Management */}
        <PropertyImageManager
          initialImages={images}
          propertyTitle={title}
          onChange={setImages}
        />

        {/* Publishing */}
        <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-navy-900 border-b pb-3">
            Publishing Control
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                name="isPublished"
                value="true"
                defaultChecked={property.isPublished}
                className="w-4 h-4 text-gold-500 rounded border-slate-300 focus:ring-gold-500"
              />
              <span>Published on public portal</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                name="isFeatured"
                value="true"
                defaultChecked={property.isFeatured}
                className="w-4 h-4 text-gold-500 rounded border-slate-300 focus:ring-gold-500"
              />
              <span>Featured Listing</span>
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Link
            href={`/admin/properties/${property.id}`}
            className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-bold text-sm bg-white hover:bg-slate-50 text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-gold-500 font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>
              {loading ? "Updating Property..." : "Update Property Listing"}
            </span>
          </button>
        </div>
      </form>
    </>
  );
}
