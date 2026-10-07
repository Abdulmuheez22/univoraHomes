import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Mail, MessageCircle, MapPin, Send, User,
  AtSign, ChevronDown, CheckCircle2, Clock3,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const CONTACTS = [
  {
    icon: Mail,
    label: "Email",
    value: "univorahomes@gmail.com",
    href: "mailto:univorahomes@gmail.com",
    accent: "#004741",
    soft: "bg-[#004741]/10 text-[#004741]",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "0901 794 2879",
    href: "https://wa.me/2349017942879",
    accent: "#25D366",
    soft: "bg-green-100 text-green-600",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Nigeria",
    href: null,
    accent: "#F59E0B",
    soft: "bg-amber-100 text-amber-600",
  },
];

const ROLES = ["Landlord", "Agent", "Tenant"];

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

const inputCls =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 py-3.5 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-300 focus:border-[#004741] focus:bg-white focus:ring-4 focus:ring-[#004741]/10";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", role: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name && form.email && form.role && form.message;

  const submit = (e) => {
    e.preventDefault();
    if (!valid || sending) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-white py-24 lg:py-32">
      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#004741]/5 blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold tracking-widest text-slate-500"
          >
            <Clock3 className="h-3.5 w-3.5 text-[#004741]" />
            CONTACT US
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
          >
            Have questions?{" "}
            <span className="relative inline-block text-[#004741]">
              We're happy to help.
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
            className="mt-5 text-lg text-slate-600"
          >
            Reach out and our team will get back to you within 24 hours.
          </motion.p>
        </div>

        <div ref={ref} className="grid gap-6 lg:grid-cols-5">
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
            className="rounded-3xl border border-slate-100 bg-white p-7 shadow-[0_20px_50px_-16px_rgba(0,0,0,0.08)] sm:p-9 lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-h-[420px] flex-col items-center justify-center gap-4 text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 16 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#004741]/10"
                  >
                    <CheckCircle2 className="h-8 w-8 text-[#004741]" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900">Message sent!</h3>
                  <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                    Thanks, {form.name.split(" ")[0]}. Our team will get back to you within 24 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => { setSent(false); setForm({ name: "", email: "", role: "", message: "" }); }}
                    className="mt-2 text-sm font-semibold text-[#004741] underline-offset-4 hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="space-y-5"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field icon={User} label="Full Name" delay={0.3} inView={inView}>
                      <input required value={form.name} onChange={update("name")} placeholder="John Doe" className={inputCls} />
                    </Field>
                    <Field icon={AtSign} label="Email Address" delay={0.38} inView={inView}>
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
                    disabled={!valid || sending}
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
                      {sending ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                        </>
                      )}
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
            <div className="rounded-3xl bg-[#004741] p-7 sm:p-8">
              <h3 className="mb-1 text-lg font-bold text-white">Quick contact</h3>
              <p className="mb-6 text-sm text-white/60">Prefer reaching out directly? Pick a channel.</p>
              <div className="space-y-3">
                {CONTACTS.map((c, i) => {
                  const Wrap = c.href ? motion.a : motion.div;
                  return (
                    <motion.div
                      key={c.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.45 + i * 0.1, duration: 0.5, ease: EASE }}
                    >
                      <Wrap
                        {...(c.href ? { href: c.href, target: c.href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" } : {})}
                        whileHover={c.href ? { x: 6 } : {}}
                        className={`flex items-center gap-4 rounded-2xl bg-white/5 p-4 ${c.href ? "cursor-pointer transition-colors duration-300 hover:bg-white/10" : ""}`}
                      >
                        <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ${c.soft}`}>
                          <c.icon className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wider text-white/50">{c.label}</p>
                          <p className="truncate text-sm font-semibold text-white">{c.value}</p>
                        </div>
                      </Wrap>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.75, duration: 0.5, ease: EASE }}
              className="flex items-center gap-3 rounded-3xl border border-slate-100 bg-white p-6 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.06)]"
            >
              <span className="relative flex h-3 w-3 flex-shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
              </span>
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Typically replies</span> within a few hours, Monday–Saturday.
              </p>
            </motion.div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}