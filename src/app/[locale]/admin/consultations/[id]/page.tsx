import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getConsultationByIdAdmin } from "@/lib/actions/admin-consultation-actions";
import { getAllClinicsAdmin } from "@/lib/actions/admin-clinic-queries";
import { TreatmentPlanForm } from "@/components/admin/treatment-plan-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, User, FileText, Image as ImageIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { format } from "date-fns";
import Image from "next/image";

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  quoted: "bg-blue-100 text-blue-800 border-blue-300",
  accepted: "bg-green-100 text-green-800 border-green-300",
  declined: "bg-red-100 text-red-800 border-red-300",
  expired: "bg-gray-100 text-gray-800 border-gray-300",
};

export default async function ConsultationDetailPage({ params }: PageProps) {
  const { locale, id } = await params;
  const t = await getTranslations("admin.consultations");

  const result = await getConsultationByIdAdmin(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const consultation = result.data;
  const clinicsResult = await getAllClinicsAdmin();
  const clinics = clinicsResult.success ? clinicsResult.data.clinics : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href={`/${locale}/admin/consultations`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Consultations
          </Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Consultation Details</h1>
          <p className="text-muted-foreground mt-1">ID: {consultation.id}</p>
        </div>
        <Badge
          variant="outline"
          className={statusColors[consultation.status as keyof typeof statusColors]}
        >
          {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium">{consultation.user?.full_name || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{consultation.user?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patient Count</p>
              <p className="font-medium">{consultation.patient_count}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Request Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">Submitted</p>
              <p className="font-medium">
                {format(new Date(consultation.created_at), "PPP")}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Preferred Clinic</p>
              <p className="font-medium">
                {consultation.clinic
                  ? `${consultation.clinic.name} - ${consultation.clinic.city}`
                  : "Any clinic"}
              </p>
            </div>
            {consultation.travel_dates && (
              <div>
                <p className="text-sm text-muted-foreground">Travel Dates</p>
                <p className="font-medium">{consultation.travel_dates}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Treatment Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{consultation.treatment_description}</p>
        </CardContent>
      </Card>

      {consultation.images && consultation.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Uploaded Images ({consultation.images.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {consultation.images.map((image) => (
                <div key={image.id} className="relative aspect-square rounded-lg overflow-hidden border">
                  <Image
                    src={image.image_url}
                    alt={`X-ray ${image.id}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {consultation.status === "pending" && (
        <Card>
          <CardHeader>
            <CardTitle>Create Treatment Plan Quote</CardTitle>
          </CardHeader>
          <CardContent>
            <TreatmentPlanForm
              consultationId={consultation.id}
              clinics={clinics.map((c) => ({ id: c.id, name: c.name, city: c.city }))}
            />
          </CardContent>
        </Card>
      )}

      {consultation.treatment_plans && consultation.treatment_plans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Treatment Plans</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {consultation.treatment_plans.map((plan) => (
              <div key={plan.id} className="border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Created {format(new Date(plan.created_at), "PPP")}
                  </p>
                  <Badge variant="outline">
                    {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                  </Badge>
                </div>
                {plan.total_usd && (
                  <p className="text-2xl font-bold">${plan.total_usd.toFixed(2)} USD</p>
                )}
                {plan.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">{plan.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
