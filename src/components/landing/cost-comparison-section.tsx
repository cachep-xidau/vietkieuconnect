"use client";

import { useTranslations } from "next-intl";

export function CostComparisonSection() {
  const t = useTranslations("landing.costComparison");

  const treatments = [
    {
      name: t("implant"),
      usPrice: "$3,000–6,000",
      vnPrice: "$700–1,200",
      savings: "~75%",
    },
    {
      name: t("veneer"),
      usPrice: "$925–2,500",
      vnPrice: "$235–470",
      savings: "~75%",
    },
    {
      name: t("crown"),
      usPrice: "$1,500–3,000",
      vnPrice: "$160–550",
      savings: "~80%",
    },
    {
      name: t("braces"),
      usPrice: "$3,000–7,000",
      vnPrice: "$1,100–2,350",
      savings: "~65%",
    },
    {
      name: t("rootCanal"),
      usPrice: "$700–1,500",
      vnPrice: "$40–120",
      savings: "~90%",
    },
    {
      name: t("whitening"),
      usPrice: "$500–1,000",
      vnPrice: "$80–200",
      savings: "~80%",
    },
    {
      name: t("filling"),
      usPrice: "$150–400",
      vnPrice: "$8–40",
      savings: "~85%",
    },
    {
      name: t("dentures"),
      usPrice: "$1,500–3,000",
      vnPrice: "$300–600",
      savings: "~80%",
    },
  ];

  return (
    <section id="costComparison" className="scroll-mt-20 bg-bg-primary py-16 md:py-24">
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

        {/* Table - Desktop */}
        <div className="hidden overflow-hidden rounded-lg border border-border bg-bg-card md:block">
          <table className="w-full">
            <thead className="bg-bg-subtle">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t("treatment")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t("usPrice")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t("vnPrice")}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-accent">
                  {t("savings")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {treatments.map((treatment, index) => (
                <tr key={index} className="transition-colors hover:bg-bg-subtle/50">
                  <td className="px-6 py-4 font-medium text-text-primary">
                    {treatment.name}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">
                    {treatment.usPrice}
                  </td>
                  <td className="px-6 py-4 font-semibold text-primary">
                    {treatment.vnPrice}
                  </td>
                  <td className="px-6 py-4 font-bold text-accent">
                    {treatment.savings}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards - Mobile */}
        <div className="space-y-4 md:hidden">
          {treatments.map((treatment, index) => (
            <div
              key={index}
              className="rounded-lg border border-border bg-bg-card p-4"
            >
              <h3 className="mb-3 font-semibold text-text-primary">
                {treatment.name}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">{t("usPrice")}:</span>
                  <span className="text-text-primary">{treatment.usPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">{t("vnPrice")}:</span>
                  <span className="font-semibold text-primary">
                    {treatment.vnPrice}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="font-medium text-text-primary">
                    {t("savings")}:
                  </span>
                  <span className="font-bold text-accent">
                    {treatment.savings}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Source + Disclaimer */}
        <p className="mt-6 text-center text-sm text-text-secondary">
          {t("disclaimer")}
        </p>
        <p className="mt-2 text-center text-xs text-text-secondary/60">
          {t("source")}
        </p>
      </div>
    </section>
  );
}
