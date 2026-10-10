import { useRef, useState } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Building2,
  LayoutDashboard,
  Bell,
  Search,
  ChevronRight,
  Bookmark,
  MessageSquare,
  User,
  Users,
  CheckCircle2,
  X,
  ExternalLink,
  MapPin,
  LogOut,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  fetchSavedProperties,
  fetchTenantConnectionRequests,
  fetchUserProfile,
  fetchTenantLandLord,
  unSaveProperty,
} from "../../lib/services/auth.service";
import ProfileModal from "./ProfileModal";
import SignOutConfirmation from "./SignOutConfirmation";
import TenantPropertyBrowser from "./TenantPropertyBrowser";

const EASE = [0.22, 1, 0.36, 1];

const toWhatsAppNumber = (number) => {
  const digits = String(number).replace(/\D/g, "");
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  return digits;
};

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Inquiry Accepted!", desc: "Landlord accepted your inquiry for Flat 4B, Lekki Phase 1.", time: "2 hours ago", read: false },
  { id: 2, title: "New Property Match", desc: "A new property matching your saved filters was listed in Ikeja.", time: "1 day ago", read: true },
];

const STATUS_STYLE = {
  Accepted: "bg-green-50 text-green-700 border-green-200",
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Declined: "bg-red-50 text-red-700 border-red-200",
};

