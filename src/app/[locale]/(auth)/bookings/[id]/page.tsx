import { getBookingById, cancelBooking } from "@/lib/actions/booking-actions";
import { getReviewByBookingId } from "@/lib/actions/review-actions";
import { BookingStatusCard } from "@/components/booking/booking-status-card";
import { TreatmentPlanView } from "@/components/booking/treatment-plan-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { MapPin, Phone, Mail, AlertTriangle, Star } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Link } from "@/i18n/routing";

interface BookingDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id, locale } = await params;
  const t = await getTranslations();
  const tReview = await getTranslations("review");

  const result = await getBookingById(id);

  if (!result.success) {
    redirect("/bookings");
  }

  const booking = result.data;

  // Check if review exists for completed bookings
  let hasReview = false;
  if (booking.status === "completed") {
    const reviewResult = await getReviewByBookingId(id);
    hasReview = reviewResult.success && reviewResult.data !== null;
  }

  const handleCancel = async () => {
    "use server";
    const result = await cancelBooking(id);
    if (result.success) {
      redirect("/bookings");
    }
  };

  const canCancel = booking.status === "pending" || booking.status === "confirmed";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <Link href="/bookings" className="hover:text-foreground">{t("booking.myBookings")}</Link>
          <span>/</span>
          <span className="text-foreground">{t("booking.bookingDetails")}</span>
        </nav>
        <h1 className="text-3xl font-bold">{t("booking.bookingDetails")}</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <TreatmentPlanView treatmentPlan={booking.treatment_plan} readonly />

          <Card>
            <CardHeader>
              <CardTitle>Clinic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{booking.clinic.name}</h3>
                {booking.clinic.address && (
                  <div className="flex items-start gap-2 mt-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>{booking.clinic.address}</span>
                  </div>
                )}
              </div>

              {booking.clinic.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${booking.clinic.phone}`} className="hover:underline">
                    {booking.clinic.phone}
                  </a>
                </div>
              )}

              {booking.clinic.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${booking.clinic.email}`} className="hover:underline">
                    {booking.clinic.email}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <BookingStatusCard booking={booking} clinicName={booking.clinic.name} />

          {booking.status === "completed" && !hasReview && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-green-900">{tReview("writeReview")}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-green-700 mb-4">
                  {tReview("shareExperience")}
                </p>
                <Link href={`/${locale}/bookings/${id}/review`}>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    {tReview("writeReviewButton")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {canCancel && (
            <Card className="border-destructive/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-destructive">Cancel Booking</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("booking.cancelConfirm")}
                </p>
                <form action={handleCancel}>
                  <Button variant="destructive" className="w-full" type="submit">
                    {t("booking.cancelBooking")}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
