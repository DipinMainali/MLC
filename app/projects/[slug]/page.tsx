import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ProjectHero } from "@/components/projects/project-hero";
import { ProjectContent } from "@/components/projects/project-content";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { ProjectNavigation } from "@/components/projects/project-navigation";
import { CTABlock } from "@/components/cta-block";
import {
  getPublishedProjectBySlug,
  listPublishedProjects,
} from "@/features/content/projects/project.service";
import { getSiteSettings } from "@/features/content/site-settings/site-settings.service";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: `${project.title} — Prajesh Shakya`,
    description: project.overview,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [projects, project, settings] = await Promise.all([
    listPublishedProjects(),
    getPublishedProjectBySlug(slug),
    getSiteSettings(),
  ]);

  if (!project) {
    notFound();
  }

  // Find prev/next projects
  const currentIndex = projects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  return (
    <>
      <Navbar siteName={settings?.siteName} />
      <main className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(120,119,198,0.12),transparent_24%),linear-gradient(to_bottom,transparent,transparent_20%,rgba(255,255,255,0.02))]" />
        <ProjectHero project={project} />
        <ProjectContent project={project} />
        <ProjectGallery project={project} />
        <ProjectNavigation prev={prevProject} next={nextProject} />
        <CTABlock
          title="Inspired by this project?"
          description="Let's discuss how we can create something similar for your brand."
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
