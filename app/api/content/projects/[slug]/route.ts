import { NextRequest } from "next/server";
import {
  deleteProjectController,
  getProjectController,
  updateProjectController,
} from "@/features/content/projects/project.controller";
import { defineRouteHandlers } from "../../../_lib/route-handlers";

interface RouteContext {
  params: { slug: string };
}

export const { GET, PATCH, DELETE } = defineRouteHandlers({
  GET: (_: NextRequest, { params }: RouteContext) =>
    getProjectController(params.slug),
  PATCH: (request: NextRequest, { params }: RouteContext) =>
    updateProjectController(request, params.slug),
  DELETE: (request: NextRequest, { params }: RouteContext) =>
    deleteProjectController(request, params.slug),
});
