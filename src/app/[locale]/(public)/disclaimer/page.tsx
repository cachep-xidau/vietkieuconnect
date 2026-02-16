"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";

export default function DisclaimerPage() {
    const t = useTranslations("legal");

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">{t("disclaimer.title")}</h1>
            <p className="text-sm text-muted-foreground mb-8">
                {t("disclaimer.lastUpdated")}
            </p>

            {/* Highlight box */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8 flex gap-4">
                <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-amber-900 dark:text-amber-100 font-medium leading-relaxed">
                    {t("disclaimer.highlight")}
                </p>
            </div>

            <div className="prose prose-stone dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("disclaimer.s1Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("disclaimer.s1Body")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("disclaimer.s2Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("disclaimer.s2Body")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("disclaimer.s3Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("disclaimer.s3Body")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("disclaimer.s4Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("disclaimer.s4Body")}</p>
                </section>
            </div>
        </div>
    );
}
