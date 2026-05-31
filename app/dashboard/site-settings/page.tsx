import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DashboardDataTable } from "@/components/dashboard/DataTable/dashboard-data-table";
import { DashboardEmptyState } from "@/components/dashboard/EmptyState/dashboard-empty-state";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader/dashboard-page-header";
import { SiteSettingsForm } from "@/components/dashboard/site-settings/site-settings-form";
import { SiteSettingsRowActions } from "@/components/dashboard/site-settings/site-settings-row-actions";
import { getSiteSettings } from "@/features/content/site-settings/site-settings.service";
import { normalizeSettings } from "../_lib/dashboard";

type SiteSettingsPageProps = {
  searchParams?: { mode?: string; id?: string };
};

function buildCreateHref() {
  return "/dashboard/site-settings?mode=create";
}

function buildEditHref(id: string) {
  return `/dashboard/site-settings?mode=edit&id=${encodeURIComponent(id)}`;
}

export default async function SiteSettingsPage({
  searchParams = {},
}: SiteSettingsPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const settings = normalizeSettings(await getSiteSettings());
  const mode = resolvedSearchParams.mode;
  const selectedId = (resolvedSearchParams.id ?? "").trim();
  const isCreateMode = mode === "create";
  const isEditMode = mode === "edit";
  const isViewMode = mode === "view";

  if (isCreateMode && settings) {
    redirect(buildEditHref(settings.id));
  }

  if ((isEditMode || isViewMode) && !settings) {
    notFound();
  }

  if ((isEditMode || isViewMode) && selectedId && settings?.id !== selectedId) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <DashboardPageHeader
        eyebrow="Configuration"
        title={
          isCreateMode
            ? "Create site settings"
            : isEditMode
              ? "Edit site settings"
              : isViewMode
                ? "View site settings"
                : "Site settings list"
        }
        description={
          isCreateMode
            ? "Add a site settings record and return to the configuration list once saved."
            : isEditMode
              ? "Review the active configuration and save your updates when ready."
              : isViewMode
                ? "Inspect the current site branding and homepage settings."
                : "Review the active brand and homepage settings record in one place."
        }
        action={
          isCreateMode || isEditMode || isViewMode ? (
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link href="/dashboard/site-settings">Back to site settings</Link>
            </Button>
          ) : settings ? null : (
            <Button asChild className="rounded-full px-5">
              <Link href={buildCreateHref()}>Add settings</Link>
            </Button>
          )
        }
        meta={
          isCreateMode || isEditMode || isViewMode ? null : (
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {settings ? 1 : 0} record
            </Badge>
          )
        }
      />

      {isCreateMode || isEditMode ? (
        <SiteSettingsForm
          mode={isEditMode ? "edit" : "create"}
          initialSettings={settings}
        />
      ) : isViewMode && settings ? (
        <Card className="border-border/70 shadow-sm">
          <CardHeader>
            <CardTitle>{settings.siteName ?? "Site settings"}</CardTitle>
            <CardDescription>
              Last updated {new Date(settings.updatedAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Tagline</p>
                <p>{settings.tagline ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Contact email</p>
                <p>{settings.contactEmail ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hero title</p>
                <p>{settings.heroTitle ?? "—"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hero subtitle</p>
                <p>{settings.heroSubtitle ?? "—"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">About text</p>
                <p className="whitespace-pre-wrap">
                  {settings.aboutText ?? "—"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">CTA text</p>
                <p>{settings.ctaText ?? "—"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Social links</p>
              {settings.socialLinks.length ? (
                <ul className="mt-2 space-y-2">
                  {settings.socialLinks.map((link) => (
                    <li key={`${link.label}-${link.url}`}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-primary underline-offset-4 hover:underline"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>—</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : settings ? (
        <DashboardDataTable
          rows={[settings]}
          rowKey={(entry) => entry.id}
          columns={[
            {
              key: "siteName",
              header: "Site name",
              render: (entry) => entry.siteName ?? "—",
            },
            {
              key: "tagline",
              header: "Tagline",
              render: (entry) => entry.tagline ?? "—",
            },
            {
              key: "contactEmail",
              header: "Contact email",
              render: (entry) => entry.contactEmail ?? "—",
            },
            {
              key: "socialLinks",
              header: "Social links",
              render: (entry) => entry.socialLinks.length,
            },
            {
              key: "updatedAt",
              header: "Updated",
              render: (entry) => new Date(entry.updatedAt).toLocaleString(),
            },
            {
              key: "actions",
              header: "Actions",
              headerClassName: "w-24 text-right",
              cellClassName: "w-24 text-right",
              render: (entry) => <SiteSettingsRowActions settings={entry} />,
            },
          ]}
        />
      ) : (
        <DashboardEmptyState
          title="No site settings record yet"
          description="Create a settings record to manage your active branding and homepage content."
          action={
            <Button asChild className="rounded-full px-5">
              <Link href={buildCreateHref()}>Add settings</Link>
            </Button>
          }
        />
      )}
    </section>
  );
}
