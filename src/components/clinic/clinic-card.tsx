"use client";

import { Link } from "@/i18n/routing";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RatingStars } from "./rating-stars";
import { SavingsBadge } from "./savings-badge";
import { ShieldCheck, MapPin, Phone, ExternalLink } from "lucide-react";
import { ClinicTable } from "@/types/database-clinic-tables";
import { useTranslations } from "next-intl";

interface ClinicCardProps {
  clinic: ClinicTable["Row"];
  locale: string;
}

function getGoogleMapsUrl(address: string, city: string): string {
  const query = encodeURIComponent(`${address}, ${city}, Vietnam`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function ClinicCard({ clinic, locale }: ClinicCardProps) {
  const t = useTranslations("clinic");
  const mainPhoto = clinic.photos[0];
  const services = Array.isArray(clinic.services)
    ? (clinic.services as string[])
    : [];

  return (
    <Link href={`/clinics/${clinic.slug}`}>
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

          {/* Address — clickable, opens Google Maps */}
          {clinic.address && (
            <a
              href={getGoogleMapsUrl(clinic.address, clinic.city)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-primary/80 hover:text-primary truncate flex items-center gap-1.5 transition-colors group"
            >
              <MapPin className="h-3 w-3 flex-shrink-0" />
              <span className="truncate group-hover:underline">{clinic.address}</span>
              <ExternalLink className="h-2.5 w-2.5 flex-shrink-0 opacity-50 group-hover:opacity-100" />
            </a>
          )}

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

          {/* Action Buttons — Hotline + Đặt lịch */}
          <div className="flex gap-2 pt-2">
            {clinic.phone && (
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0"
                asChild
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <a href={`tel:${clinic.phone}`} onClick={(e) => e.stopPropagation()}>
                  <Phone className="h-3.5 w-3.5 mr-1.5" />
                  {t("hotline")}
                </a>
              </Button>
            )}
            <Button size="sm" className="flex-1" asChild>
              <span>{t("bookAppointment")}</span>
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
