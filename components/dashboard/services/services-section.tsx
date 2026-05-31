"use client";

import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import {
  Eye,
  RefreshCcw,
  Save,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import Link from "next/link";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DashboardDataTable,
  type DashboardTableColumn,
} from "@/components/dashboard/DataTable/dashboard-data-table";
import { DashboardEmptyState } from "@/components/dashboard/EmptyState/dashboard-empty-state";
import { ContentSection } from "@/components/dashboard/content";
import type {
  AdminService,
  ServiceFormState,
} from "@/components/dashboard/admin-types";

type ServicesSectionProps = {
  services: AdminService[];
  serviceForm: ServiceFormState;
  editingServiceSlug: string | null;
  isServiceFormOpen: boolean;
  saving: string | null;
  setServiceForm: Dispatch<SetStateAction<ServiceFormState>>;
  onResetServiceForm: () => void;
  onAddService: () => void;
  onSaveService: () => void;
  onEditService: (service: AdminService) => void;
  onRemoveService: (slug: string) => void;
};

export function ServicesSection({
  services,
  serviceForm,
  editingServiceSlug,
  isServiceFormOpen,
  saving,
  setServiceForm,
  onResetServiceForm,
  onAddService,
  onSaveService,
  onEditService,
  onRemoveService,
}: ServicesSectionProps) {
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("sortOrder");

  const filteredServices = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    const filtered = services.filter((service) => {
      if (statusFilter === "published" && !service.isPublished) {
        return false;
      }
      if (statusFilter === "draft" && service.isPublished) {
        return false;
      }

      if (!query) {
        return true;
      }

      return (
        service.title.toLowerCase().includes(query) ||
        service.slug.toLowerCase().includes(query)
      );
    });

    return [...filtered].sort((left, right) => {
      if (sortBy === "title") {
        return left.title.localeCompare(right.title);
      }

      return left.sortOrder - right.sortOrder;
    });
  }, [services, searchValue, sortBy, statusFilter]);

  const columns: DashboardTableColumn<AdminService>[] = [
    {
      key: "service",
      header: "Service",
      cellClassName: "min-w-[280px]",
      render: (service) => (
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-foreground">{service.title}</p>
            <Badge
              variant={service.isPublished ? "secondary" : "outline"}
              className="rounded-full px-2.5 py-0.5"
            >
              {service.isPublished ? "Published" : "Draft"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">/{service.slug}</p>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {service.shortDescription ||
              service.fullDescription ||
              "No description available."}
          </p>
        </div>
      ),
    },
    {
      key: "features",
      header: "Features",
      cellClassName: "min-w-[240px]",
      render: (service) => (
        <div className="flex flex-wrap gap-2">
          {service.features.length ? (
            <>
              {service.features.slice(0, 3).map((feature) => (
                <Badge
                  key={feature}
                  variant="outline"
                  className="rounded-full px-2.5 py-0.5"
                >
                  {feature}
                </Badge>
              ))}
              {service.features.length > 3 ? (
                <Badge
                  variant="secondary"
                  className="rounded-full px-2.5 py-0.5"
                >
                  +{service.features.length - 3} more
                </Badge>
              ) : null}
            </>
          ) : (
            <span className="text-sm text-muted-foreground">
              No features yet.
            </span>
          )}
        </div>
      ),
    },
    {
      key: "sortOrder",
      header: "Sort",
      cellClassName: "whitespace-nowrap",
      render: (service) => service.sortOrder,
    },
    {
      key: "actions",
      header: "Actions",
      cellClassName: "whitespace-nowrap",
      render: (service) => (
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
          >
            <Link
              href={`/dashboard/services/${encodeURIComponent(service.slug)}`}
            >
              <Eye className="size-4" />
              View
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => onEditService(service)}
          >
            Edit
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full"
            onClick={() => onRemoveService(service.slug)}
            disabled={saving === `service:${service.slug}`}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <ContentSection
      title="Services"
      description="Manage service cards, feature bullets, and publish state in one place."
      action={
        <Button
          variant="outline"
          className="rounded-full px-4"
          onClick={onAddService}
        >
          <RefreshCcw className="size-4" />
          Add service
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="border-border/70 shadow-sm">
          <CardHeader className="space-y-4 border-b border-border/70 pb-5">
            <div className="space-y-2">
              <CardTitle className="text-xl">Service catalog</CardTitle>
              <CardDescription>
                Review services in a compact table, then open one to view, edit,
                or remove it.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="relative min-w-55 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="Search by title or slug..."
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
                    <SelectItem value="all">All services</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Drafts</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="min-w-45">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sortOrder">Sort order</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                className="rounded-full px-4"
                onClick={() => {
                  setSearchValue("");
                  setStatusFilter("all");
                  setSortBy("sortOrder");
                }}
              >
                Reset filters
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <DashboardDataTable
              rows={filteredServices}
              rowKey={(service) => service.id}
              columns={columns}
              emptyState={
                <DashboardEmptyState
                  title="No services found"
                  description="Try a different keyword or reset the filters to show every service."
                  action={
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full px-5"
                      onClick={onAddService}
                    >
                      Add service
                    </Button>
                  }
                />
              }
            />
          </CardContent>
        </Card>

        <Dialog
          open={isServiceFormOpen}
          onOpenChange={(open) => {
            if (!open) {
              onResetServiceForm();
            }
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {editingServiceSlug ? "Edit service" : "Add service"}
              </DialogTitle>
              <DialogDescription>
                Keep the public services page in sync with the studio offering.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="service-slug">Slug</Label>
                <Input
                  id="service-slug"
                  value={serviceForm.slug}
                  onChange={(event) =>
                    setServiceForm((current) => ({
                      ...current,
                      slug: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-title">Title</Label>
                <Input
                  id="service-title"
                  value={serviceForm.title}
                  onChange={(event) =>
                    setServiceForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-icon">Icon label</Label>
                <Input
                  id="service-icon"
                  value={serviceForm.icon}
                  onChange={(event) =>
                    setServiceForm((current) => ({
                      ...current,
                      icon: event.target.value,
                    }))
                  }
                  placeholder="Sparkles"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service-sort-order">Sort order</Label>
                <Input
                  id="service-sort-order"
                  value={serviceForm.sortOrder}
                  onChange={(event) =>
                    setServiceForm((current) => ({
                      ...current,
                      sortOrder: event.target.value,
                    }))
                  }
                  inputMode="numeric"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="service-short-description">
                  Short description
                </Label>
                <Textarea
                  id="service-short-description"
                  rows={3}
                  value={serviceForm.shortDescription}
                  onChange={(event) =>
                    setServiceForm((current) => ({
                      ...current,
                      shortDescription: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="service-full-description">
                  Full description
                </Label>
                <Textarea
                  id="service-full-description"
                  rows={4}
                  value={serviceForm.fullDescription}
                  onChange={(event) =>
                    setServiceForm((current) => ({
                      ...current,
                      fullDescription: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="service-features">Features, one per line</Label>
                <Textarea
                  id="service-features"
                  rows={4}
                  value={serviceForm.featuresText}
                  onChange={(event) =>
                    setServiceForm((current) => ({
                      ...current,
                      featuresText: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="button"
                onClick={onSaveService}
                disabled={saving === "service"}
                className="rounded-full px-5"
              >
                <Save className="size-4" />
                {editingServiceSlug ? "Update service" : "Create service"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onResetServiceForm}
                className="rounded-full px-5"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ContentSection>
  );
}
