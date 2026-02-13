import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import {
  PlusCircle,
  MessageSquareText,
  CalendarDays,
  User,
  type LucideIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

interface QuickAction {
  href: string;
  labelKey: string;
  descKey: string;
  icon: LucideIcon;
  color: string;
}

const actions: QuickAction[] = [
  {
    href: "/consultation/new",
    labelKey: "newConsultation",
    descKey: "startJourney",
    icon: PlusCircle,
    color: "text-primary",
  },
  {
    href: "/consultation",
    labelKey: "myConsultations",
    descKey: "activeConsultations",
    icon: MessageSquareText,
    color: "text-blue-500",
  },
  {
    href: "/bookings",
    labelKey: "myBookings",
    descKey: "upcomingBookings",
    icon: CalendarDays,
    color: "text-green-500",
  },
  {
    href: "/profile",
    labelKey: "viewProfile",
    descKey: "manageAccount",
    icon: User,
    color: "text-purple-500",
  },
];

export async function QuickActions() {
  const t = await getTranslations("dashboard");

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{t("quickActions")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.href} href={action.href} aria-label={t(action.labelKey)}>
              <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer group">
                <CardContent className="p-4 flex flex-col items-center text-center gap-1">
                  <Icon className={`h-8 w-8 ${action.color} group-hover:scale-110 transition-transform`} />
                  <span className="font-medium text-sm">{t(action.labelKey)}</span>
                  <span className="text-xs text-muted-foreground">{t(action.descKey)}</span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
