import { prisma } from "@/lib/db";
import type { SiteSettingsDTO } from "./site-settings.interfaces";
import type { SiteSettingsUpdateInput } from "./site-settings.schemas";

function mapSettings(settings: {
  id: string;
  data: unknown;
  updatedAt: Date;
}): SiteSettingsDTO {
  const d = (settings.data ?? {}) as Record<string, unknown>;

  return {
    id: settings.id,
    siteName: (d.siteName as string) ?? null,
    tagline: (d.tagline as string) ?? null,
    heroTitle: (d.heroTitle as string) ?? null,
    heroSubtitle: (d.heroSubtitle as string) ?? null,
    aboutText: (d.aboutText as string) ?? null,
    ctaText: (d.ctaText as string) ?? null,
    contactEmail: (d.contactEmail as string) ?? null,
    socialLinks: Array.isArray(d.socialLinks)
      ? (d.socialLinks as SiteSettingsDTO["socialLinks"])
      : [],
    updatedAt: settings.updatedAt,
  };
}

export async function getSiteSettingsRecord() {
  const settings = await prisma.siteSetting.findFirst({
    orderBy: { updatedAt: "desc" },
  });

  return settings ? mapSettings(settings) : null;
}

export async function upsertSiteSettingsRecord(data: SiteSettingsUpdateInput) {
  const existing = await prisma.siteSetting.findFirst();
  const existingData = (existing?.data ?? {}) as Record<string, unknown>;

  const newData = existing
    ? { ...existingData, ...(data as Record<string, unknown>) }
    : {
        siteName: data.siteName ?? "Prajesh Shakya",
        tagline: data.tagline ?? null,
        heroTitle: data.heroTitle ?? null,
        heroSubtitle: data.heroSubtitle ?? null,
        aboutText: data.aboutText ?? null,
        ctaText: data.ctaText ?? null,
        contactEmail: data.contactEmail ?? null,
        socialLinks: data.socialLinks ?? [],
      };

  const settings = existing
    ? await prisma.siteSetting.update({
        where: { id: existing.id },
        data: { data: newData as any },
      })
    : await prisma.siteSetting.create({
        data: {
          id: "singleton",
          data: newData as any,
        },
      });

  return mapSettings(settings);
}

export async function deleteSiteSettingsRecord() {
  const existing = await prisma.siteSetting.findFirst();

  if (!existing) {
    return null;
  }

  const deleted = await prisma.siteSetting.delete({
    where: { id: existing.id },
  });

  return mapSettings(deleted);
}
