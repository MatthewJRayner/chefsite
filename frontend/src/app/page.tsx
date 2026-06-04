"use client";

import { useState } from "react";
import PortfolioNavbar from "@/components/PortfolioNavbar";
import MenuAccordion from "@/components/MenuAccordion";

export default function Home() {
  const [heroVersion, setHeroVersion] = useState<"split" | "centered">("split");

  const services = [
    {
      id: "date-night",
      title: "Date Night Dinners",
      description:
        "Intimate multi-course dining in the comfort of your home. Choose 3 or 4 courses specifically tailored to your liking.",
      image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "family-style",
      title: "Family-Style Meals",
      description:
        "Take a load off by letting me cook for you and your family. Choose between kid-friendly classics, sharing plates or international food to try something new.",
      image: "https://images.unsplash.com/photo-1547573854-74d2a71d0826?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "meal-prep",
      title: "Weekly Meal-Prep",
      description:
        "Elevated lunches or dinners prepared in advance to support your schedule. Choose between lunch boxes for your children, work prep to take a break from eating out or simple dinners to make your evenings ligther, these preps focus on nutritional balance and chef-quality meals ready in your fridge.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "tasting-dinner",
      title: "Dinner Parties",
      description:
        "In the mood to host? I offer elevated multi-course tasting menus or sharing-platter style dinner parties. Fancy some light snacks for your cocktail party? No problem. Parties are designed to your ideal expectations. (These require min. 2x chefs)",
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const sampleMenus = [
    {
      id: "tasting",
      title: "Signature Tasting Menu",
      description: "A 5-course journey showcasing local British ingredients with French technique.",
      sections: [
        {
          courseName: "To Begin",
          items: [
            {
              name: "Seared Scallops",
              description: "Wild garlic purée, pickled heritage radish, hazelnut crumb.",
            },
            {
              name: "Cured Sea Trout",
              description: "Fermented cucumber, dill emulsion, crisp rye sourdough.",
            },
          ],
        },
        {
          courseName: "Mains",
          items: [
            {
              name: "Roasted Duck Breast",
              description: "Glazed heritage carrots, cherry gastrique, toasted buckwheat.",
            },
            {
              name: "Pan-fried Halibut",
              description: "Broad beans, sea herbs, lemon verbena butter sauce.",
            },
          ],
        },
        {
          courseName: "Dessert",
          items: [
            {
              name: "Meadowsweet Tart",
              description: "English strawberries, elderflower jelly, vanilla shortcrust.",
            },
          ],
        },
      ],
    },
    {
      id: "bistro",
      title: "Bespoke Gastropub Bistro Menu",
      description: "Rich, comforting modern European classics, executed to perfection.",
      sections: [
        {
          courseName: "Starters",
          items: [
            {
              name: "Heritage Beetroot & Burrata",
              description: "Roasted walnuts, honeyed sherry dressing, watercress.",
            },
            {
              name: "Crisp Pork Belly",
              description: "Spiced apple purée, celeriac slaw, mustard oil.",
            },
          ],
        },
        {
          courseName: "Mains",
          items: [
            {
              name: "Salt-Aged Beef Ribeye",
              description: "Triple-cooked chips, charred shallot, bone marrow jus.",
            },
            {
              name: "Wild Mushroom Gnocchi",
              description: "Truffle butter sauce, aged parmesan, fresh winter truffle shavings.",
            },
          ],
        },
        {
          courseName: "Desserts",
          items: [
            {
              name: "Warm Chocolate Fondant",
              description: "Salted caramel core, clotted cream ice cream.",
            },
          ],
        },
      ],
    },
    {
      id: "brunch",
      title: "Sophisticated Cafe Brunch Menu",
      description: "Vibrant, casual, and ingredient-led brunch classics.",
      sections: [
        {
          courseName: "Savory Classics",
          items: [
            {
              name: "Smashed Avocado & Poached Eggs",
              description: "Sourdough toast, fermented chilli salsa, toasted seeds, micro coriander.",
            },
            {
              name: "Baked Shakshuka",
              description: "Spiced tomato and bell pepper ragout, soft goat's cheese, coriander, flatbread.",
            },
          ],
        },
        {
          courseName: "Sweet & Light",
          items: [
            {
              name: "Brioche French Toast",
              description: "Whipped mascarpone, warm seasonal berry compote, pistachios.",
            },
            {
              name: "House Granola Bowl",
              description: "Greek yogurt, wild flower honey, fresh berries, toasted coconut chips.",
            },
          ],
        },
        {
          courseName: "Libations",
          items: [
            {
              name: "Cold-Pressed Green Juice",
              description: "Spinach, cucumber, apple, ginger, lemon.",
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-stone-200">
      <PortfolioNavbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section
          id="hero"
          className="relative min-h-screen flex flex-col items-center justify-center bg-stone-100 px-6 pt-28 pb-16"
        >
          {/* Design Toggle Pill */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20 bg-stone-50/90 backdrop-blur border border-stone-200 rounded-full p-1 shadow-sm flex items-center gap-1">
            <button
              onClick={() => setHeroVersion("split")}
              className={`text-[9px] tracking-wider uppercase font-bold px-3.5 py-1.5 rounded-full transition-all duration-300 ${heroVersion === "split"
                ? "bg-stone-900 text-white"
                : "text-stone-500 hover:text-stone-900"
                }`}
            >
              Split View
            </button>
            <button
              onClick={() => setHeroVersion("centered")}
              className={`text-[9px] tracking-wider uppercase font-bold px-3.5 py-1.5 rounded-full transition-all duration-300 ${heroVersion === "centered"
                ? "bg-stone-900 text-white"
                : "text-stone-500 hover:text-stone-900"
                }`}
            >
              Centered View
            </button>
          </div>

          {/* Conditional Layouts */}
          {heroVersion === "split" ? (
            /* Layout A: Split Layout */
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto transition-all duration-500">
              {/* Hero text */}
              <div className="lg:col-span-5 space-y-6 text-left order-2 lg:order-1">
                <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-accent">
                  Private Chef & Culinary Consultant
                </span>
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.1] text-stone-900">
                  Crafting food <br />
                  <span className="font-serif italic text-accent">with pedigree.</span>
                </h1>
                <p className="text-stone-500 font-sans text-sm sm:text-base leading-relaxed max-w-md">
                  Beautifully plated Modern European dishes, bringing Michelin-starred expertise and seasonal gastropub refinement directly to your table.
                </p>
                <div className="pt-4 flex items-center gap-6">
                  <a
                    href="#contact"
                    className="bg-stone-900 hover:bg-accent text-white hover:text-white px-8 py-3.5 text-xs uppercase tracking-widest transition-all duration-300 font-medium"
                  >
                    Book Theresa
                  </a>
                  <a
                    href="#menus"
                    className="text-stone-900 hover:text-accent text-xs uppercase tracking-widest transition-all duration-300 font-medium border-b border-stone-400 hover:border-accent pb-1"
                  >
                    View Sample Menus
                  </a>
                </div>
              </div>

              {/* Hero Image */}
              <div className="lg:col-span-7 order-1 lg:order-2">
                <div className="relative aspect-[4/3] w-full bg-stone-200 overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80"
                    alt="Modern European Fine Plating"
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Layout B: Minimalist Centered Layout */
            <div className="max-w-4xl mx-auto w-full text-center space-y-8 my-auto transition-all duration-500">
              <div className="space-y-3">
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-stone-900 tracking-wide">
                  Theresa Oemmelen
                </h1>
                <p className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-accent font-semibold">
                  Modern European Culinary Artist
                </p>
              </div>

              {/* Center Image */}
              <div className="relative max-w-2xl mx-auto aspect-[16/9] w-full bg-stone-200 overflow-hidden shadow-2xl border border-stone-200">
                <img
                  src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80"
                  alt="Modern European Fine Plating"
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

              <div className="space-y-6 max-w-md mx-auto">
                <p className="text-stone-500 font-sans text-xs uppercase tracking-[0.25em]">
                  pedigree &middot; seasonality &middot; craft
                </p>
                <div className="flex items-center justify-center gap-6">
                  <a
                    href="#contact"
                    className="bg-stone-900 hover:bg-accent text-white px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300 font-medium"
                  >
                    Book Theresa
                  </a>
                  <a
                    href="#menus"
                    className="text-stone-900 hover:text-accent text-xs uppercase tracking-widest transition-all duration-300 font-medium border-b border-stone-400 hover:border-accent pb-0.5"
                  >
                    Sample Menus
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Scroll Down Indicator */}
          <a
            href="#about"
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 group z-10"
          >
            <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 group-hover:text-accent transition-colors font-semibold">
              Scroll Down
            </span>
            <div className="w-[1px] h-8 bg-stone-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-accent animate-[slideDown_2s_infinite_ease-in-out]" />
            </div>
          </a>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 sm:py-32 bg-stone-50 border-t border-stone-200/50">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-accent">
              About Me
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900">
              Theresa Oemmelen
            </h2>
            <div className="w-12 h-[1px] bg-accent mx-auto" />
            {/* <p className="font-serif italic text-lg sm:text-xl text-stone-700 leading-relaxed max-w-2xl mx-auto">
              "Fine dining isn't just about complexity; it's about showcasing natural ingredients in their absolute peak season, executed with clean European technique."
            </p> */}
            <p className="text-stone-500 font-sans text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
              Hi there! I'm Theresa, a professional chef, who would love to bring my culinary expertise to the comfort of your home. Having worked in two of the UK's top 50 gastropubs under Michelin-starred head-chefs, I aim to combine elevated dinners with a personal touch. I focus on balancing high-end menus with expceptional quality produce, that is seasonal and local wherever possible. Dedicated to creating memorable events for you, I design menus tailored to any requests you have. I'm excited to work with you and turn your next event into a culinary feast!
            </p>
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-24 sm:py-32 bg-stone-100/50 border-t border-stone-200/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
              {/* <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-accent">
                My Services
              </span> */}
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900">
                My Services
              </h2>
              {/* <p className="text-stone-500 text-sm">
                Curating fine dining events, custom meal prep, and nutrition-focused programs.
              </p> */}
            </div>

            <div className="space-y-24">
              {services.map((service, index) => {
                const isEven = index % 2 === 0;
                return (
                  <div
                    key={service.id}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
                  >
                    {/* Image block */}
                    <div
                      className={`lg:col-span-6 w-full ${isEven ? "lg:order-1" : "lg:order-2"
                        }`}
                    >
                      <div className="relative aspect-[3/2] w-full bg-stone-200 overflow-hidden shadow-lg border border-stone-200">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>
                    </div>

                    {/* Content block */}
                    <div
                      className={`lg:col-span-6 space-y-4 ${isEven ? "lg:order-2" : "lg:order-1"
                        }`}
                    >
                      <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-accent">
                        0{index + 1} / Service
                      </span>
                      <h3 className="font-serif text-2xl sm:text-3xl text-stone-900">
                        {service.title}
                      </h3>
                      <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SAMPLE MENUS SECTION */}
        <section id="menus" className="py-24 sm:py-32 bg-stone-50 border-t border-stone-200/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-20 space-y-4">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-accent">
                Curated Options
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-stone-900">
                Sample Menus
              </h2>
              <p className="text-stone-500 text-sm">
                Click on each menu to view detailed dishes, seasonal elements, and courses.
              </p>
            </div>

            <MenuAccordion menus={sampleMenus} />
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 sm:py-32 bg-stone-900 text-stone-100">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-accent">
                Bookings & Inquiries
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white">
                Start Planning Your Event
              </h2>
              <p className="text-stone-400 text-sm max-w-lg mx-auto leading-relaxed">
                Whether hosting an intimate dinner, a celebratory party, or requiring dietary consulting, get in touch to design a custom culinary experience.
              </p>
            </div>

            <form className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  className="w-full bg-stone-800/50 border border-stone-700/80 px-4 py-3 text-sm text-stone-200 focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full bg-stone-800/50 border border-stone-700/80 px-4 py-3 text-sm text-stone-200 focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  Event Type
                </label>
                <select className="w-full bg-stone-800/50 border border-stone-700/80 px-4 py-3 text-sm text-stone-200 focus:outline-none focus:border-accent transition-colors">
                  <option className="bg-stone-900">Date Night Dinner</option>
                  <option className="bg-stone-900">Tasting Dinner Party</option>
                  <option className="bg-stone-900">Family-Style Meal</option>
                  <option className="bg-stone-900">Elevated Meal-Prep</option>
                  <option className="bg-stone-900">Nutrition/Dietary Consultation</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  Date
                </label>
                <input
                  type="date"
                  className="w-full bg-stone-800/50 border border-stone-700/80 px-4 py-3 text-sm text-stone-200 focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="sm:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-stone-400 font-medium">
                  Event Details & Preferences
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell Theresa about any dietary restrictions, favorites, or specific requests..."
                  className="w-full bg-stone-800/50 border border-stone-700/80 px-4 py-3 text-sm text-stone-200 focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              <div className="sm:col-span-2 text-center pt-4">
                <button
                  type="submit"
                  onClick={(e) => e.preventDefault()}
                  className="w-full sm:w-auto bg-stone-100 hover:bg-accent hover:text-white text-stone-900 px-10 py-4 text-xs uppercase tracking-widest transition-all duration-300 font-bold"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 py-12 bg-stone-100 text-stone-500 text-xs text-center">
        <p className="tracking-widest uppercase font-serif text-[10px] text-stone-600 mb-2">
          Theresa Oemmelen
        </p>
        <p>&copy; {new Date().getFullYear()} Atelier Rayner. Built for Culinary Excellence.</p>
      </footer>
    </div>
  );
}
