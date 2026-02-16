import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/landing/hero-section";
import { TrustBadgesSection } from "@/components/landing/trust-badges-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturedClinicsSection } from "@/components/landing/featured-clinics-section";
import { CostComparisonSection } from "@/components/landing/cost-comparison-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { HashScrollFix } from "@/components/layout/hash-scroll-fix";

export default async function HomePage() {
  const supabase = await createClient();

  const { data: clinics } = await supabase
    .from("clinics")
    .select("*")
    .eq("active", true)
    .order("rating", { ascending: false })
    .limit(3);

  return (
    <main className="min-h-screen">
      <HashScrollFix />
      <HeroSection />
      <TrustBadgesSection />
      <HowItWorksSection />
      <FeaturedClinicsSection clinics={clinics ?? []} />
      <CostComparisonSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </main>
  );
}
