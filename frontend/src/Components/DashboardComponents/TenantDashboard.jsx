import { useRef, useState } from "react";
import {
  motion,
  useInView,
  AnimatePresence,
} from "framer-motion";
import {
  Home,
  LayoutDashboard,
  Bell,
  Search,
  ChevronRight,
  Bookmark,
  MessageSquare,
  User,
  CheckCircle2,
  Clock,
  X,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSavedProperties } from "../../lib/services/auth.service";

const EASE = [0.22, 1, 0.36, 1];

const naira = (n) => "₦" + n.toLocaleString("en-NG");

const MOCK_INQUIRIES = [
  { id: 1, property: "Flat 4B, Lekki Phase 1", location: "Lagos", price: 4500000, date: "Yesterday, 2:30 PM", status: "Accepted" },
  { id: 2, property: "Duplex A, Victoria Island", location: "Lagos", price: 8500000, date: "3 days ago", status: "Pending" },
  { id: 3, property: "Unit 2, Yaba Commercial Hub", location: "Lagos", price: 3200000, date: "1 week ago", status: "Declined" },
];

const MOCK_SAVED = [
  { id: 101, property: "Modern Luxury Villa", location: "Ikeja GRA, Lagos", price: 12000000, type: "Villa" },
  { id: 102, property: "Cozy Waterfront Apartment", location: "Elegushi, Lagos", price: 5500000, type: "Apartment" },
  { id: 103, property: "Executive 3-Bedroom Flat", location: "Ilorin, Kwara", price: 2500000, type: "Flat" },
];

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
  const [savedProperty, setSavedProperty] = useState({})
  // useEffect(()=>{
    const {data, isLoading, isError} = useQuery({
      queryKey: ["properties"],
      queryFn: fetchSavedProperties
    })
    // setSavedProperty(data)
  // }, [])

  // if(!isLoading){console.log(data)}
  const [userData, setUserData] = useState(() => ({
    userName: accountData?.userName || "",
    phone: accountData?.phoneNumber || "",
    email: accountData?.email || "",
  }));
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebar, setSidebar] = useState(false);
  const [toast, setToast] = useState(null);
  const mainRef = useRef(null);
  const inView = useInView(mainRef, { once: true, margin: "-40px" });

  const notify = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const NAV = [
    { icon: LayoutDashboard, label: "Overview", id: "overview", active: activeTab === "overview" },
    { icon: MessageSquare, label: "My Inquiries", id: "inquiries", badge: MOCK_INQUIRIES.filter(i => i.status === "Accepted").length, active: activeTab === "inquiries" },
    { icon: Bookmark, label: "Saved Properties", id: "saved", badge: MOCK_SAVED.length, active: activeTab === "saved" },
    { icon: Bell, label: "Notifications", id: "notifications", badge: MOCK_NOTIFICATIONS.filter(n => !n.read).length, active: activeTab === "notifications" },
    { icon: User, label: "My Profile", id: "profile", active: activeTab === "profile" },
  ];

  return (
    <>
    {/* {console.log("data: ", savedProperty)} */}
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
              <motion.span 
                whileHover={{ rotate: 12, scale: 1.08 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#F59E0B]"
              >
                <Home className="h-5 w-5 text-[#004741]" strokeWidth={2.5} />
              </motion.span>
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
                  onClick={() => setActiveTab(n.id)}
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
              <Link to="/" className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-white/60 transition-colors hover:bg-white/5 hover:text-white">
                <LogOut className="h-5 w-5 flex-shrink-0" />
                {sidebar && <span>Sign out</span>}
              </Link>
            </motion.div>
          </div>
        </motion.aside>

        <div className="flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-100 bg-white/80 px-5 backdrop-blur-md lg:px-8">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Welcome back,</p>
              <h1 className="-mt-0.5 text-sm font-bold text-slate-900">{userData.userName}</h1>
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
              <motion.span 
                whileHover={{ scale: 1.05 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#004741] text-xs font-bold text-white shadow-md shadow-[#004741]/20 cursor-pointer"
              >
                AY
              </motion.span>
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
                  {activeTab === "inquiries" && "My Property Inquiries"}
                  {activeTab === "saved" && "Saved Properties"}
                  {activeTab === "notifications" && "Notifications & Updates"}
                  {activeTab === "profile" && "Tenant Profile"}
                </motion.h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  {activeTab === "overview" && "Track your inquiries, saved properties, and landlord messages."}
                  {activeTab === "inquiries" && "Monitor the real-time status of properties you've reached out about."}
                  {activeTab === "saved" && "Quickly access your favorite homes and listings."}
                  {activeTab === "notifications" && "Recent updates regarding your inquiries and housing matches."}
                  {activeTab === "profile" && "Your contact details are automatically prefilled during new inquiries."}
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/properties"
                  className="flex items-center gap-2 rounded-xl bg-[#004741] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#004741]/25 hover:bg-[#00332F] transition-colors"
                >
                  <Search className="h-4 w-4" strokeWidth={2.5} />
                  Browse Properties
                </Link>
              </motion.div>
            </motion.div>

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
                        View all ({MOCK_INQUIRIES.length}) <ChevronRight className="h-3 w-3" />
                      </motion.button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {MOCK_INQUIRIES.map((item, idx) => (
                      <motion.div 
                        key={item.id} 
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.4, ease: EASE }}
                        whileHover={{ x: 4, backgroundColor: "rgba(240, 232, 213, 0.15)" }}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 transition-all bg-slate-50/50"
                      >
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{item.property}</h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {item.location}</span>
                            <span>•</span>
                            <span className="font-bold text-[#004741]">{naira(item.price)}/yr</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {item.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <motion.span 
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${STATUS_STYLE[item.status]}`}
                          >
                            {item.status}
                          </motion.span>
                          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Link to={`#`} className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#004741] hover:border-[#004741] transition-colors flex items-center justify-center shadow-sm">
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
                        View all ({MOCK_SAVED.length}) <ChevronRight className="h-3 w-3" />
                      </motion.button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {MOCK_SAVED.map((property, idx) => (
                      <motion.div 
                        key={property.id} 
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.08, duration: 0.4, ease: EASE }}
                        whileHover={{ y: -4, boxShadow: "0 14px 30px -10px rgba(0,71,65,0.12)" }}
                        className="rounded-xl border border-slate-100 p-4 bg-slate-50/50 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-[#004741]/10 text-[#004741]">{property.type}</span>
                            <motion.button 
                              whileTap={{ scale: 0.8 }}
                              onClick={() => notify("Removed from favorites")} 
                              className="text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <Bookmark className="h-4 w-4 fill-current text-[#F59E0B]" />
                            </motion.button>
                          </div>
                          <h4 className="font-bold text-sm text-slate-900">{property.property}</h4>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {property.location}</p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-sm font-extrabold text-[#004741]">{naira(property.price)}</span>
                          <motion.div whileHover={{ x: 2 }}>
                            <Link to={`#`} className="text-xs font-bold text-[#004741] hover:underline flex items-center gap-1">
                              View details <ChevronRight className="h-3 w-3" />
                            </Link>
                          </motion.div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
                <motion.div
                  key="profile-section"
                  initial={{ opacity: 0, y: 16, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.99 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.06)] max-w-2xl"
                >
                  <h3 className="font-bold text-slate-900 mb-1">My Profile & Contact Information</h3>
                  <p className="text-xs text-slate-500 mb-6">These details are automatically prefilled whenever you submit a property inquiry.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="text"
                          value={userData.userName}
                          onChange={(e) => setUserData({ ...userData, userName: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004741]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="text"
                          value={userData.phone}
                          onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004741]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                        <motion.input
                          whileFocus={{ scale: 1.01 }}
                          type="email"
                          value={userData.email}
                          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#004741]"
                        />
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => notify("Profile updated successfully")}
                      className="mt-4 px-6 py-3 bg-[#004741] text-white text-sm font-bold rounded-xl shadow-md hover:bg-[#00332F] cursor-pointer transition-all"
                    >
                      Save Changes
                    </motion.button>
                  </div>
                </motion.div>
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
    </>
  );
}