import { Link } from "react-router-dom";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Building2,
  Image as ImageIcon,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Loader2,
  RefreshCw,
  SearchX,
  Home,
} from "lucide-react";
import api from "../lib/axios";
import { fetchSavedProperties } from "../lib/services/auth.service";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const EASE = [0.22, 1, 0.36, 1];
const LIMIT = 12;

const naira = (amount) =>
  `₦${Number(amount || 0).toLocaleString("en-NG")}`;

const LOCATIONS = [
  "All Locations",
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
];
const PROPERTY_TYPES = [
  "All Types",
  "Multi-Family",
  "Single-Family",
  "Duplex",
  "Commercial",
];
const PRICE_RANGES = ["All Prices", "Under ₦5M", "₦5M - ₦10M", "Above ₦10M"];

const normalize = (value) => String(value ?? "").trim().toLocaleLowerCase();
const normalizeLocation = (value) => {
  const location = normalize(value).replace(/\s+state$/, "");
  return ["fct", "abuja", "federal capital territory"].includes(location)
    ? "fct"
    : location;
};

function getPropertyPrice(property) {
  const value =
    property.rent ??
    property.target ??
    property.targetRent ??
    property.price;
  const parsed = Number(String(value ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function matchesPriceRange(price, range) {
  if (range === "All Prices") return true;
  if (price === null) return false;
  if (range === "Under ₦5M") return price < 5_000_000;
  if (range === "₦5M - ₦10M") {
    return price >= 5_000_000 && price <= 10_000_000;
  }
  return price > 10_000_000;
}

function FilterSelect({ label, value, options, onChange }) {
  return (
    <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-600">
      <span>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border-0 bg-[#F0E8D5]/30 px-3 py-3 text-sm text-slate-800 focus:ring-2 focus:ring-[#004741]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

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


function PropertyCard({ property, index, isSaved }) {
  const name = property.name || property.propertyName;
  const type = property.type || property.propertyType;
  const city = property.city;
  const state = property.state;
  const description = property.description || "";
  const rent =
    property.rent ?? property.target ?? property.targetRent ?? property.price ?? 0;
    // const rent = Number(rawRent)
  const units =
    property.availableUnits ?? property.totalUnit ?? property.units ?? 0;
  const images = property.propertyImages || property.photos || [];
  const firstImage = images[0];
  const cover =
    typeof firstImage === "string"
      ? firstImage
      : firstImage?.imageUrl || firstImage?.url || null;
  const photoCount = images.length;
  const propertyId = property.propertyId || property.id || property._id;



  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index % LIMIT, 8) * 0.06,
        duration: 0.55,
        ease: EASE,
      }}
    >
      <Link
        to={`/properties/${propertyId}`}
        className="group block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-16px_rgba(0,71,65,0.18)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {cover ? (
            <img
              src={cover}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-300">
              <Home className="h-10 w-10" />
              <span className="text-xs font-medium">No photo yet</span>
            </div>
          )}
          <span
            className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-bold capitalize backdrop-blur ${TYPES[type?.toLowerCase()] || TYPES.default}`}
          >
            {type || "Property"}
          </span>
          {isSaved && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[#004741] px-3 py-1.5 text-xs font-bold text-white shadow-md">
              <Bookmark className="h-3.5 w-3.5 fill-current" />
              Saved
            </span>
          )}
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
            {name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[#F59E0B]" />
            <span className="truncate">
              {city}, {state}
            </span>
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Building2 className="h-3.5 w-3.5" />
            {units} units available
          </p>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
            {description}
          </p>
          <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
            <div>
              <p className="text-lg font-extrabold tabular-nums tracking-tight text-[#004741]">
               ₦ {rent}
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedType, setSelectedType] = useState("All Types");
  const [priceRange, setPriceRange] = useState("All Prices");
  const [sortBy, setSortBy] = useState("default");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: savedProperties = [] } = useQuery({
    queryKey: ["saved-properties"],
    queryFn: fetchSavedProperties,
    retry: false,
  });
  const savedPropertyIds = new Set(
    savedProperties.map((property) => property.propertyId),
  );

  const {
    data,
    error,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["properties"],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const response = await api.get("/property/fetchProperties", {
        params: {
          limit: LIMIT,
          offset: pageParam,
        },
      });
      return response.data;
    },
    getNextPageParam: (lastPage, pages) =>
      lastPage.properties.length < LIMIT
        ? undefined
        : pages.reduce((count, page) => count + page.properties.length, 0),
  });

  

  const rawProperties =
    data?.pages.flatMap((page) => page.properties || []) || [];
  const normalizedSearch = normalize(searchQuery);
  const filteredProperties = rawProperties.filter((property) => {
    const state = normalizeLocation(property.state);
    const selectedState = normalizeLocation(selectedLocation);
    const matchesLocation =
      selectedLocation === "All Locations" || state === selectedState;
    const matchesType =
      selectedType === "All Types" ||
      normalize(property.propertyType ?? property.type) ===
        normalize(selectedType);
    const searchableLocation = normalize(
      `${property.city || ""} ${property.state || ""}`,
    );
    const matchesSearch =
      !normalizedSearch || searchableLocation.includes(normalizedSearch);

    return (
      matchesLocation &&
      matchesType &&
      matchesSearch &&
      matchesPriceRange(getPropertyPrice(property), priceRange)
    );
  });
  const properties = [...filteredProperties];
  if (sortBy !== "default") {
    properties.sort((left, right) => {
      const leftPrice = getPropertyPrice(left);
      const rightPrice = getPropertyPrice(right);
      if (leftPrice === null) return rightPrice === null ? 0 : 1;
      if (rightPrice === null) return -1;
      return sortBy === "low-high"
        ? leftPrice - rightPrice
        : rightPrice - leftPrice;
    });
  }
  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    selectedLocation !== "All Locations" ||
    selectedType !== "All Types" ||
    priceRange !== "All Prices";
  const noProperties = !isLoading && !error && rawProperties.length === 0;
  const noMatches = !isLoading && !error && properties.length === 0;

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLocation("All Locations");
    setSelectedType("All Types");
    setPriceRange("All Prices");
    setSortBy("default");
  };
  return (
    <div className="min-h-screen bg-[#f7f5f0] pb-20">
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2.5">
            {/* <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#004741]">
              <Home className="h-4.5 w-4.5 text-[#F59E0B]" strokeWidth={2.5} />
            </span> */}
            <span className="text-2xl font-extrabold tracking-tighter text-[#0C3530]">
              Univora<span className="text-[#F59E0B]"> Homes</span>
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
                className="absolute -bottom-1 left-0 h-2 w-full origin-left rounded-full bg-[#F59E0B]"
              />
            </span>
          </h1>
          <p className="mt-4 max-w-xl text-slate-500">
            Browse verified properties across Nigeria — transparent pricing,
            real photos, no agent wahala.
          </p>
        </motion.div>

        <div className="w-full max-w-7xl mx-auto px-6 py-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#004741]/10 shadow-lg shadow-[#004741]/5"
      >
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#111827]/40">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            aria-label="Search by state or city"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by state or city..."
            className="w-full pl-10 pr-4 py-3 bg-[#F0E8D5]/30 rounded-xl text-sm font-medium text-[#111827] placeholder-[#111827]/40 focus:outline-none focus:ring-2 focus:ring-[#004741] transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden lg:flex items-end gap-2">
            <FilterSelect
              label="Location"
              value={selectedLocation}
              options={LOCATIONS}
              onChange={setSelectedLocation}
            />
            <FilterSelect
              label="Property type"
              value={selectedType}
              options={PROPERTY_TYPES}
              onChange={setSelectedType}
            />
            <FilterSelect
              label="Price range"
              value={priceRange}
              options={PRICE_RANGES}
              onChange={setPriceRange}
            />
          </div>

          <motion.button
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            aria-expanded={isFilterOpen}
            aria-controls="mobile-property-filters"
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-[#F0E8D5]/50 text-[#004741] rounded-xl text-xs font-bold cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v4.172a1 1 0 01-1.447.894l-4-2A1 1 0 017 16.172v-4.172a1 1 0 00-.293-.707L.293 7.293A1 1 0 010 6.586V4z" />
            </svg>
            Filters
          </motion.button>

          <div className="flex items-center gap-2 bg-[#004741]/5 rounded-xl px-3 py-1.5 flex-1 sm:flex-initial">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#004741]/60 whitespace-nowrap">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-xs font-bold text-[#004741] focus:ring-0 cursor-pointer pr-4"
            >
              <option value="default">Featured</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            id="mobile-property-filters"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden lg:hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 bg-white p-4 rounded-2xl border border-[#004741]/10 shadow-md">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#111827]/50 mb-1">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-[#F0E8D5]/30 text-xs font-semibold text-[#111827] rounded-xl px-3 py-2.5 border-none focus:ring-2 focus:ring-[#004741]"
                >
                  {LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#111827]/50 mb-1">Property Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-[#F0E8D5]/30 text-xs font-semibold text-[#111827] rounded-xl px-3 py-2.5 border-none focus:ring-2 focus:ring-[#004741]"
                >
                  {PROPERTY_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-[#111827]/50 mb-1">Price Range</label>
                <select
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="w-full bg-[#F0E8D5]/30 text-xs font-semibold text-[#111827] rounded-xl px-3 py-2.5 border-none focus:ring-2 focus:ring-[#004741]"
                >
                  {PRICE_RANGES.map((range) => (
                    <option key={range} value={range}>{range}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-sm text-slate-500" aria-live="polite">
          Showing {properties.length} of {rawProperties.length} loaded{" "}
          {rawProperties.length === 1 ? "property" : "properties"}
        </p>
        <button
          type="button"
          onClick={clearFilters}
          disabled={!hasActiveFilters && sortBy === "default"}
          className="text-sm font-semibold text-[#004741] underline-offset-4 hover:underline disabled:cursor-not-allowed disabled:opacity-40"
        >
          Clear filters
        </button>
      </div>
    </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
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
              <h3 className="font-bold text-slate-900">
                Couldn't load properties
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Check your connection and try again.
              </p>
            </div>
            <motion.button
              onClick={() => refetch()}
              disabled={isFetching}
              whileHover={{ scale: isFetching ? 1 : 1.04 }}
              whileTap={{ scale: isFetching ? 1 : 0.96 }}
              className="flex items-center gap-2 rounded-xl bg-[#004741] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#004741]/25 disabled:cursor-wait disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />
              {isFetching ? "Retrying..." : "Retry"}
            </motion.button>
          </motion.div>
        ) : noProperties ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 rounded-3xl border border-slate-100 bg-white py-20 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Home className="h-7 w-7 text-slate-400" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900">
                No properties listed yet.
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                New homes go up every day — check back soon.
              </p>
            </div>
            <Link
              to="/signup"
              className="mt-1 text-sm font-bold text-[#004741] underline-offset-4 hover:underline"
            >
              Are you a landlord? List your property free
            </Link>
          </motion.div>
        ) : noMatches ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 rounded-3xl border border-slate-100 bg-white py-16 text-center"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <SearchX className="h-7 w-7 text-slate-400" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900">
                No properties match these filters
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or clearing the filters.
              </p>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl bg-[#004741] px-5 py-3 text-sm font-bold text-white"
            >
              Clear filters
            </button>
            {hasNextPage && (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-xl border border-[#004741]/25 px-5 py-3 text-sm font-bold text-[#004741] disabled:opacity-60"
              >
                {isFetchingNextPage
                  ? "Loading more..."
                  : "Load more to search"}
              </button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              { 
              properties.map((p, i) => (
                <PropertyCard
                  key={p.propertyId || p.id || p._id}
                  property={p}
                  index={i}
                  isSaved={savedPropertyIds.has(p.propertyId || p.id || p._id)}
                />
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
                  You've seen all {properties.length}{" "}
                  {properties.length === 1 ? "property" : "properties"}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
