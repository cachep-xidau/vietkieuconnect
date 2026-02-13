"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getConsultations } from "@/lib/actions/consultation-actions";
import { ConsultationRequestTable } from "@/types/database-booking-tables";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, FileText, CheckCircle, XCircle, Plus } from "lucide-react";

type ConsultationStatus = "pending" | "quoted" | "accepted" | "declined";

export default function ConsultationsPage() {
  const t = useTranslations();
  const tConsultation = useTranslations("consultation");
  const tBooking = useTranslations("booking");
  const tDashboard = useTranslations("dashboard");

  const [consultations, setConsultations] = useState<ConsultationRequestTable["Row"][]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | ConsultationStatus>("all");

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

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: "secondary" as const, label: tBooking("status.pending"), icon: Clock },
      quoted: { variant: "default" as const, label: tBooking("status.plan_sent"), icon: FileText },
      accepted: { variant: "default" as const, label: tBooking("status.confirmed"), icon: CheckCircle },
      declined: { variant: "destructive" as const, label: tBooking("status.cancelled"), icon: XCircle },
    };
    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
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
          <span className="text-foreground">{t("nav.consult")}</span>
        </nav>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{tConsultation("title")}</h1>
            <p className="text-muted-foreground mt-2">{tConsultation("description")}</p>
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
            {tBooking("status.pending")} ({getStatusCount("pending")})
          </TabsTrigger>
          <TabsTrigger value="quoted">
            {tBooking("status.plan_sent")} ({getStatusCount("quoted")})
          </TabsTrigger>
          <TabsTrigger value="accepted">
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
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
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
                      {getStatusBadge(consultation.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                      <div>
                        <span className="font-medium">{tConsultation("patientCount")}:</span>{" "}
                        {consultation.patient_count}
                      </div>
                      {consultation.travel_dates && (
                        <div>
                          <span className="font-medium">{tConsultation("travelDates")}:</span>{" "}
                          {(() => {
                            try {
                              const dates = typeof consultation.travel_dates === "string"
                                ? JSON.parse(consultation.travel_dates)
                                : consultation.travel_dates;
                              return dates?.start || "Not specified";
                            } catch {
                              return "Not specified";
                            }
                          })()}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="default" size="sm">
                        <Link href={`/consultation/${consultation.id}`}>
                          {t("common.viewAll")}
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
    </div>
  );
}
