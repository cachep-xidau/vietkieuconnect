"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getConsultations } from "@/lib/actions/consultation-actions";
import { ConsultationRequestTable } from "@/types/database-booking-tables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, FileText, CheckCircle, XCircle, Plus, Pencil, Trash2 } from "lucide-react";
import { ConsultationProgress } from "@/components/booking/consultation-progress";
import { ConsultationEditModal } from "@/components/booking/consultation-edit-modal";
import { ConsultationDeleteDialog } from "@/components/booking/consultation-delete-dialog";

type ConsultationStatus = "pending" | "quoted" | "accepted" | "declined";

export default function ConsultationsPage() {
  const t = useTranslations();
  const tConsultation = useTranslations("consultation");
  const tBooking = useTranslations("booking");
  const tDashboard = useTranslations("dashboard");

  const [consultations, setConsultations] = useState<ConsultationRequestTable["Row"][]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | ConsultationStatus>("all");
  const [editingConsultation, setEditingConsultation] = useState<ConsultationRequestTable["Row"] | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadConsultations();
  }, []);

  const loadConsultations = async () => {
    setLoading(true);
    const result = await getConsultations();
    if (result.success) {
      setConsultations(result.data);
    }
    setLoading(false);
  };

  const filteredConsultations = activeTab === "all"
    ? consultations
    : consultations.filter((c) => c.status === activeTab);

  const getStatusCount = (status: ConsultationStatus) =>
    consultations.filter((c) => c.status === status).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/dashboard" className="hover:text-foreground">
            {t("nav.home")}
          </Link>
          <span>/</span>
          <span className="text-foreground">{tConsultation("myConsultations")}</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{tConsultation("myConsultations")}</h1>
            <p className="text-muted-foreground mt-2">{tConsultation("myConsultationsDesc")}</p>
          </div>
          <Button asChild>
            <Link href="/consultation/new">
              <Plus className="mr-2 h-4 w-4" />
              {tConsultation("newConsultation")}
            </Link>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="all">
            {t("common.viewAll")} ({consultations.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            <Clock className="h-3 w-3 mr-1" />
            {tBooking("status.pending")} ({getStatusCount("pending")})
          </TabsTrigger>
          <TabsTrigger value="quoted">
            <FileText className="h-3 w-3 mr-1" />
            {tBooking("status.plan_sent")} ({getStatusCount("quoted")})
          </TabsTrigger>
          <TabsTrigger value="accepted">
            <CheckCircle className="h-3 w-3 mr-1" />
            {tBooking("status.confirmed")} ({getStatusCount("accepted")})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
                <p className="mt-4 text-muted-foreground">{t("common.loading")}</p>
              </div>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">{tDashboard("noActiveConsultations")}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Start a new consultation to get treatment quotes from verified clinics
                </p>
                <Button asChild className="mt-4">
                  <Link href="/consultation/new">{tConsultation("newConsultation")}</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredConsultations.map((consultation) => (
                <Card key={consultation.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-2">
                          {consultation.treatment_description}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(consultation.created_at).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      {/* Edit/Delete actions — only for pending */}
                      {consultation.status === "pending" && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            onClick={() => setEditingConsultation(consultation)}
                            title={tConsultation("editConsultation")}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => setDeletingId(consultation.id)}
                            title={tConsultation("deleteConsultation")}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Progress Stepper */}
                    <ConsultationProgress status={consultation.status} />

                    {/* Info row */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">{tConsultation("patientCount")}:</span>{" "}
                        {consultation.patient_count}
                      </div>
                      {consultation.travel_dates && (
                        <div>
                          <span className="font-medium">{tConsultation("travelDates")}:</span>{" "}
                          {(() => {
                            try {
                              const raw = String(consultation.travel_dates);
                              const match = raw.match(/[[(]([\d-]+),([\d-]+)[)\]]/);
                              return match ? match[1] : "Not specified";
                            } catch {
                              return "Not specified";
                            }
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1">
                      <Button asChild variant="default" size="sm">
                        <Link href={`/consultation/${consultation.id}`}>
                          {tConsultation("viewDetails")}
                        </Link>
                      </Button>
                      {consultation.status === "quoted" && (
                        <Button asChild variant="secondary" size="sm">
                          <Link href={`/consultation/${consultation.id}`}>
                            {tBooking("treatmentPlan")}
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      {editingConsultation && (
        <ConsultationEditModal
          consultation={editingConsultation}
          open={!!editingConsultation}
          onOpenChange={(open) => !open && setEditingConsultation(null)}
          onSuccess={loadConsultations}
        />
      )}

      {/* Delete Dialog */}
      {deletingId && (
        <ConsultationDeleteDialog
          consultationId={deletingId}
          open={!!deletingId}
          onOpenChange={(open) => !open && setDeletingId(null)}
          onSuccess={loadConsultations}
        />
      )}
    </div>
  );
}
