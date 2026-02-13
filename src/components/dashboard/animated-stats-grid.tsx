"use client";

import { motion } from "framer-motion";
import { StatCard } from "./stat-card";
import { DollarSign, ClipboardList, Calendar, Bell } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DashboardStats } from "@/lib/mock-data/dashboard-types";

interface AnimatedStatsGridProps {
  stats: DashboardStats;
}

export function AnimatedStatsGrid({ stats }: AnimatedStatsGridProps) {
  const t = useTranslations("dashboard");

  const statCards = [
    {
      icon: <DollarSign className="h-5 w-5" />,
      label: t("totalSaved"),
      value: `$${stats.totalSaved.toLocaleString()}`,
      trend: stats.totalSavedTrend,
      variant: "green" as const
    },
    {
      icon: <ClipboardList className="h-5 w-5" />,
      label: t("activeConsultations"),
      value: stats.activeConsultations,
      variant: "blue" as const
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: t("bookings"),
      value: stats.bookings,
      variant: "amber" as const
    },
    {
      icon: <Bell className="h-5 w-5" />,
      label: t("nextAppointment"),
      value: stats.nextAppointment?.date
        ? new Date(stats.nextAppointment.date).toLocaleDateString()
        : t("noneScheduled"),
      subtitle: stats.nextAppointment?.clinic,
      variant: "purple" as const
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <StatCard {...card} />
        </motion.div>
      ))}
    </div>
  );
}
