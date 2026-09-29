import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Home,
  User,
  AtSign,
  Lock,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  ChevronDown,
  Building2,
  KeyRound,
  Rocket,
  Check,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../lib/services/auth.service";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1];

const ROLES = [
  {
    id: "landlord",
    label: "landlord",
    icon: Building2,
    desc: "I own properties",
  },
  // { id: "agent", label: "Agent", icon: Rocket, desc: "I manage for others" },
  { id: "tenant", label: "tenant", icon: KeyRound, desc: "I'm renting a home" },
];

const PERKS = [
  "Free for up to 5 properties",
  "No credit card required",
  "Set up in under 5 minutes",
];

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT - Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

function strengthOf(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}

const STRENGTH = [
  { label: "Weak", color: "#ef4444" },
  { label: "Fair", color: "#f59e0b" },
  { label: "Good", color: "#0F766E" },
  { label: "Strong", color: "#004741" },
];

export default function SignUp() {
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate("/verifyotp", { state: { email: form.email } });
  };

  const [apiResponse, setApiResponse] = useState({});

  const { mutate, isPending } = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      setApiResponse(data);
      console.log("Account Created", data);
      setStatus("done");
    },
    onError: (error) => {
      console.log("something went wrong", error);
      setStatus("idle");
      setError("Unable to create your account. Please try again.");
    },
  });

  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [form, setForm] = useState({
    fullName: "",
    role: "",
    email: "",
    phoneNumber: "",
    state: "",
    city: "",
    password: "",
  });

  const [role, setRole] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const update = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [k]: "" }));
    setError("");
  };

  const setFieldError = (key, message) => {
    setFieldErrors((prev) => ({ ...prev, [key]: message }));
  };

  const strength = strengthOf(form.password);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (!role) return setError("Please select your role to continue.");

    const phoneDigits = form.phoneNumber.replace(/\D/g, "");
    if (phoneDigits.length < 7 || phoneDigits.length > 11) {
      setFieldError(
        "phoneNumber",
        "Phone number must be between 7 and 11 digits.",
      );
      return setError("Please enter a valid phone number.");
    }

    if (!form.state) return setError("Please select your state.");
    if (!form.city.trim()) return setError("Please enter your city.");
    if (form.password.length < 8)
      return setError("Password must be at least 8 characters.");
    if (form.password !== form.confirm)
      return setError("Passwords do not match.");
    if (!agree) return setError("Please accept the terms to continue.");
    setStatus("loading");
    const payload = { ...form, role };
    console.log(payload);
    mutate(payload);
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-[#004741] focus:bg-white focus:ring-4 focus:ring-[#004741]/10";

  // if(apiResponse){console.log(apiResponse)}
  // else if(!apiResponse){console.log('no api response')}
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="relative hidden w-[45%] overflow-hidden bg-[#004741] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#F59E0B]/20 blur-3xl"
        />
        j
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
        {/* <a href="#" className="relative z-10 flex w-fit items-center gap-2.5"> */}
        {/* <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]">
            <Home className="h-5 w-5 text-[#004741]" strokeWidth={2.5} />
            home
          </span> */}
        <span className="text-2xl font-extrabold tracking-tight text-white">
          Univora<span className="text-[#F59E0B]"> Homes</span>
        </span>
        {/* </a> */}
        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
            className="text-4xl font-bold leading-tight tracking-tight text-white xl:text-5xl"
          >
            Property management,
            <span className="block text-[#F59E0B]">simplified.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-4 max-w-sm text-white/60"
          >
            Create your account and bring every property, tenant, and payment
            into one calm dashboard.
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
              "I stopped chasing rent the week I signed up."
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
                <h1 className="text-3xl font-bold text-slate-900">
                  Welcome, {form.fullName.split(" ")[0]}!
                </h1>
                <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                  Your {ROLES.find((r) => r.id === role)?.label.toLowerCase()}{" "}
                  account is ready. We've sent a confirmation OTP to{" "}
                  <span className="font-semibold text-slate-700">
                    {form.email}
                  </span>
                  .
                </p>
                <motion.div
                  onClick={handleVerify}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 flex items-center gap-2 cursor-pointer rounded-xl bg-[#004741] px-8 py-3.5 font-bold text-white shadow-lg shadow-[#004741]/25"
                >
                  Verify email
                  <ArrowRight className="h-4 w-4" />
                </motion.div>
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
                    <span className="text-lg font-extrabold text-[#F59E0B]">
                      Univora<span className="text-[#004741]"> Homes</span>
                    </span>
                  </a>
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    Create your account
                  </h1>
                  <p className="mt-2 text-sm text-slate-500">
                    Already have one?{" "}
                    <Link
                      to="/signin"
                      className="font-semibold text-[#004741] underline-offset-4 hover:underline"
                    >
                      Sign in
                    </Link>
                  </p>
                </motion.div>

                <form onSubmit={submit} className="mt-8 space-y-5">
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1, duration: 0.5, ease: EASE }}
                  >
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      I am a
                    </label>
                    <div className="flex flex-wrap justify-around">
                      {ROLES.map((r) => {
                        const active = role === r.id;
                        return (
                          // <div className="w-full my-2 flex flex-wrap justify-between items-center gap-4">
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setRole(r.id)}
                            className={`w-40 h-18 flex justify-between cursor-pointer flex-col items-center  gap-1.5 rounded-xl border-2 py-3.5 transition-all duration-300 ${
                              active
                                ? "border-[#004741] bg-[#004741]/5 shadow-sm"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <motion.span
                              animate={
                                active
                                  ? { scale: 1.1, rotate: -6 }
                                  : { scale: 1, rotate: 0 }
                              }
                              transition={{
                                type: "spring",
                                stiffness: 350,
                                damping: 16,
                              }}
                            >
                              <r.icon
                                className={`h-5 w-5 ${active ? "text-[#004741]" : "text-slate-400"}`}
                              />
                            </motion.span>
                            <span
                              className={`text-xs font-bold ${active ? "text-[#004741]" : "text-slate-600"}`}
                            >
                              {r.label}
                            </span>
                            {active && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#004741]"
                              >
                                <Check
                                  className="h-3 w-3 text-white"
                                  strokeWidth={3}
                                />
                              </motion.span>
                            )}
                          </button>
                          // </div>
                        );
                      })}
                    </div>
                    <p className="mt-1.5 text-center text-xs text-slate-400">
                      {ROLES.find((r) => r.id === role)?.desc ||
                        "Choose the role that fits you"}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.16, duration: 0.5, ease: EASE }}
                  >
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        required
                        value={form.fullName}
                        onChange={update("fullName")}
                        placeholder="John Doe"
                        className={inputCls}
                      />
                    </div>
                  </motion.div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.22, duration: 0.5, ease: EASE }}
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
                      transition={{ delay: 0.28, duration: 0.5, ease: EASE }}
                    >
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <span className="absolute left-10 top-1/2 -translate-y-1/2 border-r border-slate-200 pr-2.5 text-sm font-semibold text-slate-400">
                          +234
                        </span>
                        <input
                          required
                          type="tel"
                          value={form.phoneNumber}
                          maxLength={11}
                          onChange={(e) => {
                            const v = e.target.value
                              .replace(/[^\d\s]/g, "")
                              .slice(0, 11);
                            setForm((f) => ({ ...f, phoneNumber: v }));
                            setFieldErrors((prev) => ({
                              ...prev,
                              phoneNumber: "",
                            }));
                            setError("");
                          }}
                          placeholder="801 234 5678"
                          className={`${inputCls} pl-[76px] ${fieldErrors.phone ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                        />
                      </div>
                      {fieldErrors.phone && (
                        <p className="mt-1 text-xs font-medium text-red-600">
                          {fieldErrors.phone}
                        </p>
                      )}
                    </motion.div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.34, duration: 0.5, ease: EASE }}
                      className="group"
                    >
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        State
                      </label>
                      <div className="relative">
                        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-300 group-focus-within:text-[#004741]" />
                        <select
                          required
                          value={form.state}
                          onChange={update("state")}
                          className={`${inputCls} cursor-pointer appearance-none ${form.state ? "text-slate-900" : "text-slate-400"}`}
                        >
                          <option value="" disabled>
                            Select state
                          </option>
                          {NIGERIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform duration-300 group-focus-within:rotate-180" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
                    >
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        City
                      </label>
                      <div className="relative">
                        <Home className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          required
                          value={form.city}
                          onChange={update("city")}
                          placeholder="e.g. Lekki, Ikeja, Wuse"
                          className={inputCls}
                        />
                      </div>
                    </motion.div>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.46, duration: 0.5, ease: EASE }}
                    >
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          required
                          type={showPw ? "text" : "password"}
                          value={form.password}
                          onChange={update("password")}
                          placeholder="Min. 8 characters"
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
                      {form.password && (
                        <div className="mt-2">
                          <div className="flex gap-1">
                            {[0, 1, 2, 3].map((i) => (
                              <motion.span
                                key={i}
                                animate={{
                                  backgroundColor:
                                    i < strength
                                      ? STRENGTH[Math.max(0, strength - 1)]
                                          .color
                                      : "#e2e8f0",
                                }}
                                transition={{ duration: 0.3 }}
                                className="h-1 flex-1 rounded-full"
                              />
                            ))}
                          </div>
                          <p
                            className="mt-1 text-[11px] font-medium"
                            style={{
                              color: form.password
                                ? STRENGTH[Math.max(0, strength - 1)].color
                                : "#94a3b8",
                            }}
                          >
                            {STRENGTH[Math.max(strength - 1, 0)].label}
                          </p>
                        </div>
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.52, duration: 0.5, ease: EASE }}
                    >
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          required
                          type={showPw ? "text" : "password"}
                          // value={form.confirm}
                          onChange={update("confirm")}
                          placeholder="Repeat password"
                          className={`${inputCls} ${form.confirm && form.confirm !== form.password ? "border-red-400 focus:border-red-400 focus:ring-red-100" : ""}`}
                        />
                        {form.confirm && form.confirm === form.password && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            <Check
                              className="h-4 w-4 text-green-600"
                              strokeWidth={3}
                            />
                          </motion.span>
                        )}
                      </div>
                    </motion.div>
                  </div>

                  <motion.label
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.58, duration: 0.5, ease: EASE }}
                    className="flex cursor-pointer items-start gap-3"
                  >
                    <button
                      type="button"
                      onClick={() => setAgree(!agree)}
                      className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 transition-all duration-300 ${
                        agree
                          ? "border-[#004741] bg-[#004741]"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      <AnimatePresence>
                        {agree && (
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
                            <Check
                              className="h-3 w-4 text-white"
                              strokeWidth={3.5}
                            />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                    <span className="text-xs leading-relaxed text-slate-500">
                      I agree to the{" "}
                      <a
                        href="#"
                        className="font-semibold text-[#004741] underline-offset-2 hover:underline"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="font-semibold text-[#004741] underline-offset-2 hover:underline"
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </motion.label>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    // onClick={console.log(form)}
                    disabled={isPending}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.64, duration: 0.5, ease: EASE }}
                    whileHover={{ scale: isPending ? 1 : 1.02 }}
                    whileTap={{ scale: isPending ? 1 : 0.97 }}
                    className="group cursor-pointer relative w-full overflow-hidden rounded-xl bg-[#004741] py-4 font-bold text-white shadow-lg shadow-[#004741]/25"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                    <span className="relative flex items-center justify-center gap-2">
                      {isPending ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 0.8,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                          />
                          Creating your account...
                        </>
                      ) : (
                        <>
                          Create account
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </motion.button>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.72, duration: 0.5 }}
                    className="flex items-center justify-center gap-2 pt-1 text-xs text-slate-400"
                  >
                    <ShieldCheck className="h-4 w-4 text-[#004741]" />
                    Your data is encrypted and never shared.
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
