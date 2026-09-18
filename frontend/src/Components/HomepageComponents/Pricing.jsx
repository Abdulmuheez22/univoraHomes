import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { Check, Zap, ArrowRight, Building2, Rocket, Crown } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const PLANS = [
  {
    name: "Free",
    icon: Building2,
    price: "₦0",
    period: "",
    tagline: "Individual landlords starting out",
    properties: "Up to 5 properties",
    features: ["Rent tracking", "Maintenance requests", "Document storage", "Email notifications"],
    cta: "Start for free",
    accent: "#0F766E",
  },
  {
    name: "Growth",
    icon: Rocket,
    price: "₦5,000",
    period: "/month",
    tagline: "Active landlords and small agencies",
    properties: "Up to 20 properties",
    features: [
      "Rent tracking", "Maintenance requests", "Document storage", "Email notifications",
      "WhatsApp notifications", "Priority support", "Advanced dashboard analytics (v2)",
    ],
    cta: "Go Growth",
    accent: "#004741",
    popular: true,
  },
  {
    name: "Pro",
    icon: Crown,
    price: "₦12,000",
    period: "/month",
    tagline: "Property management companies",
    properties: "Unlimited properties",
    features: [
      "Rent tracking", "Maintenance requests", "Document storage", "Email notifications",
      "WhatsApp notifications", "Priority support", "Advanced dashboard analytics (v2)",
    ],
    cta: "Scale with Pro",
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
      className={plan.popular ? "md:-my-4 md:scale-[1.04] z-10" : ""}
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
        className={`relative flex h-full flex-col overflow-hidden rounded-3xl p-7 sm:p-8 ${
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
              className="absolute right-5 top-5 flex items-center gap-1 rounded-full bg-[#F59E0B] px-3 py-1 text-[11px] font-bold text-[#004741]"
            >
              <Zap className="h-3 w-3" />
              MOST POPULAR
            </motion.div>
          </>
        )}

        <div className="relative mb-6 flex items-center gap-3" style={{ transform: "translateZ(30px)" }}>
          <motion.div
            animate={hovered ? { rotate: -8, scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 15 }}
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${
              plan.popular ? "bg-white/10 text-[#F59E0B]" : ""
            }`}
            style={plan.popular ? {} : { background: `${plan.accent}14`, color: plan.accent }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold">{plan.name}</h3>
            <p className={`text-xs ${plan.popular ? "text-white/60" : "text-slate-500"}`}>{plan.tagline}</p>
          </div>
        </div>

        <div className="relative mb-1 flex items-end gap-1" style={{ transform: "translateZ(30px)" }}>
          <span className="text-4xl font-extrabold tracking-tight tabular-nums sm:text-5xl">{plan.price}</span>
          {plan.period && <span className={`pb-1.5 text-sm ${plan.popular ? "text-white/60" : "text-slate-500"}`}>{plan.period}</span>}
        </div>
        <p className={`relative mb-7 text-sm font-medium ${plan.popular ? "text-[#F59E0B]" : ""}`} style={{ color: plan.popular ? "#F59E0B" : plan.accent }}>
          {plan.properties}
        </p>

        <ul className={`relative mb-8 flex-1 space-y-3 border-t pt-6 ${plan.popular ? "border-white/10" : "border-slate-100"}`}>
          {plan.features.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -12 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1 + i * 0.05, duration: 0.4, ease: EASE }}
              className="flex items-start gap-2.5 text-sm"
            >
              <span
                className={`mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full ${
                  plan.popular ? "bg-[#F59E0B]/20" : ""
                }`}
                style={plan.popular ? {} : { background: `${plan.accent}14` }}
              >
                <Check className={`h-3 w-3 ${plan.popular ? "text-[#F59E0B]" : ""}`} style={plan.popular ? {} : { color: plan.accent }} strokeWidth={3} />
              </span>
              <span className={plan.popular ? "text-white/85" : "text-slate-600"}>{f}</span>
            </motion.li>
          ))}
        </ul>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className={`group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold ${
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
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#004741]/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold tracking-widest text-slate-500"
          >
            PRICING
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
          >
            Simple pricing that{" "}
            <span className="relative inline-block text-[#004741]">
              grows with you
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
            className="mt-5 text-lg text-slate-600"
          >
            Start free. Upgrade when your portfolio does. No hidden fees, ever.
          </motion.p>
        </div>

        <div ref={ref} className="grid items-stretch gap-6 md:grid-cols-3">
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
          All plans include rent tracking, maintenance, documents, and email notifications. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
}