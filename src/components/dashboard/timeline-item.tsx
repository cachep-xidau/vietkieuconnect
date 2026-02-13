"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ChevronDown, ClipboardList, Calendar, Star } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TimelineActivity } from "@/lib/mock-data/dashboard-types";

interface TimelineItemProps {
  activity: TimelineActivity;
  isLatest: boolean;
}

export function TimelineItem({ activity, isLatest }: TimelineItemProps) {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    pending: "bg-yellow-500",
    quoted: "bg-blue-500",
    confirmed: "bg-green-500",
    completed: "bg-gray-400"
  };

  const typeIcons = {
    consultation: ClipboardList,
    booking: Calendar,
    review: Star
  };

  const Icon = typeIcons[activity.type];

  return (
    <div className="flex gap-4 group">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center" aria-hidden="true">
        <div className={cn(
          "w-3 h-3 rounded-full border-2 border-background",
          isLatest ? statusColors[activity.status] : "bg-muted"
        )} />
        <div className="w-0.5 h-full bg-border" />
      </div>

      {/* Content */}
      <Card
        className="flex-1 p-4 hover:bg-muted/50 cursor-pointer transition-colors mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        onClick={() => setExpanded(!expanded)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded(!expanded);
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={expanded}
        aria-label={`${activity.title} - ${activity.status}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <Icon className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <p className="font-medium">{activity.title}</p>
              {activity.subtitle && (
                <p className="text-sm text-muted-foreground line-clamp-1">{activity.subtitle}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(activity.date).toLocaleDateString()} • {activity.clinic.name}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="secondary">{activity.status}</Badge>
            <ChevronDown className={cn(
              "h-4 w-4 transition-transform",
              expanded && "rotate-180"
            )} />
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 pt-3 border-t overflow-hidden"
            >
              {activity.details && <p className="text-sm">{activity.details}</p>}
              {activity.price && (
                <p className="text-sm font-semibold mt-2">
                  ${activity.price.toLocaleString()}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
}
