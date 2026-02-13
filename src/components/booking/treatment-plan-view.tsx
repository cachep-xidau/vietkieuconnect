"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { TreatmentPlanTable } from "@/types/database-booking-tables";
import { DollarSign, TrendingDown } from "lucide-react";

interface TreatmentPlanViewProps {
  treatmentPlan: TreatmentPlanTable["Row"];
  onAccept?: () => void;
  onDecline?: () => void;
  readonly?: boolean;
}

interface TreatmentItem {
  name: string;
  quantity: number;
  priceUsd: number;
  priceVnd: number;
}

const US_AVG_PRICES: Record<string, number> = {
  "Dental Implant": 3500,
  "Crown": 1200,
  "Root Canal": 1000,
  "Veneer": 1500,
  "Teeth Whitening": 600,
  "Bridge": 3000,
  "Filling": 200,
  "Extraction": 150,
};

function calculateSavings(items: TreatmentItem[]): number {
  let totalUsSavings = 0;
  items.forEach((item) => {
    const usPrice = US_AVG_PRICES[item.name] || item.priceUsd * 3;
    totalUsSavings += (usPrice - item.priceUsd) * item.quantity;
  });
  return totalUsSavings;
}

export function TreatmentPlanView({ treatmentPlan, onAccept, onDecline, readonly = false }: TreatmentPlanViewProps) {
  const t = useTranslations();

  const items = (treatmentPlan.items as TreatmentItem[]) || [];
  const totalUsd = treatmentPlan.total_usd || 0;
  const totalVnd = treatmentPlan.total_vnd || 0;
  const savings = calculateSavings(items);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t("booking.treatmentPlan")}</CardTitle>
          <Badge variant={treatmentPlan.status === "accepted" ? "default" : "secondary"}>
            {treatmentPlan.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${item.priceUsd.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {item.priceVnd.toLocaleString()} VNĐ
                </p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <div className="text-right">
              <p>${totalUsd.toLocaleString()}</p>
              <p className="text-sm font-normal text-muted-foreground">
                {totalVnd.toLocaleString()} VNĐ
              </p>
            </div>
          </div>

          {savings > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300">
              <TrendingDown className="h-5 w-5" />
              <span className="font-semibold">
                {t("booking.youSaved", { amount: `$${savings.toLocaleString()}` })}
              </span>
            </div>
          )}
        </div>

        {treatmentPlan.notes && (
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-sm font-medium mb-1">Notes from Clinic:</p>
            <p className="text-sm text-muted-foreground">{treatmentPlan.notes}</p>
          </div>
        )}

        {!readonly && treatmentPlan.status === "sent" && onAccept && onDecline && (
          <div className="flex gap-3 pt-4">
            <Button onClick={onAccept} className="flex-1">
              <DollarSign className="h-4 w-4 mr-2" />
              {t("booking.acceptPlan")}
            </Button>
            <Button onClick={onDecline} variant="outline" className="flex-1">
              {t("booking.decline")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
