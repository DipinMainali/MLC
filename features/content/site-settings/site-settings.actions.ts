"use server";

import { revalidateTag } from "next/cache";
import { canManageContent, resolveCurrentUser } from "@/lib/authorization";
import { AppError } from "@/features/system/errors/app-error";
import {
  createSiteSettings,
  deleteSiteSettings,
  upsertSiteSettings,
} from "./site-settings.service";

async function ensureContentAccess() {
  const user = await resolveCurrentUser();

  if (!user || !canManageContent(user.role)) {
    throw new AppError("Forbidden", 403, { code: "FORBIDDEN" });
  }

  return user;
}

export async function createSiteSettingsAction(input: unknown) {
  await ensureContentAccess();

  const settings = await createSiteSettings(input);

  revalidateTag("settings");

  return settings;
}

export async function updateSiteSettingsAction(input: unknown) {
  await ensureContentAccess();

  const settings = await upsertSiteSettings(input);

  revalidateTag("settings");

  return settings;
}

export async function deleteSiteSettingsAction() {
  await ensureContentAccess();

  const deleted = await deleteSiteSettings();

  revalidateTag("settings");

  return deleted;
}
