import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

const NAV_ITEMS = ["Home", "About", "Services", "Contact"];

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={`w-full bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm transition-all duration-300 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <img
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-lg transition-transform duration-300 hover:scale-105"
              src="univora homes logo-1.jpg"
              alt="Univora Homes logo"
            />
            <h1 className="text-[#004741] hidden lg:block text-2xl sm:text-2xl font-bold tracking-tight">
              Univora <span className="text-[#F59E0B]">Homes</span>
            </h1>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item}
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `relative font-semibold text-base transition-colors py-1 group ${
                    isActive ? "text-[#F59E0B]" : "text-[#004741] hover:text-[#F59E0B]"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-[#F59E0B] transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/signup"
              className="group relative overflow-hidden px-5 py-2.5 rounded-xl bg-[#004741] text-[#F0E8D5] font-semibold text-sm shadow-md hover:bg-[#003530] hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <span className="relative">Get Started</span>
            </Link>

            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="md:hidden cursor-pointer flex flex-col justify-center items-center gap-[5px] p-2 hover:bg-[#004741]/10 rounded-xl active:bg-[#004741]/20 transition-all duration-200"
            >
              <span
                className={`h-[3px] w-6 bg-[#004741] rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  open ? "translate-y-[8px] rotate-45" : ""
                }`}
              />
              <span
                className={`h-[3px] w-6 bg-[#004741] rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                  open ? "opacity-0 scale-x-0" : ""
                }`}
              />
              <span
                className={`h-[3px] w-6 bg-[#004741] rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
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
            className="fixed inset-0 top-20 z-40 bg-[#004741]/30 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={open ? { x: 0 } : { x: "-100%" }}
        transition={{ duration: 0.35, ease: EASE }}
        className="fixed top-20 left-0 z-50 w-[80%] max-w-sm h-[calc(100vh-5rem)] bg-white/95 backdrop-blur-2xl border-r border-t border-[#004741]/10 shadow-2xl flex flex-col justify-between p-8 rounded-r-3xl md:hidden"
      >
        <div className="flex flex-col gap-6">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={open ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs font-bold tracking-widest text-[#004741]/50 uppercase"
          >
            Menu
          </motion.h2>
          {NAV_ITEMS.map((item, i) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: -24 }}
              animate={open ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
              transition={{ delay: open ? 0.12 + i * 0.06 : 0, duration: 0.4, ease: EASE }}
            >
              <NavLink
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={({ isActive }) =>
                  `block text-lg font-semibold transition-all duration-200 active:scale-98 ${
                    isActive
                      ? "text-[#F59E0B] translate-x-2"
                      : "text-[#004741] hover:text-[#F59E0B] hover:translate-x-2"
                  }`
                }
              >
                {item}
              </NavLink>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ delay: open ? 0.4 : 0, duration: 0.4, ease: EASE }}
          className="space-y-3"
        >
          <Link
            to="/signup"
            className="block w-full bg-[#004741] hover:bg-[#003530] active:scale-95 cursor-pointer py-3 rounded-xl text-white text-center font-bold shadow-md hover:shadow-lg transition-all duration-200"
          >
            Get Started Free
          </Link>
          <p className="text-center text-xs text-slate-400">Free for 1 property · No credit card</p>
        </motion.div>
      </motion.aside>
    </>
  );
}

export default Header;