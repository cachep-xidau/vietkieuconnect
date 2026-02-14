"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { useEffect, useState } from "react";

export function Footer() {
  const t = useTranslations("footer");
  const [currentYear, setCurrentYear] = useState(2026); // Default to avoid hydration mismatch

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-bg-subtle border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-text-primary">
              {t("about")}
            </h3>
            <p className="mb-4 text-sm text-text-secondary leading-relaxed">
              {t("aboutDesc")}
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-primary"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary transition-colors hover:text-primary"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-text-primary">
              {t("services")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/clinics"
                  className="text-sm text-stone-600 transition-colors hover:text-primary"
                >
                  {t("clinicDirectory")}
                </Link>
              </li>
              <li>
                <Link
                  href="/consultations"
                  className="text-sm text-stone-600 transition-colors hover:text-primary"
                >
                  {t("freeConsultation")}
                </Link>
              </li>
              <li>
                <Link
                  href="/calculator"
                  className="text-sm text-stone-600 transition-colors hover:text-primary"
                >
                  {t("costCalculator")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-text-primary">
              {t("resources")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/how-it-works"
                  className="text-sm text-stone-600 transition-colors hover:text-primary"
                >
                  {t("howItWorks")}
                </Link>
              </li>
              <li>
                <Link
                  href="/guide"
                  className="text-sm text-stone-600 transition-colors hover:text-primary"
                >
                  {t("dentalGuide")}
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-stone-600 transition-colors hover:text-primary"
                >
                  {t("faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-text-primary">
              {t("contact")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@vietkieuconnect.com"
                  className="text-sm text-stone-600 transition-colors hover:text-primary"
                >
                  {t("email")}
                </a>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-sm text-stone-600 transition-colors hover:text-primary"
                >
                  {t("support")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-text-secondary">
            {t("copyright", { year: currentYear })}
          </p>
        </div>
      </div>
    </footer>
  );
}
