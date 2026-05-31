import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DashboardDataTable,
  type DashboardTableColumn,
} from "@/components/dashboard/DataTable/dashboard-data-table";
import { DashboardEmptyState } from "@/components/dashboard/EmptyState/dashboard-empty-state";
import { DashboardPageHeader } from "@/components/dashboard/PageHeader/dashboard-page-header";
import { DashboardPagination } from "@/components/dashboard/Pagination/dashboard-pagination";
import { DashboardSearchBar } from "@/components/dashboard/SearchBar/dashboard-search-bar";
import { InquiryForm } from "@/components/dashboard/contact/inquiry-form";
import { InquiriesRowActions } from "@/components/dashboard/contact/inquiries-row-actions";
import { listContactMessages } from "@/features/contact/contact.service";
import { getSiteSettings } from "@/features/content/site-settings/site-settings.service";
import {
  buildPageHref,
  getPageNumber,
  getSearchParam,
  normalizeInquiry,
  normalizeSettings,
  paginateItems,
} from "../_lib/dashboard";

type InquiriesPageProps = {
  searchParams?: {
    query?: string;
    page?: string;
    mode?: string;
    id?: string;
  };
};

function extractInquiryField(
  inquiry: ReturnType<typeof normalizeInquiry>,
  key: "name" | "email" | "subject" | "company" | "message",
) {
  const value = inquiry.data?.[key];

  return typeof value === "string" ? value : "";
}

function buildEditHref(id: string) {
  return `/dashboard/inquiries?mode=edit&id=${encodeURIComponent(id)}`;
}

function buildViewHref(id: string) {
  return `/dashboard/inquiries?mode=view&id=${encodeURIComponent(id)}`;
}

