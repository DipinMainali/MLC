"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import type {
  AdminSettings,
  SettingsFormState,
} from "@/components/dashboard/admin-types";
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
import { Textarea } from "@/components/ui/textarea";
import {
  createSiteSettingsAction,
  updateSiteSettingsAction,
} from "@/features/content/site-settings/site-settings.actions";

type SiteSettingsFormMode = "create" | "edit";

type SiteSettingsFormProps = {
  mode?: SiteSettingsFormMode;
  initialSettings?: AdminSettings | null;
};

function buildSettingsFormState(
  settings?: AdminSettings | null,
): SettingsFormState {
  return {
    siteName: settings?.siteName ?? "",
    tagline: settings?.tagline ?? "",
    heroTitle: settings?.heroTitle ?? "",
    heroSubtitle: settings?.heroSubtitle ?? "",
    aboutText: settings?.aboutText ?? "",
    ctaText: settings?.ctaText ?? "",
    contactEmail: settings?.contactEmail ?? "",
    socialLinksText:
      settings?.socialLinks
        .map((link) => `${link.label} | ${link.url}`)
        .join("\n") ?? "",
  };
}

function toNullableString(value: string) {
  const trimmed = value.trim();

  return trimmed ? trimmed : null;
}

function toOptionalString(value: string) {
  const trimmed = value.trim();

  return trimmed ? trimmed : undefined;
}

function parseSocialLinks(text: string) {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const links: Array<{ label: string; url: string }> = [];

  for (const line of lines) {
    const [rawLabel, rawUrl] = line.split("|").map((part) => part?.trim());

    if (!rawLabel || !rawUrl) {
      throw new Error(
        `Use the format \"Label | https://...\" for each social link. Invalid entry: ${line}`,
      );
    }

    links.push({
      label: rawLabel,
      url: rawUrl,
    });
  }

  return links;
}

export function SiteSettingsForm({
  mode = "create",
  initialSettings = null,
}: SiteSettingsFormProps) {
  const router = useRouter();
  const isEditMode = mode === "edit" && Boolean(initialSettings);
  const [form, setForm] = useState<SettingsFormState>(() =>
    buildSettingsFormState(initialSettings),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleReset = () => {
    setForm(buildSettingsFormState(initialSettings));
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = {
        siteName: toOptionalString(form.siteName),
        tagline: toNullableString(form.tagline),
        heroTitle: toNullableString(form.heroTitle),
        heroSubtitle: toNullableString(form.heroSubtitle),
        aboutText: toNullableString(form.aboutText),
        ctaText: toNullableString(form.ctaText),
        contactEmail: toNullableString(form.contactEmail),
        socialLinks: parseSocialLinks(form.socialLinksText),
      };

      if (isEditMode) {
        await updateSiteSettingsAction(payload);
      } else {
        await createSiteSettingsAction(payload);
      }

      if (!isEditMode) {
        setForm(buildSettingsFormState(null));
      }

      setSuccessMessage(
        `Site settings ${isEditMode ? "updated" : "created"} successfully.`,
      );
      router.replace("/dashboard/site-settings");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-2 border-b border-border/70 pb-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              {isEditMode ? "Edit settings" : "Create settings"}
            </p>
            <CardTitle className="text-xl">
              {isEditMode ? "Update site settings" : "New settings record"}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? "Review the current configuration and publish your updates."
                : "Add the primary site branding and homepage copy."}
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
              <Label htmlFor="settings-site-name">Site name</Label>
              <Input
                id="settings-site-name"
                value={form.siteName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    siteName: event.target.value,
                  }))
                }
                placeholder="Prajesh Shakya"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="settings-contact-email">Contact email</Label>
              <Input
                id="settings-contact-email"
                type="email"
                value={form.contactEmail}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    contactEmail: event.target.value,
                  }))
                }
                placeholder="hello@example.com"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="settings-tagline">Tagline</Label>
              <Input
                id="settings-tagline"
                value={form.tagline}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    tagline: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="settings-hero-title">Hero title</Label>
              <Textarea
                id="settings-hero-title"
                rows={3}
                value={form.heroTitle}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    heroTitle: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="settings-hero-subtitle">Hero subtitle</Label>
              <Textarea
                id="settings-hero-subtitle"
                rows={3}
                value={form.heroSubtitle}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    heroSubtitle: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="settings-about-text">About text</Label>
              <Textarea
                id="settings-about-text"
                rows={5}
                value={form.aboutText}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    aboutText: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="settings-cta-text">CTA text</Label>
              <Input
                id="settings-cta-text"
                value={form.ctaText}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    ctaText: event.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="settings-social-links">
                Social links, one per line as Label | https://...
              </Label>
              <Textarea
                id="settings-social-links"
                rows={5}
                value={form.socialLinksText}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    socialLinksText: event.target.value,
                  }))
                }
              />
            </div>
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
              {isEditMode ? "Update settings" : "Create settings"}
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
