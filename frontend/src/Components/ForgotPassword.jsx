import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  MailCheck,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  requestPasswordReset,
  resetPassword,
  verifyPasswordResetOtp,
} from "../lib/services/auth.service";

const EASE = [0.22, 1, 0.36, 1];
const OTP_LENGTH = 6;

const STEPS = [
  { id: "email", label: "Email" },
  { id: "otp", label: "Code" },
  { id: "password", label: "New password" },
];

const errorMessage = (err, fallback) =>
  err?.response?.data?.message || fallback;

export default function ForgotPassword() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const inputsRef = useRef([]);

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [resetToken, setResetToken] = useState("");
  const [passwords, setPasswords] = useState({ password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loading = status === "loading";
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  /* Step 1 — ask for a code. The API answers the same way whether or not the
     account exists, so the message shown here is always generic. */
  const submitEmail = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setStatus("loading");

    try {
      const data = await requestPasswordReset(email.trim());
      setStatus("idle");
      setNotice(data?.message || "If that email exists, we sent a code.");
      setOtp(Array(OTP_LENGTH).fill(""));
      setStep("otp");
      requestAnimationFrame(() => inputsRef.current[0]?.focus());
    } catch (err) {
      setStatus("idle");
      setError(errorMessage(err, "Unable to send the code. Please try again."));
    }
  };

  /* Step 2 — confirm the code, and keep the reset token it returns. */
  const submitOtp = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== OTP_LENGTH) {
      return setError("Enter the 6 digit code we emailed you.");
    }

    setError("");
    setStatus("loading");

    try {
      const data = await verifyPasswordResetOtp({
        email: email.trim(),
        otp: code,
      });
      setStatus("idle");
      setNotice("");
      setResetToken(data?.resetToken || "");
      setStep("password");
    } catch (err) {
      setStatus("idle");
      setError(errorMessage(err, "That code doesn't match. Please try again."));
      setOtp(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    }
  };

  /* Step 3 — set the new password with the short lived reset token. */
  const submitPassword = async (e) => {
    e.preventDefault();

    if (passwords.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (passwords.password !== passwords.confirm) {
      return setError("Passwords do not match.");
    }

    setError("");
    setStatus("loading");

    try {
      await resetPassword({
        resetToken,
        password: passwords.password,
      });
      setStatus("idle");
      setStep("done");
    } catch (err) {
      setStatus("idle");
      setError(
        errorMessage(err, "Unable to reset the password. Please try again."),
      );
    }
  };

  const setDigit = (index, value) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setError("");
    setOtp((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const onOtpKeyDown = (index) => (e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const onOtpPaste = (e) => {
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH);
    if (!digits) return;

    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    digits.split("").forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    inputsRef.current[Math.min(digits.length, OTP_LENGTH - 1)]?.focus();
  };

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-[#004741] focus:bg-white focus:ring-4 focus:ring-[#004741]/10";

  const submitButton = (label, pendingLabel, Icon) => (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.97 }}
      className="group relative w-full cursor-pointer overflow-hidden rounded-xl bg-[#004741] py-4 font-bold text-white shadow-lg shadow-[#004741]/25 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <span className="relative flex items-center justify-center gap-2">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {pendingLabel}
          </>
        ) : (
          <>
            {label}
            <Icon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </span>
    </motion.button>
  );

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-6 py-12">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#004741]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#F59E0B]/15 blur-3xl" />

      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative w-full max-w-md"
      >
        <Link
          to="/"
          className="mb-8 flex w-fit items-center gap-2.5"
          aria-label="Univora Homes home"
        >
          <span className="text-2xl font-extrabold tracking-tight text-[#004741]">
            Univora<span className="text-[#F59E0B]"> Homes</span>
          </span>
        </Link>

        <AnimatePresence mode="wait">
          {step !== "done" ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Reset your password
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {step === "email" &&
                  "Enter your email address and we will send you a 6 digit code."}
                {step === "otp" &&
                  "Enter the code we emailed you. It expires in 10 minutes."}
                {step === "password" &&
                  "Choose a new password for your account."}
              </p>

              <ol className="mt-6 flex items-center gap-2" aria-label="Progress">
                {STEPS.map((s, i) => (
                  <li key={s.id} className="flex flex-1 items-center gap-2">
                    <span
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-colors duration-300 ${
                        i <= stepIndex
                          ? "bg-[#004741] text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        i < stepIndex ? "bg-[#004741]" : "bg-slate-100"
                      }`}
                    />
                  </li>
                ))}
              </ol>

              {notice && (
                <p
                  role="status"
                  className="mt-6 flex items-start gap-2 rounded-xl bg-[#004741]/5 px-4 py-3 text-sm font-medium text-[#004741]"
                >
                  <MailCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  {notice}
                </p>
              )}

              <AnimatePresence>
                {error && (
                  <motion.p
                    role="alert"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {step === "email" && (
                <form onSubmit={submitEmail} className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="reset-email"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <AtSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="reset-email"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        placeholder="john@example.com"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {submitButton("Send reset code", "Sending...", ArrowRight)}
                </form>
              )}

              {step === "otp" && (
                <form onSubmit={submitOtp} className="mt-6 space-y-5">
                  <div
                    className="flex items-center justify-between gap-2 sm:gap-3"
                    onPaste={onOtpPaste}
                  >
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          inputsRef.current[i] = el;
                        }}
                        value={digit}
                        onChange={(e) => setDigit(i, e.target.value)}
                        onKeyDown={onOtpKeyDown(i)}
                        inputMode="numeric"
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        aria-label={`Digit ${i + 1}`}
                        className="h-14 w-full min-w-0 rounded-xl border-2 border-slate-200 bg-slate-50/60 text-center text-lg font-bold text-slate-900 outline-none transition-all duration-200 focus:border-[#004741] focus:bg-white focus:ring-4 focus:ring-[#004741]/10"
                      />
                    ))}
                  </div>

                  {submitButton("Verify code", "Verifying...", KeyRound)}

                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setNotice("");
                      setError("");
                    }}
                    className="mx-auto flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#004741]"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Use a different email
                  </button>
                </form>
              )}

              {step === "password" && (
                <form onSubmit={submitPassword} className="mt-6 space-y-5">
                  <div>
                    <label
                      htmlFor="reset-password"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      New password
                    </label>
                    <div className="relative">
                      <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="reset-password"
                        required
                        type={showPw ? "text" : "password"}
                        value={passwords.password}
                        onChange={(e) => {
                          setPasswords((p) => ({ ...p, password: e.target.value }));
                          setError("");
                        }}
                        placeholder="At least 8 characters"
                        className={`${inputCls} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw((v) => !v)}
                        aria-label={showPw ? "Hide password" : "Show password"}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-[#004741]"
                      >
                        {showPw ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="reset-confirm"
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        id="reset-confirm"
                        required
                        type={showPw ? "text" : "password"}
                        value={passwords.confirm}
                        onChange={(e) => {
                          setPasswords((p) => ({ ...p, confirm: e.target.value }));
                          setError("");
                        }}
                        placeholder="Repeat your new password"
                        className={inputCls}
                      />
                    </div>
                  </div>

                  {submitButton("Update password", "Saving...", Check)}
                </form>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-center"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#004741]/10">
                <CheckCircle2 className="h-7 w-7 text-[#004741]" />
              </span>
              <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
                Password updated
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                You can now sign in with your new password.
              </p>
              <Link
                to="/signin"
                className="group relative mt-8 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#004741] py-4 font-bold text-white shadow-lg shadow-[#004741]/25"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                <span className="relative flex items-center gap-2">
                  Go to sign in
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {step !== "done" && (
          <p className="mt-8 text-center text-sm text-slate-500">
            Remembered it?{" "}
            <Link
              to="/signin"
              className="font-semibold text-[#004741] underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        )}
      </motion.div>
    </div>
  );
}
