import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";

const secret = new TextEncoder().encode(env.AUTH_SECRET);

export interface AccessTokenPayload {
  sub: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

export async function signAccessToken(
  payload: AccessTokenPayload,
  expiresIn = "2h",
) {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
