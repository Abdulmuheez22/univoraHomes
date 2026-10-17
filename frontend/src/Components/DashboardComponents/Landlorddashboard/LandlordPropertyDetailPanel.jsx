import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Home,
  MapPin,
  ScrollText,
  Wallet,
} from "lucide-react";
import LandlordPropertyActions from "../../LandlordPropertyActions";

const EASE = [0.22, 1, 0.36, 1];

/* Rent is stored as plain digits, so any separators are dropped before the
   amount is formatted (matches the public listing and the add-property form). */
const formatNaira = (amount) =>
  `₦${Number(String(amount ?? "").replace(/[^\d]/g, "") || 0).toLocaleString("en-NG")}`;

const FACT_ROW = "rounded-2xl border border-slate-100 bg-slate-50/70 p-4";

/* Property detail rendered inside the landlord dashboard. It never links out to
   the public listing, so a landlord stays inside their workspace. */
export default function LandlordPropertyDetailPanel({
  property,
  onBack,
  onDeleted,
}) {
  const images = property?.propertyImages || [];
  const address = [property?.propertyAddress, property?.city, property?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
      className="space-y-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#004741] hover:text-[#004741]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my properties
        </button>
        <span className="rounded-full bg-[#004741]/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#004741]">
          Landlord workspace
        </span>
      </div>

      <article className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]">
        <section aria-label="Property photos" className="bg-slate-50 p-2">
          {images.length ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <img
                src={images[0]}
                alt={`${property.propertyName} main photo`}
                className="h-56 w-full rounded-xl object-cover sm:h-full sm:min-h-72"
              />
              {images.slice(1, 3).map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${property.propertyName} photo ${index + 2}`}
                  className="hidden h-40 w-full rounded-xl object-cover sm:block lg:h-[8.75rem]"
                />
              ))}
            </div>
          ) : (
            <div className="flex h-56 flex-col items-center justify-center gap-2 rounded-xl bg-slate-100 text-slate-400 sm:h-72">
              <Home className="h-10 w-10" />
              <span className="text-sm font-medium">No photos available</span>
            </div>
          )}
        </section>

        <div className="p-5 sm:p-7">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                  {property.propertyName}
                </h1>
                <span className="rounded-full bg-[#004741]/10 px-3 py-1 text-xs font-bold capitalize text-[#004741]">
                  {property.propertyType || "Property"}
                </span>
              </div>
              {address && (
                <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <MapPin className="h-4 w-4 shrink-0 text-amber-500" />
                  {address}
                </p>
              )}
            </div>
            <LandlordPropertyActions
              property={property}
              onDeleted={onDeleted}
            />
          </div>

          <div className="mt-6 grid gap-3 border-y border-slate-100 py-5 sm:grid-cols-3">
            <div className={FACT_ROW}>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Wallet className="h-4 w-4 text-[#0F766E]" />
                Target rent / year
              </p>
              <p className="mt-2 text-xl font-extrabold text-[#004741]">
                {formatNaira(property.targetRent)}
              </p>
            </div>
            <div className={FACT_ROW}>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Building2 className="h-4 w-4 text-[#0F766E]" />
                Property category
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {property.propertyCategory || "Uncategorized"}
              </p>
            </div>
            <div className={FACT_ROW}>
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <Home className="h-4 w-4 text-[#0F766E]" />
                Property type
              </p>
              <p className="mt-2 text-base font-bold text-slate-900">
                {property.propertyType || "Not specified"}
              </p>
            </div>
          </div>

          <section className="mt-6">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <ScrollText className="h-4 w-4 text-[#004741]" />
              Property description
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
              {property.description || "No description has been added."}
            </p>
          </section>
        </div>
      </article>
    </motion.div>
  );
}
