"use client";

import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  RefreshCcw,
  Save,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ContentSection } from "@/components/dashboard/content";
import type {
  AdminProject,
  ProjectFormState,
} from "@/components/dashboard/admin-types";

type ProjectsSectionProps = {
  projects: AdminProject[];
  projectForm: ProjectFormState;
  editingProjectSlug: string | null;
  saving: string | null;
  setProjectForm: Dispatch<SetStateAction<ProjectFormState>>;
  onResetProjectForm: () => void;
  onSaveProject: () => void;
  onEditProject: (project: AdminProject) => void;
  onRemoveProject: (slug: string) => void;
};

export function ProjectsSection({
  projects,
  projectForm,
  editingProjectSlug,
  saving,
  setProjectForm,
  onResetProjectForm,
  onSaveProject,
  onEditProject,
  onRemoveProject,
}: ProjectsSectionProps) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("updated");

  const filteredProjects = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const filtered = projects.filter((project) => {
      if (statusFilter === "published" && !project.isPublished) {
        return false;
      }
      if (statusFilter === "draft" && project.isPublished) {
        return false;
      }
      if (statusFilter === "featured" && !project.featured) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        project.title.toLowerCase().includes(query) ||
        project.slug.toLowerCase().includes(query) ||
        project.category.toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((left, right) => {
      if (sortBy === "title") {
        return left.title.localeCompare(right.title);
      }
      if (sortBy === "sortOrder") {
        return left.sortOrder - right.sortOrder;
      }

      return (
        new Date(right.updatedAt).getTime() -
        new Date(left.updatedAt).getTime()
      );
    });
  }, [projects, searchValue, sortBy, statusFilter]);

  return (
    <ContentSection
      title="Projects"
      description="Create, edit, publish, and remove case studies without leaving the admin area."
      action={
        <Button
          variant="outline"
          className="rounded-full px-4"
          onClick={onResetProjectForm}
        >
          <RefreshCcw className="size-4" />
          New project
        </Button>
      }
    >
      <div className="space-y-6">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="space-y-4 border-b border-border/70 pb-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Project library</CardTitle>
                <CardDescription>
                  Review, filter, and manage your portfolio projects.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="rounded-full px-4"
                onClick={onResetProjectForm}
              >
                <RefreshCcw className="size-4" />
                Add project
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative min-w-55 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search by title, slug, category..."
                  className="pl-9"
                />
              </div>
              <div className="flex min-w-45 items-center gap-2">
                <SlidersHorizontal className="size-4 text-muted-foreground" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="min-w-40">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All projects</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                    <SelectItem value="featured">Featured</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="min-w-45">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated">Recently updated</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="sortOrder">Sort order</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {filteredProjects.length ? (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{project.title}</p>
                        <Badge
                          variant={
                            project.isPublished ? "secondary" : "outline"
                          }
                          className="rounded-full px-2.5 py-0.5"
                        >
                          {project.isPublished ? "Published" : "Draft"}
                        </Badge>
                        {project.featured && (
                          <Badge
                            variant="outline"
                            className="rounded-full px-2.5 py-0.5"
                          >
                            Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        /projects/{project.slug} · {project.category} ·{" "}
                        {project.year || "—"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onEditProject(project)}
                      >
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveProject(project.slug)}
                        disabled={saving === `project:${project.slug}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-xs text-muted-foreground md:grid-cols-2">
                    <p>Sort order: {project.sortOrder}</p>
                    <p>
                      Updated: {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                    <p className="md:col-span-2">
                      SEO title: {project.seoTitle || "—"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 p-8 text-sm text-muted-foreground">
                No projects match those filters.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border/70 shadow-sm">
          <CardHeader className="space-y-2 border-b border-border/70 pb-5">
            <CardTitle className="text-xl">
              {editingProjectSlug ? "Edit project" : "Create project"}
            </CardTitle>
            <CardDescription>
              Populate the portfolio with a full case study, gallery, and SEO
              fields.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project-slug">Slug</Label>
                <Input
                  id="project-slug"
                  value={projectForm.slug}
                  onChange={(event) =>
                    setProjectForm((current) => ({
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
                  value={projectForm.title}
                  onChange={(event) =>
                    setProjectForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Product launch refresh"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-category-name">Category name</Label>
                <Input
                  id="project-category-name"
                  value={projectForm.categoryName}
                  onChange={(event) =>
                    setProjectForm((current) => ({
                      ...current,
                      categoryName: event.target.value,
                    }))
                  }
                  placeholder="Brand Strategy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-category-slug">Category slug</Label>
                <Input
                  id="project-category-slug"
                  value={projectForm.categorySlug}
                  onChange={(event) =>
                    setProjectForm((current) => ({
                      ...current,
                      categorySlug: event.target.value,
                    }))
                  }
                  placeholder="brand-strategy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-year">Year</Label>
                <Input
                  id="project-year"
                  value={projectForm.year}
                  onChange={(event) =>
                    setProjectForm((current) => ({
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
                  value={projectForm.client}
                  onChange={(event) =>
                    setProjectForm((current) => ({
                      ...current,
                      client: event.target.value,
                    }))
                  }
                  placeholder="Acme Co."
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="project-thumbnail">Thumbnail URL</Label>
                <Input
                  id="project-thumbnail"
                  type="url"
                  value={projectForm.thumbnailUrl}
                  onChange={(event) =>
                    setProjectForm((current) => ({
                      ...current,
                      thumbnailUrl: event.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="project-overview">Overview</Label>
                <Textarea
                  id="project-overview"
                  rows={4}
                  value={projectForm.overview}
                  onChange={(event) =>
                    setProjectForm((current) => ({
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
                  value={projectForm.problem}
                  onChange={(event) =>
                    setProjectForm((current) => ({
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
                  value={projectForm.approach}
                  onChange={(event) =>
                    setProjectForm((current) => ({
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
                  value={projectForm.solution}
                  onChange={(event) =>
                    setProjectForm((current) => ({
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
                  value={projectForm.outcome}
                  onChange={(event) =>
                    setProjectForm((current) => ({
                      ...current,
                      outcome: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="project-gallery">
                  Gallery URLs, one per line
                </Label>
                <Textarea
                  id="project-gallery"
                  rows={4}
                  value={projectForm.galleryText}
                  onChange={(event) =>
                    setProjectForm((current) => ({
                      ...current,
                      galleryText: event.target.value,
                    }))
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="project-seo-title">SEO title</Label>
                <Input
                  id="project-seo-title"
                  value={projectForm.seoTitle}
                  onChange={(event) =>
                    setProjectForm((current) => ({
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
                  value={projectForm.sortOrder}
                  onChange={(event) =>
                    setProjectForm((current) => ({
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
                  value={projectForm.seoDescription}
                  onChange={(event) =>
                    setProjectForm((current) => ({
                      ...current,
                      seoDescription: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                onClick={onSaveProject}
                disabled={saving === "project"}
                className="rounded-full px-5"
              >
                <Save className="size-4" />
                {editingProjectSlug ? "Update project" : "Create project"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onResetProjectForm}
                className="rounded-full px-5"
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentSection>
  );
}
