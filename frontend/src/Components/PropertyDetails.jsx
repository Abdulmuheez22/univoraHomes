import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Building2,
  CalendarCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Home,
  Link2,
  Loader2,
  MapPin,
  Share2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import api from "../lib/axios";
import { Bookmark } from "lucide-react";
import {
  connectionRequest,
  fetchSavedProperties,
  saveProperty,
  unSaveProperty,
} from "../lib/services/auth.service";

const formatNaira = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const queryClient = useQueryClient();
  const [galleryState, setGalleryState] = useState({
    propertyId,
    activeImageIndex: 0,
    failedImageIndexes: new Set(),
  });
  const [save, setSave] = useState(()=> localStorage.getItem(`saveStatus:${propertyId}`) === "true");
  const [copied, setCopied] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [requestedPropertyId, setRequestedPropertyId] = useState(null);
  const [connectionError, setConnectionError] = useState("");
  const gallery =
    galleryState.propertyId === propertyId
      ? galleryState
      : { propertyId, activeImageIndex: 0, failedImageIndexes: new Set() };
  const { activeImageIndex, failedImageIndexes } = gallery;
  const {
    data: property,
    error,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["property", propertyId],
    queryFn: async () => {
      const response = await api.get(`/property/fetchProperties/${propertyId}`);
      return response.data.property;
    },
    enabled: Boolean(propertyId),
  });
  const { data: savedProperties } = useQuery({
    queryKey: ["saved-properties"],
    queryFn: fetchSavedProperties,
    retry: false,
  });
  const isSaved =
    savedProperties?.some(
      (savedProperty) => savedProperty.propertyId === propertyId,
    ) ?? save;

  const images = (property?.propertyImages || [])
    .map((image) =>
      typeof image === "string" ? image : image?.imageUrl || image?.url,
    )
    .filter(Boolean);
  const propertyNotFound =
    error?.response?.status === 404 || (!isLoading && !isError && !property);

  const updateGallery = (update) => {
    setGalleryState((previous) => {
      const current =
        previous.propertyId === propertyId
          ? previous
          : { propertyId, activeImageIndex: 0, failedImageIndexes: new Set() };
      return { ...current, ...update(current), propertyId };
    });
  };

  const showImage = (index) => {
    updateGallery(() => ({
      activeImageIndex: (index + images.length) % images.length,
    }));
  };

  const markImageFailed = (index) => {
    updateGallery((current) => ({
      failedImageIndexes: new Set(current.failedImageIndexes).add(index),
    }));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked (e.g. non-HTTPS), ignore
    }
  };

  const shareProperty = async () => {
    if (!navigator.share) return copyLink(); // desktop fallback
    try {
      await navigator.share({
        title: property.propertyName,
        text: `Check out ${property.propertyName}`,
        url: window.location.href,
      });
    } catch {
      // user closed the share sheet; not a real error
    }
  };

  const {
    mutateAsync: sendConnectionRequest,
    isPending: isSendingConnectionRequest,
  } = useMutation({
    mutationFn: connectionRequest,
    onSuccess: () => setRequestedPropertyId(propertyId),
  });

  const requestProperty = async () => {
    if (isSendingConnectionRequest || requestedPropertyId === propertyId) return;
    setConnectionError("");

    if (!navigator.onLine) {
      setConnectionError("You're offline. Reconnect and try again.");
      return;
    }

    try {
      await sendConnectionRequest(propertyId);
    } catch (error) {
      if (!navigator.onLine || error?.code === "ERR_NETWORK") {
        setConnectionError("Network problem — your request wasn't sent.");
      } else if (error?.response?.status === 401) {
        setConnectionError("Please log in to express your interest.");
      } else {
        setConnectionError(
          error?.response?.data?.message ||
            "Couldn't send your request. Please try again.",
        );
      }
    }
  };

  const { mutateAsync: savePropertyMutation, isPending: isSaving } = useMutation({
    mutationFn: saveProperty,
    onSuccess: () => {
      queryClient.setQueryData(["saved-properties"], (previous = []) => [
        ...previous.filter((savedProperty) => savedProperty.propertyId !== propertyId),
        property,
      ]);
      queryClient.invalidateQueries({ queryKey: ["saved-properties"] });
    },
    onError: (error) => {
      console.log("Error saving property : ", error?.response?.data ?? error);
    },
  });

  const { mutateAsync: deleteUserMutation, isPending: isRemoving } = useMutation({
    mutationFn: unSaveProperty,
    onSuccess: () => {
      queryClient.setQueryData(["saved-properties"], (previous = []) =>
        previous.filter((savedProperty) => savedProperty.propertyId !== propertyId),
      );
      queryClient.invalidateQueries({ queryKey: ["saved-properties"] });
    },
  });

  const savefunction = async () => {
    if (isSaving || isRemoving) return;
    setSaveError("");

    if (!navigator.onLine) {
      setSaveError("You're offline. Reconnect and try again.");
      return;
    }

    const next = !isSaved;

    try {
      if (next) {
        await savePropertyMutation({ propertyId });
      } else {
        await deleteUserMutation(propertyId);
      }

      // Only persist locally once the server confirmed the change,
      // so local state can never drift from the backend.
      setSave(next);
      localStorage.setItem(`saveStatus:${propertyId}`, String(next));
    } catch (error) {
      if (!navigator.onLine || error?.code === "ERR_NETWORK") {
        setSaveError("Network problem — your save status wasn't changed.");
      } else if (error?.response?.status === 401) {
        setSaveError("Please log in to save properties.");
      } else {
        setSaveError("Couldn't update saved status. Please try again.");
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/properties"
          className="mb-6 inline-flex items-center gap-2 mt-5 text-sm font-semibold text-[#004741] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to properties
        </Link>

        {isLoading ? (
          <div
            className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-3xl bg-white text-[#004741]"
            role="status"
          >
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="font-medium">Loading property details...</p>
          </div>
        ) : isError && !propertyNotFound ? (
          <section className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-3xl bg-white p-8 text-center">
            <h1 className="text-xl font-bold text-slate-900">
              Couldn't load this property
            </h1>
            <p className="text-sm text-slate-500">
              Check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="mt-2 rounded-xl bg-[#004741] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
            >
              {isFetching ? "Retrying..." : "Try again"}
            </button>
          </section>
        ) : propertyNotFound ? (
          <section className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-3xl bg-white p-8 text-center">
            <h1 className="text-xl font-bold text-slate-900">
              Property not found
            </h1>
            <p className="text-sm text-slate-500">
              This property may have been removed or the link may be incorrect.
            </p>
          </section>
        ) : (
          <article className="overflow-hidden rounded-3xl bg-white shadow-sm">
            {images.length > 0 ? (
              <section aria-label="Property photos">
                <div className="group relative flex h-64 items-center justify-center overflow-hidden bg-slate-100 sm:h-112">
                  {failedImageIndexes.has(activeImageIndex) ? (
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Home className="h-12 w-12" />
                      <span>This photo could not be loaded</span>
                    </div>
                  ) : (
                    <img
                      src={images[activeImageIndex]}
                      alt={`${property.propertyName} photo ${activeImageIndex + 1} of ${images.length}`}
                      className="h-full w-full object-cover"
                      onError={() => markImageFailed(activeImageIndex)}
                    />
                  )}

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        aria-label="Show previous photo"
                        onClick={() =>
                          showImage(
                            (activeImageIndex - 1 + images.length) %
                              images.length,
                          )
                        }
                        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-100 transition hover:bg-black/70 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <ChevronLeft className="h-6 w-6" />
                      </button>
                      <button
                        type="button"
                        aria-label="Show next photo"
                        onClick={() =>
                          showImage((activeImageIndex + 1) % images.length)
                        }
                        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white opacity-100 transition hover:bg-black/70 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
                        {activeImageIndex + 1} / {images.length}
                      </span>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div
                    className="flex gap-3 overflow-x-auto p-4"
                    aria-label="Choose a property photo"
                  >
                    {images.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        aria-label={`Show photo ${index + 1}`}
                        aria-pressed={activeImageIndex === index}
                        onClick={() => showImage(index)}
                        className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 bg-slate-100 ${
                          activeImageIndex === index
                            ? "border-[#004741]"
                            : "border-transparent"
                        }`}
                      >
                        {failedImageIndexes.has(index) ? (
                          <span className="flex h-full items-center justify-center text-slate-400">
                            <Home className="h-6 w-6" />
                          </span>
                        ) : (
                          <img
                            src={image}
                            alt=""
                            className="h-full w-full object-cover"
                            onError={() => markImageFailed(index)}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <div className="flex h-64 w-full flex-col items-center justify-center gap-3 bg-slate-100 text-slate-400 sm:h-112">
                <Home className="h-12 w-12" />
                <span>No photos available</span>
              </div>
            )}

            <div className="p-6 sm:p-10">
              <span className="rounded-full bg-[#004741]/10 px-3 py-1 text-xs font-bold capitalize text-[#004741]">
                {property.propertyType || "Property"}
              </span>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                  {property.propertyName}
                </h1>
                {isSaved && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#004741]/10 px-3 py-1.5 text-xs font-bold text-[#004741]">
                    <Bookmark className="h-3.5 w-3.5 fill-current" />
                    Saved
                  </span>
                )}
              </div>

              <p className="mt-3 flex items-center gap-2 text-slate-500">
                <MapPin className="h-4 w-4 shrink-0 text-amber-500" />
                {[property.propertyAddress, property.city, property.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <div className="mt-8 grid gap-4 border-y border-slate-100 py-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">Rent per year</p>
                  <p className="mt-1 text-2xl font-extrabold text-[#004741]">
                    ₦ {property.target}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total units</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Building2 className="h-5 w-5 text-[#004741]" />
                    {property.totalUnit ?? 0} units
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={requestProperty}
                  disabled={
                    isSendingConnectionRequest ||
                    requestedPropertyId === propertyId
                  }
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-2xl bg-amber-500 px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSendingConnectionRequest ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CalendarCheck className="h-4 w-4" />
                  )}
                  {isSendingConnectionRequest
                    ? "Sending..."
                    : requestedPropertyId === propertyId
                      ? "Interest sent"
                      : "Interested"}
                </button>
                <button
                  type="button"
                  onClick={savefunction}
                  disabled={isSaving || isRemoving}
                  aria-pressed={isSaved}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-2xl border border-[#004741] px-5 text-sm font-bold text-[#004741] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Bookmark
                    className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`}
                  />
                  {isSaved ? "Saved" : "Save"}
                </button>
                <button
                  type="button"
                  onClick={copyLink}
                  className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-2xl border border-[#004741] px-5 text-sm font-bold text-[#004741]"
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Link2 className="h-4 w-4" />
                  )}
                  {copied ? "Copied!" : "Copy link"}
                </button>
              </div>

              {saveError && (
                <p
                  role="alert"
                  className="mt-3 text-sm font-semibold text-red-700"
                >
                  {saveError}
                </p>
              )}
              {connectionError && (
                <p
                  role="alert"
                  className="mt-3 text-sm font-semibold text-red-700"
                >
                  {connectionError}
                </p>
              )}
              {requestedPropertyId === propertyId && (
                <p
                  role="status"
                  className="mt-3 text-sm font-semibold text-[#004741]"
                >
                  Your interest has been sent to the landlord.
                </p>
              )}

              <section className="mt-7">
                <div className="flex justify-between align-middle">
                  <h2 className="text-lg font-bold text-slate-900">
                    About this property
                  </h2>
                </div>
                <p className="mt-3 whitespace-pre-line leading-relaxed text-slate-600">
                  {property.description || "No description has been provided."}
                </p>
              </section>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
