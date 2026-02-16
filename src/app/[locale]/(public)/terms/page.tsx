"use client";

import { useTranslations } from "next-intl";

export default function TermsPage() {
    const t = useTranslations("legal");

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-3xl font-bold mb-2">{t("terms.title")}</h1>
            <p className="text-sm text-muted-foreground mb-8">
                {t("terms.lastUpdated")}
            </p>

            <div className="prose prose-stone dark:prose-invert max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("terms.s1Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("terms.s1Body")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("terms.s2Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("terms.s2Body")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("terms.s3Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("terms.s3Body")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("terms.s4Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("terms.s4Body")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("terms.s5Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("terms.s5Body")}</p>
                </section>

                <section>
                    <h2 className="text-xl font-semibold mb-3">{t("terms.s6Title")}</h2>
                    <p className="text-muted-foreground leading-relaxed">{t("terms.s6Body")}</p>
                </section>
            </div>
        </div>
    );
}
