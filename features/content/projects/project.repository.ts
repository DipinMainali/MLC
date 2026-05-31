import { prisma } from "@/lib/db";

export async function listProjectRecords() {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: { updatedAt: "desc" },
  });

  return projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    data: p.data as any,
    isPublished: p.isPublished,
    publishedAt: p.publishedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
}

export async function listAllProjectRecords() {
  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return projects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    data: p.data as any,
    isPublished: p.isPublished,
    publishedAt: p.publishedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
}

export async function getProjectRecordBySlug(slug: string) {
  const p = await prisma.project.findUnique({ where: { slug } });
  if (!p) return null;
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    data: p.data as any,
    isPublished: p.isPublished,
    publishedAt: p.publishedAt,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  };
}

export async function createProjectRecord(payload: any) {
  const project = await prisma.project.create({
    data: {
      slug: payload.slug,
      title: payload.title,
      data: {
        category: payload.category ?? [],
        client: payload.client ?? null,
        year: payload.year ?? null,
        overview: payload.overview ?? null,
        problem: payload.problem ?? null,
        approach: payload.approach ?? null,
        solution: payload.solution ?? null,
        outcome: payload.outcome ?? null,
        thumbnailUrl: payload.thumbnail?.url ?? payload.thumbnailUrl ?? null,
        featured: payload.featured ?? false,
        sortOrder: payload.sortOrder ?? 0,
        seoTitle: payload.seoTitle ?? null,
        seoDescription: payload.seoDescription ?? null,
        images: payload.images ?? payload.gallery ?? [],
      },
      isPublished: payload.isPublished ?? true,
      publishedAt: payload.isPublished ? new Date() : null,
    },
  });

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    data: project.data as any,
    isPublished: project.isPublished,
    publishedAt: project.publishedAt,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export async function updateProjectRecord(slug: string, payload: any) {
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (!existing) throw new Error("Project not found");

  const newData = {
    ...(existing.data as any),
    ...(payload.category !== undefined ? { category: payload.category } : {}),
    ...(payload.client !== undefined ? { client: payload.client } : {}),
    ...(payload.year !== undefined ? { year: payload.year } : {}),
    ...(payload.overview !== undefined ? { overview: payload.overview } : {}),
    ...(payload.problem !== undefined ? { problem: payload.problem } : {}),
    ...(payload.approach !== undefined ? { approach: payload.approach } : {}),
    ...(payload.solution !== undefined ? { solution: payload.solution } : {}),
    ...(payload.outcome !== undefined ? { outcome: payload.outcome } : {}),
    ...(payload.thumbnail !== undefined || payload.thumbnailUrl !== undefined
      ? {
          thumbnailUrl: payload.thumbnail?.url ?? payload.thumbnailUrl ?? null,
        }
      : {}),
    ...(payload.featured !== undefined ? { featured: payload.featured } : {}),
    ...(payload.sortOrder !== undefined
      ? { sortOrder: payload.sortOrder }
      : {}),
    ...(payload.seoTitle !== undefined ? { seoTitle: payload.seoTitle } : {}),
    ...(payload.seoDescription !== undefined
      ? { seoDescription: payload.seoDescription }
      : {}),
    ...(payload.images !== undefined || payload.gallery !== undefined
      ? { images: payload.images ?? payload.gallery }
      : {}),
  };

  const project = await prisma.project.update({
    where: { slug },
    data: {
      ...(payload.slug ? { slug: payload.slug } : {}),
      ...(payload.title ? { title: payload.title } : {}),
      data: newData,
      ...(payload.isPublished !== undefined
        ? { isPublished: payload.isPublished }
        : {}),
      ...(payload.isPublished ? { publishedAt: new Date() } : {}),
    },
  });

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    data: project.data as any,
    isPublished: project.isPublished,
    publishedAt: project.publishedAt,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
  };
}

export async function deleteProjectRecord(slug: string) {
  await prisma.project.delete({ where: { slug } });
  return { slug };
}
