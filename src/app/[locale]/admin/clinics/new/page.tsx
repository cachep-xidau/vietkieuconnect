import { getTranslations } from "next-intl/server";
import { ClinicForm } from "@/components/admin/clinic-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";

interface NewClinicPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewClinicPage({ params }: NewClinicPageProps) {
  const { locale } = await params;
  const t = await getTranslations("admin.clinics");

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
          <h1 className="text-3xl font-bold tracking-tight">{t("createClinic")}</h1>
          <p className="text-muted-foreground mt-2">{t("createDescription")}</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <ClinicForm mode="create" locale={locale} />
      </div>
    </div>
  );
}
