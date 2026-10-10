import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Building2,
  Layers,
  CheckCircle2,
  DoorOpen,
  LayoutDashboard,
  Users,
  Wrench,
  Settings,
  LogOut,
  Bell,
  Search,
  Bookmark,
  Plus,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Clock,
  CreditCard,
  X,
  ArrowUpRight,
  Loader2,
  MessageCircle,
  Phone,
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

const EASE = [0.22, 1, 0.36, 1];
const MotionLink = motion(Link);

const STATS = [
  {
    label: "Total Properties",
    value: 0,
    icon: Building2,
    accent: "#004741",
    delta: "+2",
    up: true,
  },
  {
    label: "Total Units",
    value: 0,
    icon: Layers,
    accent: "#0F766E",
    delta: "+4",
    up: true,
  },
  {
    label: "Occupied Units",
    value: 0,
    icon: CheckCircle2,
    accent: "#004741",
    delta: "86%",
    up: true,
    suffix: "",
  },
  {
    label: "Vacant Units",
    value: 0,
    icon: DoorOpen,
    accent: "#F59E0B",
    delta: "3 in Lekki",
    up: false,
  },
  // {
  //   label: "Rent Collected This Month",
  //   value: 1850000,
  //   icon: Wallet,
  //   accent: "#004741",
  //   money: true,
  //   delta: "+12.4%",
  //   up: true,
  // },
  // {
  //   label: "Overdue Payments",
  //   value: 3,
  //   icon: AlertCircle,
  //   accent: "#DC2626",
  //   delta: "-₦450k",
  //   up: false,
  // },
];

const PAYMENTS = [
  {
    tenant: "Adaeze Okonkwo",
    unit: "Flat 4B, Lekki Phase 1",
    amount: 450000,
    date: "Today, 9:41 AM",
    status: "Paid",
  },
  {
    tenant: "Ibrahim Musa",
    unit: "Unit 2, Yaba",
    amount: 320000,
    date: "Yesterday",
    status: "Paid",
  },
  {
    tenant: "Chinedu Eze",
    unit: "Duplex A, V.I",
    amount: 850000,
    date: "2 days ago",
    status: "Paid",
  },
  {
    tenant: "Blessing Adeyemi",
    unit: "Flat 1C, Ikeja",
    amount: 280000,
    date: "3 days ago",
    status: "Partial",
  },
  {
    tenant: "Tunde Balogun",
    unit: "Unit 5, Surulere",
    amount: 300000,
    date: "5 days ago",
    status: "Paid",
  },
];

const MAINTENANCE = [
  {
    title: "Leaking kitchen sink",
    unit: "Flat 4B, Lekki",
    priority: "High",
    time: "2h ago",
  },
  {
    title: "AC not cooling",
    unit: "Unit 2, Yaba",
    priority: "Medium",
    time: "5h ago",
  },
  {
    title: "Broken corridor light",
    unit: "Flat 1C, Ikeja",
    priority: "Low",
    time: "1d ago",
  },
  {
    title: "Water heater fault",
    unit: "Duplex A, V.I",
    priority: "High",
    time: "1d ago",
  },
];

const EXPIRING = [
  { tenant: "Ngozi Nwosu", unit: "Flat 2A, Lekki", days: 5, amount: 450000 },
  { tenant: "Emeka Obi", unit: "Unit 3, Yaba", days: 12, amount: 320000 },
  { tenant: "Fatima Bello", unit: "Flat 6D, Ikeja", days: 19, amount: 280000 },
  { tenant: "Kunle Alabi", unit: "Unit 1, Surulere", days: 27, amount: 300000 },
];

const CHART = [62, 78, 55, 91, 70, 100];

const ACTIONS = [
  {
    icon: Building2,
    label: "Add New Property",
    desc: "List a new building",
    color: "#004741",
  },
  {
    icon: Users,
    label: "Add Tenant",
    desc: "Onboard a tenant",
    color: "#0F766E",
  },
  {
    icon: CreditCard,
    label: "Record Payment",
    desc: "Log a rent payment",
    color: "#F59E0B",
  },
  {
    icon: Wrench,
    label: "All Maintenance",
    desc: "View every request",
    color: "#DC2626",
  },
];

