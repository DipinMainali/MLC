import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "prisma/config";

function loadEnvValue(key: string) {
  if (process.env[key]) {
    return process.env[key];
  }

  const envPath = resolve(process.cwd(), ".env");

  try {
    const envFile = readFileSync(envPath, "utf8");
    const entry = envFile
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line.startsWith(`${key}=`));

    if (!entry) {
      return undefined;
    }

    const rawValue = entry.slice(key.length + 1).trim();
    const normalizedValue = rawValue.replace(/^(["'])(.*)\1$/, "$2");

    process.env[key] = normalizedValue;
    return normalizedValue;
  } catch {
    return undefined;
  }
}

loadEnvValue("DATABASE_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
