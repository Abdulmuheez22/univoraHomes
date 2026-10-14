import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];
const MotionLink = motion.create(Link);

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.6, ease: EASE },
  }),
};

const MAGNET_MAX = 10;

function MagneticButton({ children, variant = "primary", icon: Icon, to, label }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 16 });
  const sy = useSpring(y, { stiffness: 200, damping: 16 });

  /* Measured on the padded wrapper, not the button itself: the button slides
     toward the cursor, so a tight hit area makes it slip out from under the
     pointer and snap back. Clamping keeps it inside that padded area. */
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const clamp = (v) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, v));
    x.set(clamp((e.clientX - r.left - r.width / 2) * 0.2));
    y.set(clamp((e.clientY - r.top - r.height / 2) * 0.2));
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const isPrimary = variant === "primary";

  const base =
    "group relative flex min-w-0 items-center justify-center overflow-hidden rounded-xl px-4 text-sm font-bold tracking-wide h-[52px] w-full cursor-pointer transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:h-[54px] sm:w-[224px] sm:px-7 sm:text-base";
  const styles = isPrimary
    ? "bg-[#004741] text-white shadow-lg shadow-[#004741]/25 hover:shadow-xl hover:shadow-[#004741]/35 focus-visible:ring-[#004741]"
    : "border border-[#004741]/25 bg-white/80 text-[#004741] backdrop-blur hover:border-[#004741]/60 hover:bg-white hover:shadow-lg hover:shadow-[#004741]/10 focus-visible:ring-[#004741]";

  const Component = to ? MotionLink : motion.button;
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      custom={0}
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="-m-3 flex w-[calc(100%+1.5rem)] p-3 sm:w-auto"
    >
      <Component
        {...(to ? { to } : { type: "button" })}
        aria-label={label}
        style={{ x: sx, y: sy }}
        whileTap={{ scale: 0.97 }}
        className={`${base} ${styles}`}
      >
        {isPrimary && (
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        )}
        <span className="relative flex min-w-0 items-center justify-center gap-2">
          {Icon && (
            <span
              className={
                isPrimary
                  ? "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/15 text-white transition-transform duration-300 group-hover:-rotate-6"
                  : "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#F59E0B]/20 text-[#8a5a00] transition-all duration-300 group-hover:bg-[#F59E0B] group-hover:text-white group-hover:-rotate-6"
              }
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
            </span>
          )}
          <span className="truncate">{children}</span>
          <svg
            className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
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
      </Component>
    </motion.div>
  );
}

