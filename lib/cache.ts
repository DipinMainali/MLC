import { getRedisClient } from "@/lib/upstash";

type CacheEntry<T> = {
  value: T;
};

export const redisCacheKeys = {
  siteSettings: "cache:site-settings:record",
} as const;

export async function getRedisCache<T>(key: string): Promise<T | undefined> {
  const redis = getRedisClient();

  if (!redis) {
    return undefined;
  }

  const raw = await redis.get(key);

  if (typeof raw !== "string") {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    return parsed.value;
  } catch {
    return undefined;
  }
}

export async function setRedisCache<T>(
  key: string,
  value: T,
  ttlSeconds: number,
) {
  const redis = getRedisClient();

  if (!redis) {
    return;
  }

  await redis.set(key, JSON.stringify({ value }), {
    ex: ttlSeconds,
  });
}

export async function deleteRedisCache(key: string) {
  const redis = getRedisClient();

  if (!redis) {
    return;
  }

  await redis.del(key);
}

export async function invalidateRedisCacheByTags(tags: string[]) {
  const uniqueTags = new Set(tags);

  if (uniqueTags.has("settings")) {
    await deleteRedisCache(redisCacheKeys.siteSettings);
  }
}
