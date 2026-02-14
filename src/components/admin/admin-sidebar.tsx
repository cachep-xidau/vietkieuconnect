"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Building2, Calendar, ClipboardList, LayoutDashboard, MessageSquare } from "lucide-react";

interface AdminSidebarProps {
  locale: string;
}

const navItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    translationKey: "admin.nav.dashboard",
  },
  {
    href: "/admin/clinics",
    label: "Clinics",
    icon: Building2,
    translationKey: "admin.nav.clinics",
  },
  {
    href: "/admin/consultations",
    label: "Consultations",
    icon: ClipboardList,
    translationKey: "admin.nav.consultations",
  },
  {
    href: "/admin/bookings",
    label: "Bookings",
    icon: Calendar,
    translationKey: "admin.nav.bookings",
  },
  {
    href: "/admin/reviews",
    label: "Reviews",
    icon: MessageSquare,
    translationKey: "admin.nav.reviews",
  },
];

/**
 * Admin sidebar navigation component
 * Desktop: Fixed left sidebar
 * Mobile: Use with Sheet component
 */
export function AdminSidebar({ locale }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-2">
      {/* Logo/Branding */}
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <span>VietKieu Admin</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2 lg:px-4">
        <div className="grid gap-1 py-2">
          {navItems.map((item) => {
            const href = item.href;
            // pathname includes locale prefix (e.g. /vi/admin), strip it for comparison
            const strippedPathname = pathname.replace(`/${locale}`, '') || '/';
            const isActive = strippedPathname === href || (item.href !== "/admin" && strippedPathname.startsWith(href));

            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
