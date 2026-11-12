"use client";

import { useRef, useState } from "react";
import {
  Upload,
  Star,
  ArrowUp,
  ArrowDown,
  Trash2,
  Loader2,
  AlertCircle,
  ImagePlus,
} from "lucide-react";

export interface ManagedPropertyImage {
  id?: string; // Present when loaded from MySQL
  cloudinaryId: string;
  url: string;
  altText: string;
  isNewUpload?: boolean; // True if uploaded during current form session
}

interface PropertyImageManagerProps {
  initialImages?: ManagedPropertyImage[];
  propertyTitle?: string;
  onChange: (images: ManagedPropertyImage[]) => void;
}

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export default function PropertyImageManager({
  initialImages = [],
  propertyTitle = "",
  onChange,
}: PropertyImageManagerProps) {
  const [images, setImages] = useState<ManagedPropertyImage[]>(initialImages);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const syncImages = (nextImages: ManagedPropertyImage[]) => {
    setImages(nextImages);
    onChange(nextImages);
  };

  const handleFileSelection = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setUploadError(null);
    const files = Array.from(fileList);

    // Client-side validation before requesting signatures
    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError(
          `"${file.name}" is not a supported format. Please upload JPEG, PNG, WebP, or AVIF images.`,
        );
        e.target.value = "";
        return;
      }
      if (file.size > MAX_BYTES) {
        setUploadError(`"${file.name}" exceeds the 8 MB maximum file size.`);
        e.target.value = "";
        return;
      }
    }

    setUploadingCount((prev) => prev + files.length);
    const uploadedBatch: ManagedPropertyImage[] = [];

    for (const file of files) {
      try {
        // 1. Request authenticated upload signature from server
        const signRes = await fetch("/api/admin/cloudinary/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
          }),
        });

        const signData = await signRes.json();
        if (!signRes.ok) {
          throw new Error(
            signData.error || "Failed to authorize image upload.",
          );
        }

        // 2. Upload directly to Cloudinary using signed parameters
        const cloudForm = new FormData();
        cloudForm.append("file", file);
        cloudForm.append("api_key", signData.apiKey);
        cloudForm.append("timestamp", String(signData.timestamp));
        cloudForm.append("signature", signData.signature);
        cloudForm.append("folder", signData.folder);

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${encodeURIComponent(signData.cloudName)}/image/upload`,
          {
            method: "POST",
            body: cloudForm,
          },
        );

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.secure_url || !uploadData.public_id) {
          throw new Error(
            uploadData.error?.message || `Failed to upload "${file.name}".`,
          );
        }

        const cleanBaseName = file.name
          .replace(/\.[^/.]+$/, "")
          .replace(/[-_]+/g, " ");
        uploadedBatch.push({
          cloudinaryId: uploadData.public_id,
          url: uploadData.secure_url,
          altText: propertyTitle
            ? `${propertyTitle} - ${cleanBaseName}`
            : cleanBaseName,
          isNewUpload: true,
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : `Upload failed for ${file.name}.`;
        setUploadError(message);
      } finally {
        setUploadingCount((prev) => Math.max(0, prev - 1));
      }
    }

    if (uploadedBatch.length > 0) {
      syncImages([...images, ...uploadedBatch]);
    }

    e.target.value = "";
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0 || index < 0 || index >= images.length) return;
    const copy = [...images];
    const [selected] = copy.splice(index, 1);
    copy.unshift(selected);
    syncImages(copy);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    syncImages(copy);
  };

  const handleAltChange = (index: number, value: string) => {
    const copy = [...images];
    copy[index] = { ...copy[index], altText: value };
    syncImages(copy);
  };

  const handleRemove = async (index: number) => {
    const target = images[index];
    if (!target) return;

    setUploadError(null);

    // If this image was newly uploaded in this session (not yet saved to MySQL),
    // clean it up immediately from Cloudinary so no orphan remains.
    if (target.isNewUpload && !target.id) {
      setRemovingId(target.cloudinaryId);
      try {
        const res = await fetch("/api/admin/cloudinary/sign", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cloudinaryId: target.cloudinaryId }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(
            data.error || "Failed to delete uploaded image from Cloudinary.",
          );
        }
      } catch (err: unknown) {
        const msg =
          err instanceof Error
            ? err.message
            : "Could not remove newly uploaded image.";
        setUploadError(msg);
        setRemovingId(null);
        return;
      } finally {
        setRemovingId(null);
      }
    }

    // For existing persisted images (target.id exists), we remove from the staged list;
    // actual DB + Cloudinary deletion occurs safely when Update Property is submitted.
    const next = images.filter((_, idx) => idx !== index);
    syncImages(next);
  };

  return (
    <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
        <div>
          <h3 className="text-base font-bold text-navy-900">Property Images</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload JPEG, PNG, WebP, or AVIF images (max 8 MB each). The first
            image (#1) is the primary thumbnail.
          </p>
        </div>

        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            multiple
            onChange={handleFileSelection}
            disabled={uploadingCount > 0}
            className="hidden"
          />
          <button
            type="button"
            disabled={uploadingCount > 0}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs sm:text-sm transition-colors shadow-xs cursor-pointer disabled:opacity-50 w-full sm:w-auto"
          >
            {uploadingCount > 0 ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading ({uploadingCount})...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Images</span>
              </>
            )}
          </button>
        </div>
      </div>

      {uploadError && (
        <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <p>{uploadError}</p>
        </div>
      )}

      {images.length === 0 ? (
        <div
          onClick={() => uploadingCount === 0 && fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-gold-500 rounded-xl p-8 text-center bg-slate-50/50 transition-colors cursor-pointer"
        >
          <ImagePlus className="w-9 h-9 mx-auto mb-2 text-slate-400" />
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            Click to select one or multiple property photos
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            PNG, JPG, WebP, or AVIF up to 8 MB per image
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((img, index) => {
            const isPrimary = index === 0;
            const isRemoving = removingId === img.cloudinaryId;

            return (
              <div
                key={`${img.cloudinaryId}-${index}`}
                className={`rounded-xl border p-3.5 space-y-3 transition-all ${
                  isPrimary
                    ? "border-gold-500 bg-amber-50/20 shadow-xs"
                    : "border-slate-200 bg-slate-50/40"
                }`}
              >
                {/* Preview Image */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-200 border border-slate-200">
                  <img
                    src={img.url}
                    alt={img.altText || `Property image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-navy-900/90 text-white text-[11px] font-bold">
                      #{index + 1}
                    </span>
                    {isPrimary && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gold-500 text-navy-950 text-[11px] font-extrabold shadow-xs">
                        <Star className="w-3 h-3 fill-navy-950" />
                        Primary
                      </span>
                    )}
                    {img.isNewUpload && (
                      <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                        New
                      </span>
                    )}
                  </div>
                </div>

                {/* Alt Text Input */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Alt Text (SEO & Accessibility)
                  </label>
                  <input
                    type="text"
                    value={img.altText}
                    onChange={(e) => handleAltChange(index, e.target.value)}
                    placeholder="Describe this photo (e.g. Living room view)"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                {/* Ordering, Primary & Remove Controls */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/80">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      title="Move earlier"
                      className="p-1.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => handleMove(index, "down")}
                      title="Move later"
                      className="p-1.5 rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>

                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(index)}
                        className="ml-1 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-gold-500/60 bg-amber-50 hover:bg-amber-100 text-navy-900 text-[11px] font-bold cursor-pointer"
                      >
                        <Star className="w-3 h-3 text-gold-600" />
                        <span>Set Primary</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isRemoving}
                    onClick={() => handleRemove(index)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[11px] font-bold cursor-pointer disabled:opacity-50"
                  >
                    {isRemoving ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
