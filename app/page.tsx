import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/home/hero-section";
import { IntroSection } from "@/components/home/intro-section";
import { SelectedWorkSection } from "@/components/home/selected-work-section";
import { ServicesSection } from "@/components/home/services-section";
import { ProcessSection } from "@/components/home/process-section";
import { CTABlock } from "@/components/cta-block";
import { getSiteSettings } from "@/features/content/site-settings/site-settings.service";
import { listServices } from "@/features/content/services/service.service";

export default async function HomePage() {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    listServices(),
  ]);

  return (
    <>
      <Navbar siteName={settings?.siteName} />
      <main>
        <HeroSection
          title={settings?.heroTitle}
          subtitle={settings?.heroSubtitle}
        />
        <IntroSection />
        <SelectedWorkSection />
        <ServicesSection services={services} />
        <ProcessSection />
        <CTABlock />
      </main>
      <Footer
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        socialLinks={settings?.socialLinks}
      />
    </>
  );
}