const PRIORITY = {
  High: "bg-red-100 text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-slate-100 text-slate-500",
};

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
      <div className="relative flex items-start justify-between">
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
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${stat.up ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-500"}`}
        >
          {stat.up ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          {stat.delta}
        </span>
      </div>
      <p className="relative mt-4 text-2xl font-extrabold tabular-nums tracking-tight text-slate-900">
        {stat.money ? naira(value) : value.toLocaleString()}
      </p>
      <p className="relative mt-0.5 text-xs font-medium text-slate-500">
        {stat.label}
      </p>
    </motion.div>
  );
}

function ChartCard() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]"
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Rent Collection</h3>
          <p className="text-xs text-slate-400">Last 6 months</p>
        </div>
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
          +18% vs last month
        </span>
      </div>
      <div className="flex h-36 items-end gap-3 sm:gap-4">
        {CHART.map((h, i) => (
          <div
            key={i}
            className="group flex flex-1 flex-col items-center gap-2"
          >
            <motion.div
              initial={{ height: 0 }}
              animate={inView ? { height: `${h}%` } : {}}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.7, ease: EASE }}
              className={`relative w-full rounded-t-lg transition-colors duration-300 ${
                i === CHART.length - 1
                  ? "bg-gradient-to-t from-[#004741] to-[#0F766E]"
                  : "bg-slate-100 group-hover:bg-[#004741]/20"
              }`}
            >
              {i === CHART.length - 1 && (
                <motion.span
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#F59E0B] shadow-[0_0_12px_3px_rgba(245,158,11,0.5)]"
                />
              )}
            </motion.div>
            <span className="text-[11px] font-medium text-slate-400">
              {months[i]}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h3 className="font-bold text-slate-900">{title}</h3>
      <motion.button
        whileHover={{ x: 2 }}
        onClick={onAction}
        className="group flex items-center gap-1 text-xs font-semibold text-[#004741] hover:text-[#F59E0B] transition-colors cursor-pointer"
      >
        {action}
        <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </motion.button>
    </div>
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
      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
      style={{ background: color }}
    >
      {initials}
    </span>
  );
}

