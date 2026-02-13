import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "./rating-stars";
import { SavingsBadge } from "./savings-badge";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { ClinicTable } from "@/types/database-clinic-tables";
import { useTranslations } from "next-intl";

interface ClinicCardProps {
  clinic: ClinicTable["Row"];
  locale: string;
}

export function ClinicCard({ clinic, locale }: ClinicCardProps) {
  const t = useTranslations("clinic");
  const mainPhoto = clinic.photos[0];
  const services = Array.isArray(clinic.services)
    ? (clinic.services as string[])
    : [];

  return (
    <Link href={`/${locale}/clinics/${clinic.slug}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
          {mainPhoto ? (
            <img
              src={mainPhoto}
              alt={clinic.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-text-secondary">
              {clinic.name[0]}
            </div>
          )}
          <div className="absolute top-3 right-3">
            <SavingsBadge savings={t("savings", { amount: "60-80%" })} />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-text-primary truncate">
                {clinic.name}
              </h3>
              <p className="text-sm text-text-secondary">{clinic.city}</p>
            </div>
            {clinic.verified && (
              <div className="flex items-center gap-1 text-primary flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-medium">{t("verified")}</span>
              </div>
            )}
          </div>

          <RatingStars rating={clinic.rating} reviewCount={clinic.review_count} />

          <div className="flex flex-wrap gap-1.5">
            {services.slice(0, 3).map((service, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="text-xs bg-bg-subtle"
              >
                {service}
              </Badge>
            ))}
            {services.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-bg-subtle">
                +{services.length - 3}
              </Badge>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" asChild>
              <span>{t("viewProfile")}</span>
            </Button>
            <Button size="sm" className="flex-1" asChild>
              <span>{t("requestConsultation")}</span>
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
