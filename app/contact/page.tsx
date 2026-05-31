import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact/contact-form";
import { getSiteSettings } from "@/features/content/site-settings/site-settings.service";

export const metadata: Metadata = {
  title: "Contact — Prajesh Shakya",
  description:
    "Get in touch to discuss your brand identity project. Start a conversation about transforming your brand.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar siteName={settings?.siteName} />
      <main className="pt-20">
        <ContactForm contactEmail={settings?.contactEmail} />
      </main>
      <Footer
        siteName={settings?.siteName}
        tagline={settings?.tagline}
        socialLinks={settings?.socialLinks}
      />
    </>
  );
}
