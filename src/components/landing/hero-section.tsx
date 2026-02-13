"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const t = useTranslations("landing.hero");
  const tStats = useTranslations("landing.stats");

  const stats = [
    { label: tStats("savings"), value: tStats("savingsValue") },
    { label: tStats("clinics"), value: tStats("clinicsValue") },
    { label: tStats("reviews"), value: tStats("reviewsValue") },
    { label: tStats("satisfaction"), value: tStats("satisfactionValue") },
  ];

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-primary/3 to-transparent">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          {/* Headline */}
          <h1 className="mb-6 whitespace-pre-line text-4xl font-bold leading-tight text-text-primary md:text-5xl lg:text-6xl">
            {t("title")}
          </h1>

          {/* Subtitle */}
          <p className="mb-8 text-lg text-text-secondary md:text-xl">
            {t("subtitle")}
          </p>

          {/* CTAs */}
          <div className="mb-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/consultation">{t("cta")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/how-it-works">{t("ctaSecondary")}</Link>
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-1 text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </div>
                <div className="text-sm text-text-secondary md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
