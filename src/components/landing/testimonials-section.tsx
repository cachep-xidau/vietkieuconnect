"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TestimonialsSection() {
  const t = useTranslations("landing.testimonials");

  const testimonials = [
    {
      name: "Nguyen Tran",
      location: "Los Angeles, CA",
      rating: 5,
      text: "I saved over $8,000 on my dental implants! The clinic in HCMC was spotless, the dentist spoke perfect English, and the quality was just as good as what I'd get in the US. VietKieuConnect made the whole process so easy.",
      initials: "NT",
    },
    {
      name: "Linh Pham",
      location: "Houston, TX",
      rating: 5,
      text: "Got 6 porcelain crowns done during my visit home. The quote comparison feature helped me find the best clinic. Everything was transparent, no hidden fees. Highly recommend to all Việt Kiều!",
      initials: "LP",
    },
    {
      name: "David Vo",
      location: "Sydney, Australia",
      rating: 4,
      text: "Professional service from start to finish. The clinic followed up with me even after I returned to Australia. Only wish I had discovered this platform sooner!",
      initials: "DV",
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

        {/* Testimonials Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="border-border bg-bg-card transition-shadow hover:shadow-md"
            >
              <CardContent className="p-6">
                {/* Avatar & Info */}
                <div className="mb-4 flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-text-primary">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {testimonial.location}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-accent text-accent"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-text-secondary leading-relaxed">
                  "{testimonial.text}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
