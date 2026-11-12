"use client";

import { useState } from "react";
import Link from "next/link";
import { Save } from "lucide-react";
import { createProperty } from "../actions";
import PropertyImageManager, {
  ManagedPropertyImage,
} from "../PropertyImageManager";

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

export default function NewPropertyForm() {
  const [title, setTitle] = useState("");
  const [pricingMode, setPricingMode] = useState<
    "TOTAL_ONLY" | "PER_SQM_ONLY" | "EXPLICIT_BOTH"
  >("TOTAL_ONLY");
  const [status, setStatus] = useState<"AVAILABLE" | "RESERVED" | "SOLD">(
    "AVAILABLE",
  );
  const [images, setImages] = useState<ManagedPropertyImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("images", JSON.stringify(images));

    try {
      await createProperty(formData);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create property.";
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
                placeholder="e.g. Luxurious 4-Bedroom Villa in Bole Near Edna Mall"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Category *
              </label>
              <select
                name="category"
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
                Initial Status *
              </label>
              <select
                name="status"
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as "AVAILABLE" | "RESERVED" | "SOLD")
                }
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
                required
                rows={5}
                placeholder="Provide detailed property description, finishing specifications, amenities..."
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
                required
                placeholder="e.g. Bole Medhanealem"
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
                placeholder="e.g. House No. 402, Bole Road behind Millennium Hall"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Public Latitude (Approximate)
              </label>
              <input
                type="number"
                step="any"
                name="publicLat"
                placeholder="9.0227"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Public Longitude (Approximate)
              </label>
              <input
                type="number"
                step="any"
                name="publicLng"
                placeholder="38.7468"
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
                placeholder="250"
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
                placeholder="4"
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
                placeholder="3"
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
                placeholder="2"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
              />
            </div>
          </div>
        </div>

        {/* Pricing & Dual Mode Configuration */}
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
              <option value="PER_SQM_ONLY">
                Price Per Square Metre Only (Calculates Total)
              </option>
              <option value="EXPLICIT_BOTH">
                Explicit Both (Manual Total & Per Sqm)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(pricingMode === "TOTAL_ONLY" ||
              pricingMode === "EXPLICIT_BOTH") && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Total Asking Price (ETB) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="totalPrice"
                  required={
                    pricingMode === "TOTAL_ONLY" ||
                    pricingMode === "EXPLICIT_BOTH"
                  }
                  placeholder="15000000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
                />
              </div>
            )}

            {(pricingMode === "PER_SQM_ONLY" ||
              pricingMode === "EXPLICIT_BOTH") && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Price Per Sqm (ETB) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="pricePerSqm"
                  required={
                    pricingMode === "PER_SQM_ONLY" ||
                    pricingMode === "EXPLICIT_BOTH"
                  }
                  placeholder="60000"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 text-slate-900 bg-slate-50/50"
                />
              </div>
            )}
          </div>
        </div>

        {/* Property Image Management */}
        <PropertyImageManager
          initialImages={images}
          propertyTitle={title}
          onChange={setImages}
        />

        {/* Publishing Options */}
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
                className="w-4 h-4 text-gold-500 rounded border-slate-300 focus:ring-gold-500"
              />
              <span>Publish immediately to public portal</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                name="isFeatured"
                value="true"
                className="w-4 h-4 text-gold-500 rounded border-slate-300 focus:ring-gold-500"
              />
              <span>Feature on Homepage</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Link
            href="/admin/properties"
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
              {loading ? "Saving Property..." : "Save Property Listing"}
            </span>
          </button>
        </div>
      </form>
    </>
  );
}
