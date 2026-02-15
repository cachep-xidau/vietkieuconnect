"use client";

import { motion } from "framer-motion";
import { StatCard } from "./stat-card";
import { ClipboardList, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import type { DashboardStats } from "@/lib/mock-data/dashboard-types";

interface AnimatedStatsGridProps {
  stats: DashboardStats;
}

export function AnimatedStatsGrid({ stats }: AnimatedStatsGridProps) {
  const t = useTranslations("dashboard");

  const statCards = [
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
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
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
