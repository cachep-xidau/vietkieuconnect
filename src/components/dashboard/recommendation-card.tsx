"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import type { ClinicRecommendation, TreatmentRecommendation } from "@/lib/mock-data/dashboard-types";

interface ClinicRecommendationCardProps {
  clinic: ClinicRecommendation;
}

export function ClinicRecommendationCard({ clinic }: ClinicRecommendationCardProps) {
  const t = useTranslations("dashboard");

  return (
    <Card className="hover:scale-[1.02] transition-transform">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Star className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-semibold truncate">{clinic.name}</h4>
              <Badge variant="secondary" className="shrink-0">
                {t("matchScore", { score: clinic.matchScore })}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {clinic.city}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{clinic.rating}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({t("reviews", { count: clinic.reviewCount })})
              </span>
            </div>
            <Badge variant="outline" className="mt-2 text-xs">
              {clinic.reason}
            </Badge>
          </div>
        </div>
        <Link href={`/clinics/${clinic.id}`} className="block mt-3">
          <Button variant="outline" size="sm" className="w-full">
            {t("viewProfile")}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

interface TreatmentRecommendationCardProps {
  treatment: TreatmentRecommendation;
}

export function TreatmentRecommendationCard({ treatment }: TreatmentRecommendationCardProps) {
  const t = useTranslations("dashboard");

  return (
    <Card className="hover:scale-[1.02] transition-transform">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{treatment.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {treatment.reason}
            </p>
          </div>
          {treatment.trending && (
            <Badge variant="secondary" className="shrink-0">
              <TrendingUp className="h-3 w-3 mr-1" />
              {t("trending")}
            </Badge>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">{t("usPrice")}:</span>
            <span className="line-through">${treatment.usPrice}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold">
            <span>{t("vietnamPrice")}:</span>
            <span className="text-green-600">${treatment.vnPrice}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>{t("youSave")}:</span>
            <span className="text-green-600 font-bold">{treatment.savings}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
