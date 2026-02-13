"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Star, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FeaturedClinicsSection() {
  const t = useTranslations("landing.featuredClinics");
  const tClinic = useTranslations("clinic");

  const clinics = [
    {
      id: 1,
      name: "Saigon Smile Dental",
      city: "Ho Chi Minh City",
      rating: 4.8,
      reviewCount: 342,
      services: ["Implants", "Veneers"],
    },
    {
      id: 2,
      name: "Hanoi International Dental",
      city: "Hanoi",
      rating: 4.9,
      reviewCount: 521,
      services: ["All Services"],
    },
    {
      id: 3,
      name: "Da Nang Dental Center",
      city: "Da Nang",
      rating: 4.7,
      reviewCount: 289,
      services: ["Crowns", "Braces"],
    },
  ];

  return (
    <section className="bg-bg-subtle py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-text-primary md:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-secondary">
            {t("subtitle")}
          </p>
        </div>

        {/* Clinics Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clinics.map((clinic) => (
            <Card
              key={clinic.id}
              className="overflow-hidden border-border bg-bg-card transition-shadow hover:shadow-lg"
            >
              <CardContent className="p-6">
                {/* Clinic Name */}
                <h3 className="mb-2 text-xl font-semibold text-text-primary">
                  {clinic.name}
                </h3>

                {/* Location */}
                <div className="mb-3 flex items-center gap-1.5 text-sm text-text-secondary">
                  <MapPin className="h-4 w-4" />
                  <span>{clinic.city}</span>
                </div>

                {/* Rating */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-semibold text-text-primary">
                      {clinic.rating}
                    </span>
                  </div>
                  <span className="text-sm text-text-secondary">
                    ({clinic.reviewCount} reviews)
                  </span>
                </div>

                {/* Services */}
                <div className="flex flex-wrap gap-2">
                  {clinic.services.map((service, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/10 text-primary hover:bg-primary/20"
                    >
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="border-t border-border bg-bg-subtle p-4">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/clinics/${clinic.id}`}>
                    {tClinic("viewProfile")}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/clinics">{t("viewAll")}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
