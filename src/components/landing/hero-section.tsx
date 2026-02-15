"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDE_DURATION = 6000;

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop",
    links: ["/consultation/new", "/#costComparison", "/how-it-works"],
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop",
    links: ["/clinics", "/clinics", "/clinics"],
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=2074&auto=format&fit=crop",
    links: ["/consultation/new", "/#testimonials", "/consultation/new"],
  },
];

export function HeroSection() {
  const t = useTranslations("landing.hero");
  const tStats = useTranslations("landing.stats");
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  const stats = [
    { label: tStats("savings"), value: tStats("savingsValue") },
    { label: tStats("clinics"), value: tStats("clinicsValue") },
    { label: tStats("reviews"), value: tStats("reviewsValue") },
    { label: tStats("satisfaction"), value: tStats("satisfactionValue") },
  ];

  const slide = slides[current];
  const slideNum = current + 1;

  return (
    <section
      className="relative min-h-[600px] md:min-h-[650px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Ken Burns */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slide.id}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <motion.img
            src={slide.image}
            alt=""
            className="w-full h-full object-cover"
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.12 }}
            transition={{ duration: SLIDE_DURATION / 1000 + 1.2, ease: "linear" }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/75 to-teal-900/50" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="mb-6 whitespace-pre-line text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl drop-shadow-md">
                {t(`slide${slideNum}Title`)}
              </h1>
              <p className="mb-8 text-lg text-teal-50/90 md:text-xl font-medium max-w-2xl mx-auto">
                {t(`slide${slideNum}Subtitle`)}
              </p>

              {/* 3 CTA Buttons */}
              <div className="mb-16 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto bg-white text-teal-900 hover:bg-teal-50 border-none font-semibold shadow-lg">
                  <Link href={slide.links[0]}>
                    {t(`slide${slideNum}Cta1`)}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white bg-white/5 backdrop-blur-sm font-medium"
                >
                  <Link href={slide.links[1]}>
                    {t(`slide${slideNum}Cta2`)}
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto text-teal-100 hover:bg-white/10 hover:text-white font-medium"
                >
                  <Link href={slide.links[2]}>
                    {t(`slide${slideNum}Cta3`)}
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="text-center"
              >
                <div className="mb-1 text-3xl font-bold text-white md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-teal-100 md:text-base font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${index === current
                ? "w-8 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/10">
        <motion.div
          key={current}
          className="h-full bg-white/50"
          initial={{ width: "0%" }}
          animate={{ width: isPaused ? undefined : "100%" }}
          transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
        />
      </div>
    </section>
  );
}
