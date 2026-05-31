import { NextRequest } from "next/server";
import {
  deleteSiteSettingsController,
  getSiteSettingsController,
  updateSiteSettingsController,
} from "@/features/content/site-settings/site-settings.controller";
import { defineRouteHandlers } from "../../_lib/route-handlers";

export const { GET, PATCH, DELETE } = defineRouteHandlers({
  GET: getSiteSettingsController,
  PATCH: (request: NextRequest) => updateSiteSettingsController(request),
  DELETE: (request: NextRequest) => deleteSiteSettingsController(request),
});