export default async function InquiriesDashboardPage({
  searchParams = {},
}: InquiriesPageProps) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const [messages, settings] = await Promise.all([
    listContactMessages(),
    getSiteSettings(),
  ]);

  const normalizedMessages = messages.map(normalizeInquiry);
  const normalizedSettings = normalizeSettings(settings);
  const query = getSearchParam(resolvedSearchParams.query).trim();
  const page = getPageNumber(resolvedSearchParams.page);
  const mode = resolvedSearchParams.mode;
  const selectedId = getSearchParam(resolvedSearchParams.id).trim();
  const isViewMode = mode === "view";
  const isEditMode = mode === "edit";

  const filteredMessages = normalizedMessages.filter((inquiry) => {
    if (!query) {
      return true;
    }

    const haystack = [
      extractInquiryField(inquiry, "name"),
      extractInquiryField(inquiry, "email"),
      extractInquiryField(inquiry, "subject"),
      extractInquiryField(inquiry, "company"),
      extractInquiryField(inquiry, "message"),
      inquiry.status,
      inquiry.assignedTo ?? "",
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query.toLowerCase());
  });

  const { items, totalPages, currentPage } = paginateItems(
    filteredMessages,
    page,
  );

  const selectedInquiry =
    isViewMode || isEditMode
      ? normalizedMessages.find((inquiry) => inquiry.id === selectedId)
      : null;

  if ((isViewMode || isEditMode) && !selectedInquiry) {
    notFound();
  }

  const latestCount = normalizedMessages.filter(
    (inquiry) => inquiry.status === "new",
  ).length;

  return (
    <section className="space-y-6">
      <DashboardPageHeader
        eyebrow="Messages"
        title={
          isEditMode
            ? "Edit inquiry"
            : isViewMode
              ? "View inquiry"
              : "Inquiries"
        }
        description={
          isEditMode
            ? "Review one inquiry and update its status, ownership, or internal notes."
            : isViewMode
              ? "Inspect the message details before assigning or closing it."
              : "Manage inbound contact form submissions with the same polished workflow used across the dashboard."
        }
        action={
          isViewMode || isEditMode ? (
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link href="/dashboard/inquiries">Back to inquiries</Link>
            </Button>
          ) : (
            <Button asChild variant="outline" className="rounded-full px-5">
              <Link href="/dashboard">Back to dashboard</Link>
            </Button>
          )
        }
        meta={
          isViewMode || isEditMode ? null : (
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {filteredMessages.length} total
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {latestCount} new
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {normalizedSettings?.contactEmail ?? "No contact email"}
              </Badge>
            </div>
          )
        }
      />

      {isEditMode || isViewMode ? (
        selectedInquiry ? (
          isEditMode ? (
            <InquiryForm inquiry={selectedInquiry} />
          ) : (
            <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-semibold">
                  {extractInquiryField(selectedInquiry, "subject") ||
                    "New inquiry"}
                </h2>
                <Badge variant="outline" className="rounded-full px-2.5 py-0.5">
                  {selectedInquiry.status}
                </Badge>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                From{" "}
                {extractInquiryField(selectedInquiry, "name") || "Anonymous"} ·{" "}
                {extractInquiryField(selectedInquiry, "email") || "No email"}
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Assigned to</p>
                  <p className="font-medium">
                    {selectedInquiry.assignedTo ?? "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">
                    {new Date(selectedInquiry.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Message</p>
                  <p className="mt-1 whitespace-pre-wrap leading-7 text-foreground">
                    {extractInquiryField(selectedInquiry, "message") || "—"}
                  </p>
                </div>
                {selectedInquiry.adminNotes ? (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Admin notes</p>
                    <p className="mt-1 whitespace-pre-wrap leading-7 text-foreground">
                      {selectedInquiry.adminNotes}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>
          )
        ) : null
      ) : (
        <>
          <DashboardSearchBar
            action="/dashboard/inquiries"
            queryName="query"
            defaultValue={query}
            placeholder="Search by name, email, subject, or message..."
            resetHref="/dashboard/inquiries"
          />

          {items.length ? (
            <DashboardDataTable
              rows={items}
              rowKey={(inquiry) => inquiry.id}
              columns={[
                {
                  key: "subject",
                  header: "Subject",
                  render: (inquiry) => (
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {extractInquiryField(inquiry, "subject") ||
                          "New inquiry"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {extractInquiryField(inquiry, "message").slice(0, 64) ||
                          "No message preview"}
                      </p>
                    </div>
                  ),
                },
                {
                  key: "sender",
                  header: "Sender",
                  render: (inquiry) => (
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {extractInquiryField(inquiry, "name") || "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {extractInquiryField(inquiry, "email") || "No email"}
                      </p>
                    </div>
                  ),
                },
                {
                  key: "status",
                  header: "Status",
                  render: (inquiry) => (
                    <Badge
                      variant={
                        inquiry.status === "new" ? "secondary" : "outline"
                      }
                      className="rounded-full px-2.5 py-0.5 capitalize"
                    >
                      {inquiry.status}
                    </Badge>
                  ),
                },
                {
                  key: "assignedTo",
                  header: "Assigned to",
                  render: (inquiry) => inquiry.assignedTo ?? "—",
                },
                {
                  key: "updatedAt",
                  header: "Updated",
                  render: (inquiry) =>
                    new Date(inquiry.createdAt).toLocaleString(),
                },
                {
                  key: "actions",
                  header: "Actions",
                  headerClassName: "w-24 text-right",
                  cellClassName: "w-24 text-right",
                  render: (inquiry) => (
                    <InquiriesRowActions inquiry={inquiry} />
                  ),
                },
              ]}
              emptyState={
                <DashboardEmptyState
                  title="No inquiries found"
                  description="Try a different keyword or reset the search to see the full inbox."
                  action={
                    <Button
                      asChild
                      variant="outline"
                      className="rounded-full px-5"
                    >
                      <Link href="/dashboard/inquiries">Reset search</Link>
                    </Button>
                  }
                />
              }
            />
          ) : (
            <DashboardEmptyState
              title="No inquiries yet"
              description="Messages sent from the public contact form will appear here for triage and follow-up."
            />
          )}

          <DashboardPagination
            currentPage={currentPage}
            totalPages={totalPages}
            previousHref={
              currentPage > 1
                ? buildPageHref(
                    "/dashboard/inquiries",
                    resolvedSearchParams,
                    currentPage - 1,
                  )
                : undefined
            }
            nextHref={
              currentPage < totalPages
                ? buildPageHref(
                    "/dashboard/inquiries",
                    resolvedSearchParams,
                    currentPage + 1,
                  )
                : undefined
            }
          />
        </>
      )}
    </section>
  );
}
