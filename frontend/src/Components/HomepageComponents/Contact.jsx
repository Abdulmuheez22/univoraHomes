import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Mail, MessageCircle, MapPin, Send, User,
  AtSign, ChevronDown, Check, Clock3, ArrowUpRight,
  Loader2, ShieldCheck, Lock, Rocket, Inbox, MailCheck, RefreshCw,
} from "lucide-react";
import {
  MAILTO_SUPPORT,
  SUPPORT_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "../../lib/site";

const EASE = [0.22, 1, 0.36, 1];

/* Tiles are rendered on the dark green card, so every icon needs a light
   foreground and its own ring to stay legible. */
const CONTACTS = [
  {
    icon: Mail,
    label: "Email",
    value: SUPPORT_EMAIL,
    href: MAILTO_SUPPORT,
    tile: "bg-[#F59E0B]/15 text-[#FBBF24] ring-[#F59E0B]/30",
    glow: "bg-[#F59E0B]/25",
    hint: "Send us an email",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: WHATSAPP_DISPLAY,
    href: WHATSAPP_URL,
    tile: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
    glow: "bg-emerald-400/25",
    hint: "Message our team",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Nigeria",
    href: null,
    tile: "bg-sky-400/15 text-sky-300 ring-sky-400/30",
    glow: "bg-sky-400/25",
    hint: "Based in Nigeria",
  },
];

const ROLES = ["Landlord", "Tenant"];

function Field({ icon: Icon, label, children, delay, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5, ease: EASE }}
      className="group"
    >
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-300 group-focus-within:text-[#004741]" />
        {children}
      </div>
    </motion.div>
  );
}

