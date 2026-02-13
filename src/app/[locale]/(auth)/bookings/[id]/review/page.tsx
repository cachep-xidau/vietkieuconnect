import { getBookingById } from "@/lib/actions/booking-actions";
import { getReviewByBookingId } from "@/lib/actions/review-actions";
import { ReviewForm } from "@/components/review/review-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

interface ReviewPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations("review");
  const tBooking = await getTranslations("booking");

  // Fetch booking details
  const bookingResult = await getBookingById(id);

  if (!bookingResult.success) {
    redirect(`/${locale}/bookings`);
  }

  const booking = bookingResult.data;

  // Check if booking is completed
  if (booking.status !== "completed") {
    redirect(`/${locale}/bookings/${id}`);
  }

  // Check if review already exists
  const reviewResult = await getReviewByBookingId(id);

  if (reviewResult.success && reviewResult.data) {
    // Review already submitted - show confirmation
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          href={`/${locale}/bookings/${id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {tBooking("backToBooking")}
        </Link>

        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
              <div>
                <CardTitle className="text-green-900">{t("alreadySubmitted")}</CardTitle>
                <CardDescription className="text-green-700">
                  {t("thankYou")}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Show review form
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href={`/${locale}/bookings/${id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          {tBooking("backToBooking")}
        </Link>

        <h1 className="text-3xl font-bold">{t("writeReview")}</h1>
        <p className="text-muted-foreground mt-2">{t("shareExperience")}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("yourReview")}</CardTitle>
          <CardDescription>{t("helpOthers")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ReviewForm
            bookingId={id}
            clinicName={booking.clinic.name}
            translations={{
              title: t("title"),
              ratingLabel: t("ratingLabel"),
              titleLabel: t("titleLabel"),
              titlePlaceholder: t("titlePlaceholder"),
              contentLabel: t("contentLabel"),
              contentPlaceholder: t("contentPlaceholder"),
              treatmentTypeLabel: t("treatmentTypeLabel"),
              treatmentTypePlaceholder: t("treatmentTypePlaceholder"),
              photosLabel: t("photosLabel"),
              submit: t("submit"),
              submitting: t("submitting"),
              success: t("success"),
              error: t("error"),
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
