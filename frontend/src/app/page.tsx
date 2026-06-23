"use client";

import { useState } from "react";
import PortfolioNavbar from "@/components/PortfolioNavbar";
import MenuAccordion from "@/components/MenuAccordion";

function ServiceCarousel({ images, title }: { images: string[]; title: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative aspect-[3/2] w-full rounded-lg bg-stone-200 overflow-hidden shadow-lg border border-stone-200 group">
      {/* Images container */}
      <div className="relative w-full h-full">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${idx === currentIndex ? "opacity-100 z-10 animate-fade-in" : "opacity-0 z-0"
              }`}
          >
            <img
              src={img}
              alt={`${title} - view ${idx + 1}`}
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            type="button"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-stone-900/60 hover:bg-stone-900/90 hover:scale-105 text-white p-2.5 rounded-full transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer shadow-md backdrop-blur-xs"
            aria-label="Previous image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            type="button"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-stone-900/60 hover:bg-stone-900/90 hover:scale-105 text-white p-2.5 rounded-full transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer shadow-md backdrop-blur-xs"
            aria-label="Next image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}

      {/* Indicators/Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-stone-900/40 px-3 py-1.5 rounded-full backdrop-blur-xs">
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
              className={`cursor-pointer w-1.5 h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-white w-3" : "bg-white/50 hover:bg-white/80"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [heroVersion, setHeroVersion] = useState<"split" | "centered">("split");
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);

  const services = [
    {
      id: "date-night",
      title: "Date Night Dinners",
      description:
        "Intimate multi-course dining in the comfort of your home. Choose 3 or 4 courses specifically tailored to your liking.",
      images: [
        "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      ],
    },
    {
      id: "family-style",
      title: "Family-Style Meals",
      description:
        "Take a load off by letting me cook for you and your family. Choose between kid-friendly classics, sharing plates or international food to try something new.",
      images: [
        "assets/images/pizza_1.jpg",
        "assets/images/pizza_4.jpg",
        "assets/images/pizza_2.jpg",
        "assets/images/pizza_3.jpg",
      ],
    },
    {
      id: "meal-prep",
      title: "Weekly Meal-Prep",
      description:
        "Elevated lunches or dinners prepared in advance to support your schedule. Choose between lunch boxes for your children, work prep to take a break from eating out or simple dinners to make your evenings ligther, these preps focus on nutritional balance and chef-quality meals ready in your fridge.",
      images: [
        "assets/images/meal-prep_1.jpg",
        "assets/images/stroganoff_1.jpg",
        "assets/images/chicken_2.jpg",
      ],
    },
    {
      id: "tasting-dinner",
      title: "Dinner Parties",
      description:
        "In the mood to host? I offer elevated multi-course tasting menus or sharing-platter style dinner parties. Fancy some light snacks for your cocktail party? No problem. Parties are designed to your ideal expectations. (These require min. 2x chefs)",
      images: [
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=800&q=80",
      ],
    },
  ];

  const galleryImages = [
    {
      src: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
      alt: "Artisanal Sourdough & Crusty Breads",
    },
    {
      src: "https://images.unsplash.com/photo-1535141192574-5d4897c13636?auto=format&fit=crop&w=800&q=80",
      alt: "Bespoke Celebratory Floral Cake",
    },
    {
      src: "https://images.unsplash.com/photo-1532636875304-0c8fe119ff91?auto=format&fit=crop&w=800&q=80",
      alt: "Pan-Seared Scallops with Herb Oil",
    },
    {
      src: "https://images.unsplash.com/photo-1553618551-fba689030290?auto=format&fit=crop&w=800&q=80",
      alt: "Fresh Rock Oysters on Ice with Mignonette",
    },
    {
      src: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80",
      alt: "Warm Chocolate Fondant with Gastropub Garnish",
    },
    {
      src: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
      alt: "Hand-Crafted Tagliatelle Pasta Prep",
    },
    {
      src: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
      alt: "Roasted Seasonal Beetroot & Goat Cheese Salad",
    },
    {
      src: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=800&q=80",
      alt: "Seared Venison Loin, Parsnip Purée, Jus",
    },
  ];

  const sampleMenus = [
    {
      id: "tasting",
      title: "Date Night Menu",
      description: "",
      sections: [
        {
          courseName: "Starter",
          items: [
            {
              name: "Charred Mackerel",
              description: "with Salmorejo, Fennel, Nasturtium",
            },
          ],
        },
        {
          courseName: "Interim",
          items: [
            {
              name: "Courgette Flower Ravioli",
              description: "with Creamy Asparagus, Spring Veg, Mint",
            },
          ],
        },
        {
          courseName: "Mains",
          items: [
            {
              name: "Cornish Cod",
              description: "with Ratatouille, Datterini Sauce, Pomme Anna",
            },
          ],
        },
        {
          courseName: "Dessert",
          items: [
            {
              name: "Blueberry Custard Tart",
              description: "with Toasted Italian Meringue",
            },
          ],
        },
      ],
    },
    {
      id: "bistro",
      title: "Family Style Options",
      description: "",
      sections: [
        {
          courseName: "Pizza Selection",
          items: [
            {
              name: "Hot Honey Pepperoni",
            },
            {
              name: "Classic Margherita & Burrata",
            },
            {
              name: "Mortadella, Pistachio & Wild Garlic",
            },
            {
              name: "Rosemary Potatoes & Blue Cheese Beschamel",
            },
          ],
        },
        {
          courseName: "East Asian Sharing Platters",
          items: [
            {
              name: "Chilli Butter Salmon",
            },
            {
              name: "Sweet Chilli Wantons & Pak Choi",
            },
            {
              name: "Smashed Cucumber Salad",
            },
            {
              name: "Kimchi Fried Rice",
            },
            {
              name: "Mango & Mint Mochi",
            },
          ],
        },
        {
          courseName: "Sunday Roast",
          items: [
            {
              name: "Roast Beef / Chicken",
            },
            {
              name: "Vegetarian Wellington",
              description: "optional",
            },
            {
              name: "Yorkshire Puddings",
            },
            {
              name: "Seasonal Greens",
            },
            {
              name: "Roast Potatoes",
            },
            {
              name: "Sticky Toffee Pudding / Summer Trifle",
            },
          ],
        },
      ],
    },
    {
      id: "brunch",
      title: "Meal Prep Ideas",
      description: "",
      sections: [
        {
          courseName: "Brunch",
          items: [
            {
              name: "Gochujang Noodle Bowl",
              description: "with Sticky Pork / Tofu, Fried Greens, Pickled Red Onion",
            },
            {
              name: "Creamy Green Orzotto",
              description: "with Herb & Butter Chicken / Shaved Courgette Salad, Feta",
            },
            {
              name: "Beef & Mushroom Stroganoff",
              description: "with Wild Rice, Gremolata",
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
              <div className="lg:col-span-5 space-y-3 text-left order-2 lg:order-1">
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.1] text-stone-900">
                  Quality food <br />
                  <span className="font-serif italic text-accent text-3xl sm:text-4xl lg:text-5xl">in the comfort of your home.</span>
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
                <div className="relative aspect-[4/3] w-full bg-stone-200 overflow-hidden shadow-2xl rounded-lg">
                  <img
                    src="assets/images/main.jpg"
                    alt="Modern European Fine Plating"
                    className="object-cover w-full h-full transition-transform duration-700 ease-out hover:scale-105"
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
            <p className="text-stone-500 font-sans text-sm sm:text-base max-w-3xl mx-auto">
              Hi there! I'm Theresa, a professional chef who loves bringing restaurant-quality food into the comfort of people's homes. <br /><br />
              Over the years, I've had the opportunity to work across a wide range of culinary settings, from bakeryies and bespoke celebration cakes to gastropubs and high-end tasiting dinners. Most recently, I worked in two of the UK's Top 50 Gastropubs under Michelin-starred chefs, where I developed a passion for combining exceptional ingredients with thoughtful, flavour-driven cooking. <br /><br />
              My approach is rooted in seasonality, quality produce, and food made from scratcch. Whether I'm preparing an intimate date night dinner, catering a special celebration, creating a family-style feast, or simply helping busy households enjoy delicious home-cooked meals, I tailor every menu to the occasion and the people acround the table. <br /><br />
              For me, great food is about more than technique - it's about creating memorable experience. My goal is to take the stress out of hosting, allowing you to relax and enjoy the moment while I take care of the cooking. <br /><br />
              Whatever the occasion, I'd love to help create something truly special for you and your guests.
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
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900">
                My Services
              </h2>
              <div className="w-12 h-[1px] bg-accent mx-auto" />
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
                      <ServiceCarousel images={service.images} title={service.title} />
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
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900">
                Sample Menus
              </h2>
              <div className="w-12 h-[1px] bg-accent mx-auto" />
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

        {/* GALLERY SECTION */}
        <section id="gallery" className="py-24 sm:py-32 bg-stone-50 border-t border-stone-200/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
              <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-accent">
                Visual Showcase
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900">
                Culinary Gallery
              </h2>
              <div className="w-12 h-[1px] bg-accent mx-auto" />
              <p className="text-stone-500 text-sm">
                A selection of bespoke creations, plating designs, and fresh prep from my kitchen.
              </p>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(image)}
                  className="relative aspect-square bg-stone-200 overflow-hidden cursor-pointer group shadow-xs border border-stone-200/60 text-left p-0 w-full"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  <div className="absolute inset-0 bg-stone-950/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-xs uppercase tracking-widest text-white border border-white/50 px-4 py-2 backdrop-blur-xs">
                      View Plate
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Lightbox Modal */}
          {selectedImage && (
            <div
              className="fixed inset-0 z-50 bg-stone-950/90 flex items-center justify-center p-4 backdrop-blur-md transition-all duration-300"
              onClick={() => setSelectedImage(null)}
            >
              <button
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors cursor-pointer"
                onClick={() => setSelectedImage(null)}
                aria-label="Close lightbox"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div
                className="relative max-w-5xl max-h-[85vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  className="object-contain max-w-full max-h-[85vh] mx-auto shadow-2xl border border-stone-800"
                />
                {selectedImage.alt && (
                  <div className="absolute bottom-0 inset-x-0 bg-stone-950/70 text-white/90 text-center py-3 text-xs uppercase tracking-wider font-medium backdrop-blur-xs">
                    {selectedImage.alt}
                  </div>
                )}
              </div>
            </div>
          )}
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
