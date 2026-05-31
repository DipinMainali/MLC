import { ZodError } from "zod";
import { errorResponse } from "@/lib/http";
import { AppError } from "./app-error";

export function handleAppError(error: unknown) {
  if (error instanceof AppError) {
    return errorResponse(
      error.message,
      error.status,
      error.details,
      error.code,
    );
  }

  if (error instanceof ZodError) {
    return errorResponse(
      "Validation failed",
      422,
      error.flatten(),
      "VALIDATION_ERROR",
    );
  }

  if (error instanceof Error) {
    return errorResponse(error.message, 500);
  }

  return errorResponse("Unexpected server error", 500);
}
