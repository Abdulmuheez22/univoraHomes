import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Building2,
  CheckCircle2,
  LayoutDashboard,
  Users,
  LogOut,
  Bell,
  Bookmark,
  Plus,
  ChevronRight,
  CircleUserRound,
  X,
  ArrowUpRight,
  Loader2,
  MessageCircle,
  Phone,
  MapPin,
  Menu,
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";
import LoadingState from "../loadingState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchSavedProperties,
  fetchUserProfile,
  unSaveProperty,
  landLordProperties,
  fetchLandlordTenant,
  fetchLandlordConnectionRequests,
  respondToConnectionRequest,
} from "../../lib/services/auth.service";
import ProfileModal from "./ProfileModal";
import SignOutConfirmation from "./SignOutConfirmation";
import RoleSwitchButton from "./RoleSwitchButton";
import SavedPropertyDetails from "./SavedPropertyDetails";

const EASE = [0.22, 1, 0.36, 1];
const MOBILE_TAB_LABELS = [
  "Overview",
  "Properties",
  "Connection Requests",
  "Tenants",
  "Profile",
];

const naira = (n) => "₦" + n.toLocaleString("en-NG");

const toWhatsAppNumber = (number) => {
  const digits = String(number).replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  return digits;
};

function useCountUp(target, start, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value;
}

function StatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [hovered, setHovered] = useState(false);
  const value = useCountUp(stat.value, inView);
  const Icon = stat.icon;
  const displayValue = stat.isLoading
    ? "..."
    : stat.isError
      ? "—"
      : value.toLocaleString();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.07, duration: 0.6, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative cursor-default overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]"
    >
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(240px circle at 80% 0%, ${stat.accent}0d, transparent 70%)`,
        }}
      />
      <div className="relative flex items-center">
        <motion.span
          animate={
            hovered ? { rotate: -8, scale: 1.1 } : { rotate: 0, scale: 1 }
          }
          transition={{ type: "spring", stiffness: 320, damping: 15 }}
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ background: `${stat.accent}14`, color: stat.accent }}
        >
          <Icon className="h-5 w-5" />
        </motion.span>
      </div>
      <p className="relative mt-4 text-2xl font-extrabold tabular-nums tracking-tight text-slate-900">
        {displayValue}
      </p>
      <p className="relative mt-0.5 text-xs font-medium text-slate-500">
        {stat.label}
      </p>
    </motion.div>
  );
}

function LandlordOverview({
  name,
  properties,
  propertiesLoading,
  propertiesError,
  onRetryProperties,
  pendingRequests,
  requestsLoading,
  requestsError,
  onRetryRequests,
  tenants,
  tenantsLoading,
  tenantsError,
  responding,
  onRespond,
  onNavigate,
}) {
  const stats = [
    {
      label: "My Properties",
      value: properties?.length ?? 0,
      icon: Building2,
      accent: "#004741",
      isLoading: propertiesLoading,
      isError: propertiesError,
    },
    {
      label: "Pending Requests",
      value: pendingRequests.length,
      icon: Bell,
      accent: "#0F766E",
      isLoading: requestsLoading,
      isError: requestsError,
    },
    {
      label: "Connected Tenants",
      value: tenants.length,
      icon: Users,
      accent: "#F59E0B",
      isLoading: tenantsLoading,
      isError: tenantsError,
    },
  ];

  return (
    <>
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#00332F] via-[#004741] to-[#0F766E] p-5 text-white shadow-lg shadow-[#004741]/15 sm:p-7 lg:p-8">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#F59E0B]/15 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/55">
              Landlord workspace
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Welcome back{name ? `, ${name.split(" ")[0]}` : ""}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
              Keep your listings and tenant connection requests moving from one
              place.
            </p>
          </div>
          <Link
            to="/addproperty"
            className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-3 text-sm font-bold text-[#00332F] shadow-md transition hover:bg-amber-300 sm:w-auto"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add property
          </Link>
        </div>
      </section>

      <section aria-label="Landlord account summary" className="grid gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map((stat, index) => (
          <StatCard key={stat.label} stat={stat} index={index} />
        ))}
      </section>

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900">Recent properties</h3>
              <p className="mt-1 text-xs text-slate-500">
                Your latest listings at a glance.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("Properties")}
              className="shrink-0 text-xs font-bold text-[#004741] hover:underline"
            >
              View all
            </button>
          </div>

          {propertiesLoading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading properties...
            </p>
          ) : propertiesError ? (
            <div className="py-8 text-center">
              <p className="text-sm text-red-600">Couldn't load properties.</p>
              <button
                type="button"
                onClick={onRetryProperties}
                className="mt-2 text-sm font-semibold text-[#004741] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : properties.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">
              <Building2 className="mx-auto h-8 w-8 text-[#004741]/60" />
              <p className="mt-3 font-semibold text-slate-800">
                No properties listed yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Add a listing to start connecting with tenants.
              </p>
              <Link
                to="/addproperty"
                className="mt-4 inline-flex rounded-lg bg-[#004741] px-4 py-2.5 text-sm font-bold text-white"
              >
                Add your first property
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {properties.slice(0, 3).map((property) => (
                <Link
                  key={property.propertyId}
                  to={`/landlord/properties/${property.propertyId}`}
                  className="flex min-w-0 items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  {property.propertyImages?.[0] ? (
                    <img
                      src={property.propertyImages[0]}
                      alt=""
                      className="h-14 w-16 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="flex h-14 w-16 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#004741]">
                      <Building2 className="h-5 w-5" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-900">
                      {property.propertyName}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500">
                      {property.propertyType} · {property.city}, {property.state}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)] sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900">Tenant requests</h3>
              <p className="mt-1 text-xs text-slate-500">
                Review people interested in your listings.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("Connection Requests")}
              className="shrink-0 text-xs font-bold text-[#004741] hover:underline"
            >
              View all
            </button>
          </div>

          {requestsLoading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading requests...
            </p>
          ) : requestsError ? (
            <div className="py-8 text-center">
              <p className="text-sm text-red-600">Couldn't load requests.</p>
              <button
                type="button"
                onClick={onRetryRequests}
                className="mt-2 text-sm font-semibold text-[#004741] hover:underline"
              >
                Try again
              </button>
            </div>
          ) : pendingRequests.length === 0 ? (
            <div className="rounded-xl bg-slate-50 px-4 py-8 text-center">
              <CheckCircle2 className="mx-auto h-8 w-8 text-[#0F766E]" />
              <p className="mt-3 font-semibold text-slate-800">
                You're all caught up
              </p>
              <p className="mt-1 text-sm text-slate-500">
                New tenant requests will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.slice(0, 3).map((request) => {
                const isResponding =
                  responding.isPending &&
                  responding.variables?.requestId === request.requestId;
                return (
                  <article
                    key={request.requestId}
                    className="rounded-xl border border-slate-100 p-3"
                  >
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {request.tenantName || "Tenant"}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          Interested in {request.propertyName || "your property"}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                        Pending
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onRespond({ requestId: request.requestId, status: "Accepted" })
                        }
                        disabled={isResponding}
                        className="rounded-lg bg-[#004741] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#00332F] disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onRespond({ requestId: request.requestId, status: "Declined" })
                        }
                        disabled={isResponding}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-red-200 hover:text-red-600 disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const colors = ["#004741", "#0F766E", "#F59E0B", "#7C3AED"];
  const color = colors[name.length % colors.length];
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
      style={{ background: color }}
    >
      {initials}
    </span>
  );
}



export default function LandlordDashboard() {
  // const [landLordProperties, setLandLordProperties] = useState({})
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const runPopulateDashboard = async () => {
      try {
        const response = await api.get("/dashboard/populateDashboard");
        // console.log(response.data.userData);
        setUserData(response.data.userData);
      } catch (error) {
        console.error("Unable to load landlord dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };
    runPopulateDashboard();
  }, []);

  const [sidebar, setSidebar] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [selectedSavedPropertyId, setSelectedSavedPropertyId] =
    useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [dismissedNotifications, setDismissedNotifications] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
  });
  const {
    data: savedProperties = [],
    isLoading: isSavedPropertiesLoading,
    isError: isSavedPropertiesError,
    refetch: refetchSavedProperties,
  } = useQuery({
    queryKey: ["saved-properties"],
    queryFn: fetchSavedProperties,
  });

  const {
    data: landLordPropertiesData,
    isLoading: landLordPropertiesIsLoading,
    isError: landLordPropertiesIsError,
    refetch: refetchLandLordProperties,
  } = useQuery({
    queryKey: ["landlord-properties"],
    queryFn: landLordProperties,
  });
  const {
    data: connectionRequests = [],
    isLoading: areConnectionRequestsLoading,
    isError: areConnectionRequestsError,
    refetch: refetchConnectionRequests,
  } = useQuery({
    queryKey: ["landlord-connection-requests"],
    queryFn: fetchLandlordConnectionRequests,
  });
  const {
    data: landlordTenants = [],
    isLoading: areLandlordTenantsLoading,
    isError: areLandlordTenantsError,
    refetch: refetchLandlordTenants,
  } = useQuery({
    queryKey: ["landlord-tenants"],
    queryFn: fetchLandlordTenant,
  });

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const connectionNotifications = (connectionRequests || []).filter(
    (request) =>
      ["accepted", "declined"].includes(String(request.requestStatus || "").toLowerCase()) &&
      !dismissedNotifications.includes(request.requestId),
  );

  const removeNotification = (requestId) => {
    setDismissedNotifications((prev) => [...prev, requestId]);
  };

  // console.log("landLordPropertiesData: ", landLordPropertiesData)
  const removeSavedProperty = useMutation({
    mutationFn: unSaveProperty,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["saved-properties"] }),
    onError: () => notify("Couldn't remove saved property. Please try again."),
  });

  const respondToRequest = useMutation({
    mutationFn: respondToConnectionRequest,
    onSuccess: (data, variables) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["landlord-connection-requests"],
        }),
        variables.status === "Accepted"
          ? queryClient.invalidateQueries({ queryKey: ["landlord-tenants"] })
          : Promise.resolve(),
      ])
        .then(() => notify(data?.message || "Connection request updated.")),
    onError: () =>
      notify("Couldn't update connection request. Please try again."),
  });

  const pendingConnectionRequests = (connectionRequests || []).filter(
    (request) => String(request.requestStatus || "").toLowerCase() === "pending",
  );

  const NAV = [
    { icon: LayoutDashboard, label: "Overview" },
    { icon: Building2, label: "Properties" },
    {
      icon: Bell,
      label: "Connection Requests",
      badge: pendingConnectionRequests.length || null,
    },
    {
      icon: Bell,
      label: "Notifications",
      badge: connectionNotifications.length || null,
    },
    { icon: Users, label: "Tenants" },
    {
      icon: Bookmark,
      label: "Saved Properties",
      badge: savedProperties.length || null,
    },
    // { icon: FileText, label: "Documents", active: false },
    { icon: CircleUserRound, label: "Profile", active: false },
  ];

  const activateNav = (label) => {
    setActiveNav(label);
    setMobileNavOpen(false);
    if (label === "Profile") setIsProfileOpen(true);
  };

  const shortTabLabel = (label) =>
    label === "Connection Requests" ? "Requests" : label;

  useEffect(() => {
    if (!mobileNavOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileNavOpen]);

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingState />}</AnimatePresence>
      <AnimatePresence>
        {mobileNavOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 z-50 bg-[#00332F]/65 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Landlord navigation"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: EASE }}
              className="fixed inset-y-0 left-0 z-60 flex w-[min(20rem,88vw)] flex-col overflow-hidden bg-linear-to-b from-[#00332F] via-[#004741] to-[#002825] py-6 shadow-2xl md:hidden"
            >
              <div className="mb-7 flex items-center justify-between px-5">
                <Link
                  to="/"
                  onClick={() => setMobileNavOpen(false)}
                  className="text-lg font-extrabold text-white"
                >
                  Univora<span className="text-[#F59E0B]"> Homes</span>
                </Link>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {/* <div className="mx-4 mb-5 rounded-2xl border border-white/10 bg-white/[0.07] p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-100/70">
                  Landlord workspace
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-white">
                  {profile?.userName || userData.userName || "Welcome"}
                </p>
              </div> */}
              <nav className="flex-1 space-y-1 overflow-y-auto px-3">
                {NAV.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.label;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => activateNav(item.label)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-semibold transition ${
                        isActive
                          ? "bg-[#F59E0B] text-[#004741] shadow-lg shadow-black/10"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge ? (
                        <span
                          className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                            isActive
                              ? "bg-[#004741] text-white"
                              : "bg-white/15 text-white"
                          }`}
                        >
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
              <div className="px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-3">
                <RoleSwitchButton
                  currentRole={profile?.userRole || userData.role}
                  expanded
                  onSwitch={() => setMobileNavOpen(false)}
                />
                <button
                  type="button"
                  onClick={() => {
                    setMobileNavOpen(false);
                    setIsSignOutOpen(true);
                  }}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  Sign out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <div className="flex min-h-dvh overflow-x-clip bg-[#f7f5f0]">
        <motion.aside
          animate={{ width: sidebar ? 240 : 76 }}
          transition={{ duration: 0.35, ease: EASE }}
          onMouseEnter={() => setSidebar(true)}
          onMouseLeave={() => setSidebar(false)}
          className="sticky top-0 z-40 hidden h-screen flex-col bg-[#00332F] py-6 md:flex"
        >
          <Link to="/">
            <div className="mb-8 flex items-center gap-3 px-5">
              {/* <motion.span 
                whileHover={{ rotate: 12, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]"
              >
                <Home className="h-5 w-5 text-[#004741]" strokeWidth={2.5} />
              </motion.span> */}
              <AnimatePresence>
                {sidebar && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.2 }}
                    className="whitespace-nowrap text-lg font-extrabold text-white"
                  >
                    Univora<span className="text-[#F59E0B]"> Homes</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Link>
          <nav className="flex-1 space-y-1 px-3">
            {NAV.map((n) => (
              <motion.button
                key={n.label}
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  activateNav(n.label);
                }}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                  activeNav === n.label
                    ? "bg-[#F59E0B] text-[#004741]"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <n.icon className="h-5 w-5 flex-shrink-0" />
                <AnimatePresence>
                  {sidebar && (
                    <motion.span
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 whitespace-nowrap text-left"
                    >
                      {n.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {n.badge && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      activeNav === n.label
                        ? "bg-[#004741] text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {n.badge}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </nav>
          <div className="px-3">
            <RoleSwitchButton
              currentRole={profile?.userRole || userData.role}
              expanded={sidebar}
            />
            <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}>
              <button
                type="button"
                onClick={() => setIsSignOutOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white cursor-pointer"
              >
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {sidebar && <span>Sign out</span>}
              </button>
            </motion.div>
          </div>
        </motion.aside>
        
        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-slate-100 bg-white/85 px-3 backdrop-blur-xl sm:px-5 lg:px-8">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileNavOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-[#004741] hover:text-[#004741] md:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="hidden text-[11px] font-medium text-slate-400 sm:block">
                Good morning,
              </p>
              <h1 className="truncate text-sm font-bold text-slate-900 sm:-mt-0.5">
                {profile?.userName || userData.userName}
              </h1>
              {profile?.userEmail && (
                <p className="hidden truncate text-[10px] text-slate-400 lg:block">
                  {profile.userEmail}
                </p>
              )}
              {isProfileLoading && (
                <p className="hidden text-[10px] text-slate-400 sm:block">
                  Loading profile...
                </p>
              )}
              {isProfileError && (
                <p className="hidden text-[10px] text-red-600 sm:block">
                  Profile unavailable
                </p>
              )}
            </div>
            <div className="ml-auto flex shrink-0 items-center gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => activateNav("Notifications")}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:text-[#004741] cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                {connectionNotifications.length > 0 && (
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-[#F59E0B] ring-2 ring-white"
                  />
                )}
              </motion.button>
              <motion.button
                type="button"
                aria-label="Open your profile"
                title="My profile"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setActiveNav("Profile");
                  setIsProfileOpen(true);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004741] text-xs font-bold text-white shadow-md shadow-[#004741]/20"
              >
                {(profile?.userName || userData.userName || "U")
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </motion.button>
            </div>
          </header>

          <main
            className="space-y-5 px-3 pb-28 pt-5 sm:space-y-6 sm:px-5 sm:pb-28 md:p-8"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeNav}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="space-y-6"
              >
            {activeNav === "Overview" && (
              <LandlordOverview
                name={profile?.userName || userData.userName}
                properties={landLordPropertiesData?.properties || []}
                propertiesLoading={landLordPropertiesIsLoading}
                propertiesError={landLordPropertiesIsError}
                onRetryProperties={refetchLandLordProperties}
                pendingRequests={pendingConnectionRequests}
                requestsLoading={areConnectionRequestsLoading}
                requestsError={areConnectionRequestsError}
                onRetryRequests={refetchConnectionRequests}
                tenants={landlordTenants}
                tenantsLoading={areLandlordTenantsLoading}
                tenantsError={areLandlordTenantsError}
                responding={respondToRequest}
                onRespond={(variables) => respondToRequest.mutate(variables)}
                onNavigate={activateNav}
              />
            )}

            {activeNav === "Properties" && (
            <section
              id="landlord-properties"
              className="scroll-mt-20 rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">My Properties</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Properties listed under your account.
                  </p>
                </div>
                <Building2 className="h-5 w-5 text-[#004741]" />
              </div>
              {landLordPropertiesIsLoading ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Loading your properties...
                </p>
              ) : landLordPropertiesIsError ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-red-600">
                    Couldn't load your properties.
                  </p>
                  <button
                    type="button"
                    onClick={() => refetchLandLordProperties()}
                    className="mt-2 text-sm font-semibold text-[#004741] hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : landLordPropertiesData?.properties?.length === 0 ? (
                <div className="rounded-xl bg-slate-50 px-5 py-10 text-center">
                  <p className="font-semibold text-slate-700">
                    You haven't listed any properties yet
                  </p>
                  <Link
                    to="/addproperty"
                    className="mt-4 inline-flex rounded-xl bg-[#004741] px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Add your first property
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {landLordPropertiesData?.properties?.map((property) => (
                    <Link
                      key={property.propertyId}
                      to={`/landlord/properties/${property.propertyId}`}
                      className="group block overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 transition hover:border-[#004741]/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#004741] focus-visible:ring-offset-2"
                    >
                      <article>
                        {property.propertyImages?.[0] ? (
                          <img
                            src={property.propertyImages[0]}
                            alt={property.propertyName}
                            className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-40 items-center justify-center bg-slate-100 text-sm text-slate-400">
                            No property photo
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-bold text-slate-900 group-hover:text-[#004741]">
                            {property.propertyName}
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            {property.propertyType} · {property.city},{" "}
                            {property.state}
                          </p>
                          <p className="mt-3 text-sm font-semibold text-slate-600">
                            Category:{" "}
                            {property.propertyCategory || "Uncategorized"}
                          </p>
                          <p className="mt-1 text-sm font-extrabold text-[#004741]">
                            ₦ {property.targetRent || 0}
                          </p>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </section>
            )}

            {activeNav === "Connection Requests" && (
              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      Connection Requests
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Pending tenant interest in your properties.
                    </p>
                  </div>
                  <Bell className="h-5 w-5 text-[#004741]" />
                </div>

                {areConnectionRequestsLoading ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    Loading connection requests...
                  </p>
                ) : areConnectionRequestsError ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-red-600">
                      Couldn't load connection requests.
                    </p>
                    <button
                      type="button"
                      onClick={() => refetchConnectionRequests()}
                      className="mt-2 text-sm font-semibold text-[#004741] hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : pendingConnectionRequests.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 px-5 py-10 text-center">
                    <p className="font-semibold text-slate-700">
                      No pending connection requests
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Accepted and declined requests move to notifications.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pendingConnectionRequests.map((request) => (
                      <article
                        key={request.requestId}
                        className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-100 p-4"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {request.tenantName || "Tenant"}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                            {request.tenantEmail && (
                              <a
                                href={`mailto:${request.tenantEmail}`}
                                className="hover:text-[#004741] hover:underline"
                              >
                                {request.tenantEmail}
                              </a>
                            )}
                          </div>
                          <p className="mt-3 text-sm text-slate-600">
                            Interested in{" "}
                            {request.propertyId ? (
                              <Link
                                to={`/properties/${request.propertyId}`}
                                className="font-semibold text-[#004741] hover:underline"
                              >
                                {request.propertyName || "a property"}
                              </Link>
                            ) : (
                              <span className="font-semibold">
                                {request.propertyName || "a property"}
                              </span>
                            )}
                          </p>
                          {(request.propertyAddress ||
                            request.city ||
                            request.state) && (
                            <p className="mt-1 text-xs text-slate-500">
                              {[
                                request.propertyAddress,
                                request.city,
                                request.state,
                              ]
                                .filter(Boolean)
                                .join(", ")}
                            </p>
                          )}
                        </div>
                        {(() => {
                          const isResponding =
                            respondToRequest.isPending &&
                            respondToRequest.variables?.requestId === request.requestId;

                          return (
                            <div className="flex shrink-0 items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  respondToRequest.mutate({
                                    requestId: request.requestId,
                                    status: "Accepted",
                                  })
                                }
                                disabled={isResponding}
                                className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#004741] to-[#0F766E] px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_-6px_rgba(0,71,65,0.65)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-6px_rgba(0,71,65,0.8)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isResponding ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                                )}
                                Accept
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  respondToRequest.mutate({
                                    requestId: request.requestId,
                                    status: "Declined",
                                  })
                                }
                                disabled={isResponding}
                                className="group flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-600 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-300 hover:bg-rose-100 hover:shadow-[0_10px_22px_-8px_rgba(225,29,72,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {isResponding ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                                )}
                                Decline
                              </button>
                            </div>
                          );
                        })()}
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeNav === "Notifications" && (
              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">Notifications</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Recent accepted and declined connection requests.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#004741]/10 px-3 py-1 text-xs font-bold text-[#004741]">
                    {connectionNotifications.length} new
                  </span>
                </div>

                {connectionNotifications.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 px-5 py-10 text-center">
                    <p className="font-semibold text-slate-700">No notifications yet</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Accepted and declined requests will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {connectionNotifications.map((request) => (
                      <article
                        key={request.requestId}
                        className={`flex flex-wrap items-start justify-between gap-4 rounded-xl border p-4 ${
                          request.requestStatus?.toLowerCase() === "accepted"
                            ? "border-emerald-200 bg-emerald-50/60"
                            : "border-rose-200 bg-rose-50/60"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                                request.requestStatus?.toLowerCase() === "accepted"
                                  ? "bg-emerald-600 text-white"
                                  : "bg-rose-600 text-white"
                              }`}
                            >
                              {request.requestStatus}
                            </span>
                            <p className="font-semibold text-slate-900">
                              {request.tenantName || "Tenant"}
                            </p>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            {request.requestStatus?.toLowerCase() === "accepted"
                              ? "Accepted request to view"
                              : "Declined request to view"}{" "}
                            <span className="font-semibold text-slate-800">
                              {request.propertyName || "this property"}
                            </span>
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {[
                              request.propertyAddress,
                              request.city,
                              request.state,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeNotification(request.requestId)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-rose-200 hover:text-rose-600"
                          aria-label="Remove notification"
                          title="Remove notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeNav === "Saved Properties" && (
            <section
              id="saved-properties"
              className="scroll-mt-20 rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900">Saved Properties</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Properties you bookmarked while browsing.
                  </p>
                </div>
                <Bookmark className="h-5 w-5 text-[#F59E0B]" />
              </div>

              {selectedSavedPropertyId ? (
                <SavedPropertyDetails
                  propertyId={selectedSavedPropertyId}
                  onBack={() => setSelectedSavedPropertyId(null)}
                />
              ) : isSavedPropertiesLoading ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Loading saved properties...
                </p>
              ) : isSavedPropertiesError ? (
                <div className="py-8 text-center">
                  <p className="text-sm text-red-600">
                    Couldn't load saved properties.
                  </p>
                  <button
                    type="button"
                    onClick={() => refetchSavedProperties()}
                    className="mt-2 text-sm font-semibold text-[#004741] hover:underline"
                  >
                    Try again
                  </button>
                </div>
              ) : savedProperties.length === 0 ? (
                <div className="rounded-xl bg-slate-50 px-5 py-10 text-center">
                  <p className="font-semibold text-slate-700">
                    No saved properties yet
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Bookmark a property while browsing to find it here.
                  </p>
                  <Link
                    to="/properties"
                    className="mt-4 inline-flex rounded-xl bg-[#004741] px-4 py-2.5 text-sm font-bold text-white"
                  >
                    Browse properties
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {savedProperties.map((property) => (
                    <article
                      key={property.propertyId}
                      className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedSavedPropertyId(property.propertyId)
                        }
                        className="block w-full cursor-pointer text-left"
                      >
                        {property.propertyImages?.[0] ? (
                          <img
                            src={property.propertyImages[0]}
                            alt={property.propertyName}
                            className="h-40 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-40 items-center justify-center bg-slate-100 text-sm text-slate-400">
                            No property photo
                          </div>
                        )}
                      </button>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedSavedPropertyId(property.propertyId)
                              }
                              className="text-left font-bold text-slate-900 hover:text-[#004741]"
                            >
                              {property.propertyName}
                            </button>
                            <p className="mt-1 text-xs text-slate-500">
                              {property.propertyCategory || "Uncategorized"} ·{" "}
                              {property.propertyType} · {property.city},{" "}
                              {property.state}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${property.propertyName} from saved properties`}
                            onClick={() =>
                              removeSavedProperty.mutate(property.propertyId)
                            }
                            disabled={removeSavedProperty.isPending}
                            className="rounded-lg p-2 text-[#F59E0B] hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Bookmark className="h-4 w-4 fill-current" />
                          </button>
                        </div>
                        <p className="mt-3 text-sm font-extrabold text-[#004741]">
                          {naira(Number(property.targetRent || 0))}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedSavedPropertyId(property.propertyId)
                          }
                          className="mt-3 inline-flex cursor-pointer items-center gap-1 text-xs font-bold text-[#004741] hover:underline"
                        >
                          View details <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
            )}

            {activeNav === "Tenants" && (
              <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-slate-900">My Tenants</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Tenants with accepted connection requests.
                    </p>
                  </div>
                  <span className="rounded-full bg-[#004741]/10 px-3 py-1 text-xs font-bold text-[#004741]">
                    {landlordTenants.length}
                  </span>
                </div>

                {areLandlordTenantsLoading ? (
                  <p className="py-8 text-center text-sm text-slate-500">
                    Loading tenants...
                  </p>
                ) : areLandlordTenantsError ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-red-600">
                      Couldn't load your tenants.
                    </p>
                    <button
                      type="button"
                      onClick={() => refetchLandlordTenants()}
                      className="mt-2 text-sm font-semibold text-[#004741] hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : landlordTenants.length === 0 ? (
                  <div className="rounded-xl bg-slate-50 px-5 py-10 text-center">
                    <Users className="mx-auto h-10 w-10 text-[#004741]" />
                    <p className="mt-3 font-semibold text-slate-700">
                      No tenants yet
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Tenants will appear here after you accept their connection requests.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {landlordTenants.map((record, index) => (
                      <article
                        key={`${record.tenant?.tenantEmail || "tenant"}-${record.property?.propertyName || index}`}
                        className="rounded-xl border border-slate-100 p-4"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar name={record.tenant?.tenantName || "Tenant"} />
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold text-slate-900">
                              {record.tenant?.tenantName || "Tenant"}
                            </h3>
                            {record.tenant?.tenantEmail && (
                              <a
                                href={`mailto:${record.tenant.tenantEmail}`}
                                className="mt-1 block truncate text-sm text-slate-500 hover:text-[#004741] hover:underline"
                              >
                                {record.tenant.tenantEmail}
                              </a>
                            )}
                            {record.tenant?.tenantNumber && (
                              <p className="mt-1 text-sm text-slate-500">
                                {record.tenant.tenantNumber}
                              </p>
                            )}
                            {(record.tenant?.tenantCity ||
                              record.tenant?.tenantState) && (
                              <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                {[record.tenant.tenantCity, record.tenant.tenantState]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                        {record.tenant?.tenantNumber && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <a
                              href={`https://wa.me/${toWhatsAppNumber(record.tenant.tenantNumber)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                            >
                              <MessageCircle className="h-4 w-4" />
                              WhatsApp
                            </a>
                            <a
                              href={`tel:${record.tenant.tenantNumber}`}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-[#004741] hover:text-[#004741]"
                            >
                              <Phone className="h-4 w-4" />
                              Call
                            </a>
                          </div>
                        )}
                        <div className="mt-4 border-t border-slate-100 pt-3">
                          <p className="font-semibold text-slate-800">
                            {record.property?.propertyName || "Property"}
                          </p>
                          {(record.property?.propertyCategory ||
                            record.property?.propertyType) && (
                            <p className="mt-1 text-xs text-slate-500">
                              {record.property.propertyCategory ||
                                record.property.propertyType}
                            </p>
                          )}
                          {record.property?.propertyAddress && (
                            <p className="mt-1 text-sm text-slate-500">
                              {record.property.propertyAddress}
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeNav === "Profile" && (
              <section className="rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]">
                <h2 className="text-xl font-bold text-slate-900">Profile</h2>
                <p className="mt-2 text-sm text-slate-500">
                  View and update your account details.
                </p>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(true)}
                  className="mt-5 rounded-xl bg-[#004741] px-5 py-3 text-sm font-bold text-white"
                >
                  Open profile details
                </button>
              </section>
            )}
              </motion.div>
            </AnimatePresence>
          </main>
          <nav
            aria-label="Primary navigation"
            className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200/80 bg-white/95 px-2 pt-2 shadow-[0_-12px_35px_-24px_rgba(0,51,47,0.45)] backdrop-blur-xl pb-[max(env(safe-area-inset-bottom),0.5rem)] md:hidden"
          >
            <div className="mx-auto grid max-w-xl grid-cols-5 gap-1">
              {NAV.filter((item) =>
                MOBILE_TAB_LABELS.includes(item.label),
              ).map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.label;
                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => activateNav(item.label)}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition ${
                      isActive
                        ? "bg-[#004741]/[0.07] text-[#004741]"
                        : "text-slate-500 hover:text-[#004741]"
                    }`}
                  >
                    <span className="relative">
                      <Icon className="h-5 w-5" />
                      {item.badge ? (
                        <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#F59E0B] px-1 text-[9px] font-extrabold text-[#00332F]">
                          {item.badge}
                        </span>
                      ) : null}
                    </span>
                    <span className="max-w-full truncate">
                      {shortTabLabel(item.label)}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="landlord-mobile-nav-active"
                        className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-[#F59E0B]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-[#00332F] px-5 py-3.5 text-sm font-semibold text-white shadow-2xl"
            >
              <CheckCircle2 className="h-5 w-5 text-[#F59E0B]" />
              {toast}
              <motion.button 
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                onClick={() => setToast(null)}
                className="ml-1 text-white/50 hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
        <ProfileModal
          open={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          profile={profile}
          isLoading={isProfileLoading}
          isError={isProfileError}
        />
        <SignOutConfirmation
          open={isSignOutOpen}
          onClose={() => setIsSignOutOpen(false)}
        />
      </div>
    </>
  );
}