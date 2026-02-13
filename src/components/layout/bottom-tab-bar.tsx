"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Home, Building2, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomTabBar() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const tabs = [
    {
      href: "/",
      label: t("home"),
      icon: Home,
      isActive: pathname.endsWith("/en") || pathname.endsWith("/vi"),
    },
    {
      href: "/clinics",
      label: t("clinics"),
      icon: Building2,
      isActive: pathname.includes("/clinics"),
    },
    {
      href: "/consultation",
      label: t("consult"),
      icon: MessageCircle,
      isActive: pathname.includes("/consultation"),
    },
    {
      href: "/profile",
      label: t("profile"),
      icon: User,
      isActive: pathname.includes("/profile"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-bg-card md:hidden">
      <div className="flex h-16 items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 transition-colors",
                tab.isActive
                  ? "text-primary"
                  : "text-text-secondary hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
