import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, Mail, MessageCircle, MapPin, ArrowUp } from "lucide-react";
import {
  MAILTO_SUPPORT,
  SITE_NAME,
  SUPPORT_EMAIL,
  WHATSAPP_DISPLAY,
  WHATSAPP_URL,
} from "../../lib/site";

const EASE = [0.22, 1, 0.36, 1];

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.9"
    aria-hidden="true"
    {...props}
  >
    <rect x="2.75" y="2.75" width="18.5" height="18.5" rx="5.25" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.35" cy="6.65" r="1.15" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.86v-8.39H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.39C19.61 23.02 24 18.06 24 12.07z" />
  </svg>
);

const SOCIALS = [
  { icon: XIcon, label: "Follow Univora Homes on X", href: "#" },
  { icon: InstagramIcon, label: "Follow Univora Homes on Instagram", href: "#" },
  { icon: LinkedInIcon, label: "Univora Homes on LinkedIn", href: "#" },
  { icon: FacebookIcon, label: "Univora Homes on Facebook", href: "#" },
];

const LINK_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Properties", to: "/properties" },
      { label: "Features", href: "#features" },
      { label: "Workspaces", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Contact Us", href: "#contact" },
    ],
  },
];

const linkCls =
  "group relative w-fit text-sm text-white/60 transition-colors duration-300 hover:text-white";

function Underline() {
  return (
    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#F59E0B] transition-all duration-300 group-hover:w-full" />
  );
}

function FooterLink({ children, href = "#", to, ...rest }) {
  if (to) {
    return (
      <Link to={to} className={linkCls} {...rest}>
        {children}
        <Underline />
      </Link>
    );
  }
  return (
    <motion.a
      href={href}
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className={linkCls}
      {...rest}
    >
      {children}
      <Underline />
    </motion.a>
  );
}

function SocialButton({ icon: Icon, label, href, index, inView }) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{
        delay: 0.5 + index * 0.07,
        type: "spring",
        stiffness: 300,
        damping: 18,
      }}
      whileHover={{ y: -4, backgroundColor: "#F59E0B", color: "#004741" }}
      whileTap={{ scale: 0.9 }}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70"
    >
      <Icon className="h-4 w-4" />
    </motion.a>
  );
}

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer className="relative overflow-hidden bg-[#00332F]">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[700px] -translate-x-1/2 rounded-full bg-[#004741] blur-3xl" />

      <div
        ref={ref}
        className="relative mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20"
      >
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-col items-start gap-5 sm:col-span-2 lg:col-span-1"
          >
            <Link to="/" className="flex items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]">
                <Home className="h-5 w-5 text-[#004741]" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                Univora<span className="text-[#F59E0B]"> Homes</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              A shared property platform for landlords and tenants to publish,
              discover, save, and connect around property listings.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s, i) => (
                <SocialButton key={s.label} {...s} index={i} inView={inView} />
              ))}
            </div>
          </motion.div>

          {LINK_COLUMNS.map((col, ci) => (
            <motion.nav
              key={col.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + ci * 0.1, duration: 0.6, ease: EASE }}
              aria-label={col.title}
            >
              <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <FooterLink to={l.to} href={l.href}>
                      {l.label}
                    </FooterLink>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6, ease: EASE }}
          >
            <h3 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              Contact
            </h3>
            <ul className="space-y-4">
              <li>
                <motion.a
                  href={MAILTO_SUPPORT}
                  whileHover={{ x: 4 }}
                  aria-label={`Email ${SITE_NAME} at ${SUPPORT_EMAIL}`}
                  className="group flex items-center gap-3 text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 transition-colors duration-300 group-hover:bg-[#F59E0B]/20">
                    <Mail className="h-4 w-4 text-[#FBBF24]" />
                  </span>
                  <span className="break-all">{SUPPORT_EMAIL}</span>
                </motion.a>
              </li>
              <li>
                <motion.a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ x: 4 }}
                  aria-label={`Message ${SITE_NAME} on WhatsApp`}
                  className="group flex items-center gap-3 text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 transition-colors duration-300 group-hover:bg-emerald-400/20">
                    <MessageCircle className="h-4 w-4 text-emerald-300" />
                  </span>
                  {WHATSAPP_DISPLAY}
                </motion.a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <MapPin className="h-4 w-4 text-sky-300" />
                </span>
                Nigeria
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 sm:flex-row"
        >
          <p className="text-center text-xs text-white/40 sm:text-left">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <motion.button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.92 }}
            className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/60 transition-colors duration-300 hover:border-[#F59E0B] hover:text-[#F59E0B]"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </motion.button>
        </motion.div>
      </div>
    </footer>
  );
}
