import { getTranslations } from "next-intl/server";
import { getClinics } from "@/lib/actions/clinic-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/components/clinic/rating-stars";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, X } from "lucide-react";
import { Link } from "@/i18n/routing";

interface ComparePageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ clinics?: string }>;
}

export default async function ComparePage({
  params,
  searchParams,
}: ComparePageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations("clinic");
  const tCommon = await getTranslations("common");

  const clinicIds = sp.clinics?.split(",").filter(Boolean) || [];
  const clinicsResult = await getClinics();
  const allClinics = clinicsResult.success ? clinicsResult.data : [];
  const selectedClinics = allClinics.filter((c) => clinicIds.includes(c.id));

  if (selectedClinics.length === 0) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-text-primary mb-8">
            {t("compare")}
          </h1>
          <Card className="p-12 text-center">
            <p className="text-text-secondary text-lg mb-4">
              No clinics selected for comparison
            </p>
            <Button asChild>
              <Link href={`/${locale}/clinics`}>Browse Clinics</Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const services = Array.from(
    new Set(
      selectedClinics.flatMap((c) =>
        Array.isArray(c.services) ? (c.services as string[]) : []
      )
    )
  );

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-text-primary">
            {t("compare")}
          </h1>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-bg-card">
                  <th className="p-4 text-left font-semibold text-text-primary border border-border">
                    Feature
                  </th>
                  {selectedClinics.map((clinic) => (
                    <th
                      key={clinic.id}
                      className="p-4 text-left font-semibold text-text-primary border border-border min-w-[250px]"
                    >
                      <div className="space-y-2">
                        <Link
                          href={`/${locale}/clinics/${clinic.slug}`}
                          className="hover:underline"
                        >
                          {clinic.name}
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1"
                          asChild
                        >
                          <Link
                            href={`?clinics=${clinicIds.filter((id) => id !== clinic.id).join(",")}`}
                          >
                            <X className="w-4 h-4" />
                            {t("removeFromCompare")}
                          </Link>
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 font-medium text-text-secondary border border-border">
                    Rating
                  </td>
                  {selectedClinics.map((clinic) => (
                    <td key={clinic.id} className="p-4 border border-border">
                      <RatingStars rating={clinic.rating} />
                    </td>
                  ))}
                </tr>
                <tr className="bg-bg-subtle">
                  <td className="p-4 font-medium text-text-secondary border border-border">
                    Reviews
                  </td>
                  {selectedClinics.map((clinic) => (
                    <td key={clinic.id} className="p-4 border border-border">
                      {clinic.review_count} reviews
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-text-secondary border border-border">
                    City
                  </td>
                  {selectedClinics.map((clinic) => (
                    <td key={clinic.id} className="p-4 border border-border">
                      {clinic.city}
                    </td>
                  ))}
                </tr>
                <tr className="bg-bg-subtle">
                  <td className="p-4 font-medium text-text-secondary border border-border">
                    Verified
                  </td>
                  {selectedClinics.map((clinic) => (
                    <td key={clinic.id} className="p-4 border border-border">
                      {clinic.verified ? (
                        <Badge className="bg-primary gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          {t("verified")}
                        </Badge>
                      ) : (
                        <span className="text-text-secondary">No</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-4 font-medium text-text-secondary border border-border align-top">
                    Services
                  </td>
                  {selectedClinics.map((clinic) => (
                    <td key={clinic.id} className="p-4 border border-border">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(clinic.services)
                          ? (clinic.services as string[])
                          : []
                        ).map((service, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-center pt-4">
            <Button asChild variant="outline">
              <Link href={`/${locale}/clinics`}>Browse More Clinics</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
