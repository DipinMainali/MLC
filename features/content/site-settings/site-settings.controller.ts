import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import { canManageContent, resolveCurrentUser } from "@/lib/authorization";
import { successResponse } from "@/lib/http";
import { AppError } from "@/features/system/errors/app-error";
import { handleAppError } from "@/features/system/errors/error-handler";
import {
  deleteSiteSettings,
  getSiteSettings,
  upsertSiteSettings,
} from "./site-settings.service";

async function ensureContentAccess(request: NextRequest) {
  const user = await resolveCurrentUser(request);

  if (!user || !canManageContent(user.role)) {
    throw new AppError("Forbidden", 403, { code: "FORBIDDEN" });
  }

  return user;
}

export async function getSiteSettingsController() {
  try {
    const settings = await getSiteSettings();
    return successResponse({ settings });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function updateSiteSettingsController(request: NextRequest) {
  try {
    await ensureContentAccess(request);
    const body = await request.json();
    const settings = await upsertSiteSettings(body);

    revalidateTag("settings");

    return successResponse({ settings });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function deleteSiteSettingsController(request: NextRequest) {
  try {
    await ensureContentAccess(request);
    const deleted = await deleteSiteSettings();

    revalidateTag("settings");

    return successResponse({ deleted });
  } catch (error) {
    return handleAppError(error);
  }
}
