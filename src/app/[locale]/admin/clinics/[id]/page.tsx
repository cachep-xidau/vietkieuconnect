import { getTranslations } from "next-intl/server";
import { getClinicById } from "@/lib/actions/admin-clinic-queries";
import { ClinicForm } from "@/components/admin/clinic-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { notFound } from "next/navigation";

interface EditClinicPageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function EditClinicPage({ params }: EditClinicPageProps) {
  const { locale, id } = await params;
  const t = await getTranslations("admin.clinics");

  const result = await getClinicById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  const clinic = result.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/${locale}/admin/clinics`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("editClinic")}</h1>
          <p className="text-muted-foreground mt-2">{clinic.name}</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <ClinicForm mode="edit" initialData={clinic} locale={locale} />
      </div>
    </div>
  );
}
