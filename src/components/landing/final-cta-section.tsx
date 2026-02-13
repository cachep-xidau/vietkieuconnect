"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  const t = useTranslations("landing.cta");

  return (
    <section className="bg-gradient-to-r from-primary to-primary-hover py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Headline */}
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            {t("title")}
          </h2>

          {/* Subtitle */}
          <p className="mb-8 text-lg text-white/90 md:text-xl">
            {t("subtitle")}
          </p>

          {/* CTA Button */}
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
          >
            <Link href="/consultation">{t("button")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
