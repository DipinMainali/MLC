export type ProjectImageInput = {
  url: string;
  alt?: string | null;
  sortOrder?: number;
};

export type ProjectCategory = {
  id: string;
  name: string;
  slug: string;
};

//I want now project category to be enum of predefined categories instead of free text, so I will define it as enum
export enum ProjectCategoryEnum {
  Branding = "branding",
  WebDesign = "web-design",
  MobileApp = "mobile-app",
  ECommerce = "e-commerce",
  DigitalMarketing = "digital-marketing",
  ContentCreation = "content-creation",
  SEO = "seo",
}

export type ProjectData = {
  year?: string | null;
  client?: string | null;
  thumbnail?: ProjectImageInput;
  category: ProjectCategory[];
  overview?: string | null;
  problem?: string | null;
  approach?: string | null;
  solution?: string | null;
  outcome?: string | null;
  images?: ProjectImageInput[];
  featured?: boolean;
  sortOrder?: number;
  seoTitle?: string | null;
  seoDescription?: string | null;
  [key: string]: unknown;
};

export type ProjectDTO = {
  id: string;
  slug: string;
  title: string;
  data: ProjectData;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
