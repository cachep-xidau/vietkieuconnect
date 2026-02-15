"use client";

import { useTranslations } from "next-intl";
import { FileText, BarChart3, Plane } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function HowItWorksSection() {
  const t = useTranslations("landing.howItWorks");

  const steps = [
    {
      number: 1,
      icon: FileText,
      title: t("step1Title"),
      description: t("step1Desc"),
    },
    {
      number: 2,
      icon: BarChart3,
      title: t("step2Title"),
      description: t("step2Desc"),
    },
    {
      number: 3,
      icon: Plane,
      title: t("step3Title"),
      description: t("step3Desc"),
    },
  ];

  return (
    <section className="bg-bg-primary py-10 md:py-16">
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

        {/* Steps Grid/Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-6 md:grid md:gap-8 md:grid-cols-3 md:pb-0 snap-x snap-mandatory">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Card
                key={step.number}
                className="min-w-[280px] snap-center relative overflow-hidden border-border bg-bg-card transition-shadow hover:shadow-md md:min-w-0"
              >
                <CardContent className="p-6">
                  {/* Step Number Badge */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                      {step.number}
                    </div>
                    <Icon className="h-8 w-8 text-primary/40" />
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
