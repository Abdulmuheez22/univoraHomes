import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";


const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: EASE },
  }),
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

function MagneticButton({ children, variant = "primary" }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 16 });
  const sy = useSpring(y, { stiffness: 200, damping: 16 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.28);
    y.set((e.clientY - r.top - r.height / 2) * 0.28);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative min-w-0 overflow-hidden rounded-xl px-4 font-bold tracking-wide h-[54px] w-full sm:w-[210px] sm:px-8 cursor-pointer transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";
  const styles =
    variant === "primary"
      ? "bg-[#004741] text-white shadow-lg shadow-[#004741]/25 hover:shadow-xl hover:shadow-[#004741]/35 focus-visible:ring-[#004741]"
      : "border border-[#B4C2B8] text-[#004741] bg-white/60 backdrop-blur hover:border-[#004741]/50 hover:bg-white focus-visible:ring-[#004741]";

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileTap={{ scale: 0.97 }}
      custom={0}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`${base} ${styles}`}
    >
      {variant === "primary" && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      )}
      <span className="relative flex items-center justify-center gap-2">
        {children}
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </span>
    </motion.button>
  );
}

function StatCard({ label, target, prefix = "", suffix = "", accent, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const value = useCountUp(target, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, ease: EASE }}
      whileHover={{ y: -4 }}
      className="group cursor-default rounded-xl bg-[#f5f2e9] p-3 sm:p-4 transition-colors duration-300 hover:bg-[#004741]"
    >
      <p className="text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold text-[#111827]/45 transition-colors duration-300 group-hover:text-white/60">
        {label}
      </p>
      <p
        className={`mt-1 font-extrabold text-lg sm:text-2xl md:text-3xl tabular-nums transition-colors duration-300 group-hover:text-white ${accent ? "text-[#F59E0B]" : "text-[#004741]"}`}
      >
        {prefix}
        {value.toLocaleString()}
        {suffix}
      </p>
    </motion.div>
  );
}

function ActivityRow({ icon, title, sub, badge, badgeClass, delay, amount }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5, ease: EASE }}
      whileHover={{ x: 6, backgroundColor: "#f0ede4" }}
      className="flex min-w-0 cursor-pointer items-center gap-2 rounded-xl p-2 sm:gap-3 sm:p-3 transition-colors duration-200"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs sm:text-sm md:text-base font-semibold text-[#111827]">
          {title}
        </p>
        <p className="text-[10px] sm:text-xs text-[#111827]/50">{sub}</p>
      </div>
      {amount && (
        <span className="shrink-0 whitespace-nowrap text-[11px] font-bold text-green-600 sm:text-sm">
          {amount}
        </span>
      )}
      {badge && (
        <span
          className={`shrink-0 whitespace-nowrap rounded-full px-2 py-1 text-[10px] font-semibold ${badgeClass} sm:px-2.5 sm:text-xs`}
        >
          {badge}
        </span>
      )}
    </motion.div>
  );
}

