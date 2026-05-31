import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";
import { successResponse } from "@/lib/http";
import { AppError } from "@/features/system/errors/app-error";
import { handleAppError } from "@/features/system/errors/error-handler";
import {
  createProject,
  deleteProject,
  getProjectBySlug,
  getPublishedProjectBySlug,
  listProjects,
  listPublishedProjects,
  updateProject,
} from "./project.service";

export async function listProjectsController() {
  try {
    const projects = await listProjects();
    return successResponse({ projects });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function listPublicProjectsController() {
  try {
    const projects = await listPublishedProjects();
    return successResponse({ projects });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function getProjectController(slug: string) {
  try {
    const project = await getProjectBySlug(slug);

    if (!project) {
      throw new AppError("Project not found", 404, {
        code: "PROJECT_NOT_FOUND",
      });
    }

    return successResponse({ project });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function getPublicProjectController(slug: string) {
  try {
    const project = await getPublishedProjectBySlug(slug);

    if (!project) {
      throw new AppError("Project not found", 404, {
        code: "PROJECT_NOT_FOUND",
      });
    }

    return successResponse({ project });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function createProjectController(request: NextRequest) {
  try {
    const body = await request.json();
    const project = await createProject(body);

    revalidateTag("projects");

    return successResponse({ project }, 201);
  } catch (error) {
    return handleAppError(error);
  }
}

export async function updateProjectController(
  request: NextRequest,
  slug: string,
) {
  try {
    const body = await request.json();
    const project = await updateProject(slug, body);

    revalidateTag("projects");

    return successResponse({ project });
  } catch (error) {
    return handleAppError(error);
  }
}

export async function deleteProjectController(
  request: NextRequest,
  slug: string,
) {
  try {
    const deleted = await deleteProject(slug);

    revalidateTag("projects");

    return successResponse({ deleted });
  } catch (error) {
    return handleAppError(error);
  }
}
