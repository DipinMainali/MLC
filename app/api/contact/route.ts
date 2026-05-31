import { NextRequest } from "next/server";
import { createContactMessageController } from "@/features/contact/contact.controller";
import { defineRouteHandlers } from "../_lib/route-handlers";

export const { POST } = defineRouteHandlers({
  POST: (request: NextRequest) => createContactMessageController(request),
});