function FloatingBadge({ className, delay, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
      className={`absolute z-20 ${className}`}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
        whileHover={{ scale: 1.08 }}
        className="cursor-default"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const MotionLink = motion(Link)
  const cardRef = useRef(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), {
    stiffness: 120,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), {
    stiffness: 120,
    damping: 18,
  });
  const [hovered, setHovered] = useState(false);

  const onTilt = (e) => {
    const r = cardRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const resetTilt = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <section className="relative flex min-h-screen w-full min-w-0 flex-col items-center justify-between gap-10 overflow-hidden bg-[#F0E8D5] px-3 pt-24 pb-10 sm:gap-14 sm:px-10 sm:pt-28 lg:flex-row md:gap-20 lg:px-16 lg:pt-0">
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#004741]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[420px] w-[420px] rounded-full bg-[#F59E0B]/15 blur-3xl" />

      <div className="relative z-10 flex min-w-0 max-w-xl flex-col items-center gap-7 text-center md:items-start md:text-left">
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-3xl font-extrabold leading-[1.08] tracking-tight text-[#111827] sm:text-5xl md:text-6xl lg:text-6xl"
        >
          Manage every home
          <span className="relative mt-1 block text-[#004741]">
            with confidence
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
            >
              <motion.path
                d="M4 8 C 80 2, 220 2, 296 6"
                stroke="#F59E0B"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1.1, duration: 0.7 }}
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-base leading-relaxed tracking-wide text-[#7C7C7C] sm:text-lg"
        >
          Collect rent, track maintenance, communicate with tenants, and grow
          your portfolio — all from one simple platform.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row"
        >
          <MagneticButton variant="primary">Start free trial</MagneticButton>
          <Link to="/properties">
          <MagneticButton variant="ghost" to="/properties">
            <span className="flex items-center gap-0">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              propertises
            </span>
          </MagneticButton>
          </Link>
        </motion.div>
        
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="flex flex-col gap-3 sm:flex-row sm:gap-10"
        >
          {["No credit card required", "Free for 1 property"].map((t) => (
            <motion.span
              key={t}
              whileHover={{ x: 4 }}
              className="flex cursor-default items-center gap-2 text-sm font-medium text-[#3d3f3d]"
            >
              <svg
                className="h-5 w-5 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                <path d="m16 9-5.5 5.5L8 12" />
              </svg>
              {t}
            </motion.span>
          ))}
        </motion.div>
      </div>

      <div
        className="relative z-10 w-full min-w-0 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl"
        style={{ perspective: 1200 }}
      >
        <FloatingBadge className="-top-5 -left-2 sm:-left-8" delay={0.9}>
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl shadow-[#004741]/10">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-4 w-4 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <div>
              <p className="text-xs font-bold text-[#111827]">Rent received</p>
              <p className="text-[10px] text-[#111827]/50">just now</p>
            </div>
          </div>
        </FloatingBadge>
        <FloatingBadge className="-bottom-5 -right-2 sm:-right-6" delay={1.1}>
          <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 shadow-xl shadow-[#004741]/10">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <svg
                className="h-4 w-4 text-amber-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <div>
              <p className="text-xs font-bold text-[#111827]">
                98% on-time payments
              </p>
              <p className="text-[10px] text-[#111827]/50">last 12 months</p>
            </div>
          </div>
        </FloatingBadge>

        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 40, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.3 }}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={onTilt}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => {
            resetTilt();
            setHovered(false);
          }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#004741]/25 to-[#F59E0B]/20 opacity-70 blur-2xl" />
          <div className="relative overflow-hidden rounded-2xl border border-[#004741]/5 bg-white shadow-2xl shadow-[#004741]/15">
            <div className="flex items-center gap-2 border-b border-[#004741]/5 bg-[#004741]/5 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400 transition-transform hover:scale-125" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 transition-transform hover:scale-125" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 transition-transform hover:scale-125" />
              </div>
              <div className="mx-3 flex-1">
                <div className="flex h-6 items-center gap-2 rounded-md bg-white/70 px-3 text-xs text-[#111827]/40">
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 118 0v4" />
                  </svg>
                  app.univorahomes.com
                </div>
              </div>
            </div>

            <div className="min-w-0 p-3 sm:p-6">
              <div className="mb-5 flex items-center justify-between sm:mb-6">
                <div>
                  <p className="text-xs font-medium text-[#111827]/50">
                    Welcome back
                  </p>
                  <p className="text-xl font-bold text-[#004741] sm:text-2xl">
                    Dashboard
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 4 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#004741]/10 text-sm font-bold text-[#004741]"
                >
                  AO
                </motion.div>
              </div>

              <div className="mb-5 grid min-w-0 grid-cols-3 gap-1.5 sm:mb-6 sm:gap-3">
                <StatCard label="Properties" target={12} delay={0.5} />
                <StatCard label="Tenants" target={28} delay={0.65} />
                <StatCard
                  label="Collected"
                  target={4}
                  suffix=".2M"
                  prefix="₦"
                  accent
                  delay={0.8}
                />
              </div>

              <AnimatePresence>
                <motion.div layout className="space-y-1">
                  <ActivityRow
                    delay={0.9}
                    title="Rent received — Flat 4B"
                    sub="2 hours ago"
                    amount="+₦450k"
                    icon={
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    }
                  />
                  <ActivityRow
                    delay={1.0}
                    title="Maintenance request"
                    sub="Lekki Phase 1 • Today"
                    badge="Open"
                    badgeClass="bg-amber-100 text-amber-700"
                    icon={
                      <svg
                        className="h-5 w-5 text-amber-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                    }
                  />
                  <ActivityRow
                    delay={1.1}
                    title="New tenant applied"
                    sub="Victoria Island • Yesterday"
                    badge="Review"
                    badgeClass="bg-[#004741]/10 text-[#004741]"
                    icon={
                      <svg
                        className="h-5 w-5 text-[#004741]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    }
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <motion.div
              animate={{ opacity: hovered ? 1 : 0 }}
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/10"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
