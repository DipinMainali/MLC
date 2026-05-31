import { auth } from "@/lib/auth";

export async function getMiddlewareSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}
