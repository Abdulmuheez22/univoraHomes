import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useInView } from "framer-motion";
import { Home, KeyRound, Search, ArrowLeft, DoorOpen } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const FLOATERS = [
  { icon: KeyRound, x: "12%", y: "22%", size: 28, depth: 30, color: "#F59E0B", rotate: -12 },
  { icon: Home, x: "82%", y: "18%", size: 34, depth: 50, color: "#004741", rotate: 8 },
  { icon: Search, x: "76%", y: "70%", size: 24, depth: 40, color: "#0F766E", rotate: -6 },
  { icon: DoorOpen, x: "16%", y: "74%", size: 26, depth: 55, color: "#004741", rotate: 10 },
  { icon: KeyRound, x: "60%", y: "12%", size: 20, depth: 25, color: "#F59E0B", rotate: 20 },
];

const digits = [4, 0, 4];

export default function NotFound() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  const bgX = useTransform(sx, [0, 1], ["-2%", "2%"]);
  const bgY = useTransform(sy, [0, 1], ["-2%", "2%"]);

  const [keysFled, setKeysFled] = useState(false);
  const [foundKey, setFoundKey] = useState(false);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F0E8D5] px-6"
    >
      <motion.div
        style={{ x: bgX, y: bgY }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-[#004741]/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-[#F59E0B]/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "radial-gradient(circle, #004741 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0">
        {FLOATERS.map((f, i) => (
          <Floater key={i} {...f} sx={sx} sy={sy} index={i} />
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        onClick={handleGoHome}
        className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-[#004741]/20 bg-white/70 px-4 py-2 text-sm font-semibold text-[#004741] backdrop-blur transition-colors hover:bg-white"
      >
        <Home className="h-4 w-4" />
        Univora Homes
      </motion.button>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="flex">
          {digits.map((d, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 60, rotate: i === 1 ? 0 : i === 0 ? -8 : 8 }}
              animate={inView ? { opacity: 1, y: 0, rotate: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.15, duration: 0.7, ease: EASE }}
              whileHover={{ y: -12, rotate: i === 1 ? 0 : i === 0 ? -4 : 4, color: "#F59E0B" }}
              className="cursor-default text-[9rem] font-extrabold leading-none tracking-tighter text-[#004741] sm:text-[13rem] lg:text-[15rem]"
              style={{ textShadow: "0 20px 60px rgba(0,71,65,0.15)" }}
            >
              {d}
            </motion.span>
          ))}
        </div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.7, ease: EASE }}
          className="mb-6 h-1.5 w-24 origin-center rounded-full bg-[#F59E0B]"
        />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
          className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl"
        >
          This page has moved out.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-3 max-w-md text-sm leading-relaxed text-slate-500 sm:text-base"
        >
          {foundKey
            ? "You found the spare key! Let's get you back inside."
            : keysFled
            ? "Even the keys ran away from this one. Let's head home."
            : "The link may be broken, or the page never moved in. Either way, there's no rent due here."}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.85, duration: 0.6, ease: EASE }}
          className="mt-8 flex flex-col items-center gap-4 sm:flex-row"
        >
          <motion.button
            onClick={handleGoHome}
            onMouseEnter={() => setKeysFled(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group relative overflow-hidden rounded-xl bg-[#004741] px-8 py-4 font-bold text-white shadow-xl shadow-[#004741]/25"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <span className="relative flex items-center gap-2">
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back to homepage
            </span>
          </motion.button>

          <motion.button
            onClick={() => setFoundKey(true)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-xl border border-[#004741]/25 bg-white/60 px-8 py-4 font-bold text-[#004741] backdrop-blur transition-colors hover:bg-white"
          >
            Search for the spare key
          </motion.button>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="absolute bottom-6 text-xs text-slate-400"
      >
        Error 404 · Page not found · Univora Homes
      </motion.p>
    </div>
  );
}

function Floater({ icon: Icon, x, y, size, depth, color, rotate, sx, sy, index }) {
  const fx = useTransform(sx, [0, 1], [-depth, depth]);
  const fy = useTransform(sy, [0, 1], [-depth, depth]);

  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, x: fx, y: fy }}
      animate={{ rotate: [rotate, rotate + 8, rotate], y: [0, -10, 0] }}
      transition={{
        rotate: { duration: 6 + index, repeat: Infinity, ease: "easeInOut" },
        y: { duration: 4 + index * 0.5, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      <Icon className="opacity-25" style={{ width: size, height: size, color }} />
    </motion.div>
  );
}