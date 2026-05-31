"use client";

import type { Dispatch, SetStateAction } from "react";
import { Save, Settings2, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentSection } from "@/components/dashboard/content";
import type {
  AdminSettings,
  SettingsFormState,
} from "@/components/dashboard/admin-types";

type SiteSettingsSectionProps = {
  settings: AdminSettings | null;
  settingsForm: SettingsFormState;
  saving: string | null;
  setSettingsForm: Dispatch<SetStateAction<SettingsFormState>>;
  onSaveSettings: () => void;
};

export function SiteSettingsSection({
  settings,
  settingsForm,
  saving,
  setSettingsForm,
  onSaveSettings,
}: SiteSettingsSectionProps) {
  return (
    <ContentSection
      title="Site settings"
      description="Control site branding, homepage copy, contact email, and social links."
      action={
        <Button
          type="button"
          className="rounded-full px-4"
          onClick={onSaveSettings}
          disabled={saving === "settings"}
        >
          <Save className="size-4" />
          Save settings
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="site-name">Site name</Label>
            <Input
              id="site-name"
              value={settingsForm.siteName}
              onChange={(event) =>
                setSettingsForm((current) => ({
                  ...current,
                  siteName: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Contact email</Label>
            <Input
              id="contact-email"
              type="email"
              value={settingsForm.contactEmail}
              onChange={(event) =>
                setSettingsForm((current) => ({
                  ...current,
                  contactEmail: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              value={settingsForm.tagline}
              onChange={(event) =>
                setSettingsForm((current) => ({
                  ...current,
                  tagline: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hero-title">Hero title</Label>
            <Textarea
              id="hero-title"
              rows={3}
              value={settingsForm.heroTitle}
              onChange={(event) =>
                setSettingsForm((current) => ({
                  ...current,
                  heroTitle: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="hero-subtitle">Hero subtitle</Label>
            <Textarea
              id="hero-subtitle"
              rows={3}
              value={settingsForm.heroSubtitle}
              onChange={(event) =>
                setSettingsForm((current) => ({
                  ...current,
                  heroSubtitle: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="about-text">About text</Label>
            <Textarea
              id="about-text"
              rows={5}
              value={settingsForm.aboutText}
              onChange={(event) =>
                setSettingsForm((current) => ({
                  ...current,
                  aboutText: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cta-text">CTA text</Label>
            <Input
              id="cta-text"
              value={settingsForm.ctaText}
              onChange={(event) =>
                setSettingsForm((current) => ({
                  ...current,
                  ctaText: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="social-links">
              Social links, one per line as Label | https://...
            </Label>
            <Textarea
              id="social-links"
              rows={5}
              value={settingsForm.socialLinksText}
              onChange={(event) =>
                setSettingsForm((current) => ({
                  ...current,
                  socialLinksText: event.target.value,
                }))
              }
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="outline" className="rounded-full px-3 py-1">
            <Settings2 className="mr-1 size-3.5" />
            {settings?.updatedAt
              ? `Updated ${new Date(settings.updatedAt).toLocaleDateString()}`
              : "Create settings record"}
          </Badge>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            <Star className="mr-1 size-3.5" />
            {settings?.socialLinks.length ?? 0} social links
          </Badge>
        </div>
      </div>
    </ContentSection>
  );
}
