"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-text-primary mb-4">
        {t("title")}
      </h2>
      <p className="text-text-secondary mb-8">
        {t("description")}
      </p>
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          {t("commonRoutes")}:
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            {t("home")}
          </Link>
          <Link
            href="/clinics"
            className="px-4 py-2 border border-border rounded-md hover:bg-bg-subtle transition-colors"
          >
            {t("clinics")}
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 border border-border rounded-md hover:bg-bg-subtle transition-colors"
          >
            {t("login")}
          </Link>
        </div>
      </div>
      <div className="mt-8 text-sm text-text-secondary">
        <p>{t("correctRoutes")}:</p>
        <ul className="mt-2 space-y-1">
          <li>✓ /login {t("notAuthSignin")}</li>
          <li>✓ /consultation/new {t("notConsultation")}</li>
          <li>✓ /consultations {t("consultationsList")}</li>
        </ul>
      </div>
    </div>
  );
}
