import Link from "next/link";
import {
  ArrowRight,
  FolderKanban,
  MessageSquareMore,
  Sparkles,
  SquarePen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DashboardStatCard,
  ContentSection,
} from "@/components/dashboard/content";
import {
  DashboardDataTable,
  type DashboardTableColumn,
} from "@/components/dashboard/DataTable/dashboard-data-table";
import { DashboardEmptyState } from "@/components/dashboard/EmptyState/dashboard-empty-state";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader/dashboard-page-header";
import { dashboardNavigation } from "@/components/dashboard/navigation";
import { listContactMessages } from "@/features/contact/contact.service";
import { listAdminProjects } from "@/features/content/projects/project.service";
import type {
  AdminInquiry,
  AdminProject,
} from "@/components/dashboard/admin-types";
import { listAllServices } from "@/features/content/services/service.service";
import { getSiteSettings } from "@/features/content/site-settings/site-settings.service";
import {
  normalizeInquiry,
  normalizeProject,
  normalizeService,
  normalizeSettings,
} from "./_lib/dashboard";

export default async function DashboardHomePage() {
  const [projects, services, messages, settings] = await Promise.all([
    listAdminProjects(),
    listAllServices(),
    listContactMessages(),
    getSiteSettings(),
  ]);

  const normalizedProjects = projects.map(normalizeProject);
  const normalizedServices = services.map(normalizeService);
  const normalizedMessages = messages.map(normalizeInquiry);
  const normalizedSettings = normalizeSettings(settings);

  const stats = [
    {
      label: "Projects",
      value: normalizedProjects.length,
      helper: "Case studies ready for publishing",
      icon: FolderKanban,
    },
    {
      label: "Services",
      value: normalizedServices.length,
      helper: "Active service offerings in the catalog",
      icon: Sparkles,
    },
    {
      label: "Messages",
      value: normalizedMessages.length,
      helper: "New and archived inquiries in the queue",
      icon: MessageSquareMore,
    },
    {
      label: "Settings",
      value: normalizedSettings ? 1 : 0,
      helper: "Site configuration records available",
      icon: SquarePen,
    },
  ];

  const latestProjects = normalizedProjects.slice(0, 5);
  const latestMessages = normalizedMessages.slice(0, 5);

  const latestProjectColumns: DashboardTableColumn<AdminProject>[] = [
    {
      key: "project",
      header: "Project",
      render: (project) => (
        <div className="space-y-1">
          <p className="font-medium text-foreground">{project.title}</p>
          <p className="text-xs text-muted-foreground">/{project.slug}</p>
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
      render: (project) => (project.isPublished ? "Published" : "Draft"),
    },
  ];

  const latestMessageColumns: DashboardTableColumn<AdminInquiry>[] = [
    {
      key: "subject",
      header: "Subject",
      render: (message) => message.data.subject ?? "New inquiry",
    },
    {
      key: "name",
      header: "Sender",
      render: (message) => message.data.name ?? "Anonymous",
    },
    {
      key: "status",
      header: "Status",
      render: (message) => message.status,
    },
  ];

  return (
    <section className="space-y-8">
      <DashboardPageHeader
        eyebrow="Overview"
        title="Dashboard"
        description="Monitor content activity, jump into the editable lists, and keep the studio’s publishing workflow moving."
        action={
          <Button asChild className="rounded-full px-5">
            <Link href="/dashboard/projects">
              Open projects
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
        meta={
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            {dashboardNavigation.map((item) => (
              <Button
                key={item.id}
                asChild
                variant="outline"
                size="sm"
                className="rounded-full px-4"
              >
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <DashboardStatCard key={item.label} {...item} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ContentSection
          title="Latest projects"
          description="A quick view of the most recently updated portfolio items."
        >
          <DashboardDataTable<AdminProject>
            rows={latestProjects}
            rowKey={(project: AdminProject) => project.id}
            columns={latestProjectColumns}
            emptyState={
              <DashboardEmptyState
                title="No projects yet"
                description="Create your first case study to populate the dashboard overview."
              />
            }
          />
        </ContentSection>

        <ContentSection
          title="Latest messages"
          description="Recent inquiries are surfaced here for quick triage."
        >
          <DashboardDataTable<AdminInquiry>
            rows={latestMessages}
            rowKey={(message) => message.id}
            columns={latestMessageColumns}
            emptyState={
              <DashboardEmptyState
                title="No messages yet"
                description="Contact form submissions will appear here once they arrive."
              />
            }
          />
        </ContentSection>
      </div>

      {normalizedSettings ? (
        <div className="rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Site settings
          </p>
          <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Site name</p>
              <p className="font-medium">
                {normalizedSettings.siteName ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contact email</p>
              <p className="font-medium">
                {normalizedSettings.contactEmail ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Social links</p>
              <p className="font-medium">
                {normalizedSettings.socialLinks.length}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Updated</p>
              <p className="font-medium">
                {new Date(normalizedSettings.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
