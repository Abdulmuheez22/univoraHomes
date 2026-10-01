import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  MapPin, Building2, Image as ImageIcon, ArrowRight,
  ArrowUpRight, Loader2, RefreshCw, SearchX, Home,
} from "lucide-react";
import { fetchProperties } from "../services/propertyService";

const EASE = [0.22, 1, 0.36, 1];
const LIMIT = 12;

const naira = (n) => "₦" + Number(n).toLocaleString("en-NG");

const TYPES = {
  flat: "bg-[#004741]/10 text-[#004741]",
  duplex: "bg-[#F59E0B]/15 text-amber-700",
  "self-contained": "bg-teal-100 text-teal-700",
  default: "bg-slate-100 text-slate-600",
};

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-slate-100" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-3/4 animate-pulse rounded-full bg-slate-100" />
        <div className="h-5 w-1/3 animate-pulse rounded-full bg-slate-100" />
      </div>
    </div>
  );
}

function PropertyCard({ property, index }) {
  const cover = property.photos?.[0]?.url || property.photos?.[0] || null;
  const photoCount = property.photos?.length || 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index % LIMIT, 8) * 0.06, duration: 0.55, ease: EASE }}
    >
      <Link
        to={`/properties/${property.id}`}
        className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-16px_rgba(0,71,65,0.18)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {cover ? (
            <img
              src={cover}
              alt={property.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-300">
              <Home className="h-10 w-10" />
              <span className="text-xs font-medium">No photo yet</span>
            </div>
          )}
          <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold capitalize backdrop-blur ${TYPES[property.type] || TYPES.default}`}>
            {property.type || "Property"}
          </span>
          {photoCount > 1 && (
            <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
              <ImageIcon className="h-3 w-3" />
              {photoCount}
            </span>
          )}
          <span className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#F59E0B] text-[#004741] opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
          </span>
        </div>
        <div className="p-5">
          <h3 className="truncate text-base font-bold text-slate-900 transition-colors duration-300 group-hover:text-[#004741]">
            {property.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[#F59E0B]" />
            <span className="truncate">{property.city}, {property.state}</span>
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Building2 className="h-3.5 w-3.5" />
            {property.availableUnits ?? property.units ?? 0} units available
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
            {property.description}
          </p>
          <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-lg font-extrabold tabular-nums tracking-tight text-[#004741]">
                {naira(property.rent || property.price || 0)}
              </p>
              <p className="text-[11px] text-slate-400">per year</p>
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-[#004741] transition-transform duration-300 group-hover:translate-x-1">
              View <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Properties() {
  const {
    data,
    error,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["properties"],
    queryFn: ({ pageParam = 0 }) => fetchProperties({ limit: LIMIT, offset: pageParam }),
    getNextPageParam: (lastPage, pages) => {
      const items = Array.isArray(lastPage) ? lastPage : lastPage.properties || [];
      if (items.length < LIMIT) return undefined;
      return pages.reduce((sum, p) => sum + (Array.isArray(p) ? p.length : (p.properties || []).length), 0);
    },
  });

  const properties = data?.pages.flatMap((p) => (Array.isArray(p) ? p : p.properties || [])) || [];
  const empty = !isLoading && !error && properties.length === 0;

  return (
    <div className="min-h-screen bg-[#f7f5f0] pb-20">
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#004741]">
              <Home className="h-4.5 w-4.5 text-[#F59E0B]" strokeWidth={2.5} />
            </span>
            <span className="text-lg font-extrabold text-slate-900">
              Univora<span className="text-[#004741]"> Homes</span>
            </span>
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-[#004741] px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#003530]"
          >
            Get Started
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 pt-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-10"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Find your{" "}
            <span className="relative inline-block text-[#004741]">
              next home
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
                className="absolute -bottom-1 left-0 h-2 w-full origin-left rounded-full bg-amber-400/50"
              />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-slate-500">
            Browse verified properties across Nigeria — transparent pricing, real photos, no agent wahala.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 rounded-3xl border border-slate-100 bg-white py-20 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
              <SearchX className="h-7 w-7 text-red-500" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900">Couldn't load properties</h3>
              <p className="mt-1 text-sm text-slate-500">Check your connection and try again.</p>
            </div>
            <motion.button
              onClick={() => refetch()}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 rounded-xl bg-[#004741] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#004741]/25"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </motion.button>
          </motion.div>
        ) : empty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 rounded-3xl border border-slate-100 bg-white py-20 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Home className="h-7 w-7 text-slate-400" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900">No properties listed yet.</h3>
              <p className="mt-1 text-sm text-slate-500">New homes go up every day — check back soon.</p>
            </div>
            <Link
              to="/signup"
              className="mt-1 text-sm font-bold text-[#004741] underline-offset-4 hover:underline"
            >
              Are you a landlord? List your property free
            </Link>
          </motion.div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {properties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              {hasNextPage ? (
                <motion.button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  whileHover={{ scale: isFetchingNextPage ? 1 : 1.03 }}
                  whileTap={{ scale: isFetchingNextPage ? 1 : 0.97 }}
                  className="flex items-center gap-2 rounded-xl border border-[#004741]/25 bg-white px-8 py-3.5 text-sm font-bold text-[#004741] transition-all hover:border-[#004741] hover:bg-[#004741] hover:text-white disabled:cursor-wait disabled:opacity-60"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more...
                    </>
                  ) : (
                    "Load more properties"
                  )}
                </motion.button>
              ) : (
                <p className="text-sm font-medium text-slate-400">
                  You've seen all {properties.length} {properties.length === 1 ? "property" : "properties"}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}