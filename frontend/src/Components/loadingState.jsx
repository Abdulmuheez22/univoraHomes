import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const BUILDINGS = [
  { w: 60, h: 140, delay: 0.5 },
  { w: 84, h: 220, delay: 0.65 },
  { w: 52, h: 110, delay: 0.8 },
  { w: 96, h: 260, delay: 0.55 },
  { w: 64, h: 160, delay: 0.9 },
  { w: 76, h: 200, delay: 0.7 },
  { w: 56, h: 130, delay: 0.85 },
];

const WINDOWS = [
  { x: 18, y: 14, delay: 0.9 },
  { x: 46, y: 14, delay: 1.0 },
  { x: 18, y: 34, delay: 1.1 },
  { x: 46, y: 34, delay: 1.2 },
  { x: 18, y: 54, delay: 1.3 },
  { x: 46, y: 54, delay: 1.4 },
];

export default function loadingState({ onDone }) {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 9 + 3;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setHidden(true);
          setTimeout(() => onDone?.(), 900);
        }, 500);
      }
      setProgress(Math.floor(p));
    }, 160);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-[#00332F]"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "30px 30px" }}
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.35, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F59E0B]/15 blur-3xl"
          />

          <div className="relative flex flex-col items-center">
            <div className="relative mb-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-8"
              >
                <motion.span
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#F59E0B] shadow-[0_0_16px_4px_rgba(245,158,11,0.5)]"
                />
              </motion.div>

              <svg width="180" height="180" viewBox="0 0 120 120" fill="none">
                <motion.path
                  d="M60 14 L104 46"
                  stroke="#F59E0B"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
                />
                <motion.path
                  d="M16 46 L60 14"
                  stroke="#F59E0B"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
                />
                <motion.path
                  d="M24 44 L24 96 L96 96 L96 44"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.7 }}
                />
                <motion.path
                  d="M50 96 L50 70 Q50 64 56 64 L64 64 Q70 64 70 70 L70 96"
                  stroke="#F59E0B"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, ease: EASE, delay: 1.5 }}
                />
                <motion.path
                  d="M60 64 L60 96"
                  stroke="#F59E0B"
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, ease: EASE, delay: 1.9 }}
                />
                {WINDOWS.map((w, i) => (
                  <motion.rect
                    key={i}
                    x={w.x}
                    y={w.y}
                    width="12"
                    height="12"
                    rx="2"
                    fill="#F59E0B"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0.85, 1], scale: 1 }}
                    transition={{ delay: w.delay, duration: 0.6, ease: EASE }}
                  />
                ))}
                <motion.circle
                  cx="65"
                  cy="80"
                  r="2.5"
                  fill="#00332F"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.1 }}
                />
                <motion.path
                  d="M24 96 L96 96"
                  stroke="#ffffff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 2.2 }}
                />
              </svg>

              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [-10, -34],
                    x: [0, i === 0 ? -18 : i === 1 ? 16 : -4],
                  }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: 1.6 + i * 0.4, ease: "easeOut" }}
                  className="absolute left-1/2 top-6 h-1.5 w-1.5 rounded-full bg-white/60"
                />
              ))}
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6, ease: EASE }}
              className="text-2xl font-extrabold tracking-tight text-white"
            >
              Univora<span className="text-[#F59E0B]"> Homes</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="mt-2 text-xs font-medium uppercase tracking-[0.3em] text-white/40"
            >
              Property management, simplified
            </motion.p>

            <div className="mt-10 w-56">
              <div className="mb-2 flex items-end justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-white/40">Loading</span>
                <span className="text-sm font-extrabold tabular-nums text-[#F59E0B]">{progress}%</span>
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

          <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 opacity-30">
            {BUILDINGS.map((b, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: b.h }}
                transition={{ delay: b.delay, duration: 0.9, ease: EASE }}
                className="relative rounded-t-md bg-white/15"
                style={{ width: b.w }}
              >
                {[...Array(Math.floor(b.h / 34))].map((_, r) =>
                  [...Array(Math.floor(b.w / 22))].map((_, c) => (
                    <motion.span
                      key={`${r}-${c}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0.4] }}
                      transition={{
                        delay: b.delay + 0.5 + r * 0.15 + c * 0.1,
                        duration: 1.6,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 4 + 2,
                      }}
                      className="absolute h-2 w-2 rounded-sm bg-[#F59E0B]/60"
                      style={{ left: 8 + c * 22, top: 12 + r * 34 }}
                    />
                  ))
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}