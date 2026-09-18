import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import {
  Building2, Wallet, Wrench, ShieldCheck,
  BellRing, LayoutDashboard, Check, Sparkles,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const FEATURES = [
  {
    icon: Building2,
    title: "Property & Unit Management",
    desc: "List properties, organize units, and track vacancies — all in one place",
    accent: "#004741",
    span: "md:col-span-2 md:row-span-2",
    big: true,
    chips: ["12 properties", "28 units", "3 vacancies"],
  },
  {
    icon: Wallet,
    title: "Rent Payment Tracking",
    desc: "Know exactly who has paid, who hasn't, and what's overdue — at a glance",
    accent: "#F59E0B",
    span: "md:col-span-2",
    chips: ["Paid", "Pending", "Overdue"],
  },
  {
    icon: Wrench,
    title: "Maintenance Requests",
    desc: "Tenants raise issues, landlords respond — no more lost messages",
    accent: "#0F766E",
    span: "",
  },
  {
    icon: ShieldCheck,
    title: "Document Storage",
    desc: "Leases, receipts, and agreements stored securely and always accessible",
    accent: "#004741",
    span: "",
  },
  {
    icon: BellRing,
    title: "Smart Notifications",
    desc: "Automatic rent reminders via email and WhatsApp — so you never chase manually",
    accent: "#F59E0B",
    span: "",
    chips: ["WhatsApp", "Email"],
  },
  {
    icon: LayoutDashboard,
    title: "Role-Based Dashboards",
    desc: "Landlords, agents, and tenants each see exactly what's relevant to them",
    accent: "#0F766E",
    span: "md:col-span-2",
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
        className="pointer-events-none absolute -inset-px z-10 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
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
      transition={{ delay: index * 0.08, duration: 0.6, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6 }}
      className={`group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.07)] sm:p-7 ${feature.span} ${
        feature.big ? "min-h-[280px] md:min-h-[380px]" : ""
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
          className="flex h-12 w-12 items-center justify-center rounded-2xl"
          style={{ background: `${feature.accent}14`, color: feature.accent }}
        >
          <Icon className="h-6 w-6" />
        </motion.div>

        <div>
          <h3 className={`font-bold text-slate-900 ${feature.big ? "text-2xl" : "text-base"}`}>{feature.title}</h3>
          <p className={`mt-2 leading-relaxed text-slate-500 ${feature.big ? "text-base" : "text-sm"}`}>{feature.desc}</p>
        </div>

        {feature.chips && (
          <div className="flex flex-wrap gap-2">
            {feature.chips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500 transition-colors duration-300 group-hover:border-transparent"
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
            className="absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full text-white"
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
    <section className="relative overflow-hidden bg-[#f7f5f0] py-24 lg:py-32">
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[#004741]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div ref={headRef} className="mx-auto mb-16 max-w-3xl text-center lg:mb-20">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-widest text-slate-500"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            FEATURES
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
          >
            Everything you need.
            <span className="mt-2 block text-slate-400">Nothing you don't.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-5 text-lg leading-relaxed text-slate-600"
          >
            One platform, six superpowers — built for how property actually works.
          </motion.p>
        </div>

        <SpotlightGrid>
          <div className="grid gap-5 md:grid-cols-4">
            {FEATURES.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </SpotlightGrid>
      </div>
    </section>
  );
}