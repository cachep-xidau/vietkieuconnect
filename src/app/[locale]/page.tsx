import { HeroSection } from "@/components/landing/hero-section";
import { TrustBadgesSection } from "@/components/landing/trust-badges-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturedClinicsSection } from "@/components/landing/featured-clinics-section";
import { CostComparisonSection } from "@/components/landing/cost-comparison-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <TrustBadgesSection />
      <HowItWorksSection />
      <FeaturedClinicsSection />
      <CostComparisonSection />
      <TestimonialsSection />
      <FinalCtaSection />
    </main>
  );
}
