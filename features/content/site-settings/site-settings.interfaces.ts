export type SocialLink = {
  label: string;
  url: string;
};

export type SiteSettingsDTO = {
  id: string;
  siteName: string | null;
  tagline: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  aboutText: string | null;
  ctaText: string | null;
  contactEmail: string | null;
  socialLinks: SocialLink[];
  updatedAt: Date;
};
