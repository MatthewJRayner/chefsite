"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PortfolioNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "bg-stone-50/80 backdrop-blur-md border-b border-stone-200/50 py-4 shadow-sm"
          : "bg-transparent py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
        {/* Brand logo */}
        <a href="#hero" className="flex flex-col group">
          <span className="text-xl sm:text-2xl font-serif tracking-wide text-stone-900 group-hover:text-accent transition-colors">
            Theresa Oemmelen
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-stone-500 font-sans mt-0.5">
            Private Chef
          </span>
        </a>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-10">
          <a
            href="#about"
            className="text-xs uppercase tracking-widest text-stone-600 hover:text-stone-900 font-medium transition-colors"
          >
            About
          </a>
          <a
            href="#services"
            className="text-xs uppercase tracking-widest text-stone-600 hover:text-stone-900 font-medium transition-colors"
          >
            Services
          </a>
          <a
            href="#menus"
            className="text-xs uppercase tracking-widest text-stone-600 hover:text-stone-900 font-medium transition-colors"
          >
            Sample Menus
          </a>
          <a
            href="#contact"
            className="text-xs uppercase tracking-widest text-stone-600 hover:text-stone-900 font-medium transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Portal links */}
        <div className="flex items-center gap-4">
          <Link
            href="/recipes"
            className="text-[11px] uppercase tracking-wider text-stone-500 hover:text-stone-900 border border-stone-300 hover:border-stone-800 px-4 py-2 rounded-none transition-all duration-300 font-sans"
          >
            Recipe Library
          </Link>
        </div>
      </div>
    </nav>
  );
}
