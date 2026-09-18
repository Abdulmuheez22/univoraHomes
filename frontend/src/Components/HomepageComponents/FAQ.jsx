import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { HelpCircle, Plus, MessageCircleQuestion } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const FAQS = [
  {
    q: "Is my data safe on Univora Homes?",
    a: "Yes. All documents and information are securely stored and only accessible to the right people based on their role.",
  },
  {
    q: "Do I need to be tech-savvy to use it?",
    a: "Not at all. Univora Homes is designed to be simple — if you can use WhatsApp, you can use this.",
  },
  {
    q: "What happens when I exceed 5 properties on the free plan?",
    a: "You'll be prompted to upgrade to a paid plan. Your existing data stays safe and nothing gets deleted.",
  },
  {
    q: "Can tenants pay rent through the app?",
    a: "Online payment is coming soon. For now, landlords record payments manually after receiving them.",
  },
  {
    q: "How do tenants get notified about rent?",
    a: "Automatic reminders are sent via email. WhatsApp notifications are coming soon.",
  },
  {
    q: "Can one agent manage properties for multiple landlords?",
    a: "Yes — agents have their own dashboard to manage multiple properties across different landlords.",
  },
];

function FaqItem({ faq, index, open, onToggle, inView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.25 + index * 0.07, duration: 0.55, ease: EASE }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative overflow-hidden rounded-2xl border transition-colors duration-300 ${
        open ? "border-[#004741]/20 bg-white shadow-lg shadow-[#004741]/5" : "border-slate-200 bg-white/70 hover:border-slate-300"
      }`}
    >
      <motion.span
        animate={{ scaleY: open || hovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="absolute left-0 top-0 h-full w-1 origin-top bg-[#004741]"
      />

      <button
        onClick={() => onToggle(open ? null : index)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-7"
      >
        <span className={`font-semibold transition-colors duration-300 ${open ? "text-[#004741]" : "text-slate-900"}`}>
          {faq.q}
        </span>
        <motion.span
          animate={{ rotate: open ? 45 : 0, backgroundColor: open ? "#004741" : "#f1f5f9", color: open ? "#ffffff" : "#64748b" }}
          transition={{ type: "spring", stiffness: 320, damping: 20 }}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-sm leading-relaxed text-slate-600 sm:px-7 sm:text-base">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [open, setOpen] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden bg-[#f7f5f0] py-24 lg:py-32">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#004741]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-24 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-6">
        <div className="mb-14 text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-widest text-slate-500"
          >
            <HelpCircle className="h-3.5 w-3.5 text-[#004741]" />
            FAQ
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl"
          >
            Frequently Asked{" "}
            <span className="relative inline-block text-[#004741]">
              Questions
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
            Everything you're wondering, answered straight.
          </motion.p>
        </div>

        <div ref={ref} className="space-y-3">
          {FAQS.map((faq, i) => (
            <FaqItem
              key={faq.q}
              faq={faq}
              index={i}
              open={open === i}
              onToggle={setOpen}
              inView={inView}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6, ease: EASE }}
          className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-[#004741]/15 bg-white p-6 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#004741]/10 text-[#004741]">
              <MessageCircleQuestion className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-900">Still have questions?</p>
              <p className="text-sm text-slate-500">We reply within a few hours.</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="rounded-xl bg-[#004741] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#004741]/25"
          >
            Contact support
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}