function ContactChannel({ contact, index, inView }) {
  const [hovered, setHovered] = useState(false);
  const Icon = contact.icon;
  const isLink = Boolean(contact.href);

  const inner = (
    <>
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/channel:opacity-100"
        aria-hidden="true"
      >
        <span className={`absolute -left-6 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full opacity-25 blur-2xl ${contact.glow}`} />
      </span>

      <motion.span
        animate={hovered ? { scale: 1.08, rotate: -6 } : { scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 18 }}
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-shadow duration-300 group-hover/channel:shadow-lg group-hover/channel:shadow-black/20 sm:h-12 sm:w-12 ${contact.tile}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </motion.span>

      <div className="relative min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/45">
          {contact.label}
        </p>
        <p className="break-all text-sm font-semibold text-white sm:text-[15px]">
          {contact.value}
        </p>
        <p className="mt-0.5 text-[11px] text-white/40">{contact.hint}</p>
      </div>

      {isLink && (
        <ArrowUpRight
          className="relative h-4 w-4 shrink-0 text-white/25 transition-all duration-300 group-hover/channel:-translate-y-0.5 group-hover/channel:translate-x-0.5 group-hover/channel:text-[#F59E0B]"
          aria-hidden="true"
        />
      )}
    </>
  );

  const shell =
    "group/channel relative flex items-center gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors duration-300 sm:gap-4 sm:p-4";

  return (
    <motion.li
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: 0.45 + index * 0.1, duration: 0.5, ease: EASE }}
    >
      {isLink ? (
        <motion.a
          href={contact.href}
          {...(contact.href.startsWith("http")
            ? { target: "_blank", rel: "noreferrer" }
            : {})}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.99 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`${shell} cursor-pointer hover:border-white/20 hover:bg-white/10`}
        >
          {inner}
        </motion.a>
      ) : (
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={shell}
        >
          {inner}
        </div>
      )}
    </motion.li>
  );
}

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-[#004741] focus:bg-white focus:ring-4 focus:ring-[#004741]/10";

/* Simulated delivery steps shown while the message is "sending". */
const SENDING_STEPS = [
  { icon: ShieldCheck, label: "Validating your message" },
  { icon: Lock, label: "Securing an encrypted connection" },
  { icon: Rocket, label: "Transmitting your message" },
  { icon: Inbox, label: "Delivered to our support team" },
];

function SendingState({ progress }) {
  const pct = Math.round((progress / SENDING_STEPS.length) * 100);

  return (
    <motion.div
      key="sending"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12 }}
      className="relative flex min-h-[320px] flex-col justify-center overflow-hidden sm:min-h-[420px]"
    >
      {/* Paper plane arcing across the card */}
      <motion.div
        initial={{ x: -180, y: 26, opacity: 0 }}
        animate={{ x: 180, y: -46, opacity: [0, 1, 1, 0] }}
        transition={{ duration: 2.8, times: [0, 0.08, 0.88, 1], ease: "easeInOut" }}
        className="pointer-events-none absolute left-1/2 top-14 -ml-3.5 text-[#004741]"
        aria-hidden="true"
      >
        <Send className="h-7 w-7 -rotate-12" strokeWidth={2.2} />
      </motion.div>

      <div className="relative mx-auto mb-7 flex h-16 w-16 items-center justify-center">
        <motion.span
          animate={{ scale: [1, 1.4, 1], opacity: [0.35, 0.08, 0.35] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-[#004741]/15"
        />
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-2 rounded-full border-2 border-dashed border-[#004741]/20"
        />
        <Mail className="relative h-8 w-8 text-[#004741]" />
      </div>

      <p className="mb-8 text-center text-sm font-medium text-slate-500">
        Sending your message…
      </p>

      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <motion.div
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: EASE }}
          className="h-full rounded-full bg-gradient-to-r from-[#004741] to-[#0f9b8f]"
        />
      </div>

      <ul className="space-y-3">
        {SENDING_STEPS.map((step, i) => {
          const done = i < progress;
          const active = i === progress && progress < SENDING_STEPS.length;
          const Icon = step.icon;
          return (
            <motion.li
              key={step.label}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12, duration: 0.4, ease: EASE }}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors duration-300 ${
                done
                  ? "border-emerald-200 bg-emerald-50/60 text-emerald-800"
                  : active
                    ? "border-[#004741]/20 bg-[#004741]/5 text-slate-900"
                    : "border-slate-100 bg-white text-slate-400"
              }`}
            >
              {done ? (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              ) : active ? (
                <Loader2 className="h-6 w-6 shrink-0 animate-spin text-[#004741]" />
              ) : (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                  <Icon className="h-3.5 w-3.5" />
                </span>
              )}
              <span className="font-medium">{step.label}</span>
              {done && (
                <span className="ml-auto text-[11px] font-semibold uppercase tracking-wide text-emerald-600">
                  Done
                </span>
              )}
              {active && (
                <span className="ml-auto animate-pulse text-[11px] font-semibold uppercase tracking-wide text-[#004741]">
                  Working…
                </span>
              )}
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}

function SentState({ receipt, form, onReset }) {
  const sparkles = [
    "bg-amber-400", "bg-[#004741]", "bg-emerald-400", "bg-sky-400",
    "bg-amber-400", "bg-[#0f9b8f]", "bg-rose-300", "bg-violet-300",
  ];

  return (
    <motion.div
      key="sent"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="relative flex min-h-[320px] flex-col items-center justify-center overflow-hidden py-4 text-center sm:min-h-[420px]"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.12, type: "spring", stiffness: 260, damping: 15 }}
        className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#004741]/10"
      >
        {/* Confetti burst radiating from the badge */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const distance = 56 + (i % 4) * 16;
          return (
            <motion.span
              key={i}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0.1],
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance,
              }}
              transition={{ delay: 0.3 + (i % 8) * 0.05, duration: 1.15, ease: "easeOut" }}
              className={`pointer-events-none absolute left-1/2 top-1/2 -ml-1 -mt-1 h-2 w-2 rounded-full ${sparkles[i % sparkles.length]}`}
            />
          );
        })}

        {/* Expanding ripple rings */}
        <motion.span
          initial={{ scale: 0.7, opacity: 0.6 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ delay: 0.25, duration: 1.3, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border-2 border-[#004741]/30"
        />
        <motion.span
          initial={{ scale: 0.7, opacity: 0.6 }}
          animate={{ scale: 1.8, opacity: 0 }}
          transition={{ delay: 0.5, duration: 1.3, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border-2 border-[#F59E0B]/40"
        />

        {/* Animated checkmark */}
        <svg viewBox="0 0 52 52" className="relative h-11 w-11">
          <motion.path
            d="M14 27 l8 8 l16 -16"
            fill="none"
            stroke="#004741"
            strokeWidth={4.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.35, duration: 0.45, ease: "easeOut" }}
          />
        </svg>
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.45, ease: EASE }}
        className="mt-6 text-xl font-bold text-slate-900"
      >
        Message sent successfully!
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.45, ease: EASE }}
        className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500"
      >
        Thank you{form.name ? `, ${form.name}` : ""}. We've received your message and our team will get back to you shortly.
      </motion.p>

      {/* Delivery receipt */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.72, duration: 0.5, ease: EASE }}
        className="mt-6 w-full max-w-sm rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-left"
      >
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Delivery receipt
          </span>
          <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
            <MailCheck className="h-3 w-3" />
            Delivered
          </span>
        </div>
        <dl className="mt-3 space-y-2.5 text-xs">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-400">To</dt>
            <dd className="truncate font-semibold text-slate-900">{SUPPORT_EMAIL}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-400">From</dt>
            <dd className="truncate font-semibold text-slate-900">{form.email || "—"}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-400">Subject</dt>
            <dd className="truncate font-semibold text-slate-900">Univora Homes enquiry</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-400">Sent</dt>
            <dd className="font-semibold text-slate-900">{receipt?.time}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-slate-400">Reference</dt>
            <dd className="font-mono font-bold text-[#004741]">{receipt?.ref}</dd>
          </div>
        </dl>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.88, duration: 0.4 }}
        className="mt-4 flex items-center gap-2 text-xs text-slate-400"
      >
        <Clock3 className="h-3.5 w-3.5" />
        Our team typically responds within 24 hours.
      </motion.div>

      <motion.button
        type="button"
        onClick={onReset}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.98, duration: 0.45, ease: EASE }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#004741] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#004741]/25 transition-colors duration-300 hover:bg-[#0a5a52]"
      >
        <RefreshCw className="h-4 w-4" />
        Send another message
      </motion.button>
    </motion.div>
  );
}

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", role: "", message: "" });
  const [status, setStatus] = useState("idle"); // "idle" | "sending" | "sent"
  const [progress, setProgress] = useState(0);
  const [receipt, setReceipt] = useState(null);
  const timersRef = useRef([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name && form.email && form.role && form.message;

  const reset = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setStatus("idle");
    setProgress(0);
    setReceipt(null);
    setForm({ name: "", email: "", role: "", message: "" });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!valid || status !== "idle") return;

    // Simulate a realistic send: nothing is transmitted, but the UI plays
    // through the full delivery sequence so it looks like the email was sent.
    setStatus("sending");
    setProgress(0);

    const arrivals = [800, 1600, 2400, 3100];
    arrivals.forEach((delay, i) => {
      const id = setTimeout(() => {
        setProgress(i + 1);
        if (i === arrivals.length - 1) {
          setReceipt({
            ref: `UNV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          });
          setStatus("sent");
        }
      }, delay);
      timersRef.current.push(id);
    });
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-white py-20 lg:py-32">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#004741]/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Have a question?{" "}
            <span className="relative inline-block text-[#004741]">
              Our team is ready to help.
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
            className="mt-5 text-base text-slate-600 sm:text-lg"
          >
            Send us a message and our team will get back to you as soon as possible.
          </motion.p>
        </div>

        <div ref={ref} className="grid gap-6 lg:grid-cols-5">
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
            className="rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.08)] sm:p-9 lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {status === "sending" ? (
                <SendingState progress={progress} />
              ) : status === "sent" ? (
                <SentState receipt={receipt} form={form} onReset={reset} />
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field icon={User} label="Full name" delay={0.3} inView={inView}>
                      <input required value={form.name} onChange={update("name")} placeholder="John Doe" className={inputCls} />
                    </Field>
                    <Field icon={AtSign} label="Email address" delay={0.38} inView={inView}>
                      <input required type="email" value={form.email} onChange={update("email")} placeholder="john@example.com" className={inputCls} />
                    </Field>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.46, duration: 0.5, ease: EASE }}
                    className="group"
                  >
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Role</label>
                    <div className="relative">
                      <select
                        required
                        value={form.role}
                        onChange={update("role")}
                        className={`${inputCls} cursor-pointer appearance-none ${form.role ? "text-slate-900" : "text-slate-400"}`}
                      >
                        <option value="" disabled>Select your role</option>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-transform duration-300 group-focus-within:rotate-180" />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.54, duration: 0.5, ease: EASE }}
                  >
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Message</label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={update("message")}
                      placeholder="Tell us how we can help..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/60 p-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-[#004741] focus:bg-white focus:ring-4 focus:ring-[#004741]/10"
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    disabled={!valid}
                    initial={{ opacity: 0, y: 16 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.62, duration: 0.5, ease: EASE }}
                    whileHover={valid ? { scale: 1.02 } : {}}
                    whileTap={valid ? { scale: 0.97 } : {}}
                    className={`group relative w-full overflow-hidden rounded-xl py-4 font-bold text-white transition-all duration-300 ${
                      valid
                        ? "bg-[#004741] shadow-lg shadow-[#004741]/25"
                        : "cursor-not-allowed bg-slate-300"
                    }`}
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      Send message
                      <Send className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                    </span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          <motion.aside
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.7, ease: EASE }}
            className="flex flex-col gap-4 lg:col-span-2"
          >
            <div className="relative overflow-hidden rounded-3xl bg-[#004741] p-5 sm:p-8">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#F59E0B]/15 blur-3xl" />
              <div className="relative mb-5 sm:mb-6">
                <h3 className="text-lg font-bold text-white">Direct contact</h3>
                <p className="mt-1 text-sm text-white/60">
                  Prefer to reach us directly? Choose a channel.
                </p>
              </div>
              <ul className="relative space-y-3">
                {CONTACTS.map((c, i) => (
                  <ContactChannel key={c.label} contact={c} index={i} inView={inView} />
                ))}
              </ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.75, duration: 0.5, ease: EASE }}
              className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.06)] sm:p-6"
            >
              <span className="relative flex h-3 w-3 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
              </span>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Choose a contact channel</span> and our team will respond as soon as possible.
              </p>
            </motion.div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
