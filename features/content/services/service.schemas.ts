import { z } from "zod";

export const serviceUpsertSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  icon: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  sortOrder: z.number().int().optional().default(0),
  isPublished: z.boolean().optional().default(true),
  features: z.array(z.string().min(1)).optional().default([]),
});

export const serviceUpdateSchema = z.object({
  slug: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  icon: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  fullDescription: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isPublished: z.boolean().optional(),
  features: z.array(z.string().min(1)).optional(),
});

export type ServiceUpsertInput = z.infer<typeof serviceUpsertSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
