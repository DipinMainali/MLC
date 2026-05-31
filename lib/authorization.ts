import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { verifyAccessToken } from "@/lib/jwt";
import {
  getContentRoleFromData,
  normalizeContentRole,
  type ContentRole,
} from "@/lib/roles";

export interface RequestUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: ContentRole;
}

export function canManageContent(role?: ContentRole | null) {
  return role === "ADMIN" || role === "EDITOR";
}

export async function resolveCurrentUser(
  request?: Request,
): Promise<RequestUser | null> {
  const session = await auth();

  if (session?.user?.id) {
    return {
      id: session.user.id,
      name: session.user.name ?? null,
      email: session.user.email ?? null,
      image: session.user.image ?? null,
      role: session.user.role,
    };
  }

  const header = request?.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = header.slice("Bearer ".length);
    const payload = await verifyAccessToken(token);

    if (!payload.sub) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, data: true },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.email,
      email: user.email,
      image: null,
      role: getContentRoleFromData(user.data),
    };
  } catch {
    return null;
  }
}

export async function requireContentUser(request?: Request) {
  const user = await resolveCurrentUser(request);

  if (!user || !canManageContent(user.role)) {
    throw new Error("Forbidden");
  }

  return user;
}
