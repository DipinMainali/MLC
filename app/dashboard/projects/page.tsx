import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardDataTable } from "@/components/dashboard/DataTable/dashboard-data-table";
import { DashboardEmptyState } from "@/components/dashboard/EmptyState/dashboard-empty-state";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader/dashboard-page-header";
import { DashboardPagination } from "@/components/dashboard/Pagination/dashboard-pagination";
import { DashboardSearchBar } from "@/components/dashboard/SearchBar/dashboard-search-bar";
import { ProjectForm } from "@/components/dashboard/projects/ProjectForm";
import {
  getProjectBySlug,
  listAdminProjects,
} from "@/features/content/projects/project.service";
import {
  buildPageHref,
  getPageNumber,
  getSearchParam,
  normalizeProject,
  paginateItems,
} from "../_lib/dashboard";
import { ProjectRowActions } from "../../../components/dashboard/projects/project-row-actions";

type ProjectsPageProps = {
  searchParams?: { query?: string; page?: string; mode?: string; slug?: string };
};

function buildCreateHref() {
  return "/dashboard/projects?mode=create";
}

export default async function ProjectsPage({
  searchParams = {},
}: ProjectsPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const projects = (await listAdminProjects()).map(normalizeProject);
  const query = getSearchParam(resolvedSearchParams.query).trim();
  const page = getPageNumber(resolvedSearchParams.page);
  const isCreateMode = resolvedSearchParams.mode === "create";
  const isEditMode = resolvedSearchParams.mode === "edit";

  let editingProject = null;

  if (isEditMode) {
    const slug = getSearchParam(resolvedSearchParams.slug).trim();

    if (!slug) {
      notFound();
    }

    const project = await getProjectBySlug(slug);

    if (!project) {
      notFound();
    }

    editingProject = normalizeProject(project);
  }

  const filteredProjects = projects.filter((project) => {
    if (!query) {
      return true;
    }

    const haystack = [
      project.title,
      project.slug,
      project.category,
      project.client,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query.toLowerCase());
  });

  const { items, totalPages, currentPage } = paginateItems(
    filteredProjects,
    page,
  );
  const previousHref =
    currentPage > 1
      ? buildPageHref(
          "/dashboard/projects",
          resolvedSearchParams,
          currentPage - 1,
        )
      : undefined;
  const nextHref =
    currentPage < totalPages
      ? buildPageHref(
          "/dashboard/projects",
          resolvedSearchParams,
          currentPage + 1,
        )
      : undefined;

  return (
    <section className="space-y-6">
      <DashboardPageHeader
        eyebrow="Projects"
        title={
          isCreateMode
            ? "Create project"
            : isEditMode
              ? "Edit project"
              : "Projects list"
        }
        description={
          isCreateMode
            ? "Add a new case study and send it back to the portfolio catalog once it’s saved."
            : isEditMode
              ? "Review the current case study details and publish your changes when you’re done."
            : "Browse case studies, filter by keyword, and keep the portfolio catalog tidy."
        }
        action={
          isCreateMode || isEditMode ? (
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link href="/dashboard/projects">Back to projects</Link>
            </Button>
          ) : (
            <Button asChild className="rounded-full px-5">
              <Link href={buildCreateHref()}>Add project</Link>
            </Button>
          )
        }
        meta={
          isCreateMode || isEditMode ? null : (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {filteredProjects.length} total
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {items.length} on this page
              </Badge>
            </div>
          )
        }
      />

      {isCreateMode || isEditMode ? (
        <ProjectForm
          mode={isEditMode ? "edit" : "create"}
          initialProject={editingProject}
        />
      ) : (
        <>
          <DashboardSearchBar
            action="/dashboard/projects"
            queryName="query"
            defaultValue={query}
            placeholder="Search by title, slug, category, or client..."
            resetHref="/dashboard/projects"
          />

          <div id="project-list">
            <DashboardDataTable
              rows={items}
              rowKey={(project) => project.id}
              columns={[
                {
                  key: "project",
                  header: "Project",
                  render: (project) => (
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {project.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        /{project.slug}
                      </p>
                    </div>
                  ),
                },
                {
                  key: "category",
                  header: "Category",
                  render: (project) => project.category,
                },
                {
                  key: "status",
                  header: "Status",
                  render: (project) => (
                    <Badge
                      variant={project.isPublished ? "secondary" : "outline"}
                      className="rounded-full px-2.5 py-0.5"
                    >
                      {project.isPublished ? "Published" : "Draft"}
                    </Badge>
                  ),
                },
                {
                  key: "client",
                  header: "Client",
                  render: (project) => project.client ?? "—",
                },
                {
                  key: "updated",
                  header: "Updated",
                  render: (project) =>
                    new Date(project.updatedAt).toLocaleDateString(),
                },
                {
                  key: "actions",
                  header: "Actions",
                  headerClassName: "w-24 text-right",
                  cellClassName: "w-24 text-right",
                  render: (project) => (
                    <ProjectRowActions project={project} />
                  ),
                },
              ]}
              emptyState={
                <DashboardEmptyState
                  title="No projects found"
                  description="Try a different keyword or reset the search to show the full catalog."
                  action={
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full px-5"
                    >
                      <Link href="/dashboard/projects">Reset search</Link>
                    </Button>
                  }
                />
              }
            />
          </div>

          <DashboardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            previousHref={previousHref}
            nextHref={nextHref}
          />
        </>
      )}
    </section>
  );
}
