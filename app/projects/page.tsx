import { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectsGrid } from "@/components/projects/projects-grid";
import { CTABlock } from "@/components/cta-block";
import { listPublishedProjects } from "@/features/content/projects/project.service";
import { getSiteSettings } from "@/features/content/site-settings/site-settings.service";

export const metadata: Metadata = {
  title: "Projects — Prajesh Shakya",
  description:
    "Explore brand identity projects and case studies by Prajesh Shakya. Strategic design work for ambitious businesses.",
};

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([
    listPublishedProjects(),
    getSiteSettings(),
  ]);

  return (
    <>
      <Navbar siteName={settings?.siteName} />
      <main className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(120,119,198,0.12),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_24%)]" />
        <ProjectsGrid projects={projects} />
        <CTABlock
          title="Have a project in mind?"
          description="Let's discuss how we can work together."
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
