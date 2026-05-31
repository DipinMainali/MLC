import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import { errorResponse, successResponse } from "@/lib/http";
import { invalidateRedisCacheByTags } from "@/lib/cache";
import { defineRouteHandlers } from "../_lib/route-handlers";

const tagMap: Record<string, string[]> = {
  project: ["projects"],
  projects: ["projects"],
  service: ["services"],
  services: ["services"],
  settings: ["settings"],
  siteSettings: ["settings"],
  contact: ["contact"],
};

export const { POST } = defineRouteHandlers({
  POST: async (request: NextRequest) => {
    const body = await request.json().catch(() => ({}));
    const secret = request.headers.get("x-webhook-secret");

    if (!process.env.WEBHOOK_SECRET || secret !== process.env.WEBHOOK_SECRET) {
      return errorResponse("Invalid secret", 401);
    }

    const type = String(body?._type ?? body?.type ?? "");
    const tags = Array.from(
      new Set([
        ...(tagMap[type] ?? []),
        ...(Array.isArray(body?.tags) ? body.tags : []),
      ]),
    );

    tags.forEach((tag) => revalidateTag(tag));
    await invalidateRedisCacheByTags(tags);

    return successResponse({ revalidated: tags });
  },
});
