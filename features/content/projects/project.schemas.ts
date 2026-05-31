import { z } from "zod";

const projectImageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
});

const projectCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
});

export const projectUpsertSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  category: z.array(projectCategorySchema).min(1),
  client: z.string().optional().nullable(),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  overview: z.string().optional().nullable(),
  problem: z.string().optional().nullable(),
  approach: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  outcome: z.string().optional().nullable(),
  thumbnail: projectImageSchema.optional(),
  featured: z.boolean().optional().default(false),
  isPublished: z.boolean().optional().default(true),
  sortOrder: z.number().int().optional().default(0),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  images: z.array(projectImageSchema).optional().default([]),
});

export const projectUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  category: z.array(projectCategorySchema).min(1).optional(),
  client: z.string().optional().nullable(),
  year: z.number().int().min(1900).max(2100).optional().nullable(),
  overview: z.string().optional().nullable(),
  problem: z.string().optional().nullable(),
  approach: z.string().optional().nullable(),
  solution: z.string().optional().nullable(),
  outcome: z.string().optional().nullable(),
  thumbnail: projectImageSchema.optional(),
  featured: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  seoTitle: z.string().optional().nullable(),
  seoDescription: z.string().optional().nullable(),
  images: z.array(projectImageSchema).optional(),
});

export type ProjectUpsertInput = z.infer<typeof projectUpsertSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