const STATUS = {
  Paid: "text-green-600",
  Partial: "text-amber-600",
};

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
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [toast, setToast] = useState(null);
  const [dismissedNotifications, setDismissedNotifications] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const mainRef = useRef(null);
  const inView = useInView(mainRef, { once: true, margin: "-40px" });
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

  const propertySummary = landLordPropertiesData?.summary;
  const dashboardStatValues = {
    "Total Properties": propertySummary?.totalProperties ?? 0,
    "Total Units": propertySummary?.totalUnits ?? 0,
    "Occupied Units": propertySummary?.occupiedUnits ?? 0,
    "Vacant Units": Math.max(
      (propertySummary?.totalUnits ?? 0) - (propertySummary?.occupiedUnits ?? 0),
      0,
    ),
  };
  const dashboardStats = STATS.map((stat) => ({
    ...stat,
    value: dashboardStatValues[stat.label] ?? stat.value,
  }));

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
    onSuccess: (data) =>
      queryClient
        .invalidateQueries({ queryKey: ["landlord-connection-requests"] })
        .then(() => notify(data?.message || "Connection request updated.")),
    onError: () =>
      notify("Couldn't update connection request. Please try again."),
  });

  const pendingConnectionRequests = (connectionRequests || []).filter(
    (request) => String(request.requestStatus || "").toLowerCase() === "pending",
  );

  const NAV = [
    { icon: LayoutDashboard, label: "Dashboard" },
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
    // { icon: Wrench, label: "Maintenance", badge: 4, active: false },
    // { icon: FileText, label: "Documents", active: false },
    { icon: Settings, label: "Profile", active: false },
  ];

  return (
    <>
      <AnimatePresence>{isLoading && <LoadingState />}</AnimatePresence>
      <div className="flex min-h-screen bg-[#f7f5f0]">
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
                  setActiveNav(n.label);
                  if (n.label === "Profile") {
                    setIsProfileOpen(true);
                  }
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
            <Link to="/">
            </Link>
          <div className="px-3">
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
        
        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-100 bg-white/80 px-5 backdrop-blur-md lg:px-8">
            <div>
              <p className="text-[11px] font-medium text-slate-400">
                Good morning,
              </p>
              <h1 className="-mt-0.5 text-sm font-bold text-slate-900">
                {profile?.userName || userData.userName}
              </h1>
              {profile?.userEmail && (
                <p className="text-[10px] text-slate-400">{profile.userEmail}</p>
              )}
              {isProfileLoading && (
                <p className="text-[10px] text-slate-400">Loading profile...</p>
              )}
              {isProfileError && (
                <p className="text-[10px] text-red-600">Profile unavailable</p>
              )}
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  placeholder="Search tenants, units..."
                  className="h-10 w-56 rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 text-sm outline-none transition-all duration-300 focus:border-[#004741] focus:bg-white focus:ring-4 focus:ring-[#004741]/10 lg:w-72"
                />
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveNav("Notifications")}
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

          <main ref={mainRef} className="space-y-6 p-5 lg:p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeNav}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="space-y-6"
              >
            {activeNav === "Dashboard" && (
              <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
                  Dashboard
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Here's what's happening across your portfolio today.
                </p>
              </div>
              <MotionLink
                to="/addproperty"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => notify("Add Property flow coming right up")}
                className="flex items-center gap-2 rounded-xl bg-[#004741] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#004741]/25"
              >
                <Plus className="h-4 w-4" strokeWidth={2.5} />
                Add New Property
              </MotionLink>
            </motion.div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
              {dashboardStats.map((s, i) => (
                <StatCard key={s.label} stat={s} index={i} />
              ))}
            </div>
              </>
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
                    <article
                      key={property.propertyId}
                      className="overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50"
                    >
                      <Link to={`/properties/${property.propertyId}`} className="block">
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
                      </Link>
                      <div className="p-4">
                        <Link
                          to={`/properties/${property.propertyId}`}
                          className="font-bold text-slate-900 hover:text-[#004741]"
                        >
                          {property.propertyName}
                        </Link>
                        <p className="mt-1 text-xs text-slate-500">
                          {property.propertyType} · {property.city}, {property.state}
                        </p>
                        <p className="mt-3 text-sm font-semibold text-slate-600">
                          {property.totalUnits} units
                        </p>
                        <p className="mt-1 text-sm font-extrabold text-[#004741]">
                         ₦ {property.targetRent || 0}
                        </p>
                      </div>
                    </article>
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

              {isSavedPropertiesLoading ? (
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
                      <Link
                        to={`/properties/${property.propertyId}`}
                        className="block"
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
                      </Link>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              to={`/properties/${property.propertyId}`}
                              className="font-bold text-slate-900 hover:text-[#004741]"
                            >
                              {property.propertyName}
                            </Link>
                            <p className="mt-1 text-xs text-slate-500">
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
                        <Link
                          to={`/properties/${property.propertyId}`}
                          className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#004741] hover:underline"
                        >
                          View details <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
            )}

            {activeNav === "Dashboard" && (
              <>
            <div className="grid gap-6 xl:grid-cols-3">
              <div className="xl:col-span-2">
                <ChartCard />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]"
              >
                <SectionHeader
                  title="Occupancy"
                  action="View units"
                  onAction={() => notify("Units view")}
                />
                {[
                  { label: "Occupied", value: 24, total: 28, color: "#004741" },
                  { label: "Vacant", value: 4, total: 28, color: "#F59E0B" },
                  { label: "Overdue", value: 3, total: 28, color: "#DC2626" },
                ].map((r, i) => (
                  <div key={r.label} className="mb-4 last:mb-0">
                    <div className="mb-1.5 flex justify-between text-xs font-semibold">
                      <span className="text-slate-500">{r.label}</span>
                      <span className="text-slate-900">{r.value} units</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={
                          inView
                            ? { width: `${(r.value / r.total) * 100}%` }
                            : {}
                        }
                        transition={{
                          delay: 0.4 + i * 0.12,
                          duration: 0.8,
                          ease: EASE,
                        }}
                        className="h-full rounded-full"
                        style={{ background: r.color }}
                      />
                    </div>
                  </div>
                ))}
                <div className="mt-5 rounded-xl bg-[#f7f5f0] p-4">
                  <p className="text-xs text-slate-500">
                    Monthly recurring income
                  </p>
                  <p className="text-xl font-extrabold tabular-nums text-[#004741]">
                    {naira(2480000)}
                  </p>
                </div>
              </motion.div>
            </div>
            <div className="grid gap-6 xl:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]"
              >
                <SectionHeader
                  title="Recent Payments"
                  action="View all"
                  onAction={() => notify("All payments")}
                />
                <div className="space-y-1">
                  {PAYMENTS.map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        delay: 0.3 + i * 0.08,
                        duration: 0.5,
                        ease: EASE,
                      }}
                      whileHover={{ x: 4, backgroundColor: "#f7f5f0" }}
                      className="flex cursor-pointer items-center gap-3 rounded-xl p-2.5 transition-colors duration-200"
                    >
                      <Avatar name={p.tenant} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {p.tenant}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {p.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold tabular-nums ${STATUS[p.status]}`}
                        >
                          +{naira(p.amount)}
                        </p>
                        <p className="text-[11px] text-slate-400">{p.date}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6, ease: EASE }}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]"
              >
                <SectionHeader
                  title="Pending Maintenance"
                  action="View all"
                  onAction={() => notify("All maintenance requests")}
                />
                <div className="space-y-3">
                  {MAINTENANCE.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        delay: 0.35 + i * 0.08,
                        duration: 0.5,
                        ease: EASE,
                      }}
                      whileHover={{ x: 4 }}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-colors duration-200 hover:border-[#004741]/20 hover:bg-slate-50/60"
                    >
                      <span
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${PRIORITY[m.priority]}`}
                      >
                        <Wrench className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {m.title}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" /> {m.unit} · {m.time}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-bold ${PRIORITY[m.priority]}`}
                      >
                        {m.priority}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.25, duration: 0.6, ease: EASE }}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]"
              >
                <SectionHeader
                  title="Expiring Rent Soon"
                  action="v2"
                  onAction={() => {}}
                />
                <div className="space-y-3">
                  {EXPIRING.map((e, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        delay: 0.4 + i * 0.08,
                        duration: 0.5,
                        ease: EASE,
                      }}
                      whileHover={{ x: 4 }}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 p-3.5 transition-colors duration-200 hover:border-[#F59E0B]/30 hover:bg-amber-50/40"
                    >
                      <div className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center">
                        <svg
                          className="absolute inset-0 h-full w-full -rotate-90"
                          viewBox="0 0 44 44"
                        >
                          <circle
                            cx="22"
                            cy="22"
                            r="19"
                            fill="none"
                            stroke="#f1f5f9"
                            strokeWidth="4"
                          />
                          <motion.circle
                            cx="22"
                            cy="22"
                            r="19"
                            fill="none"
                            stroke={
                              e.days <= 7
                                ? "#DC2626"
                                : e.days <= 14
                                  ? "#F59E0B"
                                  : "#0F766E"
                            }
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={119.4}
                            initial={{ strokeDashoffset: 119.4 }}
                            animate={
                              inView
                                ? {
                                    strokeDashoffset: 119.4 * (1 - e.days / 30),
                                  }
                                : {}
                            }
                            transition={{
                              delay: 0.5 + i * 0.1,
                              duration: 0.9,
                              ease: EASE,
                            }}
                          />
                        </svg>
                        <span
                          className={`text-[11px] font-extrabold tabular-nums ${e.days <= 7 ? "text-red-600" : e.days <= 14 ? "text-amber-600" : "text-teal-700"}`}
                        >
                          {e.days}d
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {e.tenant}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {e.unit}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold tabular-nums text-slate-900">
                          {naira(e.amount)}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          due in {e.days} days
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
              className="grid grid-cols-2 gap-4 lg:grid-cols-4"
            >
              {ACTIONS.map((a, i) => (
                <motion.button
                  key={a.label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{
                    delay: 0.45 + i * 0.08,
                    duration: 0.5,
                    ease: EASE,
                  }}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => notify(`${a.label} — coming up`)}
                  className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)] cursor-pointer"
                >
                  <motion.span
                    className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0"
                    style={{ background: a.color }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  />
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ background: `${a.color}14`, color: a.color }}
                  >
                    <a.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="flex items-center gap-1 text-sm font-bold text-slate-900">
                      {a.label}
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition-all duration-300 group-hover:text-[#F59E0B]" />
                    </p>
                    <p className="text-xs text-slate-400">{a.desc}</p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
              </>
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
                          {record.property?.propertyType && (
                            <p className="mt-1 text-xs text-slate-500">
                              {record.property.propertyType}
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