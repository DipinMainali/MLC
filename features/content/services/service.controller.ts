import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import { canManageContent, resolveCurrentUser } from "@/lib/authorization";
import { successResponse } from "@/lib/http";
import { AppError } from "@/features/system/errors/app-error";
import { handleAppError } from "@/features/system/errors/error-handler";
import {
  createService,
  deleteService,
  getServiceBySlug,
  listServices,
  updateService,
} from "./service.service";

async function ensureContentAccess(request: NextRequest) {
  const user = await resolveCurrentUser(request);

  if (!user || !canManageContent(user.role)) {
    throw new AppError("Forbidden", 403, { code: "FORBIDDEN" });
  }

  return user;
}

export async function listServicesController() {
  try {
    const services = await listServices();
    return successResponse({ services });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function getServiceController(slug: string) {
  try {
    const service = await getServiceBySlug(slug);

    if (!service) {
      throw new AppError("Service not found", 404, {
        code: "SERVICE_NOT_FOUND",
      });
    }

    return successResponse({ service });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function createServiceController(request: NextRequest) {
  try {
    await ensureContentAccess(request);
    const body = await request.json();
    const service = await createService(body);

    revalidateTag("services");

    return successResponse({ service }, 201);
  } catch (error) {
    return handleAppError(error);
  }
}

export async function updateServiceController(
  request: NextRequest,
  slug: string,
) {
  try {
    await ensureContentAccess(request);
    const body = await request.json();
    const service = await updateService(slug, body);

    revalidateTag("services");

    return successResponse({ service });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function deleteServiceController(
  request: NextRequest,
  slug: string,
) {
  try {
    await ensureContentAccess(request);
    const deleted = await deleteService(slug);

    revalidateTag("services");

    return successResponse({ deleted });
  } catch (error) {
    return handleAppError(error);
  }
}