function StatCard({ label, value, accent, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, ease: EASE }}
      whileHover={{ y: -4 }}
      className="group min-w-0 cursor-default rounded-xl bg-[#f5f2e9] p-2 transition-colors duration-300 hover:bg-[#004741] sm:p-4"
    >
      <p className="truncate text-[8px] font-semibold uppercase tracking-[0.08em] text-[#111827]/45 transition-colors duration-300 group-hover:text-white/60 min-[360px]:text-[9px] sm:text-[10px] sm:tracking-widest">
        {label}
      </p>
      <p
        className={`mt-1 truncate font-extrabold text-base tabular-nums transition-colors duration-300 group-hover:text-white min-[360px]:text-lg sm:text-2xl md:text-3xl ${accent ? "text-[#F59E0B]" : "text-[#004741]"}`}
      >
        {value}
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
      className="flex min-w-0 cursor-pointer items-center gap-2 rounded-xl p-2 transition-colors duration-200 sm:gap-3 sm:p-3"
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-10 sm:w-10">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-[#111827] sm:text-sm md:text-base">
          {title}
        </p>
        <p className="truncate text-[10px] text-[#111827]/50 sm:text-xs">
          {sub}
        </p>
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
    <section
      id="home"
      className="relative flex min-h-screen w-full min-w-0 flex-col items-center justify-between gap-10 overflow-hidden bg-[#F0E8D5] px-4 pb-12 pt-12 sm:gap-14 sm:px-10 sm:pb-16 sm:pt-16 lg:flex-row lg:gap-16 lg:px-16 lg:py-20"
    >
      <div className="pointer-events-none absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#004741]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-24 h-[420px] w-[420px] rounded-full bg-[#F59E0B]/15 blur-3xl" />

      <div className="relative z-10 flex min-w-0 max-w-xl flex-col items-center gap-6 text-center sm:gap-7 md:items-start md:text-left">
      

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-[1.75rem] font-extrabold leading-[1.1] tracking-tight text-[#111827] min-[360px]:text-3xl sm:text-5xl md:text-[3.25rem] lg:text-5xl xl:text-[3.5rem]"
        >
          Find your next home
          <span className="relative mt-1 block text-[#004741]">
            or manage a property
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 300 12"
              fill="none"
              preserveAspectRatio="none"
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
          className="max-w-lg text-sm leading-relaxed tracking-wide text-[#5f5f5f] sm:text-lg"
        >
          Univora Homes helps landlords publish and manage listings while
          tenants discover homes, save favourites, and send connection
          requests — all through role-specific dashboards.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4"
        >
          <MagneticButton
            to="/signup"
            variant="primary"
            label="Create a Univora Homes account"
          >
            Start your journey
          </MagneticButton>
          <MagneticButton
            to="/properties"
            variant="ghost"
            icon={Building2}
            label="Browse available properties"
          >
            Browse properties
          </MagneticButton>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 sm:gap-x-10"
        >
          {["Landlord and tenant workspaces", "Browse properties without signing in"].map((t) => (
            <motion.span
              key={t}
              whileHover={{ x: 4 }}
              className="flex cursor-default items-center gap-2 text-xs font-medium text-[#3d3f3d] sm:text-sm"
            >
              <svg
                className="h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5"
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
        <FloatingBadge
          className="-top-4 -left-1 origin-bottom-left scale-90 sm:-top-5 sm:-left-8 sm:scale-100"
          delay={0.9}
        >
          <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl shadow-[#004741]/10 sm:px-4 sm:py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-100 sm:h-8 sm:w-8">
              <svg
                className="h-3.5 w-3.5 text-green-600 sm:h-4 sm:w-4"
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
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-[#111827] sm:text-xs">
                Listing published
              </p>
              <p className="text-[10px] text-[#111827]/50">Property listing workflow</p>
            </div>
          </div>
        </FloatingBadge>
        <FloatingBadge
          className="-bottom-4 -right-1 origin-bottom-right scale-90 sm:-bottom-5 sm:-right-6 sm:scale-100"
          delay={1.1}
        >
          <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2 shadow-xl shadow-[#004741]/10 sm:px-4 sm:py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 sm:h-8 sm:w-8">
              <svg
                className="h-3.5 w-3.5 text-amber-600 sm:h-4 sm:w-4"
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
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-[#111827] sm:text-xs">
                New connection request
              </p>
              <p className="text-[10px] text-[#111827]/50">Tenant-to-landlord workflow</p>
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
            <div className="flex items-center gap-2 border-b border-[#004741]/5 bg-[#004741]/5 px-3 py-2.5 sm:px-4 sm:py-3">
              <div className="flex shrink-0 gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400 transition-transform hover:scale-125" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 transition-transform hover:scale-125" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 transition-transform hover:scale-125" />
              </div>
              <div className="mx-1 min-w-0 flex-1 sm:mx-3">
                <div className="flex h-6 min-w-0 items-center gap-2 rounded-md bg-white/70 px-2 text-[10px] text-[#111827]/40 sm:px-3 sm:text-xs">
                  <svg
                    className="h-3 w-3 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="5" y="11" width="14" height="10" rx="2" />
                    <path d="M8 11V7a4 4 0 118 0v4" />
                  </svg>
                  <span className="truncate">app.univorahomes.com</span>
                </div>
              </div>
            </div>

            <div className="min-w-0 p-3 sm:p-6">
              <div className="mb-4 flex items-center justify-between gap-2 sm:mb-6">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#111827]/50 sm:text-xs">
                    Welcome back
                  </p>
                  <p className="truncate text-lg font-bold text-[#004741] sm:text-2xl">
                    Landlord workspace
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 4 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#004741]/10 text-xs font-bold text-[#004741] sm:h-10 sm:w-10 sm:text-sm"
                >
                  AO
                </motion.div>
              </div>

              <div className="mb-4 grid min-w-0 grid-cols-3 gap-1.5 sm:mb-6 sm:gap-3">
                <StatCard label="Listings" value="Manage" delay={0.5} />
                <StatCard label="Requests" value="Review" delay={0.65} />
                <StatCard label="Connections" value="View" accent delay={0.8} />
              </div>

              <AnimatePresence>
                <motion.div layout className="space-y-1">
                  <ActivityRow
                    delay={0.9}
                    title="Property listing"
                    sub="Photos, details and target rent"
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
                          d="M3 10.5 12 3l9 7.5M5 9v11h14V9M9 20v-6h6v6"
                        />
                      </svg>
                    }
                  />
                  <ActivityRow
                    delay={1.0}
                    title="Tenant connection"
                    sub="A tenant is interested in this listing"
                    badge="Review"
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0ZM5 21v-2a7 7 0 0114 0v2"
                        />
                      </svg>
                    }
                  />
                  <ActivityRow
                    delay={1.1}
                    title="Saved property"
                    sub="Tenants can keep a shortlist"
                    badge="Saved"
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
