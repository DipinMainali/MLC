"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AdminService,
  ServiceFormState,
} from "@/components/dashboard/admin-types";
import { ServicesSection } from "./services-section";
import { toast } from "@/hooks/use-toast";

type ServicesClientProps = {
  initialServices: AdminService[];
  initialEditSlug?: string | null;
};

const emptyServiceForm: ServiceFormState = {
  slug: "",
  title: "",
  icon: "",
  shortDescription: "",
  fullDescription: "",
  featuresText: "",
  sortOrder: "0",
  isPublished: true,
};

function normalizeFormValue(value: string) {
  return value.trim();
}

function parseServicePayload(form: ServiceFormState) {
  return {
    slug: normalizeFormValue(form.slug),
    title: normalizeFormValue(form.title),
    icon: normalizeFormValue(form.icon) || null,
    shortDescription: normalizeFormValue(form.shortDescription) || null,
    fullDescription: normalizeFormValue(form.fullDescription) || null,
    sortOrder: Number.parseInt(form.sortOrder, 10) || 0,
    isPublished: form.isPublished,
    features: form.featuresText
      .split(/\r?\n/)
      .map((feature) => feature.trim())
      .filter(Boolean),
  };
}

function sortServices(items: AdminService[]) {
  return [...items].sort(
    (left, right) =>
      left.sortOrder - right.sortOrder || left.title.localeCompare(right.title),
  );
}

export function ServicesClient({
  initialServices,
  initialEditSlug,
}: ServicesClientProps) {
  const router = useRouter();
  const [services, setServices] = useState<AdminService[]>(
    sortServices(initialServices ?? []),
  );
  const [serviceForm, setServiceForm] =
    useState<ServiceFormState>(emptyServiceForm);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [editingServiceSlug, setEditingServiceSlug] = useState<string | null>(
    null,
  );
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    if (!initialEditSlug) {
      return;
    }

    const service = services.find((item) => item.slug === initialEditSlug);

    if (service) {
      onEditService(service);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEditSlug]);

  function onAddService() {
    setEditingServiceSlug(null);
    setServiceForm(emptyServiceForm);
    setIsServiceFormOpen(true);
  }

  function onEditService(service: AdminService) {
    setEditingServiceSlug(service.slug);
    setServiceForm({
      slug: service.slug,
      title: service.title,
      icon: service.icon ?? "",
      shortDescription: service.shortDescription ?? "",
      fullDescription: service.fullDescription ?? "",
      featuresText: service.features.join("\n"),
      sortOrder: String(service.sortOrder),
      isPublished: service.isPublished,
    });
    setIsServiceFormOpen(true);
  }

  function onResetServiceForm() {
    setEditingServiceSlug(null);
    setServiceForm(emptyServiceForm);
    setIsServiceFormOpen(false);
  }

  async function onSaveService() {
    const payload = parseServicePayload(serviceForm);

    if (!payload.slug || !payload.title) {
      toast({
        title: "Missing fields",
        description: "Slug and title are required to save a service.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSaving("service");

      const response = await fetch(
        editingServiceSlug
          ? `/api/content/services/${encodeURIComponent(editingServiceSlug)}`
          : "/api/content/services",
        {
          method: editingServiceSlug ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        toast({
          title: editingServiceSlug ? "Update failed" : "Create failed",
          description:
            responseBody?.message ??
            "We could not save that service. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const savedService = responseBody?.service as AdminService | undefined;

      if (savedService) {
        setServices((current) => {
          const next = current.some((service) => service.id === savedService.id)
            ? current.map((service) =>
                service.id === savedService.id ? savedService : service,
              )
            : [savedService, ...current];

          return sortServices(next);
        });
      }

      toast({
        title: editingServiceSlug ? "Service updated" : "Service created",
        description: "The live service catalog was updated successfully.",
      });

      onResetServiceForm();
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: editingServiceSlug ? "Update failed" : "Create failed",
        description: "Something went wrong while saving the service.",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  }

  async function onRemoveService(slug: string) {
    try {
      setSaving(`service:${slug}`);

      const response = await fetch(
        `/api/content/services/${encodeURIComponent(slug)}`,
        {
          method: "DELETE",
        },
      );

      const responseBody = await response.json().catch(() => null);

      if (!response.ok) {
        toast({
          title: "Delete failed",
          description:
            responseBody?.message ??
            "We could not remove that service. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setServices((current) =>
        current.filter((service) => service.slug !== slug),
      );

      if (editingServiceSlug === slug) {
        onResetServiceForm();
      }

      toast({
        title: "Service deleted",
        description: "The service was removed from the live catalog.",
      });

      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "Delete failed",
        description: "Something went wrong while deleting the service.",
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  }

  return (
    <ServicesSection
      services={services}
      serviceForm={serviceForm}
      editingServiceSlug={editingServiceSlug}
      isServiceFormOpen={isServiceFormOpen}
      saving={saving}
      setServiceForm={setServiceForm}
      onResetServiceForm={onResetServiceForm}
      onAddService={onAddService}
      onSaveService={onSaveService}
      onEditService={onEditService}
      onRemoveService={onRemoveService}
    />
  );
}
