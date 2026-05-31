import { issueTokenController } from "@/features/auth/auth.controller";
import { defineRouteHandlers } from "../../_lib/route-handlers";

export const { GET } = defineRouteHandlers({
  GET: issueTokenController,
});
