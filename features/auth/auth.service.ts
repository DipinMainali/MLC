import { signAccessToken } from "@/lib/jwt";
import type { AuthUser } from "./auth.interfaces";

export async function issueBearerToken(user: AuthUser) {
  return signAccessToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
}
