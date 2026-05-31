import type { ContentRole } from "@/lib/roles";

export type AuthUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: ContentRole;
};
