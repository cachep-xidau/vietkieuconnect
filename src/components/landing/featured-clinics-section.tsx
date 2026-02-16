"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { ClinicCard } from "@/components/clinic/clinic-card";
import { ClinicTable } from "@/types/database-clinic-tables";
import { useLocale } from "next-intl";

interface FeaturedClinicsSectionProps {
  clinics: ClinicTable["Row"][];
}

export function FeaturedClinicsSection({ clinics }: FeaturedClinicsSectionProps) {
  const t = useTranslations("landing.featuredClinics");
  const locale = useLocale();

  return (
    <section className="bg-bg-subtle py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            {t("subtitle")}
          </p>
        </div>

        {/* Clinics Grid — reuses ClinicCard */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clinics.map((clinic) => (
            <ClinicCard key={clinic.id} clinic={clinic} locale={locale} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/clinics">{t("viewAll")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
