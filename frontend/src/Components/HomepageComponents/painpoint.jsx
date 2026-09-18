import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion";
import {
  AlertTriangle, FileText, MessageSquare, CreditCard,
  Clock, Bell, FolderOpen, Home, KeyRound, TrendingUp,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const GROUPS = [
  {
    id: "landlords",
    label: "Landlords & Agents",
    icon: Home,
    accent: "#F59E0B",
    soft: "bg-amber-50 text-amber-600",
    heading: "Managing properties without structure is a full-time headache",
    pains: [
      { icon: CreditCard, title: "Rent is hard to track", desc: "Payments from multiple tenants scatter across bank alerts, WhatsApp and spreadsheets." },
      { icon: Clock, title: "Maintenance requests get lost", desc: "Follow-ups pile up. Tenants keep chasing you because nothing is logged properly." },
      { icon: FolderOpen, title: "Documents live everywhere", desc: "Leases, receipts and agreements are buried in email threads and random folders." },
      { icon: Bell, title: "Reminders are pure manual work", desc: "Every rent due date or lease renewal means another round of personal messages." },
    ],
    stat: { value: 14, suffix: "hrs", label: "wasted weekly on manual follow-ups" },
  },
  {
    id: "tenants",
    label: "Tenants",
    icon: KeyRound,
    accent: "#0F766E",
    soft: "bg-teal-50 text-teal-700",
    heading: "Being a tenant shouldn't feel like chasing shadows",
    pains: [
      { icon: CreditCard, title: "No clear payment history", desc: "You're never sure what's paid, what's outstanding, or whether the landlord received it." },
      { icon: MessageSquare, title: "Maintenance feels like shouting into the void", desc: "You raise an issue… then wait. No status, no timeline, no accountability." },
      { icon: FileText, title: "Important documents disappear", desc: "Receipts and agreements are hard to find the moment you actually need them." },
      { icon: MessageSquare, title: "Communication is inconsistent", desc: "One day it's WhatsApp, the next it's a phone call. Nothing is centralised." },
    ],
    stat: { value: 9, suffix: "days", label: "average wait with zero status updates" },
  },
];

function Counter({ value, suffix, start }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / 1200, 1);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, start]);
  return <span>{n}{suffix}</span>;
}

function GlowCard({ children, accent }) {
  const ref = useRef(null);
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const sx = useSpring(mx, { stiffness: 250, damping: 25 });
  const sy = useSpring(my, { stiffness: 250, damping: 25 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 sm:p-9 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] cursor-default"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: useSpring(sx, { stiffness: 250, damping: 25 }) && sx, x: sx, y: sy }}
      >
        <div
          className="absolute h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-2xl transition-colors duration-500"
          style={{ background: accent }}
        />
      </motion.div>
      {children}
    </motion.div>
  );
}

function PainItem({ icon: Icon, title, desc, accent, index }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.li
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ delay: 0.1 + index * 0.09, duration: 0.5, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex cursor-default items-start gap-4 rounded-2xl p-3 -m-3 transition-colors duration-300 hover:bg-slate-50"
    >
      <motion.div
        animate={hovered ? { scale: 1.12, rotate: -6 } : { scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors duration-300"
        style={hovered ? { background: `${accent}1A`, color: accent } : {}}
      >
        <Icon className="h-5 w-5" />
      </motion.div>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-slate-500">{desc}</p>
      </div>
      <motion.span
        animate={{ scale: hovered ? 1 : 0, opacity: hovered ? 1 : 0 }}
        className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full"
        style={{ background: accent }}
      />
    </motion.li>
  );
}

export default function PainPoints() {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const group = GROUPS[active];
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const statRef = useRef(null);
  const statInView = useInView(statRef, { once: true });

  const switchGroup = (i) => {
    if (i === active) return;
    setDir(i > active ? 1 : -1);
    setActive(i);
  };

  const variants = {
    enter: (d) => ({ opacity: 0, x: d * 48 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: EASE } },
    exit: (d) => ({ opacity: 0, x: d * -48, transition: { duration: 0.3, ease: EASE } }),
  };

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-[#f7f5f0] py-24 lg:py-32">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-emerald-100/50 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.15, 1, 1.15], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-40 right-1/4 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto mb-12 max-w-3xl text-center lg:mb-14"
        >

          <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            The old way is a{" "}
            <span className="relative inline-block">
              <span className="relative z-10">full-time headache</span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : {}}
                transition={{ delay: 0.6, duration: 0.7, ease: EASE }}
                className="absolute bottom-1 left-0 -z-0 h-3 w-full origin-left rounded-full bg-amber-400/60 sm:h-4"
              />
            </span>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-5 text-lg leading-relaxed text-slate-600"
          >
            Whether you manage properties or live in one, everything still feels scattered, manual, and stressful.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
          className="mb-10 flex justify-center"
        >
          <div className="relative flex rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <motion.span
              animate={{ x: active === 0 ? 0 : "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] rounded-xl bg-slate-900"
            />
            {GROUPS.map((g, i) => (
              <button
                key={g.id}
                onClick={() => switchGroup(i)}
                className={`relative z-10 flex w-40 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-colors duration-300 sm:w-52 ${
                  active === i ? "text-white" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <g.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{g.label}</span>
                <span className="sm:hidden">{g.id === "landlords" ? "Landlords" : "Tenants"}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={group.id}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <GlowCard accent={group.accent}>
                <div className="relative mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4">
                    <motion.div
                      initial={{ rotate: -12, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 16 }}
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${group.soft}`}
                    >
                      <group.icon className="h-6 w-6" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">{group.heading}</h3>
                    </div>
                  </div>
                  <div ref={statRef} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-3">
                    <TrendingUp className="h-5 w-5" style={{ color: group.accent }} />
                    <div>
                      <p className="text-2xl font-extrabold tabular-nums text-slate-900">
                        <Counter value={group.stat.value} suffix={group.stat.suffix} start={statInView} />
                      </p>
                      <p className="text-xs text-slate-500">{group.stat.label}</p>
                    </div>
                  </div>
                </div>

                <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                  <AnimatePresence mode="popLayout">
                    {group.pains.map((p, i) => (
                      <PainItem key={p.title} index={i} icon={p.icon} title={p.title} desc={p.desc} accent={group.accent} />
                    ))}
                  </AnimatePresence>
                </ul>
              </GlowCard>
            </motion.div>
          </AnimatePresence>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-10 text-center text-sm font-medium text-slate-400"
        >
          Sound familiar? There's a better way below.
        </motion.p>
      </div>
    </section>
  );
}