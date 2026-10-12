import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Mail, MessageCircle, MapPin, Send, User,
  AtSign, ChevronDown, CheckCircle2, Clock3, ArrowUpRight,
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

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [form, setForm] = useState({ name: "", email: "", role: "", message: "" });
  const [sent, setSent] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name && form.email && form.role && form.message;

  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    const subject = encodeURIComponent(`Univora Homes enquiry from ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nRole: ${form.role}\n\n${form.message}`,
    );
    window.location.href = `${MAILTO_SUPPORT}?subject=${subject}&body=${body}`;
    setSent(true);
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
            Share your question and we will prepare an email for you to review and send.
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
              {sent ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex min-h-[320px] flex-col items-center justify-center gap-4 text-center sm:min-h-[420px]"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 16 }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#004741]/10"
                  >
                    <CheckCircle2 className="h-8 w-8 text-[#004741]" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900">Email draft prepared</h3>
                  <p className="max-w-sm text-sm leading-relaxed text-slate-500">
                    If your email app opened, review and send the draft to contact our team. Otherwise, email us directly.
                  </p>
                  <a
                    href={MAILTO_SUPPORT}
                    className="text-sm font-semibold text-[#004741] underline-offset-4 hover:underline"
                  >
                    Email support directly
                  </a>
                  <button
                    type="button"
                    onClick={() => { setSent(false); setForm({ name: "", email: "", role: "", message: "" }); }}
                    className="text-sm font-semibold text-slate-500 underline-offset-4 hover:text-[#004741] hover:underline"
                  >
                    Edit message
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
                      Prepare email
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
