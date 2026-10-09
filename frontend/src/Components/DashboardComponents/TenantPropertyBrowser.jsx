import { useMemo, useState } from "react";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  ArrowLeft,
  Bookmark,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Heart,
  Loader2,
  MapPin,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../lib/axios";
import {
  connectionRequest,
  fetchSavedProperties,
  fetchTenantConnectionRequests,
  saveProperty,
  unSaveProperty,
} from "../../lib/services/auth.service";

const PAGE_SIZE = 12;

const formatNaira = (amount) =>
  `₦${(amount || 0).toLocaleString("en-NG")}`;

const propertyImage = (property) => {
  const image = property.propertyImages?.[0];
  return typeof image === "string" ? image : image?.imageUrl || image?.url;
};

export default function TenantPropertyBrowser() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All types");
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    data,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["properties"],
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const response = await api.get("/property/fetchProperties", {
        params: { limit: PAGE_SIZE, offset: pageParam },
      });
      return response.data;
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.properties.length < PAGE_SIZE
        ? undefined
        : pages.reduce((count, page) => count + page.properties.length, 0),
  });
  const { data: savedProperties = [] } = useQuery({
    queryKey: ["saved-properties"],
    queryFn: fetchSavedProperties,
    retry: false,
  });
  const { data: inquiries = [] } = useQuery({
    queryKey: ["tenant-connection-requests"],
    queryFn: fetchTenantConnectionRequests,
    retry: false,
  });
  const {
    data: selectedProperty,
    isLoading: isPropertyLoading,
    isError: isPropertyError,
    refetch: refetchSelectedProperty,
  } = useQuery({
    queryKey: ["property", selectedPropertyId],
    queryFn: async () => {
      const response = await api.get(
        `/property/fetchProperties/${selectedPropertyId}`,
      );
      return response.data.property;
    },
    enabled: Boolean(selectedPropertyId),
  });

  const properties = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    return (data?.pages.flatMap((page) => page.properties || []) || []).filter(
      (property) => {
        const type = property.propertyType || "Property";
        const searchable = [
          property.propertyName,
          type,
          property.propertyAddress,
          property.city,
          property.state,
        ]
          .filter(Boolean)
          .join(" ")
          .toLocaleLowerCase();
        return (
          (!normalizedSearch || searchable.includes(normalizedSearch)) &&
          (selectedType === "All types" || type === selectedType)
        );
      },
    );
  }, [data, search, selectedType]);

  const propertyTypes = useMemo(
    () => [
      "All types",
      ...new Set(
        (data?.pages.flatMap((page) => page.properties || []) || [])
          .map((property) => property.propertyType)
          .filter(Boolean),
      ),
    ],
    [data],
  );
  const savedPropertyIds = new Set(
    savedProperties.map((property) => property.propertyId),
  );
  const inquiryPropertyIds = new Set(
    inquiries.map((inquiry) => inquiry.propertyId).filter(Boolean),
  );

  const saveMutation = useMutation({
    mutationFn: saveProperty,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["saved-properties"] }),
  });
  const unsaveMutation = useMutation({
    mutationFn: unSaveProperty,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["saved-properties"] }),
  });
  const interestMutation = useMutation({
    mutationFn: connectionRequest,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["tenant-connection-requests"],
      }),
  });
  const closePropertyDetails = () => {
    setSelectedPropertyId(null);
    setActiveImageIndex(0);
  };

  if (selectedPropertyId) {
    const images = selectedProperty?.propertyImages || [];
    const hasInterest = inquiryPropertyIds.has(selectedPropertyId);
    const isSendingInterest =
      interestMutation.isPending &&
      interestMutation.variables === selectedPropertyId;
    const isSaved = savedPropertyIds.has(selectedPropertyId);

    return (
      <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_50px_-24px_rgba(0,51,47,0.22)]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={closePropertyDetails}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#004741] transition hover:bg-[#004741]/5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to homes
          </button>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            Univora Homes listing
          </span>
        </div>

        {isPropertyLoading ? (
          <div className="grid animate-pulse gap-8 p-5 lg:grid-cols-2 lg:p-8">
            <div className="aspect-[4/3] rounded-2xl bg-slate-100" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 rounded bg-slate-100" />
              <div className="h-4 w-1/2 rounded bg-slate-100" />
              <div className="h-28 rounded bg-slate-100" />
            </div>
          </div>
        ) : isPropertyError || !selectedProperty ? (
          <div className="px-6 py-16 text-center">
            <p className="font-semibold text-red-700">
              We couldn't load this property.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => refetchSelectedProperty()}
                className="rounded-xl bg-[#004741] px-4 py-2 text-sm font-bold text-white"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={closePropertyDetails}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600"
              >
                Back to homes
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
                    alt={selectedProperty.propertyName}
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
                          (activeImageIndex - 1 + images.length) % images.length,
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
                          (activeImageIndex + 1) % images.length,
                        )
                      }
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow transition hover:bg-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
                      {activeImageIndex + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      aria-label={`Show property photo ${index + 1}`}
                      onClick={() => setActiveImageIndex(index)}
                      className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                        index === activeImageIndex
                          ? "border-[#004741]"
                          : "border-transparent"
                      }`}
                    >
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
                  {selectedProperty.propertyType || "Property"}
                </span>
                <button
                  type="button"
                  aria-label="Close property details"
                  onClick={closePropertyDetails}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {selectedProperty.propertyName}
              </h2>
              <p className="mt-3 flex items-start gap-2 text-sm text-slate-500">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                {[
                  selectedProperty.propertyAddress,
                  selectedProperty.city,
                  selectedProperty.state,
                ]
                  .filter(Boolean)
                  .join(", ") || "Location not specified"}
              </p>
              <div className="mt-6 rounded-2xl bg-[#f7f5f0] p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Rent per year
                </p>
                <p className="mt-1 text-3xl font-extrabold text-[#004741]">
                  {formatNaira(selectedProperty.target)}
                </p>
                <p className="mt-3 text-sm font-medium text-slate-600">
                  {selectedProperty.totalUnit || 0} units available
                </p>
              </div>
              <div className="mt-6 flex-1">
                <h3 className="font-bold text-slate-900">About this home</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-600">
                  {selectedProperty.description ||
                    "No description has been provided for this property."}
                </p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  disabled={
                    hasInterest ||
                    isSendingInterest ||
                    interestMutation.isPending
                  }
                  onClick={() => interestMutation.mutate(selectedPropertyId)}
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition disabled:cursor-not-allowed ${
                    hasInterest
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-[#004741] text-white hover:bg-[#00332F] disabled:opacity-60"
                  }`}
                >
                  {isSendingInterest ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : hasInterest ? (
                    <CircleCheck className="h-4 w-4" />
                  ) : (
                    <Heart className="h-4 w-4" />
                  )}
                  {isSendingInterest
                    ? "Sending..."
                    : hasInterest
                      ? "Interest sent"
                      : "I'm interested"}
                </button>
                <button
                  type="button"
                  aria-pressed={isSaved}
                  disabled={saveMutation.isPending || unsaveMutation.isPending}
                  onClick={() =>
                    isSaved
                      ? unsaveMutation.mutate(selectedPropertyId)
                      : saveMutation.mutate({ propertyId: selectedPropertyId })
                  }
                  className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    isSaved
                      ? "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                      : "border-[#004741]/20 text-[#004741] hover:bg-[#004741]/5"
                  }`}
                >
                  {saveMutation.isPending || unsaveMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bookmark
                      className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                    />
                  )}
                  {saveMutation.isPending
                    ? "Saving..."
                    : unsaveMutation.isPending
                      ? "Removing..."
                      : isSaved
                        ? "Remove saved property"
                        : "Save property"}
                </button>
              </div>
              {interestMutation.isError &&
                interestMutation.variables === selectedPropertyId && (
                  <p role="alert" className="mt-3 text-sm text-red-600">
                    Could not send your interest. Please try again.
                  </p>
                )}
              {(saveMutation.isError || unsaveMutation.isError) && (
                <p role="alert" className="mt-3 text-sm text-red-600">
                  Could not update saved properties. Please try again.
                </p>
              )}
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_50px_-24px_rgba(0,51,47,0.22)]">
      <div className="relative overflow-hidden bg-[#00332F] px-6 py-8 text-white sm:px-8">
        <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border-[36px] border-white/5" />
        <div className="pointer-events-none absolute right-36 top-16 h-20 w-20 rounded-full bg-amber-400/10 blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-amber-200">
              <Sparkles className="h-3.5 w-3.5" />
              Your next chapter starts here
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Find a place to <span className="text-amber-400">call home.</span>
            </h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/65">
              Explore available properties, save the ones you love, and let
              landlords know when a place feels right.
            </p>
          </div>
          {/* <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
            <p className="text-xs font-medium text-white/55">Listings shown</p>
            <p className="mt-1 text-2xl font-extrabold">
              {data?.pages.reduce(
                (total, page) => total + page.properties.length,
                0,
              ) ?? "—"}
            </p>
          </div> */}
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by property, city, or state..."
              aria-label="Search properties"
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-[#004741] focus:bg-white focus:ring-4 focus:ring-[#004741]/10"
            />
          </label>
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            aria-label="Filter by property type"
            className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-[#004741] focus:ring-4 focus:ring-[#004741]/10"
          >
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-100"
              >
                <div className="aspect-[4/3] animate-pulse bg-slate-100" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-slate-100" />
                  <div className="h-8 w-full animate-pulse rounded bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl bg-red-50 px-6 py-12 text-center">
            <p className="font-semibold text-red-800">
              We couldn't load properties right now.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-3 text-sm font-bold text-[#004741] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-2xl bg-slate-50 px-6 py-14 text-center">
            <Search className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-3 font-bold text-slate-700">
              {search || selectedType !== "All types"
                ? "No homes match those filters"
                : "No properties are listed yet"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search or check back soon.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                {properties.length} {properties.length === 1 ? "home" : "homes"}
                {hasNextPage ? " on this page" : " to explore"}
              </p>
              {savedProperties.length > 0 && (
                <p className="flex items-center gap-1.5 text-xs font-semibold text-[#004741]">
                  <Heart className="h-3.5 w-3.5 fill-current text-rose-400" />
                  {savedProperties.length} saved
                </p>
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {properties.map((property, index) => {
                const isSaved = savedPropertyIds.has(property.propertyId);
                const hasInterest = inquiryPropertyIds.has(
                  property.propertyId,
                );
                const isSaving =
                  saveMutation.isPending || unsaveMutation.isPending;
                const isInterested =
                  interestMutation.isPending &&
                  interestMutation.variables === property.propertyId;
                const image = propertyImage(property);

                return (
                  <motion.article
                    key={property.propertyId}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index, 8) * 0.045 }}
                    className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_-18px_rgba(0,51,47,0.28)]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#f1f3ef]">
                      {image ? (
                        <img
                          src={image}
                          alt={property.propertyName}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                          <Building2 className="h-9 w-9" />
                          <span className="text-xs font-medium">
                            Photo coming soon
                          </span>
                        </div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-bold text-[#004741] shadow-sm backdrop-blur">
                        {property.propertyType || "Property"}
                      </span>
                      <button
                        type="button"
                        aria-label={
                          isSaved ? "Remove saved property" : "Save property"
                        }
                        aria-pressed={isSaved}
                        disabled={isSaving}
                        onClick={() =>
                          isSaved
                            ? unsaveMutation.mutate(property.propertyId)
                            : saveMutation.mutate({
                                propertyId: property.propertyId,
                              })
                        }
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-sm backdrop-blur transition hover:text-rose-500 disabled:opacity-50"
                      >
                        <Bookmark
                          className={`h-4 w-4 ${isSaved ? "fill-current text-rose-500" : ""}`}
                        />
                      </button>
                    </div>
                    <div className="p-5">
                      <h3 className="truncate text-base font-extrabold text-slate-900">
                        {property.propertyName}
                      </h3>
                      <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        <span className="truncate">
                          {[property.city, property.state]
                            .filter(Boolean)
                            .join(", ") || "Location not specified"}
                        </span>
                      </p>
                      <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-relaxed text-slate-500">
                        {property.description || "Ask the landlord for more details about this property."}
                      </p>
                      <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-lg font-extrabold tracking-tight text-[#004741]">
                           ₦ {property.target}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            per year · {property.totalUnit || 0} units
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPropertyId(property.propertyId);
                            setActiveImageIndex(0);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#004741] hover:underline"
                        >
                          Details <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={hasInterest || isInterested || interestMutation.isPending}
                        onClick={() => interestMutation.mutate(property.propertyId)}
                        className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold transition disabled:cursor-not-allowed ${
                          hasInterest
                            ? "bg-emerald-50 text-emerald-800"
                            : "bg-[#004741] text-white hover:bg-[#00332F] disabled:opacity-60"
                        }`}
                      >
                        {isInterested ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : hasInterest ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Heart className="h-4 w-4" />
                        )}
                        {isInterested
                          ? "Sending interest..."
                          : hasInterest
                            ? "Interest sent"
                            : "I'm interested"}
                      </button>
                      {interestMutation.isError &&
                        interestMutation.variables === property.propertyId && (
                          <p role="alert" className="mt-2 text-xs text-red-600">
                            Could not send your interest. Please try again.
                          </p>
                        )}
                      {(saveMutation.isError || unsaveMutation.isError) && (
                        <p role="alert" className="mt-2 text-xs text-red-600">
                          Could not update saved properties. Please try again.
                        </p>
                      )}
                    </div>
                  </motion.article>
                );
              })}
            </div>
            {hasNextPage && (
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="inline-flex h-12 items-center gap-2 rounded-xl border border-[#004741]/20 px-6 text-sm font-bold text-[#004741] transition hover:bg-[#004741]/5 disabled:opacity-60"
                >
                  {isFetchingNextPage && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {isFetchingNextPage ? "Loading more homes..." : "Show more homes"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
