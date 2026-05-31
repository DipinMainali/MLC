import { NextResponse, type NextRequest } from "next/server";
import { authorizeMiddlewareRequest } from "./authorization";
import { getMiddlewareSession } from "./session";
import { checkRateLimit } from "./rate-limit";
import { createAuthFailureResponse, createRateLimitResponse } from "./response";
import { isAuthBypassPath, isStaticAsset } from "./config";
import { logMiddlewareEvent } from "./logging";

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  logMiddlewareEvent("request_start", {
    pathname,
    method: request.method,
  });

  const rateLimit = await checkRateLimit(request);
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit);
  }

  if (isAuthBypassPath(pathname)) {
    return NextResponse.next();
  }

  const session = await getMiddlewareSession();
  const authResult = authorizeMiddlewareRequest(pathname, session);

  if (!authResult.allowed) {
    return createAuthFailureResponse(
      request,
      pathname,
      authResult.status,
      authResult.reason === "auth_required"
        ? "Authentication required"
        : "Insufficient permissions",
    );
  }

  return NextResponse.next();
}
