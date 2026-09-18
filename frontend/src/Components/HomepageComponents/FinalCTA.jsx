import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, CalendarClock, Sparkles, Home } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

function MagneticButton({ children, variant, delay, inView }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 16 });
  const sy = useSpring(y, { stiffness: 200, damping: 16 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.25);
  };
  const reset = () => { x.set(0); y.set(0); };

  const primary = variant === "primary";

  return (
    <motion.button
      ref={ref}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.6, ease: EASE }}
      whileTap={{ scale: 0.96 }}
      className={`group relative w-full overflow-hidden rounded-xl px-8 py-4 font-bold tracking-wide sm:w-auto ${
        primary
          ? "bg-[#F59E0B] text-[#004741] shadow-xl shadow-black/30"
          : "border border-white/25 bg-white/5 text-white backdrop-blur hover:border-white/50 hover:bg-white/10"
      }`}
    >
      {primary && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      )}
      <span className="relative flex items-center justify-center gap-2">
        {children}
        {primary
          ? <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          : <CalendarClock className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />}
      </span>
    </motion.button>
  );
}

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const words = "scattered chats and missed payments".split(" ");

  return (
    <section className="relative overflow-hidden bg-[#004741] py-28 lg:py-36">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[#F59E0B]/20 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-teal-400/20 blur-3xl"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1 }}
        className="pointer-events-none absolute left-[10%] top-[20%] hidden lg:block"
      >
        <motion.div animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <Home className="h-10 w-10 text-white/10" />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        className="pointer-events-none absolute bottom-[25%] right-[12%] hidden lg:block"
      >
        <motion.div animate={{ y: [0, 12, 0], rotate: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}>
          <Sparkles className="h-8 w-8 text-[#F59E0B]/20" />
        </motion.div>
      </motion.div>

      <div ref={ref} className="relative mx-auto max-w-4xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold tracking-widest text-white/70 backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" />
          READY WHEN YOU ARE
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.8, ease: EASE }}
          className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Your properties deserve better than{" "}
          <span className="whitespace-nowrap">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0.25 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ delay: 0.6 + i * 0.09, duration: 0.5 }}
                className={i >= words.length - 3 ? "text-[#F59E0B]" : ""}
              >
                {w}{" "}
              </motion.span>
            ))}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70"
        >
          Join landlords and agents already simplifying their property management with Univora Homes. Start free — no credit card required.
        </motion.p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticButton variant="primary" delay={0.7} inView={inView}>
            Get Started Free
          </MagneticButton>
          <MagneticButton variant="ghost" delay={0.8} inView={inView}>
            Book a Demo
          </MagneticButton>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 text-sm text-white/50"
        >
          Free for 1 property · Set up in minutes · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}