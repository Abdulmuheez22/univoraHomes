import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Home,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  Apple,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { signIn } from "../lib/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
// 
import { useContext } from "react";

const EASE = [0.22, 1, 0.36, 1];

const SOCIALS = [
  { id: "google", label: "Google" },
  //   { id: "facebook", label: "Facebook", icon: FacebookIcon },
  //   { id: "apple", label: "Apple", icon: Apple },
];

function FacebookIcon() {
  return (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.5 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.6 1.6-1.6h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.3v3.2h2.8V21h3.4Z"
      />
    </svg>
  );
}

const PERKS = [
  "Rent tracking in real time",
  "Maintenance without the chaos",
  "Documents, always findable",
];

function GoogleIcon() {
  return (
    <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.66-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.93-2.91l-3.87-3c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29v-3.1H1.29a12 12 0 0 0 0 10.78l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.34.6 4.58 1.8l3.44-3.44A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.61l4 3.1c.94-2.84 3.59-4.94 6.71-4.94z"
      />
    </svg>
  );
}

export default function SignIn({ onSignIn, onSocial }) {
  // const {setSharedData } = useContext(ThemeContext)
  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      // console.log(data)
    }
  });

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("loading");
    try {
      await mutateAsync(form);
      await onSignIn?.(form);
      // setForm({ email: "", password: "" });
      setStatus("done");
      navigate("/dashboard");
    } catch (err) {
      setStatus("idle");
      setError(
        err.response?.data?.message ||
          "Unable to sign in. Please check your details and try again.",
      );
    }
  };

  const social = async (provider) => {
    setError("");
    setStatus("loading");
    await onSocial?.(provider);
    setStatus("idle");
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-[#004741] focus:bg-white focus:ring-4 focus:ring-[#004741]/10";
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

        <a href="/" className="relative z-10 flex w-fit items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]">
            <Home className="h-5 w-5 text-[#004741]" strokeWidth={2.5} />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Univora<span className="text-[#F59E0B]"> Homes</span>
          </span>
        </a>

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
            className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl"
          >
            Welcome
            <span className="block text-[#F59E0B]">back home.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 max-w-sm text-white/60"
          >
            Your properties kept everything exactly where you left it.
          </motion.p>
          <ul className="mt-8 space-y-3">
            {PERKS.map((p, i) => (
              <motion.li
                key={p}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.5 + i * 0.12,
                  duration: 0.5,
                  ease: EASE,
                }}
                className="flex items-center gap-3 text-sm text-white/80"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F59E0B]/20">
                  <Check
                    className="h-3.5 w-3.5 text-[#F59E0B]"
                    strokeWidth={3}
                  />
                </span>
                {p}
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="relative z-10 flex items-center gap-3 rounded-2xl bg-white/5 p-4 backdrop-blur"
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F59E0B]/20 text-sm font-bold text-[#F59E0B]">
            AO
          </span>
          <div>
            <p className="text-sm font-semibold text-white">
              "Logging in to check rent feels like checking my balance — but
              nicer."
            </p>
            <p className="mt-0.5 text-xs text-white/50">
              Adaeze O. — Landlord, Lekki
            </p>
          </div>
        </motion.div>
      </aside>

      <main
        ref={ref}
        className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="w-full max-w-md"
        >
          <a href="/" className="mb-8 flex w-fit items-center gap-2 lg:hidden">
            {/* <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#004741]">
              <Home className="h-4 w-4 text-[#F59E0B]" strokeWidth={2.5} />
            </span> */}
            <span className="text-2xl font-extrabold text-[#004741]">
              Univora<span className="text-[#F59E0B]"> Homes</span>
            </span>
          </a>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            New here?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#004741] underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
            >
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Email Address
              </label>
              <div className="relative">
                <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="john@example.com"
                  className={inputCls}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.18, duration: 0.5, ease: EASE }}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#004741] underline-offset-2 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  required
                  type={showPw ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Your password"
                  className={`${inputCls} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-[#004741]"
                >
                  {showPw ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.26, duration: 0.5, ease: EASE }}
              className="flex items-center gap-3"
            >
              <button
                type="button"
                onClick={() => setRemember(!remember)}
                className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all duration-300 ${
                  remember
                    ? "border-[#004741] bg-[#004741]"
                    : "border-slate-300 bg-white"
                }`}
              >
                <AnimatePresence>
                  {remember && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                    >
                      <Check className="h-3 w-4 text-white" strokeWidth={3.5} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
              <span className="text-sm text-slate-500">
                Keep me signed in on this device
              </span>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={status === "loading"}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.34, duration: 0.5, ease: EASE }}
              whileHover={{ scale: status === "loading" ? 1 : 1.02 }}
              whileTap={{ scale: status === "loading" ? 1 : 0.97 }}
              className="group cursor-pointer relative w-full overflow-hidden rounded-xl bg-[#004741] py-4 font-bold text-white shadow-lg shadow-[#004741]/25"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <span className="relative flex items-center justify-center gap-2">
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing you in...
                  </>
                ) : status === "done" ? (
                  <>
                    <Check className="h-4 w-4" strokeWidth={3} />
                    Welcome back!
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.42, duration: 0.5 }}
              className="flex items-center gap-4 py-1"
            >
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                or continue with
              </span>
              <span className="h-px flex-1 bg-slate-200" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5, duration: 0.5, ease: EASE }}
              className="flex items-center justify-center"
            >
              {SOCIALS.map((s) => (
                <motion.button
                  key={s.id}
                  type="button"
                  onClick={() => social(s.id)}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="group cursor-pointer w-36 flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 bg-white py-3.5 transition-all duration-300 hover:border-[#004741]/30 hover:shadow-md"
                >
                  {s.id === "google" ? (
                    <GoogleIcon />
                  ) : (
                    <s.icon
                      className="h-4.5 w-4.5"
                      style={{
                        color: s.id === "facebook" ? "#1877F2" : "#000000",
                      }}
                    />
                  )}
                  <span className="text-[11px] font-semibold text-slate-500 transition-colors group-hover:text-slate-800">
                    {s.label}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.58, duration: 0.5 }}
              className="flex items-center justify-center gap-1.5 pt-1 text-xs text-slate-400"
            >
              <Sparkles className="h-3.5 w-3.5 text-[#F59E0B]" />
              Protected by 256-bit encryption
            </motion.p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