export default function TenantDashboard({ accountData }) {
  const queryClient = useQueryClient();
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
    data: profile,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useQuery({
    queryKey: ["user-profile"],
    queryFn: fetchUserProfile,
  });
  const {
    data: inquiries = [],
    isLoading: areInquiriesLoading,
    isError: areInquiriesError,
    refetch: refetchInquiries,
  } = useQuery({
    queryKey: ["tenant-connection-requests"],
    queryFn: fetchTenantConnectionRequests,
  });
  const {
    data: landlords = [],
    isLoading: areLandlordsLoading,
    isError: areLandlordsError,
    refetch: refetchLandlords,
  } = useQuery({
    queryKey: ["tenant-landlords"],
    queryFn: fetchTenantLandLord,
  });
  const removeSavedProperty = useMutation({
    mutationFn: unSaveProperty,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["saved-properties"] }),
    onError: () => notify("Couldn't remove saved property. Please try again."),
  });

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebar, setSidebar] = useState(false);
  const [toast, setToast] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const mainRef = useRef(null);
  const inView = useInView(mainRef, { once: true, margin: "-40px" });

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const NAV = [
    { icon: LayoutDashboard, label: "Overview", id: "overview", active: activeTab === "overview" },
    { icon: Building2, label: "Browse Homes", id: "browse", active: activeTab === "browse" },
    { icon: MessageSquare, label: "My Inquiries", id: "inquiries", badge: inquiries.length, active: activeTab === "inquiries" },
    { icon: Users, label: "My Landlord", id: "landlord", badge: landlords.length || null, active: activeTab === "landlord" },
    { icon: Bookmark, label: "Saved Properties", id: "saved", badge: savedProperties.length, active: activeTab === "saved" },
    { icon: Bell, label: "Notifications", id: "notifications", badge: MOCK_NOTIFICATIONS.filter(n => !n.read).length, active: activeTab === "notifications" },
    { icon: User, label: "My Profile", id: "profile", active: activeTab === "profile" },
  ];

  return (
    <>
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
            {NAV.map((n) => {
              const isActive = activeTab === n.id;
              return (
                <motion.button
                  key={n.id}
                  onClick={() => {
                    setActiveTab(n.id);
                    if (n.id === "profile") setIsProfileOpen(true);
                  }}
                  whileHover={{ x: 3 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                    isActive
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
                  {n.badge ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-[#004741] text-white"
                          : "bg-[#F59E0B] text-[#004741]"
                      }`}
                    >
                      {n.badge}
                    </motion.span>
                  ) : null}
                </motion.button>
              );
            })}
          </nav>
          <div className="px-3">
            <motion.div whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}>
              <button
                type="button"
                onClick={() => setIsSignOutOpen(true)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white"
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
              <p className="text-[11px] font-medium text-slate-400">Welcome back,</p>
              <h1 className="-mt-0.5 text-sm font-bold text-slate-900">
                {profile?.userName || accountData?.userName || ""}
              </h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className="relative hidden sm:block">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <motion.input
                  whileFocus={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                  placeholder="Search listings..."
                  className="h-10 w-56 rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-4 text-sm outline-none transition-all duration-300 focus:border-[#004741] focus:bg-white focus:ring-4 focus:ring-[#004741]/10 lg:w-72"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab("notifications")}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:text-[#004741] cursor-pointer"
              >
                <Bell className="h-4.5 w-4.5" />
                <motion.span 
                  animate={{ scale: [1, 1.2, 1] }} 
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#F59E0B] ring-2 ring-white" 
                />
              </motion.button>
              <motion.button
                type="button"
                aria-label="Open your profile"
                title="My profile"
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                  setActiveTab("profile");
                  setIsProfileOpen(true);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004741] text-xs font-bold text-white shadow-md shadow-[#004741]/20"
              >
                {(profile?.userName || accountData?.userName || "U")
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </motion.button>
            </div>
          </header>

          <main ref={mainRef} className="space-y-6 p-5 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
              className="flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <motion.h2 
                  key={activeTab}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-extrabold tracking-tight text-slate-900"
                >
                  {activeTab === "overview" && "Tenant Dashboard"}
                  {activeTab === "browse" && "Find Your Next Home"}
                  {activeTab === "inquiries" && "My Property Inquiries"}
                  {activeTab === "landlord" && "My Landlord"}
                  {activeTab === "saved" && "Saved Properties"}
                  {activeTab === "notifications" && "Notifications & Updates"}
                  {activeTab === "profile" && "My Profile"}
                </motion.h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  {activeTab === "overview" && "Track your inquiries, saved properties, and landlord messages."}
                  {activeTab === "browse" && "Discover and shortlist properties without leaving your dashboard."}
                  {activeTab === "inquiries" && "Monitor the real-time status of properties you've reached out about."}
                  {activeTab === "landlord" && "Contact the landlords for properties whose connection requests were accepted."}
                  {activeTab === "saved" && "Quickly access your favorite homes and listings."}
                  {activeTab === "notifications" && "Recent updates regarding your inquiries and housing matches."}
                  {activeTab === "profile" && "Manage your account details and preferences."}
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab("browse")}
                  className="flex items-center gap-2 rounded-xl bg-[#004741] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#004741]/25 hover:bg-[#00332F] transition-colors"
                >
                  <Search className="h-4 w-4" strokeWidth={2.5} />
                  Browse Properties
                </button>
              </motion.div>
            </motion.div>

            {activeTab === "browse" && <TenantPropertyBrowser />}

            {activeTab === "landlord" && (
              <motion.section
                key="landlord-section"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_18px_50px_-24px_rgba(0,51,47,0.28)]"
              >
                <div className="relative overflow-hidden bg-gradient-to-br from-[#00332F] via-[#004741] to-[#0F766E] px-6 py-7 text-white sm:px-8">
                  <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border-[28px] border-white/5" />
                  <div className="pointer-events-none absolute -bottom-20 right-24 h-40 w-40 rounded-full bg-[#F59E0B]/10 blur-2xl" />
                  <div className="relative flex items-center justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
                        Your connections
                      </span>
                      <h2 className="mt-3 text-2xl font-extrabold tracking-tight">
                        My Landlord
                      </h2>
                      <p className="mt-1 max-w-xl text-sm text-white/70">
                        Reach out to landlords for properties where your request was accepted.
                      </p>
                    </div>
                    <div className="hidden h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 sm:flex">
                      <Building2 className="h-7 w-7 text-[#FCD34D]" />
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                {areLandlordsLoading ? (
                  <div className="py-12 text-center text-sm text-slate-500">
                    <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#004741]" />
                    Loading landlord details...
                  </div>
                ) : areLandlordsError ? (
                  <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-8 text-center">
                    <p className="text-sm font-medium text-red-700">
                      Couldn't load your landlord details.
                    </p>
                    <button
                      type="button"
                      onClick={() => refetchLandlords()}
                      className="mt-3 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#004741] shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                    >
                      Try again
                    </button>
                  </div>
                ) : landlords.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-5 py-12 text-center">
                    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#004741]/10 text-[#004741]">
                      <Users className="h-7 w-7" />
                    </span>
                    <p className="mt-4 font-bold text-slate-800">
                      No landlord details yet
                    </p>
                    <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">
                      When a landlord accepts one of your connection requests, their contact details and property information will show up here.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {landlords.map((record, index) => (
                      <article
                        key={`${record.landlord?.landlordEmail || "landlord"}-${record.property?.propertyName || index}`}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_-18px_rgba(15,23,42,0.4)] transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-[0_20px_38px_-22px_rgba(0,71,65,0.42)]"
                      >
                        <div className="p-5">
                          <div className="flex items-center gap-3">
                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#004741] to-[#0F766E] text-sm font-extrabold text-white shadow-md shadow-[#004741]/20">
                              {(record.landlord?.landlordName || "Landlord")
                                .trim()
                                .split(/\s+/)
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join("")
                                .toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700">
                                Connected landlord
                              </p>
                              <h3 className="truncate font-bold text-slate-900">
                                {record.landlord?.landlordName || "Landlord"}
                              </h3>
                            </div>
                          </div>

                          <div className="mt-5 rounded-xl bg-slate-50 p-3.5">
                            <div className="flex items-start gap-2.5">
                              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]/15 text-amber-700">
                                <Building2 className="h-4 w-4" />
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-slate-800">
                                  {record.property?.propertyName || "Property"}
                                </p>
                                {record.property?.propertyType && (
                                  <p className="mt-0.5 text-xs font-medium text-slate-500">
                                    {record.property.propertyType}
                                  </p>
                                )}
                              </div>
                            </div>
                            {record.property?.propertyAddress && (
                              <p className="mt-3 flex items-start gap-1.5 text-xs leading-5 text-slate-500">
                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
                                {record.property.propertyAddress}
                              </p>
                            )}
                          </div>

                          {record.landlord?.landlordEmail && (
                            <a
                              href={`mailto:${record.landlord.landlordEmail}`}
                              className="mt-4 block truncate text-xs text-slate-500 transition hover:text-[#004741] hover:underline"
                            >
                              {record.landlord.landlordEmail}
                            </a>
                          )}
                        </div>

                        <div className="flex gap-2 border-t border-slate-100 bg-slate-50/70 p-4">
                          {record.landlord?.landlordNumber ? (
                            <>
                              <a
                                href={`https://wa.me/${toWhatsAppNumber(record.landlord.landlordNumber)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-3 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2"
                              >
                                <MessageCircle className="h-4 w-4" />
                                WhatsApp
                              </a>
                              <a
                                href={`tel:${record.landlord.landlordNumber}`}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-bold text-slate-700 transition hover:border-[#004741] hover:text-[#004741] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2"
                              >
                                <Phone className="h-4 w-4" />
                                Call
                              </a>
                            </>
                          ) : (
                            <p className="w-full py-2 text-center text-xs font-medium text-slate-400">
                              No phone number available
                            </p>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
                </div>
              </motion.section>
            )}

            <AnimatePresence mode="wait">
              {(activeTab === "overview" || activeTab === "inquiries") && (
                <motion.div
                  key="inquiries-section"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">Recent Inquiries</h3>
                    {activeTab === "overview" && (
                      <motion.button 
                        whileHover={{ x: 2 }}
                        onClick={() => setActiveTab("inquiries")} 
                        className="text-xs font-semibold text-[#004741] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        View all ({inquiries.length}) <ChevronRight className="h-3 w-3" />
                      </motion.button>
                    )}
                  </div>
                  {areInquiriesLoading ? (
                    <p className="py-8 text-center text-sm text-slate-500">
                      Loading your inquiries...
                    </p>
                  ) : areInquiriesError ? (
                    <div className="py-8 text-center">
                      <p className="text-sm text-red-600">
                        Couldn't load your inquiries.
                      </p>
                      <button
                        type="button"
                        onClick={() => refetchInquiries()}
                        className="mt-2 text-sm font-semibold text-[#004741] hover:underline"
                      >
                        Try again
                      </button>
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 px-5 py-10 text-center">
                      <p className="font-semibold text-slate-700">
                        You haven't sent any property inquiries yet
                      </p>
                      <Link
                        to="/properties"
                        className="mt-4 inline-flex rounded-xl bg-[#004741] px-4 py-2.5 text-sm font-bold text-white"
                      >
                        Browse properties
                      </Link>
                    </div>
                  ) : (
                  <div className="space-y-3">
                    {inquiries.map((item, idx) => {
                      const status = item.requestStatus || "Pending";
                      const statusStyle =
                        STATUS_STYLE[status] ||
                        "bg-slate-50 text-slate-700 border-slate-200";
                      const location = [
                        item.propertyAddress,
                        item.city,
                        item.state,
                      ]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <motion.div
                          key={item.requestId}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.08, duration: 0.4, ease: EASE }}
                          whileHover={{ x: 4, backgroundColor: "rgba(240, 232, 213, 0.15)" }}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 transition-all bg-slate-50/50"
                        >
                          <div>
                            <h4 className="font-bold text-sm text-slate-900">
                              {item.propertyName || "Property"}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                              {location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" /> {location}
                                </span>
                              )}
                              {item.targetRent && (
                                <>
                                  {location && <span>•</span>}
                                  <span className="font-bold text-[#004741]">
                                   ₦ {item.targetRent}/yr
                                  </span>
                                </>
                              )}
                              {item.landlordName && (
                                <>
                                  {(location || item.targetRent) && <span>•</span>}
                                  <span>Landlord: {item.landlordName}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <motion.span
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyle}`}
                            >
                              {status}
                            </motion.span>
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Link
                                to={
                                  item.propertyId
                                    ? `/properties/${item.propertyId}`
                                    : "/properties"
                                }
                                aria-label={`View ${item.propertyName || "property"}`}
                                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#004741] hover:border-[#004741] transition-colors flex items-center justify-center shadow-sm"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </motion.div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {(activeTab === "overview" || activeTab === "saved") && (
                <motion.div
                  key="saved-section"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">Saved Properties (Favorites)</h3>
                    {activeTab === "overview" && (
                      <motion.button 
                        whileHover={{ x: 2 }}
                        onClick={() => setActiveTab("saved")} 
                        className="text-xs font-semibold text-[#004741] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        View all ({savedProperties.length}) <ChevronRight className="h-3 w-3" />
                      </motion.button>
                    )}
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
                      <Bookmark className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 font-semibold text-slate-700">
                        No saved properties yet
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Save a property while browsing to find it here.
                      </p>
                      <Link
                        to="/properties"
                        className="mt-4 inline-flex rounded-xl bg-[#004741] px-4 py-2.5 text-sm font-bold text-white"
                      >
                        Browse properties
                      </Link>
                    </div>
                  ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {savedProperties.map((property, idx) => (
                      <motion.div 
                        key={property.propertyId}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.4, ease: EASE }}
                        whileHover={{ y: -4, boxShadow: "0 14px 30px -10px rgba(0,71,65,0.12)" }}
                        className="rounded-xl border border-slate-100 p-4 bg-slate-50/50 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#004741]/10 text-[#004741]">{property.propertyType}</span>
                            <motion.button 
                              type="button"
                              aria-label={`Remove ${property.propertyName} from saved properties`}
                              whileTap={{ scale: 0.8 }}
                              onClick={() => removeSavedProperty.mutate(property.propertyId)}
                              disabled={removeSavedProperty.isPending}
                              className="text-slate-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Bookmark className="h-4 w-4 fill-current text-[#F59E0B]" />
                            </motion.button>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900">{property.propertyName}</h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {property.city}, {property.state}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-sm font-extrabold text-[#004741]">₦{property.targetRent || 0}</span>
                          <motion.div whileHover={{ x: 2 }}>
                            <Link to={`/properties/${property.propertyId}`} className="text-xs font-bold text-[#004741] hover:underline flex items-center gap-1">
                              View details <ChevronRight className="h-3 w-3" />
                            </Link>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {(activeTab === "overview" || activeTab === "notifications") && (
                <motion.div
                  key="notifications-section"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">Notifications & Landlord Updates</h3>
                    {activeTab === "overview" && (
                      <motion.button 
                        whileHover={{ x: 2 }}
                        onClick={() => setActiveTab("notifications")} 
                        className="text-xs font-semibold text-[#004741] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        View all <ChevronRight className="h-3 w-3" />
                      </motion.button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {MOCK_NOTIFICATIONS.map((n, idx) => (
                      <motion.div 
                        key={n.id} 
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.4, ease: EASE }}
                        whileHover={{ x: 3 }}
                        className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all ${n.read ? "bg-white border-slate-100" : "bg-[#F0E8D5]/20 border-[#004741]/20 shadow-sm"}`}
                      >
                        <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                          <CheckCircle2 className="h-5 w-5" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                            <span className="text-[11px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">{n.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {activeTab === "profile" && (
                <motion.section
                  key="profile-section"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="rounded-2xl border border-slate-100 bg-white p-8 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)]"
                >
                  <h3 className="font-bold text-slate-900">Account details</h3>
                  {isProfileLoading ? (
                    <p className="mt-3 text-sm text-slate-500">Loading profile...</p>
                  ) : isProfileError ? (
                    <p className="mt-3 text-sm text-red-600">Couldn't load your profile.</p>
                  ) : (
                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">{profile?.userName || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">{profile?.userEmail || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">{profile?.userPhone || "—"}</dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Location</dt>
                        <dd className="mt-1 text-sm font-semibold text-slate-800">
                          {[profile?.userCity, profile?.userState].filter(Boolean).join(", ") || "—"}
                        </dd>
                      </div>
                    </dl>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsProfileOpen(true)}
                    className="mt-6 rounded-xl bg-[#004741] px-5 py-3 text-sm font-bold text-white"
                  >
                    Open profile settings
                  </button>
                </motion.section>
              )}
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
      </div>
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
    </>
  );
}