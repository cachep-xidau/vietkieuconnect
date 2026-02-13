import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getClinicBySlug } from "@/lib/actions/clinic-actions";
import { Button } from "@/components/ui/button";
import { BeforeAfterSlider } from "@/components/clinic/before-after-slider";
import { Link } from "@/i18n/routing";

interface GalleryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function GalleryPage({ params }: GalleryPageProps) {
  const { locale, slug } = await params;
  const t = useTranslations("clinic");
  const tCommon = useTranslations("common");

  const clinicResult = await getClinicBySlug(slug);

  if (!clinicResult.success || !clinicResult.data) {
    notFound();
  }

  const clinic = clinicResult.data;

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-6">
          <div>
            <Button variant="ghost" asChild className="mb-4">
              <Link href={`/${locale}/clinics/${slug}`}>
                ← {tCommon("back")}
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-text-primary">
              {t("gallery")} - {clinic.name}
            </h1>
          </div>

          {clinic.photos.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-text-secondary">No photos available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinic.photos.map((photo, idx) => (
                <div
                  key={idx}
                  className="aspect-video rounded-lg overflow-hidden bg-bg-subtle"
                >
                  <img
                    src={photo}
                    alt={`${clinic.name} ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="pt-8">
            <h2 className="text-2xl font-semibold mb-4 text-text-primary">
              {t("beforeAfter")}
            </h2>
            <div className="space-y-6">
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800"
                afterImage="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800"
                beforeLabel="Before"
                afterLabel="After"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
