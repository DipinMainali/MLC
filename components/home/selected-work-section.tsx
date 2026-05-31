import Link from "next/link";
import { Section, SectionHeader } from "@/components/section";
import { ProjectCard, ProjectCardLarge } from "@/components/project-card";
import { ArrowRight } from "lucide-react";
import { listProjects } from "@/features/content/projects/project.service";

type SelectedWorkProject = {
  slug: string;
  title: string;
  category: string;
  year: string;
  thumbnail: string;
  featured: boolean;
  updatedAt: string;
};

function normalizeProject(
  project: Awaited<ReturnType<typeof listProjects>>[number],
): SelectedWorkProject {
  const data = project.data ?? {};
  const category = Array.isArray(data.category) ? data.category[0] : null;
  const thumbnail =
    data.thumbnail?.url ??
    (typeof data.thumbnailUrl === "string" ? data.thumbnailUrl : "") ??
    (Array.isArray(data.images) ? (data.images[0]?.url ?? "") : "");

  return {
    slug: project.slug,
    title: project.title,
    category: category?.name ?? "Uncategorized",
    year: data.year ? String(data.year) : "",
    thumbnail,
    featured: Boolean(data.featured),
    updatedAt: project.updatedAt.toISOString(),
  };
}

export async function SelectedWorkSection() {
  const projects = (await listProjects())
    .map(normalizeProject)
    .filter((project) => project.thumbnail)
    .sort((left, right) => {
      const featuredDelta = Number(right.featured) - Number(left.featured);

      if (featuredDelta !== 0) {
        return featuredDelta;
      }

      return (
        new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime()
      );
    });

  const featuredProjects = projects.slice(0, 4);

  if (!featuredProjects.length) {
    return (
      <Section>
        <SectionHeader
          label="Selected Work"
          title="Projects that define brands"
        />

        <p className="text-muted-foreground">
          No published projects are available yet. Check back soon for new case
          studies.
        </p>

        <div className="mt-16 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm tracking-wide hover:opacity-70 transition-opacity group"
          >
            View All Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Section>
    );
  }

  const [featured, ...rest] = featuredProjects;

  return (
    <Section>
      <SectionHeader
        label="Selected Work"
        title="Projects that define brands"
      />

      {/* Featured Project - Large */}
      {featured ? (
        <div className="mb-12">
          <ProjectCardLarge project={featured} />
        </div>
      ) : null}

      {/* Other Projects - Grid */}
      {rest.length ? (
        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {rest.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>
      ) : null}

      {/* View All Link */}
      <div className="mt-16 text-center">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm tracking-wide hover:opacity-70 transition-opacity group"
        >
          View All Projects
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </Section>
  );
}

export default SelectedWorkSection;
