import { ConsultationWizard } from "@/components/booking/consultation-wizard";
import { getTranslations } from "next-intl/server";

export default async function NewConsultationPage() {
  const t = await getTranslations();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <a href="/dashboard" className="hover:text-foreground">Dashboard</a>
          <span>/</span>
          <span className="text-foreground">{t("consultation.title")}</span>
        </nav>
        <h1 className="text-3xl font-bold">{t("consultation.title")}</h1>
        <p className="text-muted-foreground mt-2">{t("consultation.description")}</p>
      </div>

      <ConsultationWizard />
    </div>
  );
}
