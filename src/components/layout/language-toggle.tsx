"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const newLocale = locale === "en" ? "vi" : "en";
    const currentPath = pathname.replace(`/${locale}`, "");
    router.push(`/${newLocale}${currentPath}`);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLocale}
      className="gap-1.5 text-sm font-medium"
    >
      {locale === "en" ? (
        <>
          <span className="text-base">🇺🇸</span>
          <span>EN</span>
        </>
      ) : (
        <>
          <span className="text-base">🇻🇳</span>
          <span>VI</span>
        </>
      )}
    </Button>
  );
}
