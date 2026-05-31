import { NextRequest } from "next/server";
import {
  deleteServiceController,
  getServiceController,
  updateServiceController,
} from "@/features/content/services/service.controller";
import { defineRouteHandlers } from "../../../_lib/route-handlers";

interface RouteContext {
  params: { slug: string };
}

export const { GET, PATCH, DELETE } = defineRouteHandlers({
  GET: (_: NextRequest, { params }: RouteContext) =>
    getServiceController(params.slug),
  PATCH: (request: NextRequest, { params }: RouteContext) =>
    updateServiceController(request, params.slug),
  DELETE: (request: NextRequest, { params }: RouteContext) =>
    deleteServiceController(request, params.slug),
});
