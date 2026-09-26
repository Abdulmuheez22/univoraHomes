import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Home,
  Mail,
  MessageCircle,
  MapPin,
  ArrowUp,
  Heart,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

const SOCIALS = [
  { icon: MessageCircle, label: "Twitter", href: "#" },
  { icon: Home, label: "Instagram", href: "#" },
  { icon: Mail, label: "LinkedIn", href: "#" },
  { icon: MapPin, label: "Facebook", href: "#" },
];

const COLUMNS = [
  {
    title: "Product",
    links: ["Features", "Pricing", "FAQ"],
  },
  {
    title: "Company",
    links: ["About Us", "Contact Us", "Privacy Policy", "Terms of Service"],
  },
];

function FooterLink({ children, href = "#" }) {
  return (
    <motion.a
      href={href}
      whileHover={{ x: 4 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      className="group relative w-fit text-sm text-white/60 transition-colors duration-300 hover:text-white"
    >
      {children}
      <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#F59E0B] transition-all duration-300 group-hover:w-full" />
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
        className="relative mx-auto max-w-7xl px-6 pt-16 pb-8 sm:pt-20"
      >
        <div className="grid gap-12 pb-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
            className="flex flex-col items-start gap-5"
          >
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-2.5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]">
                <Home className="h-5 w-5 text-[#004741]" strokeWidth={2.5} />
              </span>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Univora<span className="text-[#F59E0B]"> Homes</span>
              </span>
            </motion.a>
            <p className="max-w-xs text-sm leading-relaxed text-white/50">
              Property management, simplified.
            </p>
            <div className="flex gap-3">
              {SOCIALS.map((s, i) => (
                <SocialButton key={s.label} {...s} index={i} inView={inView} />
              ))}
            </div>
          </motion.div>

          {COLUMNS.map((col, ci) => (
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
                  <li key={l}>
                    <FooterLink>{l}</FooterLink>
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
                  href="mailto:univorahomes@gmail.com"
                  whileHover={{ x: 4 }}
                  className="group flex items-center gap-3 text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 transition-colors duration-300 group-hover:bg-[#F59E0B]/20">
                    <Mail className="h-4 w-4 text-[#F59E0B]" />
                  </span>
                  univorahomes@gmail.com
                </motion.a>
              </li>
              <li>
                <motion.a
                  href="https://wa.me/2349017942879"
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ x: 4 }}
                  className="group flex items-center gap-3 text-sm text-white/60 transition-colors duration-300 hover:text-white"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5 transition-colors duration-300 group-hover:bg-green-500/20">
                    <MessageCircle className="h-4 w-4 text-green-400" />
                  </span>
                  0901 794 2879
                </motion.a>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-white/5">
                  <MapPin className="h-4 w-4 text-[#F59E0B]" />
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
            © 2026 Univora Homes. All rights reserved. · A subsidiary of{" "}
            <a
              href="#"
              className="font-semibold text-white/60 transition-colors duration-300 hover:text-[#F59E0B]"
            >
              Univora Group
            </a>
          </p>
          <motion.button
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

      {/* <div className="pointer-events-none relative flex justify-center pb-4">
        <p className="flex items-center gap-1.5 text-[11px] text-white/25">
          Crafted with{" "}
          <Heart className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" /> by Univora
          Group
        </p> */}
      {/* </div> */}
    </footer>
  );
}
