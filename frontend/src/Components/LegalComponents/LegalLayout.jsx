import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Home, Mail, ScrollText } from "lucide-react";
import {
  LEGAL_LAST_UPDATED,
  MAILTO_SUPPORT,
  SITE_NAME,
  SUPPORT_EMAIL,
} from "../../lib/site";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Shared shell for the Terms of Service and Privacy Policy pages.
 *
 * `sections` is an array of `{ id, heading, body }`. `id` doubles as the
 * in-page anchor and the table-of-contents target, so it must be unique.
 */
export default function LegalLayout({ kicker, title, intro, sections }) {
  // Anchor links shouldn't leave the reader halfway down the new page.
  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <div className="min-h-screen bg-[#F0E8D5]">
      <div className="relative overflow-hidden bg-[#00332F]">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[700px] -translate-x-1/2 rounded-full bg-[#004741] blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 pb-12 pt-8 sm:px-6 sm:pt-10">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="flex items-center gap-2.5"
              aria-label={`${SITE_NAME} home`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F59E0B]">
                <Home className="h-4 w-4 text-[#004741]" strokeWidth={2.5} />
              </span>
              <span className="text-base font-extrabold tracking-tight text-white sm:text-lg">
                Univora<span className="text-[#F59E0B]"> Homes</span>
              </span>
            </Link>

            <Link
              to="/"
              className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition-colors duration-300 hover:border-[#F59E0B] hover:text-[#F59E0B]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              Back to site
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mt-12"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-[#F59E0B]/15 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#FBBF24]">
              <ScrollText className="h-3.5 w-3.5" />
              {kicker}
            </span>

            <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              {intro}
            </p>

            <p className="mt-6 text-xs font-medium uppercase tracking-[0.15em] text-white/40">
              Last updated · {LEGAL_LAST_UPDATED}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <motion.nav
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: EASE }}
          aria-label="On this page"
          className="rounded-2xl border border-[#004741]/10 bg-white/70 p-5 backdrop-blur sm:p-6"
        >
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-[#004741]/50">
            On this page
          </h2>
          <ol className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
            {sections.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="group flex items-baseline gap-2.5 text-sm text-slate-600 transition-colors duration-200 hover:text-[#004741]"
                >
                  <span className="text-xs font-bold tabular-nums text-[#F59E0B]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="group-hover:underline group-hover:underline-offset-2">
                    {s.heading}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </motion.nav>

        <article className="mt-8 space-y-4">
          {sections.map((s, i) => (
            <motion.section
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: EASE }}
              className="scroll-mt-6 rounded-2xl border border-[#004741]/10 bg-white p-6 shadow-sm shadow-[#004741]/5 sm:p-8"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-extrabold tabular-nums text-[#F59E0B]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="text-lg font-bold tracking-tight text-[#111827] sm:text-xl">
                  {s.heading}
                </h2>
              </div>
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600 [&_a]:font-semibold [&_a]:text-[#004741] [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-[#111827] [&_ul]:ml-4 [&_ul]:list-disc [&_ul]:space-y-2">
                {s.body}
              </div>
            </motion.section>
          ))}
        </article>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-8 rounded-2xl bg-[#004741] p-6 sm:p-8"
        >
          <h2 className="text-lg font-bold tracking-tight text-white">
            Questions about this document?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-white/60">
            Reach the {SITE_NAME} team directly and we'll respond as quickly as
            we can.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={MAILTO_SUPPORT}
              className="inline-flex items-center gap-2 rounded-xl bg-[#F59E0B] px-5 py-3 text-sm font-bold text-[#004741] transition-transform duration-200 hover:scale-[1.03]"
            >
              <Mail className="h-4 w-4" />
              {SUPPORT_EMAIL}
            </a>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white/80 transition-colors duration-200 hover:border-[#F59E0B] hover:text-[#F59E0B]"
            >
              Return home
            </Link>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </div>
  );
}
