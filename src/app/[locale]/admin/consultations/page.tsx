import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getAllConsultationsAdmin } from "@/lib/actions/admin-consultation-actions";
import { ConsultationFilters } from "@/components/admin/consultation-filters";
import { ConsultationList } from "@/components/admin/consultation-list";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";

interface SearchParams {
  status?: string;
  search?: string;
  page?: string;
}

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}

export default async function ConsultationsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const t = await getTranslations("admin.consultations");

  const status = resolvedSearchParams.status || "all";
  const search = resolvedSearchParams.search || "";
  const page = parseInt(resolvedSearchParams.page || "1", 10);

  const result = await getAllConsultationsAdmin(
    { status, search },
    page
  );

  if (!result.success) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground mt-2">{t("description")}</p>
        </div>
        <div className="text-center py-12 text-destructive">
          {result.error || "Failed to load consultations"}
        </div>
      </div>
    );
  }

  const { consultations, total } = result.data;
  const pageSize = 20;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <ConsultationFilters />

      <Suspense fallback={<div>Loading...</div>}>
        <ConsultationList consultations={consultations} />
      </Suspense>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, total)} of {total} consultations
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/${locale}/admin/consultations?${new URLSearchParams({
                    ...(status !== "all" && { status }),
                    ...(search && { search }),
                    page: String(page - 1),
                  })}`}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              </Button>
            )}
            {page < totalPages && (
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/${locale}/admin/consultations?${new URLSearchParams({
                    ...(status !== "all" && { status }),
                    ...(search && { search }),
                    page: String(page + 1),
                  })}`}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
