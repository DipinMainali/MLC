"use server";

import { revalidateTag } from "next/cache";
import { canManageContent, resolveCurrentUser } from "@/lib/authorization";
import { AppError } from "@/features/system/errors/app-error";
import { createProject, deleteProject, updateProject } from "./project.service";

async function ensureContentAccess() {
  const user = await resolveCurrentUser();

  if (!user || !canManageContent(user.role)) {
    throw new AppError("Forbidden", 403, { code: "FORBIDDEN" });
  }

  return user;
}

export async function createProjectAction(input: unknown) {
  await ensureContentAccess();

  const project = await createProject(input);

  revalidateTag("projects");

  return project;
}

export async function updateProjectAction(slug: string, input: unknown) {
  await ensureContentAccess();

  const project = await updateProject(slug, input);

  revalidateTag("projects");

  return project;
}

export async function deleteProjectAction(slug: string) {
  await ensureContentAccess();

  const deleted = await deleteProject(slug);

  revalidateTag("projects");

  return deleted;
}
