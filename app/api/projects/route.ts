import { listPublicProjectsController } from "@/features/content/projects/project.controller";
import { defineRouteHandlers } from "../_lib/route-handlers";

export const { GET } = defineRouteHandlers({
  GET: listPublicProjectsController,
});
