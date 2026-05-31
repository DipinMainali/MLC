import { auth } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/http";
import { issueBearerToken } from "./auth.service";

export async function getSessionController() {
  const session = await auth();
  return successResponse({ session });
}

export async function issueTokenController() {
  const session = await auth();

  if (!session?.user?.id) {
    return errorResponse("Unauthorized", 401);
  }

  const token = await issueBearerToken(session.user);

  return successResponse({
    token,
    tokenType: "Bearer",
    user: session.user,
  });
}
