import type { NextRequest } from "next/server";
import { getRedisClient } from "@/lib/upstash";
import { env } from "@/lib/env";
import { logger } from "../features/system/logging/logger";
import { getRateLimitRule } from "./config";

export type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
};

function getClientIdentifier(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for") ?? "";
  const realIp = request.headers.get("x-real-ip") ?? "";
  const ip = forwardedFor.split(",")[0]?.trim() || realIp.trim() || "unknown";

  return ip;
}

export async function checkRateLimit(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const rule = getRateLimitRule(pathname);

  if (!rule) {
    return {
      allowed: true,
      limit: 0,
      remaining: 0,
      resetAt: Date.now(),
    } satisfies RateLimitResult;
  }

  const redisClient = getRedisClient();

  if (!redisClient) {
    logger.warn("middleware rate limit skipped", {
      pathname,
      reason: "upstash_not_configured",
    });

    return {
      allowed: true,
      limit: 0,
      remaining: 0,
      resetAt: Date.now(),
    } satisfies RateLimitResult;
  }

  const clientId = getClientIdentifier(request);
  const key = `middleware:rate-limit:${rule.scope}:${clientId}:${pathname}`;

  try {
    const count = await redisClient.incr(key);

    if (count === 1) {
      await redisClient.expire(key, Math.ceil(rule.windowMs / 1000));
    }

    let ttl = await redisClient.ttl(key);
    if (typeof ttl !== "number" || ttl < 0) {
      ttl = Math.ceil(rule.windowMs / 1000);
    }

    const resetAt = Date.now() + ttl * 1000;

    return {
      allowed: count <= rule.limit,
      limit: rule.limit,
      remaining: Math.max(rule.limit - count, 0),
      resetAt,
    } satisfies RateLimitResult;
  } catch (error) {
    logger.warn("middleware rate limit unavailable", {
      pathname,
      reason: error instanceof Error ? error.message : "unknown_error",
    });

    return {
      allowed: true,
      limit: 0,
      remaining: 0,
      resetAt: Date.now(),
    } satisfies RateLimitResult;
  }
}

export { getClientIdentifier };
