import type { ContentRole } from "@/lib/roles";
import { requiresAuth, requiresContentAccess } from "./config";

export type MiddlewareUser = {
  id?: string;
  role?: ContentRole | null;
};

export type MiddlewareSession = {
  user?: MiddlewareUser | null;
} | null;

export type AuthorizationResult =
  | {
      allowed: true;
    }
  | {
      allowed: false;
      status: 401 | 403;
      reason: "auth_required" | "insufficient_role";
    };

function canManageContent(role?: ContentRole | null) {
  return role === "ADMIN" || role === "EDITOR";
}

export function authorizeMiddlewareRequest(
  pathname: string,
  session: MiddlewareSession,
): AuthorizationResult {
  if (!requiresAuth(pathname)) {
    return { allowed: true };
  }

  if (!session?.user?.id) {
    return {
      allowed: false,
      status: 401,
      reason: "auth_required",
    };
  }

  if (requiresContentAccess(pathname) && !canManageContent(session.user.role)) {
    return {
      allowed: false,
      status: 403,
      reason: "insufficient_role",
    };
  }

  return { allowed: true };
}
