import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView, useSpring } from "framer-motion";
import { Building2, Handshake, LayoutDashboard, ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const STEPS = [
  {
    icon: Building2,
    num: "01",
    title: "List or Find a Property",
    desc: "Landlords and agents upload properties with photos, pricing, and details. Tenants browse and find exactly what fits their budget and location.",
    accent: "#004741",
    soft: "bg-[#004741]/10 text-[#004741]",
  },
  {
    icon: Handshake,
    num: "02",
    title: "Connect and Move In",
    desc: "A tenant signals interest, the landlord or agent gets notified, and once everything is agreed — the tenant is confirmed on the platform.",
    accent: "#F59E0B",
    soft: "bg-amber-100 text-amber-600",
  },
  {
    icon: LayoutDashboard,
    num: "03",
    title: "Manage Everything in One Place",
    desc: "Track rent payments, raise maintenance requests, store documents, and receive reminders — all without digging through chats or spreadsheets.",
    accent: "#0F766E",
    soft: "bg-teal-100 text-teal-700",
  },
];

function StepCard({ step, index, onHover, hovered }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });
  const isHovered = hovered === index;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.18, duration: 0.7, ease: EASE }}
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      className="group relative flex-1 cursor-default"
    >
      <motion.div
        animate={{ y: isHovered ? -10 : 0, scale: isHovered ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 22 }}
        className="relative h-full overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.08)] sm:p-8"
      >
        <motion.div
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(320px circle at 50% 0%, ${step.accent}12, transparent 70%)` }}
        />
        <div className="relative mb-6 flex items-start justify-between">
          <motion.div
            animate={isHovered ? { rotate: -8, scale: 1.12 } : { rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 15 }}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.soft}`}
          >
            <step.icon className="h-7 w-7" />
          </motion.div>
          <span className="text-5xl font-extrabold tabular-nums text-slate-100 transition-colors duration-500 group-hover:text-slate-200">
            {step.num}
          </span>
        </div>
        <h3 className="relative mb-3 text-lg font-bold text-slate-900 sm:text-xl">{step.title}</h3>
        <p className="relative text-sm leading-relaxed text-slate-500">{step.desc}</p>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="absolute bottom-0 left-0 h-1 w-full origin-left"
          style={{ background: step.accent }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function GettingStarted() {
  const sectionRef = useRef(null);
  const [hovered, setHovered] = useState(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.75", "end 0.6"],
  });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const lineX = useTransform(lineScale, [0, 1], ["0%", "100%"]);
  const lineY = useTransform(lineScale, [0, 1], ["0%", "100%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#004741]/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto mb-16 max-w-3xl text-center lg:mb-20">

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
          >
            Getting started is{" "}
            <span className="relative inline-block text-[#004741]">
              simpler than you think
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
            className="mt-5 text-lg leading-relaxed text-slate-600"
          >
            Whether you own a property, manage one, or are looking for your next home — Univora Homes gets you set up in minutes.
          </motion.p>
        </div>

        <div className="relative">
          <div className="hidden md:block">
            <div className="absolute left-0 right-0 top-7 h-[3px] rounded-full bg-slate-100" />
            <motion.div
              style={{ scaleX: lineX }}
              className="absolute left-0 right-0 top-7 h-[3px] origin-left rounded-full bg-gradient-to-r from-[#004741] via-[#F59E0B] to-[#0F766E]"
            />
            <div className="relative flex gap-8">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex flex-1 flex-col">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.25, type: "spring", stiffness: 300, damping: 18 }}
                    className="z-10 mx-auto mb-8 h-4 w-4 rounded-full border-[3px] border-white shadow-md"
                    style={{ background: s.accent }}
                  />
                  <StepCard step={s} index={i} onHover={setHovered} hovered={hovered} />
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <div className="absolute bottom-6 left-[26px] top-2 w-[3px] rounded-full bg-slate-100" />
            <motion.div
              style={{ scaleY: lineY }}
              className="absolute bottom-6 left-[26px] top-2 w-[3px] origin-top rounded-full bg-gradient-to-b from-[#004741] via-[#F59E0B] to-[#0F766E]"
            />
            <div className="relative space-y-8">
              {STEPS.map((s, i) => (
                <div key={s.num} className="flex gap-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ delay: 0.4 + i * 0.25, type: "spring", stiffness: 300, damping: 18 }}
                    className="z-10 mt-6 h-4 w-4 flex-shrink-0 rounded-full border-[3px] border-white shadow-md"
                    style={{ background: s.accent }}
                  />
                  <div className="flex-1">
                    <StepCard step={s} index={i} onHover={setHovered} hovered={hovered} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
          className="mt-16 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 350, damping: 20 }}
            className="group relative overflow-hidden rounded-xl bg-[#004741] px-9 py-4 font-bold text-white shadow-lg shadow-[#004741]/25"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <span className="relative flex items-center gap-2">
              Start your journey
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}