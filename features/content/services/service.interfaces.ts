export type ServiceDTO = {
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
