import { getTranslations } from "next-intl/server";
import { getDashboardStats } from "@/lib/actions/admin-stats-actions";
import { AdminStatsCard } from "@/components/admin/admin-stats-card";
import { Building2, Calendar, DollarSign, Users } from "lucide-react";

/**
 * Admin dashboard overview page
 * Displays key metrics and statistics
 */
export default async function AdminDashboardPage() {
  const t = await getTranslations("admin.dashboard");
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatsCard
          title={t("totalClinics")}
          value={stats.totalClinics}
          icon={Building2}
        />
        <AdminStatsCard
          title={t("totalBookings")}
          value={stats.totalBookings}
          icon={Calendar}
        />
        <AdminStatsCard
          title={t("totalRevenue")}
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
        />
        <AdminStatsCard
          title={t("activeUsers")}
          value={stats.activeUsers}
          icon={Users}
        />
      </div>

      {/* Future: Charts, Recent Activity, etc. */}
    </div>
  );
}
