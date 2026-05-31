import { NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { resolveCurrentUser } from "@/lib/authorization";
import { successResponse } from "@/lib/http";
import { canManageContent } from "@/lib/authorization";
import { AppError } from "@/features/system/errors/app-error";
import { handleAppError } from "@/features/system/errors/error-handler";
import {
  createContactMessage,
  deleteContactMessage,
  getContactMessage,
  listContactMessages,
  updateContactMessage,
} from "./contact.service";

async function ensureContentAccess(request: NextRequest) {
  const user = await resolveCurrentUser(request);

  if (!user || !canManageContent(user.role)) {
    throw new AppError("Forbidden", 403, { code: "FORBIDDEN" });
  }

  return user;
}

export async function createContactMessageController(request: NextRequest) {
  try {
    const body = await request.json();
    const user = await resolveCurrentUser(request);
    const message = await createContactMessage(body, user?.id ?? null);

    return successResponse(
      {
        message,
        submittedBy: user ? { id: user.id, email: user.email } : null,
      },
      201,
    );
  } catch (error) {
    return handleAppError(error);
  }
}

export async function listContactMessagesController(request: NextRequest) {
  try {
    await ensureContentAccess(request);
    const inquiries = await listContactMessages();

    return successResponse({ inquiries });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function getContactMessageController(
  request: NextRequest,
  id: string,
) {
  try {
    await ensureContentAccess(request);
    const inquiry = await getContactMessage(id);

    if (!inquiry) {
      throw new AppError("Inquiry not found", 404, {
        code: "INQUIRY_NOT_FOUND",
      });
    }

    return successResponse({ inquiry });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function updateContactMessageController(
  request: NextRequest,
  id: string,
) {
  try {
    await ensureContentAccess(request);
    const body = await request.json();
    const inquiry = await updateContactMessage(id, body);

    revalidateTag("inquiries");

    return successResponse({ inquiry });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function deleteContactMessageController(
  request: NextRequest,
  id: string,
) {
  try {
    await ensureContentAccess(request);
    const deleted = await deleteContactMessage(id);

    revalidateTag("inquiries");

    return successResponse({ deleted });
  } catch (error) {
    return handleAppError(error);
  }
}
