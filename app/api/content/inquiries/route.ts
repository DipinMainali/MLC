import { NextRequest } from "next/server";
import { listContactMessagesController } from "@/features/contact/contact.controller";
import { defineRouteHandlers } from "../../_lib/route-handlers";

export const { GET } = defineRouteHandlers({
  GET: (request: NextRequest) => listContactMessagesController(request),
});
