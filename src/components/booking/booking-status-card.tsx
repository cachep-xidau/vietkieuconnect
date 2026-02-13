"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { BookingTable } from "@/types/database-booking-tables";
import { CheckCircle2, Circle, Clock } from "lucide-react";

interface BookingStatusCardProps {
  booking: BookingTable["Row"];
  clinicName: string;
}

const BOOKING_STEPS = [
  { key: "pending", label: "Inquiry Sent" },
  { key: "consultation", label: "Under Review" },
  { key: "plan_sent", label: "Plan Ready" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
];

function getStepIndex(status: string): number {
  if (status === "pending") return 0;
  if (status === "confirmed") return 3;
  if (status === "completed") return 4;
  if (status === "cancelled") return -1;
  return 0;
}

export function BookingStatusCard({ booking, clinicName }: BookingStatusCardProps) {
  const t = useTranslations();
  const currentStepIndex = getStepIndex(booking.status);
  const isCancelled = booking.status === "cancelled";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Booking Status</CardTitle>
          <Badge variant={booking.status === "completed" ? "default" : "secondary"}>
            {t(`booking.status.${booking.status}`)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Clinic</p>
          <p className="font-semibold">{clinicName}</p>
        </div>

        {isCancelled ? (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive">
            <p className="font-medium">Booking Cancelled</p>
            <p className="text-sm mt-1">This booking has been cancelled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {BOOKING_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isPending = index > currentStepIndex;

              return (
                <div key={step.key} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : isCurrent ? (
                      <Clock className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                    {index < BOOKING_STEPS.length - 1 && (
                      <div
                        className={`w-0.5 h-8 mt-1 ${
                          isCompleted ? "bg-green-600" : "bg-muted-foreground/20"
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-2">
                    <p
                      className={`font-medium ${
                        isCurrent ? "text-blue-600" : isCompleted ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isCompleted && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.key === "confirmed" && booking.confirmed_at
                          ? new Date(booking.confirmed_at).toLocaleDateString()
                          : step.key === "completed" && booking.completed_at
                          ? new Date(booking.completed_at).toLocaleDateString()
                          : "Completed"}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Booking ID</span>
            <span className="font-mono text-xs">{booking.id.slice(0, 8)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Created</span>
            <span>{new Date(booking.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
