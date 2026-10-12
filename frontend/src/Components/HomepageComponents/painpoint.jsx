import { useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useInView } from "framer-motion";
import {
  BookmarkCheck, Handshake, House, KeyRound, ListChecks, MapPinned, Users,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const GROUPS = [
  {
    id: "landlords",
    label: "Landlords",
    shortLabel: "Landlords",
    icon: House,
    accent: "#F59E0B",
    soft: "bg-amber-50 text-amber-600",
    heading: "A practical workspace for managing property interest",
    pains: [
      {
        icon: House,
        title: "Keep property listings organised",
        desc: "Create, update, and review your property details, photos, location, and target rent from your landlord dashboard.",
      },
      {
        icon: ListChecks,
        title: "Review tenant requests",
        desc: "See incoming connection requests and choose to accept or decline them from your workspace.",
      },
      {
        icon: Users,
        title: "See connected tenants",
        desc: "Keep track of tenants connected to your properties and access their contact information.",
      },
      {
        icon: KeyRound,
        title: "Switch roles when needed",
        desc: "Move between landlord and tenant workspaces from your profile or dashboard sidebar.",
      },
    ],
  },
  {
    id: "tenants",
    label: "Tenants",
    shortLabel: "Tenants",
    icon: KeyRound,
    accent: "#0F766E",
    soft: "bg-teal-50 text-teal-700",
    heading: "A simpler way to discover and connect with homes",
    pains: [
      {
        icon: MapPinned,
        title: "Find listings that fit",
        desc: "Browse available properties and filter by location, property type, category, and price.",
      },
      {
        icon: BookmarkCheck,
        title: "Save properties to revisit",
        desc: "Keep interesting homes in a personal shortlist so you can return to them later.",
      },
      {
        icon: Handshake,
        title: "Express interest clearly",
        desc: "Send a connection request to a landlord and track the request status from your dashboard.",
      },
      {
        icon: Users,
        title: "View landlord connections",
        desc: "See landlords you have connected with from your tenant workspace.",
      },
    ],
  },
];

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
      className="group relative cursor-default overflow-hidden rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] sm:p-9"
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:block"
        style={{ x: sx, y: sy }}
      >
        <div
          className="absolute h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-2xl"
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
      className="relative -m-3 flex cursor-default items-start gap-3 rounded-2xl p-3 transition-colors duration-300 hover:bg-slate-50 sm:gap-4"
    >
      <motion.div
        animate={hovered ? { scale: 1.12, rotate: -6 } : { scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors duration-300 sm:h-10 sm:w-10"
        style={hovered ? { background: `${accent}1A`, color: accent } : {}}
      >
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </motion.div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-900 sm:text-base">{title}</p>
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
    <section id="why-univora" ref={sectionRef} className="relative overflow-hidden bg-[#f7f5f0] py-20 lg:py-32">
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

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto mb-10 max-w-3xl text-center lg:mb-14"
        >


          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Property workflows, made clearer{" "}
            <span className="relative inline-block">
              <span className="relative z-10">for both sides</span>
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
            className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            Landlords and tenants need a clear way to publish listings, find
            homes, and manage connection requests.
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
          className="mb-10 flex justify-center"
        >
          <div className="relative flex w-full max-w-[22rem] rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <motion.span
              animate={{ x: active === 0 ? 0 : "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="absolute inset-y-1.5 left-1.5 w-[calc(50%-6px)] rounded-xl bg-slate-900"
            />
            {GROUPS.map((g, i) => (
              <button
                key={g.id}
                type="button"
                onClick={() => switchGroup(i)}
                aria-pressed={active === i}
                className={`relative z-10 flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold transition-colors duration-300 sm:text-sm ${
                  active === i ? "text-white" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <g.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate sm:hidden">{g.shortLabel}</span>
                <span className="hidden truncate sm:inline">{g.label}</span>
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
                <div className="relative mb-7 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <motion.div
                      initial={{ rotate: -12, scale: 0.8 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 16 }}
                      className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${group.soft}`}
                    >
                      <group.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </motion.div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 sm:text-2xl">{group.heading}</h3>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 sm:px-5">
                    <group.icon className="h-5 w-5 shrink-0" style={{ color: group.accent }} aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 sm:text-base">Workspace focus</p>
                      <p className="text-xs text-slate-500">Property connections</p>
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
          One platform with distinct tools for landlords and tenants.
        </motion.p>
      </div>
    </section>
  );
}
