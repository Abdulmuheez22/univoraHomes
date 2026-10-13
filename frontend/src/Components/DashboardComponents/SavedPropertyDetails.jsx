import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
} from "lucide-react";
import api from "../../lib/axios";
import { unSaveProperty } from "../../lib/services/auth.service";

const formatNaira = (amount) => `₦${Number(amount || 0).toLocaleString("en-NG")}`;

export default function SavedPropertyDetails({ propertyId, onBack }) {
  const queryClient = useQueryClient();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    data: property,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["saved-property", propertyId],
    queryFn: async () => {
      const response = await api.get(
        `/property/fetchProperties/${propertyId}`,
      );
      return response.data.property;
    },
    enabled: Boolean(propertyId),
    retry: false,
  });

  const unsaveMutation = useMutation({
    mutationFn: unSaveProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-properties"] });
      onBack?.();
    },
  });

  const images = property?.propertyImages || [];
  const rent = property?.target ?? property?.targetRent;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-8">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#004741] transition hover:bg-[#004741]/5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to saved properties
        </button>
        <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
          Univora Homes listing
        </span>
      </div>


      {isLoading ? (
        <div className="grid animate-pulse gap-8 p-5 lg:grid-cols-2 lg:p-8">
          <div className="aspect-[4/3] rounded-2xl bg-slate-100" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 rounded bg-slate-100" />
            <div className="h-4 w-1/2 rounded bg-slate-100" />
            <div className="h-28 rounded bg-slate-100" />
          </div>
        </div>
      ) : isError || !property ? (
        <div className="px-6 py-16 text-center">
          <p className="font-semibold text-red-700">
            We couldn't load this property.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="rounded-xl bg-[#004741] px-4 py-2 text-sm font-bold text-white disabled:opacity-60"
            >
              {isFetching ? "Retrying..." : "Try again"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
            >
              Back to saved properties
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 p-5 lg:grid-cols-[1.15fr_0.85fr] lg:p-8">
          <div>
            <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
              {images.length ? (
                <img
                  src={images[activeImageIndex]}
                  alt={property.propertyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-slate-400">
                  <Building2 className="h-12 w-12" />
                  <span className="text-sm font-medium">
                    No photos available
                  </span>
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="Previous property photo"
                    onClick={() =>
                      setActiveImageIndex(
                        (index) => (index - 1 + images.length) % images.length,
                      )
                    }
                    className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Next property photo"
                    onClick={() =>
                      setActiveImageIndex(
                        (index) => (index + 1) % images.length,
                      )
                    }
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                      index === activeImageIndex
                        ? "border-[#004741]"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${property.propertyName} photo ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#004741]/10 px-3 py-1 text-xs font-bold text-[#004741]">
                {property.propertyCategory ||
                  property.propertyType ||
                  "Uncategorized"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {property.propertyType}
              </span>
            </div>
            <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
              {property.propertyName}
            </h2>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin className="h-4 w-4" />
              {property.propertyAddress
                ? `${property.propertyAddress}, `
                : ""}
              {property.city}, {property.state}
            </p>

            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/60 p-4">
              <p className="text-sm text-slate-500">Rent per year</p>
              <p className="mt-1 text-2xl font-extrabold text-[#004741]">
                {formatNaira(rent)}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => unsaveMutation.mutate(propertyId)}
                disabled={unsaveMutation.isPending}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#004741]/20 px-4 text-sm font-bold text-[#004741] transition hover:bg-[#004741]/5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {unsaveMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bookmark className="h-4 w-4 fill-current" />
                )}
                {unsaveMutation.isPending
                  ? "Removing..."
                  : "Remove from saved"}
              </button>
            </div>

            {unsaveMutation.isError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                Could not update saved properties. Please try again.
              </p>
            )}

            <section className="mt-6">
              <h3 className="text-sm font-bold text-slate-900">
                About this property
              </h3>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-slate-600">
                {property.description ||
                  "No description has been provided."}
              </p>
            </section>
          </div>
        </div>
      )}
    </section>
  );
}
