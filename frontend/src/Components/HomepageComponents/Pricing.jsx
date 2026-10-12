import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  Check,
  Zap,
  ArrowRight,
  Building2,
  Handshake,
  ArrowLeftRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1];
const MotionLink = motion.create(Link);

const PLANS = [
  {
    name: "Discover",
    icon: Building2,
    price: "Explore",
    period: "",
    tagline: "For tenants searching for a home",
    properties: "Browse public listings",
    features: [
      "Filter properties by location and type",
      "View listing photos and details",
      "Save properties to revisit",
      "Send connection requests",
    ],
    cta: "Browse properties",
    to: "/properties",
    accent: "#0F766E",
  },
  {
    name: "Manage",
    icon: Handshake,
    price: "Publish",
    period: "",
    tagline: "For landlords managing listings",
    properties: "A dedicated landlord workspace",
    features: [
      "Create and update property listings",
      "Review tenant connection requests",
      "Accept or decline requests",
      "View connected tenants",
    ],
    cta: "Create an account",
    to: "/signup",
    accent: "#004741",
    popular: true,
  },
  {
    name: "Connect",
    icon: ArrowLeftRight,
    price: "Switch",
    period: "",
    tagline: "For people using both workspaces",
    properties: "Landlord and tenant roles",
    features: [
      "Choose your active role",
      "Switch roles from your profile",
      "Access the matching dashboard",
      "Manage listings or saved homes",
    ],
    cta: "Start your journey",
    to: "/signup",
    accent: "#F59E0B",
  },
];

function TiltCard({ plan, index, inView }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 20 });
  const sry = useSpring(ry, { stiffness: 220, damping: 20 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * (plan.popular ? 4 : 7));
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * (plan.popular ? 4 : 7));
  };
  const reset = () => { rx.set(0); ry.set(0); setHovered(false); };

  const Icon = plan.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 44 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.15 + index * 0.12, duration: 0.7, ease: EASE }}
      className={plan.popular ? "z-10 md:-my-4 md:scale-[1.04]" : ""}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={reset}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-6 sm:p-8 ${
          plan.popular
            ? "border-2 border-[#004741] bg-[#004741] text-white shadow-2xl shadow-[#004741]/30"
            : "border border-slate-100 bg-white text-slate-900 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.08)]"
        }`}
      >
        {plan.popular && (
          <>
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#F59E0B]/20 blur-2xl" />
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-[#F59E0B] px-2.5 py-1 text-[10px] font-bold text-[#004741] sm:right-5 sm:top-5 sm:px-3 sm:text-[11px]"
            >
              <Zap className="h-3 w-3" />
              MOST POPULAR
            </motion.div>
          </>
        )}

        <div className="relative mb-5 flex items-center gap-3 sm:mb-6" style={{ transform: "translateZ(30px)" }}>
          <motion.div
            animate={hovered ? { rotate: -8, scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 15 }}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              plan.popular ? "bg-white/10 text-[#F59E0B]" : ""
            }`}
            style={plan.popular ? {} : { background: `${plan.accent}14`, color: plan.accent }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <p className={`text-xs ${plan.popular ? "text-white/60" : "text-slate-500"}`}>{plan.tagline}</p>
          </div>
        </div>

        <div className="relative mb-1 flex items-end gap-1" style={{ transform: "translateZ(30px)" }}>
          <span className="text-3xl font-extrabold tracking-tight sm:text-4xl">{plan.price}</span>
          {plan.period && <span className={`pb-1.5 text-sm ${plan.popular ? "text-white/60" : "text-slate-500"}`}>{plan.period}</span>}
        </div>
        <p
          className="relative mb-6 text-sm font-medium sm:mb-7"
          style={{ color: plan.popular ? "#F59E0B" : plan.accent }}
        >
          {plan.properties}
        </p>

        <ul className={`relative mb-7 flex-1 space-y-3 border-t pt-6 sm:mb-8 ${plan.popular ? "border-white/10" : "border-slate-100"}`}>
          {plan.features.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1 + i * 0.05, duration: 0.4, ease: EASE }}
              className="flex items-start gap-2.5 text-sm"
            >
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  plan.popular ? "bg-[#F59E0B]/20" : ""
                }`}
                style={plan.popular ? {} : { background: `${plan.accent}14` }}
              >
                <Check
                  className={`h-3 w-3 ${plan.popular ? "text-[#F59E0B]" : ""}`}
                  style={plan.popular ? {} : { color: plan.accent }}
                  strokeWidth={3}
                />
              </span>
              <span className={plan.popular ? "text-white/85" : "text-slate-600"}>{f}</span>
            </motion.li>
          ))}
        </ul>

        <MotionLink
          to={plan.to}
          aria-label={`${plan.cta} — create a Univora Homes account`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className={`group relative flex w-full items-center justify-center overflow-hidden rounded-xl py-3.5 text-sm font-bold transition-colors duration-300 ${
            plan.popular
              ? "bg-[#F59E0B] text-[#004741] shadow-lg shadow-black/20"
              : "border border-slate-200 text-slate-900 hover:border-transparent hover:text-white"
          }`}
          style={plan.popular ? {} : {}}
          onMouseEnter={(e) => { if (!plan.popular) e.currentTarget.style.background = plan.accent; }}
          onMouseLeave={(e) => { if (!plan.popular) e.currentTarget.style.background = ""; }}
        >
          <span className="relative flex items-center justify-center gap-2">
            {plan.cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </MotionLink>
      </motion.div>
    </motion.div>
  );
}

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="pricing" className="relative overflow-hidden bg-white py-20 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#004741]/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:px-4 sm:text-xs"
          >
            Platform
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            A workspace for every{" "}
            <span className="relative inline-block text-[#004741]">
              property journey
              <motion.span
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.7, duration: 0.7, ease: EASE }}
                className="absolute -bottom-1 left-0 h-2 w-full origin-left rounded-full bg-amber-400/50"
              />
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 text-base text-slate-600 sm:text-lg"
          >
            Explore available homes, manage landlord listings, or use both
            workspaces with a role-based account.
          </motion.p>
        </div>

        <div ref={ref} className="grid items-stretch gap-5 sm:gap-6 md:grid-cols-3">
          {PLANS.map((p, i) => (
            <TiltCard key={p.name} plan={p} index={i} inView={inView} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-12 text-center text-sm text-slate-400"
        >
          Choose your workspace during account creation and switch roles from
          your profile whenever your needs change.
        </motion.p>
      </div>
    </section>
  );
}
