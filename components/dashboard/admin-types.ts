import type { InquiryData } from "@/features/contact/contact.interfaces";
import type { ProjectCategoryEnum } from "@/features/content/projects/project.interfaces";
import type { LucideIcon } from "lucide-react";

export type AdminProject = {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategoryEnum;
  categorySlug: string | null;
  year: string;
  client: string | null;
  thumbnail: string;
  overview: string | null;
  problem: string | null;
  approach: string | null;
  solution: string | null;
  outcome: string | null;
  images: string[];
  featured: boolean;
  isPublished: boolean;
  sortOrder: number;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string;
};

export type AdminService = {
  id: string;
  slug: string;
  title: string;
  icon: string | null;
  shortDescription: string | null;
  fullDescription: string | null;
  features: string[];
  sortOrder: number;
  isPublished: boolean;
};

export type AdminInquiry = {
  id: string;
  data: InquiryData;
  status: string;
  assignedTo: string | null;
  adminNotes: string | null;
  createdAt: string;
};

export type AdminSettings = {
  id: string;
  siteName: string | null;
  tagline: string | null;
  heroTitle: string | null;
  heroSubtitle: string | null;
  aboutText: string | null;
  ctaText: string | null;
  contactEmail: string | null;
  socialLinks: { label: string; url: string }[];
  updatedAt: string;
};

export type ProjectFormState = {
  slug: string;
  title: string;
  categoryName: ProjectCategoryEnum | "";
  categorySlug: string;
  year: string;
  client: string;
  thumbnailUrl: string;
  overview: string;
  problem: string;
  approach: string;
  solution: string;
  outcome: string;
  images: string[];
  featured: boolean;
  isPublished: boolean;
  sortOrder: string;
  seoTitle: string;
  seoDescription: string;
};

export type ServiceFormState = {
  slug: string;
  title: string;
  icon: string;
  shortDescription: string;
  fullDescription: string;
  featuresText: string;
  sortOrder: string;
  isPublished: boolean;
};

export type SettingsFormState = {
  siteName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  ctaText: string;
  contactEmail: string;
  socialLinksText: string;
};

export type InquiryFormState = {
  status: string;
  assignedTo: string;
  adminNotes: string;
};

export type DashboardStat = {
  label: string;
  value: number;
  helper: string;
  icon: LucideIcon;
};
