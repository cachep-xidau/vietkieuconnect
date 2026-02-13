"use client";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

export function FabConsultation() {
  const t = useTranslations("dashboard");

  return (
    <Link
      href="/consultation/new"
      className="fixed bottom-6 right-6 z-40 hidden md:flex"
      aria-label={t("newConsultation")}
    >
      <Button
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </Link>
  );
}
