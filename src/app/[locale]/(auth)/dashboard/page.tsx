import { getConsultations } from "@/lib/actions/consultation-actions";
import { getBookings } from "@/lib/actions/booking-actions";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AnimatedStatsGrid } from "@/components/dashboard/animated-stats-grid";
import { Timeline } from "@/components/dashboard/timeline";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { FabConsultation } from "@/components/dashboard/fab-consultation";
import { mockActivities } from "@/lib/mock-data/dashboard";
import type { DashboardStats } from "@/lib/mock-data/dashboard-types";

export default async function DashboardPage() {
  const t = await getTranslations();
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const consultationsResult = await getConsultations();
  const bookingsResult = await getBookings();

  const consultations = consultationsResult.success ? consultationsResult.data : [];
  const bookings = bookingsResult.success ? bookingsResult.data : [];

  const activeConsultations = consultations.filter((c) => c.status === "pending" || c.status === "quoted").slice(0, 3);
  const upcomingBookings = bookings.filter((b) => b.status === "pending" || b.status === "confirmed").slice(0, 3);

  const userName = profile?.full_name || user.email?.split("@")[0] || "User";

  const realStats: DashboardStats = {
    totalSaved: 0,
    totalSavedTrend: "",
    activeConsultations: activeConsultations.length,
    bookings: upcomingBookings.length,
    nextAppointment: null,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold truncate">
          👋 {t("dashboard.welcome", { name: userName })}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("dashboard.subtitle")}
        </p>
      </div>

      {/* Stats */}
      <AnimatedStatsGrid stats={realStats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Activity Timeline — Full Width */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t("dashboard.activityTimeline")}</h2>
        <Timeline activities={mockActivities} />
      </div>

      {/* FAB */}
      <FabConsultation />
    </div>
  );
}
