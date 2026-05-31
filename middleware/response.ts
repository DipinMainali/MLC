import { NextResponse, type NextRequest } from "next/server";
import type { RateLimitResult } from "./rate-limit";

export function createAuthFailureResponse(
  request: NextRequest,
  pathname: string,
  status: 401 | 403,
  message: string,
) {
  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      { success: false, error: { message } },
      { status },
    );
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export function createRateLimitResponse(rateLimit: RateLimitResult) {
  const retryAfterSeconds = Math.max(
    1,
    Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
  );

  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Too many requests",
        code: "RATE_LIMITED",
      },
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
        "X-RateLimit-Limit": String(rateLimit.limit),
        "X-RateLimit-Remaining": String(rateLimit.remaining),
        "X-RateLimit-Reset": String(rateLimit.resetAt),
      },
    },
  );
}
