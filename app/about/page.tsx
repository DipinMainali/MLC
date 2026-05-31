import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStory } from "@/components/about/about-story";
import { AboutValues } from "@/components/about/about-values";
import { CTABlock } from "@/components/cta-block";
import { getSiteSettings } from "@/features/content/site-settings/site-settings.service";

export const metadata: Metadata = {
  title: "About — Prajesh Shakya",
  description:
    "Learn about Prajesh Shakya, a brand identity designer creating strategic brand identities that combine psychology, design, and marketing.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar siteName={settings?.siteName} />
      <main className="pt-20">
        <AboutHero />
        <AboutStory />
        <AboutValues />
        <CTABlock
          title="Let's create something meaningful"
          description="I'm always interested in working with ambitious brands."
        />
      </main>
      <Footer
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        socialLinks={settings?.socialLinks}
      />
    </>
  );
}
