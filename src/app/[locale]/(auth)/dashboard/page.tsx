import { getConsultations } from "@/lib/actions/consultation-actions";
import { getBookings } from "@/lib/actions/booking-actions";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Calendar, ClipboardList, Building2, Plus, DollarSign, Bell } from "lucide-react";
import { Link } from "@/i18n/routing";
import { AnimatedStatsGrid } from "@/components/dashboard/animated-stats-grid";
import { Timeline } from "@/components/dashboard/timeline";
import { ClinicRecommendationCard, TreatmentRecommendationCard } from "@/components/dashboard/recommendation-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { FabConsultation } from "@/components/dashboard/fab-consultation";
import { mockDashboardStats, mockActivities, mockRecommendations } from "@/lib/mock-data/dashboard";

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

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="space-y-2 mb-8">
        <h1 className="text-4xl font-bold truncate">
          👋 {t("dashboard.welcome", { name: userName })}
        </h1>
        <p className="text-muted-foreground text-lg">
          {t("dashboard.subtitle")}
        </p>
        <div className="pt-4">
          <Button asChild size="lg">
            <Link href="/consultation/new">
              <Plus className="mr-2 h-5 w-5" />
              {t("dashboard.newConsultation")}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid with animations */}
      <AnimatedStatsGrid stats={mockDashboardStats} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Timeline + Recommendations Grid */}
      <div className="grid lg:grid-cols-5 gap-6">
        {/* Activity Timeline (60% - 3 columns) */}
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold mb-4">{t("dashboard.activityTimeline")}</h2>
          <Timeline activities={mockActivities} />
        </div>

        {/* Recommendations Sidebar (40% - 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Clinics */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t("dashboard.topRatedClinics")}</h3>
              <Link href="/clinics" className="text-sm text-primary hover:underline">
                {t("dashboard.viewAll")}
              </Link>
            </div>
            <div className="space-y-3">
              {mockRecommendations.clinics.slice(0, 3).map((clinic) => (
                <ClinicRecommendationCard key={clinic.id} clinic={clinic} />
              ))}
            </div>
          </div>

          {/* Trending Treatments */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{t("dashboard.trendingTreatments")}</h3>
              <Link href="/treatments" className="text-sm text-primary hover:underline">
                {t("dashboard.viewAll")}
              </Link>
            </div>
            <div className="space-y-3">
              {mockRecommendations.treatments.map((treatment, index) => (
                <TreatmentRecommendationCard key={index} treatment={treatment} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAB - Desktop Only */}
      <FabConsultation />
    </div>
  );
}
