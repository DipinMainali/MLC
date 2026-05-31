import { logger } from "@/features/system/logging/logger";

export function logMiddlewareEvent(
  event: string,
  context?: Record<string, unknown>,
) {
  logger.info(`middleware:${event}`, context);
}
