import { siteSettingsUpdateSchema } from "./site-settings.schemas";
import { AppError } from "@/features/system/errors/app-error";
import {
  deleteSiteSettingsRecord,
  getSiteSettingsRecord,
  upsertSiteSettingsRecord,
} from "./site-settings.repository";
import {
  invalidateRedisCacheByTags,
  getRedisCache,
  redisCacheKeys,
  setRedisCache,
} from "@/lib/cache";
import type { SiteSettingsDTO } from "./site-settings.interfaces";

const SITE_SETTINGS_CACHE_TTL_SECONDS = 300;

async function getCachedSiteSettingsRecord() {
  const cached = await getRedisCache<SiteSettingsDTO | null>(
    redisCacheKeys.siteSettings,
  );

  if (cached !== undefined) {
    return cached;
  }

  const settings = await getSiteSettingsRecord();

  await setRedisCache(
    redisCacheKeys.siteSettings,
    settings,
    SITE_SETTINGS_CACHE_TTL_SECONDS,
  );

  return settings;
}

async function clearSiteSettingsCache() {
  await invalidateRedisCacheByTags(["settings"]);
}

export async function getSiteSettings() {
  return getCachedSiteSettingsRecord();
}

export async function createSiteSettings(input: unknown) {
  const existing = await getSiteSettingsRecord();

  if (existing) {
    throw new AppError("Only one site settings record is allowed", 409, {
      code: "CONFLICT",
    });
  }

  const data = siteSettingsUpdateSchema.parse(input);

  const settings = await upsertSiteSettingsRecord(data);

  await clearSiteSettingsCache();

  return settings;
}

export async function upsertSiteSettings(input: unknown) {
  const data = siteSettingsUpdateSchema.parse(input);

  const settings = await upsertSiteSettingsRecord(data);

  await clearSiteSettingsCache();

  return settings;
}

export async function deleteSiteSettings() {
  const deleted = await deleteSiteSettingsRecord();

  if (!deleted) {
    throw new AppError("Site settings not found", 404, {
      code: "NOT_FOUND",
    });
  }

  await clearSiteSettingsCache();

  return { id: deleted.id };
}
