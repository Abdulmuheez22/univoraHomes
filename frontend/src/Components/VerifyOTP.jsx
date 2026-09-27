import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Home,
  MailCheck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  KeyRound,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];
const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;
import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "../lib/services/auth.service";
import { useLocation } from "react-router-dom";

export default function VerifyOTP({ onResend }) {
  const { state } = useLocation();
  const email = state?.email;

  if (!email) {
    return <div>No email provided. Please go back and try again.</div>;
  }

  const { mutateAsync, isLoading, isError } = useMutation({
    mutationFn: verifyOtp,
    onSuccess: (data) => {
      console.log("server response: ", data);
    },
    onError: (error) => {
      // console.log("something went wrong fecthing from the db: ", error);
    },
  });

  const onVerify = async (code) => {
    try {
      const data = await mutateAsync({ email, otp: code });
      return data?.message === true;
    } catch (error) {
      // console.log("something went wrong:", error);
      return false;
    }
  };

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const inputsRef = useRef([]);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const verify = useCallback(
    async (code) => {
      setStatus("loading");
      setError(false);
      const ok = await onVerify?.(code);
      setTimeout(() => {
        if (ok === false) {
          setStatus("idle");
          setError(true);
          setOtp(Array(OTP_LENGTH).fill(""));
          setActive(0);
          inputsRef.current[0]?.focus();
          setTimeout(() => setError(false), 600);
        } else {
          setStatus("done");
        }
      }, 1400);
    },
    [onVerify],
  );

  const setDigit = (i, val) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    setOtp((prev) => {
      const next = [...prev];
      next[i] = digit;
      return next;
    });
    if (digit) {
      const nextIndex = Math.min(i + 1, OTP_LENGTH - 1);
      setActive(nextIndex);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  const handleChange = (i, e) => setDigit(i, e.target.value);

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (otp[i]) {
        setOtp((prev) => {
          const next = [...prev];
          next[i] = "";
          return next;
        });
      } else if (i > 0) {
        setActive(i - 1);
        inputsRef.current[i - 1]?.focus();
        setOtp((prev) => {
          const next = [...prev];
          next[i - 1] = "";
          return next;
        });
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      setActive(i - 1);
      inputsRef.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < OTP_LENGTH - 1) {
      setActive(i + 1);
      inputsRef.current[i + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!pasted) return;
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, idx) => {
      next[idx] = d;
    });
    setOtp(next);
    const last = Math.min(pasted.length, OTP_LENGTH - 1);
    setActive(last);
    inputsRef.current[last]?.focus();
    if (pasted.length === OTP_LENGTH) verify(pasted);
  };

  useEffect(() => {
    const code = otp.join("");
    if (
      code.length === OTP_LENGTH &&
      otp.every((d) => d !== "") &&
      status === "idle"
    ) {
      const otpData = {
        email: email,
        otp: code,
      };
      verify(code);
    }
  }, [otp, status, verify]);

  const handleResend = () => {
    if (resendTimer > 0) return;
    onResend?.();
    setResent(true);
    setResendTimer(RESEND_SECONDS);
    setTimeout(() => setResent(false), 3000);
    setOtp(Array(OTP_LENGTH).fill(""));
    setActive(0);
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="relative hidden w-[45%] overflow-hidden bg-[#004741] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#F59E0B]/20 blur-3xl"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <a href="#" className="relative z-10 flex w-fit items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]">
            <Home className="h-5 w-5 text-[#004741]" strokeWidth={2.5} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Univora<span className="text-[#F59E0B]"> Homes</span>
          </span>
        </a>

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
            className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F59E0B]/15"
          >
            <KeyRound className="h-7 w-7 text-[#F59E0B]" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: EASE }}
            className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl"
          >
            Almost home.
            <span className="block text-[#F59E0B]">Just one key left.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-4 max-w-sm text-white/60"
          >
            We sent a 6-digit code to your inbox. Enter it here and your
            dashboard unlocks instantly.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="relative z-10 flex items-center gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur"
        >
          <ShieldCheck className="h-8 w-8 flex-shrink-0 text-[#F59E0B]" />
          <p className="text-sm text-white/70">
            Codes expire in{" "}
            <span className="font-bold text-white">10 minutes</span> and can
            only be used once.
          </p>
        </motion.div>
      </aside>

      <main
        ref={ref}
        className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10"
      >
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {status === "done" ? (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="flex flex-col items-center gap-4 py-16 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.15,
                    type: "spring",
                    stiffness: 280,
                    damping: 16,
                  }}
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-[#004741]/10"
                >
                  <CheckCircle2 className="h-10 w-10 text-[#004741]" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.35,
                    type: "spring",
                    stiffness: 300,
                    damping: 14,
                  }}
                  className="-mt-14 ml-14 flex h-8 w-8 items-center justify-center rounded-full bg-[#F59E0B] shadow-lg"
                >
                  <motion.svg
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="#004741"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                </motion.div>
                <h1 className="text-3xl font-bold text-slate-900">
                  You're verified!
                </h1>
                <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                  Your email is confirmed. Welcome to a calmer way to manage
                  property.
                </p>
                <motion.a
                  href="/dashboard"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 flex items-center gap-2 rounded-xl bg-[#004741] px-8 py-3.5 font-bold text-white shadow-lg shadow-[#004741]/25"
                >
                  Enter your dashboard
                  <ArrowRight className="h-4 w-4" />
                </motion.a>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -16 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <a
                    href="#"
                    className="mb-8 flex w-fit items-center gap-2 lg:hidden"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#004741]">
                      <Home
                        className="h-4 w-4 text-[#F59E0B]"
                        strokeWidth={2.5}
                      />
                    </span>
                    <span className="text-lg font-extrabold text-slate-900">
                      Univora<span className="text-[#004741]"> Homes</span>
                    </span>
                  </a>
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#004741]/10 lg:hidden">
                    <MailCheck className="h-7 w-7 text-[#004741]" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Check your inbox
                  </h1>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    We sent a 6-digit verification code to{" "}
                    <span className="font-semibold text-slate-700">
                      {email}
                    </span>
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
                  className="mt-10"
                >
                  <motion.div
                    animate={
                      error ? { x: [0, -12, 12, -8, 8, -4, 4, 0] } : { x: 0 }
                    }
                    transition={{ duration: 0.5 }}
                    className="flex justify-between gap-2 sm:gap-3"
                  >
                    {otp.map((digit, i) => (
                      <div key={i} className="relative flex-1">
                        <motion.div
                          animate={
                            active === i && status !== "loading"
                              ? { scale: [1, 1.08, 1] }
                              : { scale: 1 }
                          }
                          transition={{
                            duration: 0.9,
                            repeat: active === i ? Infinity : 0,
                          }}
                          className="absolute inset-0 rounded-xl"
                          style={{
                            border: `2px solid ${
                              error
                                ? "#ef4444"
                                : active === i
                                  ? "#004741"
                                  : "#e2e8f0"
                            }`,
                            boxShadow:
                              active === i
                                ? "0 0 0 4px rgba(0,71,65,0.08)"
                                : "none",
                          }}
                        />
                        <input
                          ref={(el) => (inputsRef.current[i] = el)}
                          type="text"
                          inputMode="numeric"
                          autoComplete={i === 0 ? "one-time-code" : "off"}
                          maxLength={1}
                          value={digit}
                          disabled={status === "loading"}
                          onChange={(e) => handleChange(i, e)}
                          onKeyDown={(e) => handleKeyDown(i, e)}
                          onPaste={handlePaste}
                          onFocus={() => setActive(i)}
                          className={`relative z-10 h-14 w-full rounded-xl bg-transparent text-center text-2xl font-extrabold text-slate-900 caret-[#F59E0B] outline-none transition-colors sm:h-16 ${
                            status === "loading" ? "opacity-50" : ""
                          }`}
                        />
                        {status === "loading" && digit && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                          >
                            <motion.span
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 0.8, repeat: Infinity }}
                              className="block h-2.5 w-2.5 rounded-full bg-[#F59E0B]"
                            />
                          </motion.span>
                        )}
                      </div>
                    ))}
                  </motion.div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600"
                      >
                        That code doesn't match. Check your email and try again.
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.35, duration: 0.5 }}
                    className="mt-8 text-center"
                  >
                    {status === "loading" ? (
                      <p className="flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="h-4 w-4 rounded-full border-2 border-[#004741]/20 border-t-[#004741]"
                        />
                        Verifying your code...
                      </p>
                    ) : (
                      <p className="text-sm text-slate-500">
                        Didn't get the code?{" "}
                        {resendTimer > 0 ? (
                          <span className="font-semibold tabular-nums text-slate-400">
                            Resend in 0:{String(resendTimer).padStart(2, "0")}
                          </span>
                        ) : (
                          <button
                            onClick={handleResend}
                            className="group inline-flex items-center gap-1.5 font-semibold text-[#004741] underline-offset-4 hover:underline"
                          >
                            <RotateCcw className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180" />
                            Resend code
                          </button>
                        )}
                      </p>
                    )}
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.45, duration: 0.5 }}
                    className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400"
                  >
                    <ShieldCheck className="h-4 w-4 text-[#004741]" />
                    Wrong email?{" "}
                    <a
                      href="/signup"
                      className="font-semibold text-[#004741] underline-offset-2 hover:underline"
                    >
                      Go back and fix it
                    </a>
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
