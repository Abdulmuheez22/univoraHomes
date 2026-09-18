import React, { useState } from "react";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="w-full h-20 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <img
              className="h-12 w-12 sm:h-14 sm:w-14 object-contain rounded-lg transition-transform duration-300 hover:scale-105"
              src="univora homes logo-1.jpg"
              alt="Univora Homes logo"
            />
            <h1 className="text-[#004741] hidden sm:block text-2xl sm:text-2xl font-bold tracking-tight">
              Univora <span className="text-[#F59E0B]">Homes</span>
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["Home", "About", "Services", "Contact"].map((item) => (
              <a
                key={item}
                className="relative text-[#004741] font-semibold text-base transition-colors hover:text-[#F59E0B] py-1 group"
                href="#"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#F59E0B] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Actions Section */}
          <div className="flex items-center gap-3">
            {/* Get Started Button */}
            <a
              href="#"
              className="px-5 py-2.5 rounded-xl bg-[#004741] text-[#F0E8D5] font-semibold text-sm shadow-md hover:bg-[#003530] hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center"
            >
              Get Started
            </a>

            {/* Hamburger Button */}
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
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

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-20 left-0 z-50 w-[80%] max-w-sm h-[calc(100vh-5rem)] bg-white/95 backdrop-blur-2xl border-r border-t border-[#004741]/10 shadow-2xl flex flex-col justify-between p-8 rounded-r-3xl transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          <h2 className="text-xs font-bold tracking-widest text-[#004741]/50 uppercase">
            Menu
          </h2>
          {["Home", "About", "Services", "Contact"].map((item) => (
            <a
              key={item}
              className="text-[#004741] text-lg font-semibold hover:text-[#F59E0B] hover:translate-x-2 active:scale-98 transition-all duration-200"
              href="#"
            >
              {item}
            </a>
          ))}
        </div>

        <div>
          <button className="w-full bg-[#004741] hover:bg-[#003530] active:scale-95 cursor-pointer py-3 rounded-xl text-white font-bold shadow-md hover:shadow-lg transition-all duration-200">
            Login
          </button>
        </div>
      </aside>
    </>
  );
}

export default Header;