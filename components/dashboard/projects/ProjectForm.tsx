"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  AdminProject,
  ProjectFormState,
} from "@/components/dashboard/admin-types";
import ImageUploader from "@/components/ImageUploader";
import {
  createProjectAction,
  updateProjectAction,
} from "@/features/content/projects/project.actions";
import { ProjectCategoryEnum } from "@/features/content/projects/project.interfaces";

type ProjectFormMode = "create" | "edit";

type ProjectFormProps = {
  mode?: ProjectFormMode;
  initialProject?: AdminProject | null;
};

function buildProjectFormState(project?: AdminProject | null): ProjectFormState {
  return {
    slug: project?.slug ?? "",
    title: project?.title ?? "",
    categoryName: project?.category ?? "",
    categorySlug: project?.categorySlug ?? project?.category ?? "",
    year: project?.year ?? "",
    client: project?.client ?? "",
    thumbnailUrl: project?.thumbnail ?? "",
    overview: project?.overview ?? "",
    problem: project?.problem ?? "",
    approach: project?.approach ?? "",
    solution: project?.solution ?? "",
    outcome: project?.outcome ?? "",
    images: project?.images ?? [],
    featured: project?.featured ?? false,
    isPublished: project?.isPublished ?? true,
    sortOrder: String(project?.sortOrder ?? 0),
    seoTitle: project?.seoTitle ?? "",
    seoDescription: project?.seoDescription ?? "",
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toNullableString(value: string) {
  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

function toNullableInteger(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number.parseInt(trimmed, 10);

  return Number.isFinite(parsed) ? parsed : null;
}

function isPersistableImageUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  return (
    trimmed.startsWith("http://") ||
    trimmed.startsWith("https://") ||
    trimmed.startsWith("/")
  );
}

const projectCategoryOptions = [
  { value: ProjectCategoryEnum.Branding, label: "Branding" },
  { value: ProjectCategoryEnum.WebDesign, label: "Web design" },
  { value: ProjectCategoryEnum.MobileApp, label: "Mobile app" },
  { value: ProjectCategoryEnum.ECommerce, label: "E-commerce" },
  { value: ProjectCategoryEnum.DigitalMarketing, label: "Digital marketing" },
  { value: ProjectCategoryEnum.ContentCreation, label: "Content creation" },
  { value: ProjectCategoryEnum.SEO, label: "SEO" },
] as const;

export function ProjectForm({
  mode = "create",
  initialProject = null,
}: ProjectFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit" && Boolean(initialProject);
  const [form, setForm] = useState<ProjectFormState>(() =>
    buildProjectFormState(initialProject),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const galleryItems = useMemo(
    () => form.images.map((url) => url.trim()).filter(Boolean),
    [form.images],
  );

  const resetFormFields = () => {
    setForm(buildProjectFormState(initialProject));
  };

  const handleReset = () => {
    resetFormFields();
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const addGallerySlot = () => {
    setForm((current) => ({
      ...current,
      images: [...current.images, ""],
    }));
  };

  const updateGalleryImage = (index: number, value: string) => {
    setForm((current) => ({
      ...current,
      images: current.images.map((image, imageIndex) =>
        imageIndex === index ? value : image,
      ),
    }));
  };

  const removeGallerySlot = (index: number) => {
    setForm((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const categoryName = form.categoryName;
    const categorySlug = form.categorySlug.trim() || categoryName;
    const slug = form.slug.trim();
    const title = form.title.trim();
    const thumbnailUrl = form.thumbnailUrl.trim();
    const thumbnail = isPersistableImageUrl(thumbnailUrl)
      ? {
          url: thumbnailUrl,
          alt: title,
          sortOrder: 0,
        }
      : undefined;
    const persistedGalleryItems = galleryItems.filter(isPersistableImageUrl);
      const images =
        persistedGalleryItems.length || !isEditMode
          ? persistedGalleryItems.map((url, index) => ({
              url,
              sortOrder: index,
            }))
          : undefined;

    if (!slug || !title || !categoryName || !categorySlug) {
      setErrorMessage("Slug, title, and category are required.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      slug,
      title,
      category: [
        {
          id: categorySlug,
          name: categoryName,
          slug: categorySlug,
        },
      ],
      client: toNullableString(form.client),
      year: toNullableInteger(form.year),
      overview: toNullableString(form.overview),
      problem: toNullableString(form.problem),
      approach: toNullableString(form.approach),
      solution: toNullableString(form.solution),
      outcome: toNullableString(form.outcome),
      thumbnail,
      featured: form.featured,
      isPublished: form.isPublished,
      sortOrder: toNullableInteger(form.sortOrder) ?? 0,
      seoTitle: toNullableString(form.seoTitle),
      seoDescription: toNullableString(form.seoDescription),
      images,
    };

    try {
      if (isEditMode && initialProject) {
        await updateProjectAction(initialProject.slug, payload);
      } else {
        await createProjectAction(payload);
      }

      if (!isEditMode) {
        resetFormFields();
      }

      setSuccessMessage(`${isEditMode ? "Updated" : "Created"} ${title}.`);
      router.replace("/dashboard/projects");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card
      id="project-create"
      className="scroll-mt-24 border-border/70 shadow-sm"
    >
      <CardHeader className="space-y-2 border-b border-border/70 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {isEditMode ? "Edit project" : "Create project"}
            </p>
            <CardTitle className="text-xl">
              {isEditMode ? "Update case study" : "New case study"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? "Adjust the project details and save the revised case study to the catalog."
                : "Add a portfolio project directly from the admin list page."}
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            className="rounded-full px-4"
          >
            <Plus className="size-4" />
            Clear form
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-slug">Slug</Label>
              <Input
                id="project-slug"
                value={form.slug}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    slug: event.target.value,
                  }))
                }
                placeholder="product-launch-refresh"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-title">Title</Label>
              <Input
                id="project-title"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title: event.target.value,
                  }))
                }
                placeholder="Product launch refresh"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-category-name">Category name</Label>
              <Select
                value={form.categoryName}
                onValueChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    categoryName: value as ProjectCategoryEnum,
                    categorySlug: value,
                  }))
                }
              >
                <SelectTrigger id="project-category-name">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {projectCategoryOptions.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-category-slug">Category slug</Label>
              <Input
                id="project-category-slug"
                value={form.categorySlug}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    categorySlug: event.target.value,
                  }))
                }
                placeholder="branding"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-year">Year</Label>
              <Input
                id="project-year"
                value={form.year}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    year: event.target.value,
                  }))
                }
                placeholder="2026"
                inputMode="numeric"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-client">Client</Label>
              <Input
                id="project-client"
                value={form.client}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    client: event.target.value,
                  }))
                }
                placeholder="Acme Co."
              />
            </div>

            <div className="md:col-span-2">
              <ImageUploader
                value={form.thumbnailUrl || null}
                onUpload={(url) =>
                  setForm((current) => ({
                    ...current,
                    thumbnailUrl: url,
                  }))
                }
                onClear={() =>
                  setForm((current) => ({
                    ...current,
                    thumbnailUrl: "",
                  }))
                }
                label="Thumbnail image"
                description="Upload an image for the project thumbnail."
                buttonLabel="Upload thumbnail"
                previewAlt={form.title || "Project thumbnail preview"}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="project-overview">Overview</Label>
              <Textarea
                id="project-overview"
                rows={4}
                value={form.overview}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    overview: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-problem">Problem</Label>
              <Textarea
                id="project-problem"
                rows={4}
                value={form.problem}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    problem: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-approach">Approach</Label>
              <Textarea
                id="project-approach"
                rows={4}
                value={form.approach}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    approach: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-solution">Solution</Label>
              <Textarea
                id="project-solution"
                rows={4}
                value={form.solution}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    solution: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="project-outcome">Outcome</Label>
              <Textarea
                id="project-outcome"
                rows={4}
                value={form.outcome}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    outcome: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-3 md:col-span-2">
              <Label>Gallery images</Label>
              <p className="text-xs text-muted-foreground">
                Upload one or more images for the project gallery.
              </p>

              <div className="space-y-4">
                {form.images.length ? (
                  form.images.map((imageUrl, index) => (
                    <div
                      key={`gallery-image-${index}`}
                      className="space-y-3 rounded-2xl border border-border/70 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">
                          Gallery image {index + 1}
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGallerySlot(index)}
                        >
                          Remove slot
                        </Button>
                      </div>

                      <ImageUploader
                        value={imageUrl || null}
                        onUpload={(url) => updateGalleryImage(index, url)}
                        onClear={() => updateGalleryImage(index, "")}
                        label={`Gallery image ${index + 1}`}
                        description="Upload a gallery image from your computer."
                        buttonLabel="Upload gallery image"
                        previewAlt={`Gallery image ${index + 1}`}
                      />
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/70 p-4 text-sm text-muted-foreground">
                    No gallery images yet.
                  </div>
                )}

                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full px-5"
                  onClick={addGallerySlot}
                >
                  <Plus className="size-4" />
                  Add gallery image
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-seo-title">SEO title</Label>
              <Input
                id="project-seo-title"
                value={form.seoTitle}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    seoTitle: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-sort-order">Sort order</Label>
              <Input
                id="project-sort-order"
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    sortOrder: event.target.value,
                  }))
                }
                inputMode="numeric"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="project-seo-description">SEO description</Label>
              <Textarea
                id="project-seo-description"
                rows={3}
                value={form.seoDescription}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    seoDescription: event.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    featured: event.target.checked,
                  }))
                }
                className="size-4 rounded border-border"
              />
              Featured project
            </label>

            <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    isPublished: event.target.checked,
                  }))
                }
                className="size-4 rounded border-border"
              />
              Published
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full px-5"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Plus className="size-4" />
              )}
              {isEditMode ? "Update project" : "Create project"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="rounded-full px-5"
            >
              Reset
            </Button>
          </div>

          {successMessage ? (
            <p className="text-sm text-emerald-600" role="status">
              {successMessage}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="text-sm text-destructive" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
