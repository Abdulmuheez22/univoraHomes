import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];

/* `to` renders a router Link, `href` renders an in-page anchor. */
const NAV_ITEMS = [
  { label: "Overview", href: "#home" },
  { label: "Properties", to: "/properties", icon: Building2 },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Contact", href: "#contact" },
];

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full border-b border-gray-100 bg-white/85 backdrop-blur-md transition-all duration-300 ${
          scrolled ? "h-16 shadow-sm" : "h-[4.5rem] sm:h-20"
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-2 px-3 sm:px-6 lg:px-8">
          <a
            href="#home"
            aria-label="Univora Homes home"
            onClick={() => setOpen(false)}
            className="flex min-w-0 shrink items-center gap-2 sm:gap-3"
          >
            <h1 className="truncate text-base font-bold tracking-tight text-[#004741] min-[380px]:text-lg sm:text-xl lg:text-2xl">
              Univora <span className="text-[#F59E0B]">Homes</span>
            </h1>
          </a>

          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-4 md:flex lg:gap-8"
          >
            {NAV_ITEMS.map(({ label, href, to, icon: Icon }) =>
              to ? (
                <Link
                  key={label}
                  to={to}
                  className="group relative flex items-center gap-1.5 py-1 text-sm font-semibold text-[#004741] transition-colors hover:text-[#F59E0B] lg:text-base"
                >
                  <Icon className="h-4 w-4 text-[#F59E0B]" aria-hidden="true" />
                  {label}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#F59E0B] transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <a
                  key={label}
                  href={href}
                  className="group relative py-1 text-sm font-semibold text-[#004741] transition-colors hover:text-[#F59E0B] lg:text-base"
                >
                  {label}
                  <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#F59E0B] transition-all duration-300 group-hover:w-full" />
                </a>
              ),
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <Link
              to="/signup"
              className="group relative flex items-center justify-center overflow-hidden rounded-xl bg-[#004741] px-3 py-2 text-xs font-semibold text-[#F0E8D5] shadow-md transition-all duration-200 hover:bg-[#003530] hover:shadow-lg active:scale-95 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <span className="relative whitespace-nowrap sm:hidden">
                Sign up
              </span>
              <span className="relative hidden whitespace-nowrap sm:inline">
                Get Started
              </span>
            </Link>

            <button
              onClick={() => setOpen((isOpen) => !isOpen)}
              aria-label={
                open ? "Close navigation menu" : "Open navigation menu"
              }
              aria-controls="mobile-navigation"
              aria-expanded={open}
              className="flex cursor-pointer flex-col items-center justify-center gap-[5px] rounded-xl p-2 transition-all duration-200 hover:bg-[#004741]/10 active:bg-[#004741]/20 md:hidden"
            >
              <span
                className={`h-[3px] w-5 rounded-full bg-[#004741] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sm:w-6 ${
                  open ? "translate-y-[8px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[3px] w-5 rounded-full bg-[#004741] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sm:w-6 ${
                  open ? "scale-x-0 opacity-0" : ""
                }`}
              />
              <span
                className={`h-[3px] w-5 rounded-full bg-[#004741] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] sm:w-6 ${
                  open ? "-translate-y-[8px] -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setOpen(false)}
            className={`fixed inset-0 z-40 bg-[#004741]/30 backdrop-blur-sm md:hidden ${
              scrolled ? "top-16" : "top-[4.5rem]"
            }`}
          />
        )}
      </AnimatePresence>

      <motion.aside
        id="mobile-navigation"
        aria-label="Mobile navigation"
        initial={false}
        animate={open ? { x: 0 } : { x: "-100%" }}
        transition={{ duration: 0.35, ease: EASE }}
        className={`fixed left-0 z-50 flex w-[86%] max-w-sm flex-col justify-between overflow-y-auto border-r border-t border-[#004741]/10 bg-white/95 p-5 shadow-2xl backdrop-blur-2xl sm:p-8 md:hidden ${
          scrolled
            ? "top-16 h-[calc(100dvh-4rem)]"
            : "top-[4.5rem] h-[calc(100dvh-4.5rem)]"
        }`}
      >
        <div className="flex flex-col gap-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={open ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs font-bold uppercase tracking-widest text-[#004741]/50"
          >
            Menu
          </motion.h2>
          <nav aria-label="Mobile navigation links" className="flex flex-col gap-5 sm:gap-6">
            {NAV_ITEMS.map(({ label, href, to, icon: Icon }, i) => {
              const linkCls =
                "flex items-center gap-3 text-base font-semibold text-[#004741] transition-all duration-200 hover:translate-x-2 hover:text-[#F59E0B] sm:text-lg";
              return (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -24 }}
                  animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
                  transition={{
                    delay: open ? 0.12 + i * 0.06 : 0,
                    duration: 0.4,
                    ease: EASE,
                  }}
                >
                  {to ? (
                    <Link to={to} onClick={() => setOpen(false)} className={linkCls}>
                      <Icon
                        className="h-4 w-4 shrink-0 text-[#F59E0B]"
                        aria-hidden="true"
                      />
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      onClick={() => setOpen(false)}
                      className={linkCls}
                    >
                      {label}
                    </a>
                  )}
                </motion.div>
              );
            })}
          </nav>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: open ? 0.45 : 0, duration: 0.4, ease: EASE }}
          className="mt-8 space-y-3"
        >
          {/* <Link
            to="/properties"
            onClick={() => setOpen(false)}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-[#004741]/20 py-3 text-center text-sm font-bold text-[#004741] transition-all duration-200 hover:border-[#004741] hover:bg-[#004741]/5 active:scale-95 sm:text-base"
          >
            <Building2 className="h-4 w-4 shrink-0 text-[#F59E0B]" />
            Browse Properties
          </Link> */}
          <Link
            to="/signin"
            onClick={() => setOpen(false)}
            className="block w-full cursor-pointer rounded-xl border-2 border-[#004741] py-3 text-center text-sm font-bold text-[#004741] transition-all duration-200 hover:bg-[#004741]/10 active:scale-95 sm:text-base"
          >
            Sign in
          </Link>
          <Link
            to="/signup"
            onClick={() => setOpen(false)}
            className="group relative block w-full overflow-hidden rounded-xl bg-[#004741] py-3 text-center text-sm font-bold text-white shadow-md transition-all duration-200 hover:bg-[#003530] hover:shadow-lg active:scale-95 sm:text-base"
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
            <span className="relative flex items-center justify-center gap-2">
              Create Free Account
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </Link>
          <p className="text-center text-[11px] text-slate-400 sm:text-xs">
            Choose the workspace that fits your role
          </p>
        </motion.div>
      </motion.aside>
    </>
  );
}

export default Header;
