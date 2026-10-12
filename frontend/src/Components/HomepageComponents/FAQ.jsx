import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { HelpCircle, Plus, MessageCircleQuestion, Mail } from "lucide-react";
import { SUPPORT_EMAIL, mailtoWithSubject } from "../../lib/site";

const EASE = [0.22, 1, 0.36, 1];

const FAQS = [
  {
    q: "What can I do as a landlord?",
    a: "You can create and manage property listings, review tenant connection requests, and view tenants connected to your properties.",
  },
  {
    q: "What can I do as a tenant?",
    a: "You can browse and filter listings, save properties to revisit, send connection requests, track their status, and view landlord connections.",
  },
  {
    q: "Can I switch between landlord and tenant?",
    a: "Yes. Use the role switch in your profile or dashboard sidebar to move between the landlord and tenant workspaces.",
  },
  {
    q: "Do I need an account to browse properties?",
    a: "Available property listings can be browsed publicly. Sign in or create an account to save properties and manage connection requests.",
  },
  {
    q: "How do tenants connect with landlords?",
    a: "Open a property listing and send a connection request. You can follow its status from your tenant dashboard.",
  },
  {
    q: "Where can I get help?",
    a: "Use the contact form or email our support team. The contact form opens a prefilled email draft for you to review and send.",
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
        type="button"
        onClick={() => onToggle(open ? null : index)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:gap-4 sm:px-7 sm:py-5"
      >
        <span className={`text-sm font-semibold transition-colors duration-300 sm:text-base ${open ? "text-[#004741]" : "text-slate-900"}`}>
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
            <p className="px-4 pb-5 text-sm leading-relaxed text-slate-600 sm:px-7 sm:pb-6 sm:text-base">
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
    <section id="faq" className="relative overflow-hidden bg-[#f7f5f0] py-20 lg:py-32">
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#004741]/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-24 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
        <div className="mb-12 text-center lg:mb-14">

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
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
            className="mt-5 text-base text-slate-600 sm:text-lg"
          >
            The questions we are asked most often, answered directly.
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
          className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-[#004741]/15 bg-white p-5 text-center sm:flex-row sm:justify-between sm:p-6 sm:text-left"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#004741]/10 text-[#004741]">
              <MessageCircleQuestion className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-slate-900">Still have questions?</p>
              <p className="text-sm text-slate-500">
                Email our team and we will get back to you.
              </p>
            </div>
          </div>
          <motion.a
            href={mailtoWithSubject("Univora Homes support request")}
            aria-label={`Contact support by email at ${SUPPORT_EMAIL}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="group flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#004741] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#004741]/25 sm:w-auto"
          >
            <Mail className="h-4 w-4 transition-transform duration-300 group-hover:-rotate-6" />
            Contact support
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
