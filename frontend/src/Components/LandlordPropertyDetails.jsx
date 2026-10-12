import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Building2, Home, Loader2, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { landLordProperties } from "../lib/services/auth.service";
import LandlordPropertyActions from "./LandlordPropertyActions";

const formatNaira = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;

export default function LandlordPropertyDetails() {
  const { propertyId } = useParams();
  const {
    data,
    error,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["landlord-properties"],
    queryFn: landLordProperties,
  });

  const property = data?.properties?.find(
    (item) => item.propertyId === propertyId,
  );
  const isNotFound = !isLoading && !isError && !property;
  const images = property?.propertyImages || [];

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/dashboard"
          className="mb-6 mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#004741] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to your dashboard
        </Link>

        {isLoading ? (
          <div
            className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-3xl bg-white text-[#004741]"
            role="status"
          >
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="font-medium">Loading your property...</p>
          </div>
        ) : isError ? (
          <section className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-3xl bg-white p-8 text-center">
            <h1 className="text-xl font-bold text-slate-900">
              Couldn't load your property
            </h1>
            <p className="text-sm text-slate-500">
              {error?.response?.status === 401
                ? "Please sign in to view your landlord properties."
                : "Check your connection and try again."}
            </p>
            {error?.response?.status === 401 ? (
              <Link
                to="/signin"
                className="mt-2 rounded-xl bg-[#004741] px-5 py-3 text-sm font-bold text-white"
              >
                Go to sign in
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="mt-2 rounded-xl bg-[#004741] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"
              >
                {isFetching ? "Retrying..." : "Try again"}
              </button>
            )}
          </section>
        ) : isNotFound ? (
          <section className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-3xl bg-white p-8 text-center">
            <h1 className="text-xl font-bold text-slate-900">
              Property not found
            </h1>
            <p className="text-sm text-slate-500">
              This property isn't part of your landlord listings.
            </p>
          </section>
        ) : (
          <article className="overflow-hidden rounded-3xl bg-white shadow-sm">
            {images.length ? (
              <section
                aria-label="Property photos"
                className="grid gap-2 bg-white p-2 sm:grid-cols-2"
              >
                <img
                  src={images[0]}
                  alt={`${property.propertyName} main photo`}
                  className={`h-64 w-full rounded-2xl object-cover ${
                    images.length > 2
                      ? "sm:row-span-2 sm:h-full sm:min-h-96"
                      : "sm:h-64"
                  }`}
                />
                {images.slice(1).map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    alt={`${property.propertyName} photo ${index + 2}`}
                    className="hidden h-48 w-full rounded-2xl object-cover sm:block"
                  />
                ))}
                {images.length === 1 && (
                  <div className="hidden items-center justify-center rounded-2xl bg-slate-100 text-slate-400 sm:flex">
                    <Home className="h-10 w-10" />
                  </div>
                )}
              </section>
            ) : (
              <div className="flex h-64 flex-col items-center justify-center gap-3 bg-slate-100 text-slate-400 sm:h-96">
                <Home className="h-12 w-12" />
                <span>No photos available</span>
              </div>
            )}

            <div className="p-6 sm:p-10">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#004741]">
                    Landlord property workspace
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
                      {property.propertyName}
                    </h1>
                    <span className="rounded-full bg-[#004741]/10 px-3 py-1 text-xs font-bold capitalize text-[#004741]">
                      {property.propertyType || "Property"}
                    </span>
                  </div>
                </div>
                <LandlordPropertyActions property={property} />
              </div>

              <p className="mt-3 flex items-center gap-2 text-slate-500">
                <MapPin className="h-4 w-4 shrink-0 text-amber-500" />
                {[property.propertyAddress, property.city, property.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <section className="mt-8 grid gap-4 border-y border-slate-100 py-6 sm:grid-cols-3">
                <div>
                  <p className="text-sm text-slate-500">Target rent per year</p>
                  <p className="mt-1 text-2xl font-extrabold text-[#004741]">
                    {formatNaira(property.targetRent)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Property category</p>
                  <p className="mt-1 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <Building2 className="h-5 w-5 text-[#004741]" />
                    {property.propertyCategory || "Uncategorized"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Property type</p>
                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {property.propertyType || "Not specified"}
                  </p>
                </div>
              </section>

              <section className="mt-8">
                <h2 className="text-lg font-bold text-slate-900">
                  Property description
                </h2>
                <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                  {property.description || "No description has been added."}
                </p>
              </section>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
