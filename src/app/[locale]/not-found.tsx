"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Search, Home, Stethoscope, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("notFound");

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="relative max-w-md w-full text-center">
        {/* Background decoration */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Illustration */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/10">
            <Search className="w-12 h-12 text-primary/60" strokeWidth={1.5} />
          </div>
          <div className="absolute top-0 right-1/2 translate-x-16 -translate-y-2">
            <span className="text-6xl font-black text-primary/15">?</span>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-7xl font-black text-primary/20 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          {t("title")}
        </h2>
        <p className="text-text-secondary mb-8 max-w-sm mx-auto">
          {t("description")}
        </p>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              {t("home")}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/clinics">
              <Stethoscope className="h-4 w-4 mr-2" />
              {t("clinics")}
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">
              <LogIn className="h-4 w-4 mr-2" />
              {t("login")}
            </Link>
          </Button>
        </div>

        {/* Helpful Routes */}
        <div className="text-sm text-text-secondary bg-bg-subtle rounded-xl p-4 border border-border">
          <p className="font-medium mb-2">{t("correctRoutes")}:</p>
          <div className="space-y-1 text-left">
            <p>✓ <code className="text-xs bg-bg-primary px-1.5 py-0.5 rounded">/login</code> — {t("notAuthSignin")}</p>
            <p>✓ <code className="text-xs bg-bg-primary px-1.5 py-0.5 rounded">/consultation/new</code> — {t("notConsultation")}</p>
            <p>✓ <code className="text-xs bg-bg-primary px-1.5 py-0.5 rounded">/consultations</code> — {t("consultationsList")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
