import { getConsultationById } from "@/lib/actions/consultation-actions";
import { QuoteCardList } from "@/components/booking/quote-card-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { acceptTreatmentPlan } from "@/lib/actions/booking-actions";
import { Link } from "@/i18n/routing";

interface ConsultationDetailPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ConsultationDetailPage({ params }: ConsultationDetailPageProps) {
  const { id } = await params;
  const t = await getTranslations();

  const result = await getConsultationById(id);

  if (!result.success) {
    redirect("/dashboard");
  }

  const consultation = result.data;

  const handleAccept = async (planId: string) => {
    "use server";
    const result = await acceptTreatmentPlan(planId);
    if (result.success) {
      redirect(`/bookings/${result.data.bookingId}`);
    }
  };

  const handleDecline = async (_planId: string) => {
    "use server";
    // TODO: Implement decline logic
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <span>/</span>
          <Link href="/consultations" className="hover:text-foreground">Consultations</Link>
          <span>/</span>
          <span className="text-foreground">Details</span>
        </nav>
        <h1 className="text-3xl font-bold">Consultation Details</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Request Information</CardTitle>
              <Badge variant={consultation.status === "pending" ? "secondary" : "default"}>
                {consultation.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Treatment Description</p>
              <p className="mt-1">{consultation.treatment_description}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Number of Patients</p>
              <p className="mt-1">{consultation.patient_count}</p>
            </div>

            {consultation.travel_dates && (
              <div>
                <p className="text-sm text-muted-foreground">Travel Dates</p>
                <p className="mt-1">
                  {(() => {
                    const raw = String(consultation.travel_dates);
                    const match = raw.match(/[[(]([\d-]+),([\d-]+)[)\]]/);
                    return match ? `${match[1]} → ${match[2]}` : raw;
                  })()}
                </p>
              </div>
            )}

            <div>
              <p className="text-sm text-muted-foreground">Submitted</p>
              <p className="mt-1">{new Date(consultation.created_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        {consultation.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Uploaded Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {consultation.images.map((image) => (
                  <div key={image.id} className="aspect-square rounded-lg overflow-hidden border">
                    <img
                      src={image.image_url}
                      alt={image.image_type || "Dental image"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="mt-6">
        <QuoteCardList
          treatmentPlans={consultation.treatment_plans}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      </div>
    </div>
  );
}

