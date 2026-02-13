"use client";

import { TimelineItem } from "./timeline-item";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ClipboardList } from "lucide-react";
import { Link } from "@/i18n/routing";
import type { TimelineActivity } from "@/lib/mock-data/dashboard-types";

interface TimelineProps {
  activities: TimelineActivity[];
}

export function Timeline({ activities }: TimelineProps) {
  const t = useTranslations("dashboard");
  const [visibleCount, setVisibleCount] = useState(5);
  const visibleActivities = activities.slice(0, visibleCount);
  const hasMore = visibleCount < activities.length;

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <ClipboardList className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold mb-2">{t("noActivities")}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t("startJourney")}
        </p>
        <Link href="/consultation/new">
          <Button size="sm">{t("newConsultation")}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {visibleActivities.map((activity, index) => (
        <TimelineItem
          key={activity.id}
          activity={activity}
          isLatest={index === 0}
        />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVisibleCount(c => c + 5)}
          >
            {t("loadMore")}
          </Button>
        </div>
      )}

      {!hasMore && activities.length > 5 && (
        <p className="text-center text-sm text-muted-foreground pt-4">
          {t("allActivitiesShown")}
        </p>
      )}
    </div>
  );
}
