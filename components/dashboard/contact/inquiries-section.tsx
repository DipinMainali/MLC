"use client";

import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Clock3, Save, Search, SlidersHorizontal, Trash2 } from "lucide-react";
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
  AdminInquiry,
  InquiryFormState,
} from "@/components/dashboard/admin-types";
import type { InquiryData } from "@/features/contact/contact.interfaces";

const inquiryStatusOptions = [
  "new",
  "in-progress",
  "responded",
  "closed",
  "archived",
];

function extractInquiryField(inquiry: AdminInquiry, key: keyof InquiryData) {
  const value = inquiry.data?.[key];

  if (typeof value === "string") {
    return value;
  }

  return "";
}

type InquiriesSectionProps = {
  inquiries: AdminInquiry[];
  inquiryForm: InquiryFormState | null;
  editingInquiryId: string | null;
  saving: string | null;
  setInquiryForm: Dispatch<SetStateAction<InquiryFormState | null>>;
  onEditInquiry: (inquiry: AdminInquiry) => void;
  onRemoveInquiry: (id: string) => void;
  onSaveInquiry: () => void;
  onResetInquiryForm: () => void;
};

export function InquiriesSection({
  inquiries,
  inquiryForm,
  editingInquiryId,
  saving,
  setInquiryForm,
  onEditInquiry,
  onRemoveInquiry,
  onSaveInquiry,
  onResetInquiryForm,
}: InquiriesSectionProps) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const filteredInquiries = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const filtered = inquiries.filter((inquiry) => {
      if (statusFilter !== "all" && inquiry.status !== statusFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const subject = extractInquiryField(inquiry, "subject").toLowerCase();
      const name = extractInquiryField(inquiry, "name").toLowerCase();
      const email = extractInquiryField(inquiry, "email").toLowerCase();

      return (
        subject.includes(query) || name.includes(query) || email.includes(query)
      );
    });

    return [...filtered].sort((left, right) => {
      if (sortBy === "oldest") {
        return (
          new Date(left.createdAt).getTime() -
          new Date(right.createdAt).getTime()
        );
      }

      return (
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
      );
    });
  }, [inquiries, searchValue, sortBy, statusFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInquiries.length / PAGE_SIZE),
  );
  const pagedInquiries = filteredInquiries.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  // ensure current page is valid when filters change
  if (page > totalPages) {
    setPage(totalPages);
  }

  return (
    <ContentSection
      title="Inquiries"
      description="Review leads, assign owners, and change the status of each conversation."
      action={
        <Badge variant="outline" className="rounded-full px-3 py-1">
          {inquiries.length} records
        </Badge>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="space-y-4 border-b border-border/70 pb-5">
            <div className="space-y-2">
              <CardTitle className="text-xl">Inquiry queue</CardTitle>
              <CardDescription>
                Review messages, filter by status, and open one to edit.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative min-w-55 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search by name, email, or subject..."
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
                    <SelectItem value="all">All statuses</SelectItem>
                    {inquiryStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="min-w-45">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            {filteredInquiries.length ? (
              pagedInquiries.map((inquiry) => {
                const subject =
                  extractInquiryField(inquiry, "subject") || "New inquiry";
                const name =
                  extractInquiryField(inquiry, "name") || "Anonymous";
                const email =
                  extractInquiryField(inquiry, "email") || "No email";

                return (
                  <div
                    key={inquiry.id}
                    className="rounded-2xl border border-border/70 bg-background/70 p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{subject}</p>
                          <Badge
                            variant="outline"
                            className="rounded-full px-2.5 py-0.5"
                          >
                            {inquiry.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {name} · {email}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => onEditInquiry(inquiry)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveInquiry(inquiry.id)}
                          disabled={saving === `inquiry:${inquiry.id}`}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
                      {extractInquiryField(inquiry, "message") ||
                        "No message body available."}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="size-3.5" />
                        {new Date(inquiry.createdAt).toLocaleString()}
                      </span>
                      {inquiry.assignedTo && (
                        <span>Assigned to {inquiry.assignedTo}</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 p-8 text-sm text-muted-foreground">
                No inquiries match those filters.
              </div>
            )}
          </CardContent>
        </Card>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {pagedInquiries.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredInquiries.length}
              </span>
            </p>
            <div className="flex items-center gap-2">
              <button
                className="rounded-full border border-border/70 bg-background px-3 py-1 text-sm text-muted-foreground disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Previous
              </button>
              <p className="text-sm text-muted-foreground">
                Page <span className="font-medium text-foreground">{page}</span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {totalPages}
                </span>
              </p>
              <button
                className="rounded-full border border-border/70 bg-background px-3 py-1 text-sm text-muted-foreground disabled:opacity-50"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <Card className="border-border/70 shadow-sm">
          <CardHeader className="space-y-2 border-b border-border/70 pb-5">
            <CardTitle className="text-xl">
              {editingInquiryId ? "Edit inquiry" : "Select an inquiry"}
            </CardTitle>
            <CardDescription>
              Update assignment, status, and private admin notes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {editingInquiryId && inquiryForm ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="inquiry-status">Status</Label>
                  <Select
                    value={inquiryForm.status}
                    onValueChange={(value) =>
                      setInquiryForm((current) =>
                        current ? { ...current, status: value } : current,
                      )
                    }
                  >
                    <SelectTrigger id="inquiry-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {inquiryStatusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inquiry-assigned-to">Assigned to</Label>
                  <Input
                    id="inquiry-assigned-to"
                    value={inquiryForm.assignedTo}
                    onChange={(event) =>
                      setInquiryForm((current) =>
                        current
                          ? { ...current, assignedTo: event.target.value }
                          : current,
                      )
                    }
                    placeholder="Ava, support@..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inquiry-notes">Admin notes</Label>
                  <Textarea
                    id="inquiry-notes"
                    rows={6}
                    value={inquiryForm.adminNotes}
                    onChange={(event) =>
                      setInquiryForm((current) =>
                        current
                          ? { ...current, adminNotes: event.target.value }
                          : current,
                      )
                    }
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={onSaveInquiry}
                    disabled={saving === `inquiry:${editingInquiryId}`}
                    className="rounded-full px-5"
                  >
                    <Save className="size-4" />
                    Save inquiry
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onResetInquiryForm}
                    className="rounded-full px-5"
                  >
                    Clear selection
                  </Button>
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/70 p-8 text-sm text-muted-foreground">
                Select a message from the queue to edit its status and notes.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ContentSection>
  );
}
