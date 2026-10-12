import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  ArrowLeftRight,
  BookmarkCheck,
  Building2,
  Handshake,
  LayoutDashboard,
  MapPinned,
  Search,
  Users,
  Check,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const FEATURES = [
  {
    icon: Building2,
    title: "Property Listings",
    desc: "Publish property details, location, category, rent, and photographs. Keep your portfolio together and update listings when details change.",
    accent: "#004741",
    span: "md:col-span-2 md:row-span-2",
    big: true,
    chips: ["Property details", "Photos", "Portfolio"],
  },
  {
    icon: Search,
    title: "Property Discovery",
    desc: "Explore available listings and narrow the results by location, property type, category, and price.",
    accent: "#F59E0B",
    span: "md:col-span-2",
    chips: ["Location", "Type", "Budget"],
  },
  {
    icon: Handshake,
    title: "Connection Requests",
    desc: "Tenants can express interest in a listing. Landlords review each request and accept or decline from their dashboard.",
    accent: "#0F766E",
    span: "",
  },
  {
    icon: BookmarkCheck,
    title: "Saved Properties",
    desc: "Tenants can save promising homes and return to their shortlist from their dashboard.",
    accent: "#B45309",
    span: "",
  },
  {
    icon: Users,
    title: "Connected Tenants",
    desc: "Landlords can view tenants connected to their properties and access contact details from one workspace.",
    accent: "#004741",
    span: "",
  },
  {
    icon: MapPinned,
    title: "Clear Property Details",
    desc: "Review each listing’s location, category, photos, description, and target rent in a dedicated property view.",
    accent: "#0F766E",
    span: "",
  },
  {
    icon: LayoutDashboard,
    title: "Role-Based Dashboards",
    desc: "Landlord and tenant workspaces surface the properties, requests, saved homes, and connections relevant to each person.",
    accent: "#F59E0B",
    span: "",
  },
  {
    icon: ArrowLeftRight,
    title: "Flexible Account Role",
    desc: "Switch between landlord and tenant workspaces from your profile or sidebar when your needs change.",
    accent: "#004741",
    span: "",
  },
];

function SpotlightGrid({ children }) {
  const ref = useRef(null);
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const sx = useSpring(mx, { stiffness: 220, damping: 26 });
  const sy = useSpring(my, { stiffness: 220, damping: 26 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className="group relative">
      <motion.div
        className="pointer-events-none absolute -inset-px z-10 hidden rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block"
        style={{
          x: sx,
          y: sy,
          width: 400,
          height: 400,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(0,71,65,0.09), transparent 65%)",
        }}
      />
      {children}
    </div>
  );
}

function FeatureCard({ feature, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);
  const Icon = feature.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ delay: index * 0.07, duration: 0.6, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6 }}
      className={`group relative min-w-0 overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.07)] sm:p-7 ${feature.span} ${
        feature.big ? "md:min-h-[380px]" : ""
      }`}
    >
      <motion.div
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="pointer-events-none absolute inset-0"
        style={{ background: `radial-gradient(300px circle at 30% 0%, ${feature.accent}10, transparent 70%)` }}
      />
      <motion.span
        animate={{ scaleX: hovered ? 1 : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="absolute left-0 top-0 h-1 w-full origin-left"
        style={{ background: feature.accent }}
      />

      <div className={`relative flex flex-col ${feature.big ? "h-full justify-between gap-6" : "gap-4"}`}>
        <motion.div
          animate={hovered ? { rotate: -8, scale: 1.1 } : { rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 15 }}
          className="flex h-11 w-11 items-center justify-center rounded-2xl sm:h-12 sm:w-12"
          style={{ background: `${feature.accent}14`, color: feature.accent }}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.div>

        <div>
          <h3 className={`font-bold text-slate-900 ${feature.big ? "text-xl sm:text-2xl" : "text-base"}`}>
            {feature.title}
          </h3>
          <p className={`mt-2 leading-relaxed text-slate-500 ${feature.big ? "text-sm sm:text-base" : "text-sm"}`}>
            {feature.desc}
          </p>
        </div>

        {feature.chips && (
          <div className="flex flex-wrap gap-2">
            {feature.chips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500 transition-colors duration-300 group-hover:border-transparent sm:px-3 sm:text-xs"
                style={{ transitionProperty: "color, background-color" }}
              >
                {c}
              </span>
            ))}
          </div>
        )}

        {feature.big && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={hovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full text-white sm:bottom-6 sm:right-6"
            style={{ background: feature.accent }}
          >
            <Check className="h-5 w-5" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default function Features() {
  const headRef = useRef(null);
  const inView = useInView(headRef, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative overflow-hidden bg-[#f7f5f0] py-20 lg:py-32">
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[#004741]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div ref={headRef} className="mx-auto mb-12 max-w-3xl text-center lg:mb-20">


          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Property workflows,{" "}
            <span className="mt-2 block text-slate-400">
              organised around people.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            From publishing and discovering properties to managing connection
            requests, saved listings, and landlord-tenant relationships, each
            workspace keeps the next step clear.
          </motion.p>
        </div>

        <SpotlightGrid>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-4">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </SpotlightGrid>
      </div>
    </section>
  );
}
