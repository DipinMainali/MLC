import { NextRequest } from "next/server";
import { getPublicProjectController } from "@/features/content/projects/project.controller";
import { defineRouteHandlers } from "../../_lib/route-handlers";

interface RouteContext {
  params: { slug: string };
}

export const { GET } = defineRouteHandlers({
  GET: (_: NextRequest, { params }: RouteContext) =>
    getPublicProjectController(params.slug),
});
