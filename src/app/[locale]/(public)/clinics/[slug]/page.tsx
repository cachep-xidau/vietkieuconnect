import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getClinicBySlug, getAllClinicReviews } from "@/lib/actions/clinic-actions";
import { RatingStars } from "@/components/clinic/rating-stars";
import { RatingBreakdown } from "@/components/clinic/rating-breakdown";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, MapPin, Phone, Mail, Globe } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Metadata } from "next";

export const revalidate = 3600;

interface ClinicProfilePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ClinicProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getClinicBySlug(slug);

  if (!result.success || !result.data) {
    return {
      title: "Clinic Not Found",
    };
  }

  return {
    title: `${result.data.name} - VietKieuConnect`,
    description:
      result.data.description_en || "Quality dental care in Vietnam",
  };
}

export default async function ClinicProfilePage({
  params,
}: ClinicProfilePageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations("clinic");
  const tCommon = await getTranslations("common");

  const result = await getClinicBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const clinic = result.data;
  const description =
    locale === "vi" ? clinic.description_vi : clinic.description_en;
  const services = Array.isArray(clinic.services)
    ? (clinic.services as string[])
    : [];
  const pricing = clinic.pricing as Record<string, number> | null;

  // Fetch all reviews for rating breakdown
  const reviewsResult = await getAllClinicReviews(clinic.id);
  const allReviews = reviewsResult.success ? reviewsResult.data : [];

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Photo Gallery Header */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
        {clinic.photos && clinic.photos.length > 0 ? (
          <div className="h-full grid grid-cols-1 md:grid-cols-3 gap-1">
            <div className="md:col-span-2 h-full relative">
              <img
                src={clinic.photos[0]}
                alt={clinic.name}
                className="w-full h-full object-cover"
              />
            </div>
            {clinic.photos.length > 1 && (
              <div className="hidden md:grid grid-rows-2 gap-1">
                {clinic.photos.slice(1, 3).map((photo, idx) => (
                  <div key={idx} className="relative overflow-hidden">
                    <img
                      src={photo}
                      alt={`${clinic.name} ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <img
            src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop"
            alt={clinic.name}
            className="w-full h-full object-cover opacity-70"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {clinic.logo_url && (
                <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={clinic.logo_url}
                    alt={clinic.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-text-primary">
                      {clinic.name}
                    </h1>
                    {clinic.verified && (
                      <Badge className="bg-primary gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        {t("verified")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {clinic.address}, {clinic.city}
                    </span>
                  </div>
                </div>

                <RatingStars
                  rating={clinic.rating}
                  reviewCount={clinic.review_count}
                />

                <div className="flex gap-3">
                  <Button asChild className="flex-1 md:flex-initial">
                    <Link href="/consultation/new">
                      {t("requestConsultation")}
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/clinics/${slug}/reviews`}>
                      {t("reviewsTitle")}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Rating Breakdown Section */}
          {allReviews.length > 0 && (
            <Card className="p-6">
              <RatingBreakdown reviews={allReviews} />
            </Card>
          )}

          {description && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-text-primary">
                {t("description")}
              </h2>
              <p className="text-text-secondary whitespace-pre-wrap">
                {description}
              </p>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">
              {t("services")}
            </h2>
            <div className="flex flex-wrap gap-2">
              {services.map((service, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {service}
                </Badge>
              ))}
            </div>
          </Card>

          {pricing && Object.keys(pricing).length > 0 && (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-text-primary">
                {t("pricing")}
              </h2>
              <div className="space-y-2">
                {Object.entries(pricing).map(([service, price]) => {
                  // Normalize service key to lowercase for translation lookup
                  const serviceKey = service.toLowerCase().replace(/\s+/g, ""); // basic normalization
                  // Try to find translation, fallback to original service name
                  // Note: naive check, ideally we use t.has() but simple key construction is safer here
                  // We map specific known keys in en.json/vi.json
                  let serviceLabel = service;
                  if (
                    [
                      "consultation",
                      "implant",
                      "crown",
                      "veneer",
                      "braces",
                      "whitening",
                      "cleaning",
                      "rootcanal",
                    ].includes(serviceKey)
                  ) {
                    serviceLabel = t(`pricingServices.${serviceKey}`);
                  } else if (serviceKey === "dentalimplant") {
                    serviceLabel = t("pricingServices.implant");
                  } else if (serviceKey === "porcelaincrown") {
                    serviceLabel = t("pricingServices.crown");
                  }

                  return (
                    <div
                      key={service}
                      className="flex justify-between items-center py-2 border-b border-border last:border-0"
                    >
                      <span className="text-text-secondary">{serviceLabel}</span>
                      <span className="font-semibold text-text-primary">
                        {price === 0 ? t("free") : `$${price.toLocaleString()}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">
              {t("contact")}
            </h2>
            <div className="space-y-3">
              {clinic.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-text-secondary" />
                  <a
                    href={`tel:${clinic.phone}`}
                    className="text-primary hover:underline"
                  >
                    {clinic.phone}
                  </a>
                </div>
              )}
              {clinic.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-text-secondary" />
                  <a
                    href={`mailto:${clinic.email}`}
                    className="text-primary hover:underline"
                  >
                    {clinic.email}
                  </a>
                </div>
              )}
              {clinic.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-text-secondary" />
                  <a
                    href={clinic.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {t("website")}
                  </a>
                </div>
              )}
            </div>
          </Card>

          {clinic.photos.length > 0 && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-text-primary">
                  {t("gallery")}
                </h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/clinics/${slug}/gallery`}>
                    {tCommon("viewAll")}
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {clinic.photos.slice(0, 4).map((photo, idx) => (
                  <div
                    key={idx}
                    className="aspect-square rounded-lg overflow-hidden bg-bg-subtle"
                  >
                    <img
                      src={photo}
                      alt={`${clinic.name} ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
