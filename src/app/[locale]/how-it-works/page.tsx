"use client";

import { useTranslations } from "next-intl";
import { FileText, BarChart3, Plane, CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HowItWorksPage() {
  const t = useTranslations("landing.howItWorks");
  const tHero = useTranslations("landing.hero");

  const steps = [
    {
      number: 1,
      icon: FileText,
      title: t("step1Title"),
      description: t("step1Desc"),
      details: [
        t("step1Detail1"),
        t("step1Detail2"),
        t("step1Detail3"),
      ],
    },
    {
      number: 2,
      icon: BarChart3,
      title: t("step2Title"),
      description: t("step2Desc"),
      details: [
        t("step2Detail1"),
        t("step2Detail2"),
        t("step2Detail3"),
      ],
    },
    {
      number: 3,
      icon: Plane,
      title: t("step3Title"),
      description: t("step3Desc"),
      details: [
        t("step3Detail1"),
        t("step3Detail2"),
        t("step3Detail3"),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-text-primary md:text-5xl">
              {t("title")}
            </h1>
            <p className="text-lg text-text-secondary md:text-xl">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-5xl space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.number}
                  className={`flex flex-col gap-8 md:flex-row md:items-center ${
                    isEven ? "" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Icon Circle */}
                  <div className="flex-shrink-0">
                    <div className="relative mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-hover shadow-lg md:h-40 md:w-40">
                      <div className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-lg font-bold text-primary shadow-md md:h-12 md:w-12">
                        {step.number}
                      </div>
                      <Icon className="h-16 w-16 text-white md:h-20 md:w-20" />
                    </div>
                  </div>

                  {/* Content */}
                  <Card className="flex-1">
                    <CardContent className="p-6 md:p-8">
                      <h3 className="mb-3 text-2xl font-bold text-text-primary md:text-3xl">
                        {step.title}
                      </h3>
                      <p className="mb-4 text-text-secondary">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-text-secondary"
                          >
                            <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary to-primary-hover py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              {t("ctaTitle")}
            </h2>
            <p className="mb-8 text-lg text-white/90 md:text-xl">
              {t("ctaSubtitle")}
            </p>
            <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
              <Link href="/consultation/new">{tHero("cta")}</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
