import type { ProjectDTO } from "./project.interfaces";
import { projectUpdateSchema, projectUpsertSchema } from "./project.schemas";
import {
  createProjectRecord,
  deleteProjectRecord,
  getProjectRecordBySlug,
  listAllProjectRecords,
  listProjectRecords,
  updateProjectRecord,
} from "./project.repository";

export type PublicProject = {
  slug: string;
  title: string;
  category: string;
  year: string;
  thumbnail: string;
  client?: string;
  overview?: string;
  problem?: string;
  approach?: string;
  solution?: string;
  outcome?: string;
  images: string[];
};

function normalizeImages(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((entry) => {
      if (typeof entry === "string") {
        return entry;
      }

      return typeof entry?.url === "string" ? entry.url : "";
    })
    .filter(Boolean);
}

function toPublicProject(project: ProjectDTO): PublicProject {
  const data = (project.data ?? {}) as ProjectDTO["data"] & Record<string, any>;
  const category = Array.isArray(data.category) ? data.category[0] : null;
  const images = normalizeImages(data.images ?? data.gallery);
  const thumbnail =
    data.thumbnail?.url ??
    data.thumbnailUrl ??
    data.thumbnail ??
    images[0] ??
    "";

  return {
    slug: project.slug,
    title: project.title,
    category: category?.name ?? category?.slug ?? "Uncategorized",
    year: data.year ? String(data.year) : "",
    thumbnail,
    client: data.client ?? undefined,
    overview: data.overview ?? undefined,
    problem: data.problem ?? undefined,
    approach: data.approach ?? undefined,
    solution: data.solution ?? undefined,
    outcome: data.outcome ?? undefined,
    images,
  };
}

export async function listProjects(): Promise<ProjectDTO[]> {
  return listProjectRecords();
}

export async function listPublishedProjects(): Promise<PublicProject[]> {
  const projects = await listProjects();

  return projects.map(toPublicProject);
}

export async function listAdminProjects(): Promise<ProjectDTO[]> {
  return listAllProjectRecords();
}

export async function getProjectBySlug(
  slug: string,
): Promise<ProjectDTO | null> {
  return getProjectRecordBySlug(slug);
}

export async function getPublishedProjectBySlug(
  slug: string,
): Promise<PublicProject | null> {
  const project = await getProjectBySlug(slug);

  if (!project || !project.isPublished) {
    return null;
  }

  return toPublicProject(project);
}

export async function createProject(input: unknown): Promise<ProjectDTO> {
  const data = projectUpsertSchema.parse(input);

  return createProjectRecord({
    slug: data.slug,
    title: data.title,
    category: data.category,
    client: data.client ?? null,
    year: data.year ?? null,
    overview: data.overview ?? null,
    problem: data.problem ?? null,
    approach: data.approach ?? null,
    solution: data.solution ?? null,
    outcome: data.outcome ?? null,
    thumbnail: data.thumbnail,
    featured: data.featured ?? false,
    isPublished: data.isPublished ?? true,
    sortOrder: data.sortOrder ?? 0,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
    images: data.images,
  });
}

export async function updateProject(
  slug: string,
  input: unknown,
): Promise<ProjectDTO> {
  const data = projectUpdateSchema.parse(input);

  return updateProjectRecord(slug, {
    ...(data.category ? { category: data.category } : {}),
    ...(data.slug ? { slug: data.slug } : {}),
    ...(data.title ? { title: data.title } : {}),
    ...(data.client !== undefined ? { client: data.client } : {}),
    ...(data.year !== undefined ? { year: data.year } : {}),
    ...(data.overview !== undefined ? { overview: data.overview } : {}),
    ...(data.problem !== undefined ? { problem: data.problem } : {}),
    ...(data.approach !== undefined ? { approach: data.approach } : {}),
    ...(data.solution !== undefined ? { solution: data.solution } : {}),
    ...(data.outcome !== undefined ? { outcome: data.outcome } : {}),
    ...(data.thumbnail ? { thumbnail: data.thumbnail } : {}),
    ...(data.featured !== undefined ? { featured: data.featured } : {}),
    ...(data.isPublished !== undefined
      ? { isPublished: data.isPublished }
      : {}),
    ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
    ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
    ...(data.seoDescription !== undefined
      ? { seoDescription: data.seoDescription }
      : {}),
    ...(data.images ? { images: data.images } : {}),
  });
}

export async function deleteProject(slug: string): Promise<{ slug: string }> {
  return deleteProjectRecord(slug);
}
