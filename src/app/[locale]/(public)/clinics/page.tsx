import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getClinics } from "@/lib/actions/clinic-actions";
import { ClinicCard } from "@/components/clinic/clinic-card";
import { ClinicFilter } from "@/components/clinic/clinic-filter";
import { Skeleton } from "@/components/ui/skeleton";

interface ClinicsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    treatments?: string;
    sort?: string;
    city?: string;
  }>;
}

export default async function ClinicsPage({
  params,
  searchParams,
}: ClinicsPageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations("clinic");

  const filters = {
    treatmentTypes: sp.treatments?.split(",").filter(Boolean),
    sortBy: sp.sort || "rating",
    city: sp.city,
  };

  const result = await getClinics(filters);
  const clinics = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              {t("directory")}
            </h1>
            <p className="text-text-secondary mt-2">
              {t("directorySubtitle")}
            </p>
          </div>

          <Suspense fallback={<FilterSkeleton />}>
            <ClinicFilter />
          </Suspense>

          {clinics.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-secondary text-lg">{t("noClinics")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinics.map((clinic) => (
                <ClinicCard key={clinic.id} clinic={clinic} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
