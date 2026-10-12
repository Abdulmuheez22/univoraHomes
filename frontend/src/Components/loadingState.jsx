import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const BUILDINGS = [
  { w: 48, h: 120, delay: 0.5 },
  { w: 72, h: 190, delay: 0.65 },
  { w: 44, h: 100, delay: 0.8 },
  { w: 80, h: 230, delay: 0.55 },
  { w: 56, h: 150, delay: 0.9 },
  { w: 64, h: 175, delay: 0.7 },
];

const WINDOWS = [
  { x: 18, y: 14, delay: 0.9 },
  { x: 46, y: 14, delay: 1.0 },
  { x: 18, y: 34, delay: 1.1 },
  { x: 46, y: 34, delay: 1.2 },
  { x: 18, y: 54, delay: 1.3 },
  { x: 46, y: 54, delay: 1.4 },
];

export default function LoadingState() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 9 + 3;
      if (p >= 95) {
        p = 95;
        clearInterval(interval);
      }
      setProgress(Math.floor(p));
    }, 160);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
      transition={{ duration: 0.8, ease: EASE }}
      className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-[#00332F]"
    >
      {/* Subtle grid – pure CSS, no animation cost */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* Soft ambient glow – single element */}
      <motion.div
        animate={{ scale: [1, 1.25, 1], opacity: [0.18, 0.28, 0.18] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F59E0B]/20 blur-3xl"
      />

      <div className="relative flex flex-col items-center">
        {/* Logo / House */}
        <div className="relative mb-2">
          {/* Orbiting dot */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-7"
          >
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#F59E0B] shadow-[0_0_12px_3px_rgba(245,158,11,0.55)]" />
          </motion.div>

          <svg width="170" height="170" viewBox="0 0 120 120" fill="none">
            {/* Roof left */}
            <motion.path
              d="M60 14 L104 46"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.2 }}
            />
            {/* Roof right */}
            <motion.path
              d="M16 46 L60 14"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.75, ease: EASE, delay: 0.35 }}
            />
            {/* Walls */}
            <motion.path
              d="M24 44 L24 96 L96 96 L96 44"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: EASE, delay: 0.65 }}
            />
            {/* Door */}
            <motion.path
              d="M50 96 L50 70 Q50 64 56 64 L64 64 Q70 64 70 70 L70 96"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.65, ease: EASE, delay: 1.4 }}
            />
            {/* Door center line */}
            <motion.path
              d="M60 64 L60 96"
              stroke="#F59E0B"
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, ease: EASE, delay: 1.8 }}
            />
            {/* Windows */}
            {WINDOWS.map((w, i) => (
              <motion.rect
                key={i}
                x={w.x}
                y={w.y}
                width="12"
                height="12"
                rx="2"
                fill="#F59E0B"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: w.delay, duration: 0.5, ease: EASE }}
              />
            ))}
            {/* Door knob */}
            <motion.circle
              cx="65"
              cy="80"
              r="2.5"
              fill="#00332F"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.0 }}
            />
            {/* Base line */}
            <motion.path
              d="M24 96 L96 96"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.45, ease: EASE, delay: 2.1 }}
            />
          </svg>

          {/* Soft rising particles (only 3, lightweight) */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.7, 0],
                y: [-8, -32],
                x: [0, i === 0 ? -14 : i === 1 ? 14 : -2],
              }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                delay: 1.5 + i * 0.45,
                ease: "easeOut",
              }}
              className="absolute left-1/2 top-5 h-1.5 w-1.5 rounded-full bg-white/50"
            />
          ))}
        </div>

        {/* Brand */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.95, duration: 0.55, ease: EASE }}
          className="text-2xl font-extrabold tracking-tight text-white"
        >
          Univora<span className="text-[#F59E0B]"> Homes</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.45 }}
          className="mt-2 text-xs font-medium uppercase tracking-[0.3em] text-white/40"
        >
          Property management, simplified
        </motion.p>

        {/* Progress */}
        <div className="mt-10 w-56">
          <div className="mb-2 flex items-end justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">
              Loading
            </span>
            <span className="text-sm font-extrabold tabular-nums text-[#F59E0B]">
              {progress}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#004741] via-[#0F766E] to-[#F59E0B]"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Skyline – much lighter */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1.5 opacity-25">
        {BUILDINGS.map((b, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: b.h }}
            transition={{ delay: b.delay, duration: 0.85, ease: EASE }}
            className="relative rounded-t-md bg-white/20"
            style={{ width: b.w }}
          >
            {/* Only 1–2 static-looking windows per building (no nested infinite loops) */}
            <div className="absolute inset-x-0 top-3 flex flex-col gap-5 px-2">
              {Array.from({ length: Math.min(3, Math.floor(b.h / 50)) }).map((_, r) => (
                <div key={r} className="flex gap-2">
                  <div className="h-1.5 w-1.5 rounded-[1px] bg-[#F59E0B]/50" />
                  {b.w > 55 && <div className="h-1.5 w-1.5 rounded-[1px] bg-[#F59E0B]/50" />}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}