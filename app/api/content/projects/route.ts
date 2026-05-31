import { NextRequest } from "next/server";
import {
  createProjectController,
  listProjectsController,
} from "@/features/content/projects/project.controller";
import { defineRouteHandlers } from "../../_lib/route-handlers";

export const { GET, POST } = defineRouteHandlers({
  GET: listProjectsController,
  POST: (request: NextRequest) => createProjectController(request),
});
