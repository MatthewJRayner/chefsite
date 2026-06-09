"use client";

import { useState } from "react";

interface MenuItem {
  name: string;
  description: string;
}

interface MenuSection {
  courseName: string;
  items: MenuItem[];
}

interface Menu {
  id: string;
  title: string;
  description: string;
  sections: MenuSection[];
}

interface MenuAccordionProps {
  menus: Menu[];
}

export default function MenuAccordion({ menus }: MenuAccordionProps) {
  const [openIndex, setOpenIndex] = useState<string | null>("tasting");

  const toggle = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {menus.map((menu) => {
        const isOpen = openIndex === menu.id;
        return (
          <div
            key={menu.id}
            className="border-b border-stone-200 py-4 transition-all duration-300"
          >
            <button
              onClick={() => toggle(menu.id)}
              className="w-full flex items-center justify-between text-left focus:outline-none py-4 group"
            >
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-stone-900 group-hover:text-accent transition-colors duration-300">
                  {menu.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-serif italic mt-1">
                  {menu.description}
                </p>
              </div>
              <div className="ml-4 flex items-center justify-center w-8 h-8 rounded-full border border-stone-200 group-hover:border-stone-400 transition-colors duration-300 group-active:scale-90">
                <span
                  className={`text-xl text-stone-600 transition-transform duration-300 transform ${isOpen ? "rotate-45" : "rotate-0"
                    }`}
                >
                  +
                </span>
              </div>
            </button>

            {/* Accordion Content */}
            <div
              className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100 mt-6" : "max-h-0 opacity-0"
                }`}
            >
              <div className="grid grid-cols-1 gap-8 text-center pb-6">
                {menu.sections.map((section, idx) => (
                  <div key={idx} className="space-y-6">
                    <h4 className="text-[10px] tracking-[0.25em] uppercase font-semibold text-accent border-b border-stone-100 pb-2">
                      {section.courseName}
                    </h4>
                    <div className="space-y-4">
                      {section.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="group">
                          <h5 className="font-serif text-base text-stone-900 group-hover:text-accent transition-colors duration-300">
                            {item.name}
                          </h5>
                          <p className="text-xs text-stone-500 font-sans leading-relaxed mt-1">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
