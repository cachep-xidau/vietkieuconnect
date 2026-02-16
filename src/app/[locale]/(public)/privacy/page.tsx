"use client";

import { useTranslations } from "next-intl";

export default function PrivacyPage() {
    const t = useTranslations("legal");

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">{t("privacy.title")}</h1>
            <p className="text-sm text-muted-foreground mb-8">
                {t("privacy.lastUpdated")}
            </p>

            <div className="prose prose-stone dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("privacy.s1Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("privacy.s1Body")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("privacy.s2Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("privacy.s2Body")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("privacy.s3Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("privacy.s3Body")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("privacy.s4Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("privacy.s4Body")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("privacy.s5Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("privacy.s5Body")}</p>
                </section>
            </div>
        </div>
    );
}
