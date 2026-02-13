import { getTranslations } from "next-intl/server";
import { getAllClinicsAdmin, getClinicCities } from "@/lib/actions/admin-clinic-queries";
import { ClinicFilters } from "@/components/admin/clinic-filters";
import { ClinicList } from "@/components/admin/clinic-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ClinicPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    search?: string;
    verified?: "all" | "verified" | "unverified";
    city?: string;
    page?: string;
  }>;
}

export default async function ClinicsPage({ params, searchParams }: ClinicPageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations("admin.clinics");

  const page = parseInt(sp.page || "1", 10);
  const filters = {
    search: sp.search,
    verified: sp.verified || "all",
    city: sp.city,
  };

  const [clinicsResult, citiesResult] = await Promise.all([
    getAllClinicsAdmin(filters, page),
    getClinicCities(),
  ]);

  const clinics = clinicsResult.success ? clinicsResult.data.clinics : [];
  const total = clinicsResult.success ? clinicsResult.data.total : 0;
  const cities = citiesResult.success ? citiesResult.data : [];

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("description")}</p>
        </div>
        <Button asChild>
          <Link href={`/${locale}/admin/clinics/new`}>
            <Plus className="h-4 w-4 mr-2" />
            {t("createClinic")}
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <ClinicFilters cities={cities} />

      {/* Clinic List */}
      <ClinicList clinics={clinics} locale={locale} />

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={page > 1 ? `?${new URLSearchParams({ ...sp, page: String(page - 1) })}` : "#"}
                aria-disabled={page <= 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href={`?${new URLSearchParams({ ...sp, page: String(p) })}`}
                  isActive={p === page}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={page < totalPages ? `?${new URLSearchParams({ ...sp, page: String(page + 1) })}` : "#"}
                aria-disabled={page >= totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
