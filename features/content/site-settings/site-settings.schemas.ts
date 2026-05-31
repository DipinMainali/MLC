import { z } from "zod";

export const socialLinkSchema = z.object({
  label: z.string(),
  url: z.string().url(),
});

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1).optional(),
  tagline: z.string().optional().nullable(),
  heroTitle: z.string().optional().nullable(),
  heroSubtitle: z.string().optional().nullable(),
  aboutText: z.string().optional().nullable(),
  ctaText: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  socialLinks: z.array(socialLinkSchema).optional().default([]),
});

export const siteSettingsUpdateSchema = z.object({
  siteName: z.string().min(1).optional(),
  tagline: z.string().optional().nullable(),
  heroTitle: z.string().optional().nullable(),
  heroSubtitle: z.string().optional().nullable(),
  aboutText: z.string().optional().nullable(),
  ctaText: z.string().optional().nullable(),
  contactEmail: z.string().email().optional().nullable(),
  socialLinks: z.array(socialLinkSchema).optional(),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
export type SiteSettingsUpdateInput = z.infer<typeof siteSettingsUpdateSchema>;
