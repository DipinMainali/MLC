import { NextRequest } from "next/server";
import {
  deleteContactMessageController,
  getContactMessageController,
  updateContactMessageController,
} from "@/features/contact/contact.controller";
import { defineRouteHandlers } from "../../../_lib/route-handlers";

interface RouteContext {
  params: { id: string };
}

export const { GET, PATCH, DELETE } = defineRouteHandlers({
  GET: (request: NextRequest, { params }: RouteContext) =>
    getContactMessageController(request, params.id),
  PATCH: (request: NextRequest, { params }: RouteContext) =>
    updateContactMessageController(request, params.id),
  DELETE: (request: NextRequest, { params }: RouteContext) =>
    deleteContactMessageController(request, params.id),
});
