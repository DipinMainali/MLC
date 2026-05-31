export const CONTENT_ROLES = ["ADMIN", "EDITOR", "VIEWER"] as const;

export type ContentRole = (typeof CONTENT_ROLES)[number];

export function normalizeContentRole(
  role: unknown,
  fallback: ContentRole = "VIEWER",
): ContentRole {
  return CONTENT_ROLES.includes(role as ContentRole)
    ? (role as ContentRole)
    : fallback;
}

export function getContentRoleFromData(data: unknown): ContentRole {
  if (!data || typeof data !== "object") {
    return "VIEWER";
  }

  const role = (data as Record<string, unknown>).role;
  return normalizeContentRole(role);
}
