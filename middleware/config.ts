export type RateLimitRule = {
  limit: number;
  windowMs: number;
  scope: string;
};

export function isStaticAsset(pathname: string) {
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots.txt") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/images/") ||
    pathname.includes(".")
  );
}

export function isAuthBypassPath(pathname: string) {
  return pathname.startsWith("/api/auth/") || pathname === "/login";
}

export function requiresAuth(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/content") ||
    pathname === "/api/auth/token"
  );
}

export function requiresContentAccess(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/content")
  );
}

export function getRateLimitRule(pathname: string) {
  if (pathname.startsWith("/api/contact")) {
    return { limit: 5, windowMs: 60_000, scope: "contact" };
  }

  if (pathname.startsWith("/api/auth/")) {
    return { limit: 10, windowMs: 60_000, scope: "auth" };
  }

  if (pathname.startsWith("/api/content/")) {
    return { limit: 60, windowMs: 60_000, scope: "content" };
  }

  if (pathname.startsWith("/api/")) {
    return { limit: 100, windowMs: 60_000, scope: "api" };
  }

  return null;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
