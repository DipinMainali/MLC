import type {
  AdminInquiry,
  AdminProject,
  AdminService,
  AdminSettings,
} from "@/components/dashboard/admin-types";
import type { InquiryRecord } from "@/features/contact/contact.interfaces";
import type { ProjectDTO } from "@/features/content/projects/project.interfaces";
import type { ServiceDTO } from "@/features/content/services/service.interfaces";
import type { SiteSettingsDTO } from "@/features/content/site-settings/site-settings.interfaces";

export const DASHBOARD_PAGE_SIZE = 8;

export function getSearchParam(
  value: string | string[] | undefined,
  fallback = "",
) {
  if (typeof value === "string") {
    return value;
  }

  return fallback;
}

export function getPageNumber(value: string | string[] | undefined) {
  const raw = getSearchParam(value, "1");
  const parsed = Number.parseInt(raw, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

export function paginateItems<T>(
  items: T[],
  page: number,
  pageSize = DASHBOARD_PAGE_SIZE,
) {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    totalItems,
    totalPages,
    currentPage,
  };
}

function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [] as string[];
  }

  return value
    .map((entry) => (typeof entry === "string" ? entry : entry?.url))
    .filter((entry): entry is string => Boolean(entry));
}

export function normalizeProject(project: ProjectDTO): AdminProject {
  const data = (project.data ?? {}) as ProjectDTO["data"] & Record<string, any>;
  const category = Array.isArray(data.category) ? data.category[0] : null;
  const gallery = Array.isArray(data.images)
    ? data.images
    : Array.isArray(data.gallery)
      ? data.gallery
      : [];

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: category?.name ?? data.categoryName ?? "Uncategorized",
    categorySlug: category?.slug ?? data.categorySlug ?? null,
    year: data.year ? String(data.year) : "",
    client: data.client ?? null,
    thumbnail: data.thumbnail?.url ?? data.thumbnailUrl ?? data.thumbnail ?? "",
    overview: data.overview ?? null,
    problem: data.problem ?? null,
    approach: data.approach ?? null,
    solution: data.solution ?? null,
    outcome: data.outcome ?? null,
    images: normalizeStringArray(gallery),
    featured: Boolean(data.featured),
    isPublished: project.isPublished,
    sortOrder: Number(data.sortOrder ?? 0),
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
    updatedAt: project.updatedAt.toISOString(),
  };
}

export function normalizeService(service: ServiceDTO): AdminService {
  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    icon: service.icon,
    shortDescription: service.shortDescription,
    fullDescription: service.fullDescription,
    features: service.features ?? [],
    sortOrder: service.sortOrder,
    isPublished: service.isPublished,
  };
}

export function normalizeInquiry(inquiry: InquiryRecord): AdminInquiry {
  return {
    id: inquiry.id,
    data: inquiry.data,
    status: inquiry.status,
    assignedTo: inquiry.assignedTo ?? null,
    adminNotes: inquiry.adminNotes ?? null,
    createdAt: inquiry.createdAt.toISOString(),
  };
}

export function normalizeSettings(
  settings: SiteSettingsDTO | null,
): AdminSettings | null {
  if (!settings) {
    return null;
  }

  return {
    id: settings.id,
    siteName: settings.siteName,
    tagline: settings.tagline,
    heroTitle: settings.heroTitle,
    heroSubtitle: settings.heroSubtitle,
    aboutText: settings.aboutText,
    ctaText: settings.ctaText,
    contactEmail: settings.contactEmail,
    socialLinks: settings.socialLinks,
    updatedAt: new Date(settings.updatedAt).toISOString(),
  };
}

export function buildPageHref(
  pathname: string,
  searchParams: Record<string, string | string[] | undefined>,
  page: number,
) {
  const query = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (key === "page" || typeof value !== "string" || !value.trim()) {
      return;
    }

    query.set(key, value);
  });

  if (page > 1) {
    query.set("page", String(page));
  }

  const search = query.toString();
  return search ? `${pathname}?${search}` : pathname;
}
