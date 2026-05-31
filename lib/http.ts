import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  message: string,
  status = 400,
  details?: unknown,
  code?: string,
) {
  return NextResponse.json(
    {
      success: false,
      error: { message, details, code },
    },
    { status },
  );
}

export function handleApiError(error: unknown) {
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
