import { getConsultationById } from "@/lib/actions/consultation-actions";
import { TreatmentPlanView } from "@/components/booking/treatment-plan-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { acceptTreatmentPlan } from "@/lib/actions/booking-actions";
import { Clock } from "lucide-react";

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
  const treatmentPlan = consultation.treatment_plans[0];

  const handleAccept = async () => {
    "use server";
    if (!treatmentPlan) return;
    const result = await acceptTreatmentPlan(treatmentPlan.id);
    if (result.success) {
      redirect(`/bookings/${result.data.bookingId}`);
    }
  };

  const handleDecline = async () => {
    "use server";
    // TODO: Implement decline logic
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <a href="/dashboard" className="hover:text-foreground">Dashboard</a>
          <span>/</span>
          <a href="/consultations" className="hover:text-foreground">Consultations</a>
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
                <p className="mt-1">{JSON.stringify(consultation.travel_dates)}</p>
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
        {treatmentPlan ? (
          <TreatmentPlanView
            treatmentPlan={treatmentPlan}
            onAccept={handleAccept}
            onDecline={handleDecline}
          />
        ) : (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">{t("consultation.waitingForResponse")}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("consultation.responseTime")}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
