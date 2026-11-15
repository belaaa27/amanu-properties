"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Maximize2,
  X,
} from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  altText: string;
}

export default function PropertyGallery({
  images,
  title,
}: {
  images: GalleryImage[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] w-full rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
        <Building2 className="w-12 h-12 text-navy-900/25 mb-2" />
        <p className="text-sm font-semibold text-slate-700">
          No Photographs Uploaded Yet
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Contact Amanuel to request additional visual details or arrange an
          on-site visit.
        </p>
      </div>
    );
  }

  const currentImage = images[activeIndex] || images[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3">
      {/* Main Display Frame */}
      <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-navy-950 border border-slate-200 shadow-xs group">
        <img
          src={currentImage.url}
          alt={currentImage.altText || title}
          className="w-full h-full object-cover"
        />

        {/* Counter & Fullscreen Trigger */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span className="px-3 py-1 rounded-md bg-navy-950/85 text-white text-xs font-semibold backdrop-blur-xs">
            Photo {activeIndex + 1} of {images.length}
          </span>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            aria-label="Expand photograph"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-navy-950/85 hover:bg-navy-900 text-gold-400 text-xs font-semibold backdrop-blur-xs cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Expand</span>
          </button>
        </div>

        {/* Prev / Next Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-navy-950/80 hover:bg-navy-900 text-white shadow-md transition-opacity cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-navy-950/80 hover:bg-navy-900 text-white shadow-md transition-opacity cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div
          role="list"
          aria-label="Property image thumbnails"
          className="grid grid-cols-4 sm:grid-cols-6 gap-2.5"
        >
          {images.map((img, idx) => {
            const selected = idx === activeIndex;
            return (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`View photo ${idx + 1}`}
                aria-current={selected ? "true" : undefined}
                className={`relative aspect-[16/10] rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                  selected
                    ? "border-gold-500 ring-2 ring-gold-500/30 opacity-100"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img.url}
                  alt={img.altText}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen property image viewer"
          className="fixed inset-0 z-50 bg-navy-950/95 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-6"
        >
          <div className="flex items-center justify-between text-white">
            <span className="text-xs sm:text-sm font-medium text-slate-300">
              {currentImage.altText} ({activeIndex + 1} / {images.length})
            </span>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close fullscreen viewer"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-4 min-h-0">
            <img
              src={currentImage.url}
              alt={currentImage.altText}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous image"
                  className="absolute left-2 sm:left-4 p-3 rounded-full bg-navy-900/90 text-white hover:bg-navy-800 cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next image"
                  className="absolute right-2 sm:right-4 p-3 rounded-full bg-navy-900/90 text-white hover:bg-navy-800 cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
