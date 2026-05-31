import { NextRequest } from "next/server";
import {
  createServiceController,
  listServicesController,
} from "@/features/content/services/service.controller";
import { defineRouteHandlers } from "../../_lib/route-handlers";

export const { GET, POST } = defineRouteHandlers({
  GET: listServicesController,
  POST: (request: NextRequest) => createServiceController(request),
});
