import { DefaultSession } from "next-auth";
import type { ContentRole } from "@/lib/roles";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: ContentRole;
    } & DefaultSession["user"];
  }

  interface User {
    role: ContentRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: ContentRole;
  }
}

export {};
