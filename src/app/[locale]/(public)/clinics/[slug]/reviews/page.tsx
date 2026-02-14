import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getClinicBySlug, getClinicReviews } from "@/lib/actions/clinic-actions";
import { RatingStars } from "@/components/clinic/rating-stars";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/routing";

interface ReviewsPageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export default async function ReviewsPage({
  params,
  searchParams,
}: ReviewsPageProps) {
  const { locale, slug } = await params;
  const sp = await searchParams;
  const t = useTranslations("clinic");
  const tReview = useTranslations("review");
  const tCommon = useTranslations("common");

  const clinicResult = await getClinicBySlug(slug);

  if (!clinicResult.success || !clinicResult.data) {
    notFound();
  }

  const clinic = clinicResult.data;
  const page = parseInt(sp.page || "1", 10);
  const sortBy = sp.sort || "recent";

  const reviewsResult = await getClinicReviews(clinic.id, {
    page,
    sortBy,
    limit: 10,
  });

  const { reviews, total } = reviewsResult.success
    ? reviewsResult.data
    : { reviews: [], total: 0 };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link href={`/clinics/${slug}`}>
                ← {tCommon("back")}
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-text-primary">
              {t("reviewsTitle")} - {clinic.name}
            </h1>
            <div className="mt-4">
              <RatingStars rating={clinic.rating} reviewCount={clinic.review_count} />
            </div>
          </div>

          {reviews.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-text-secondary">{t("noReviews")}</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-text-primary">
                            {review.title}
                          </h3>
                          <Badge variant="secondary" className="text-xs">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            {tReview("verified")}
                          </Badge>
                        </div>
                        <RatingStars rating={review.rating} />
                      </div>
                      <span className="text-sm text-text-secondary">
                        {new Date(review.created_at).toLocaleDateString(locale)}
                      </span>
                    </div>

                    <p className="text-text-secondary">{review.content}</p>

                    {review.treatment_type && (
                      <Badge variant="outline" className="text-xs">
                        {review.treatment_type}
                      </Badge>
                    )}

                    {review.photos.length > 0 && (
                      <div className="flex gap-2 pt-2">
                        {review.photos.map((photo, idx) => (
                          <div
                            key={idx}
                            className="w-20 h-20 rounded overflow-hidden bg-bg-subtle"
                          >
                            <img
                              src={photo}
                              alt={`Review ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {page > 1 && (
                <Button variant="outline" asChild>
                  <Link href={`?page=${page - 1}&sort=${sortBy}`}>
                    {tCommon("back")}
                  </Link>
                </Button>
              )}
              <span className="px-4 py-2 text-text-secondary">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Button variant="outline" asChild>
                  <Link href={`?page=${page + 1}&sort=${sortBy}`}>
                    {tCommon("next")}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
