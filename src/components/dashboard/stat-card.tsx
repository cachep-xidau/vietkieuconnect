"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: string;
  subtitle?: string;
  variant?: "default" | "green" | "blue" | "amber" | "purple";
}

export function StatCard({
  icon,
  label,
  value,
  trend,
  subtitle,
  variant = "default"
}: StatCardProps) {
  const colorClasses = {
    default: "text-muted-foreground bg-muted/10",
    green: "text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400",
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
    amber: "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400"
  };

  return (
    <Card className="hover:shadow-lg transition-shadow min-h-[140px]" role="region" aria-label={label}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {label}
            </p>
            <p className={cn("font-bold mb-1", typeof value === "string" && value.length > 12 ? "text-lg" : "text-3xl")}>{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground">{trend}</p>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{subtitle}</p>
            )}
          </div>
          <div
            className={cn(
              "rounded-full p-3 shrink-0",
              colorClasses[variant]
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
