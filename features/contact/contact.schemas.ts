import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().email(),
  company: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  message: z.string().trim().min(1),
});

export const inquiryAdminUpdateSchema = z.object({
  status: z.string().min(1),
  assignedTo: z.string().optional().nullable(),
  adminNotes: z.string().optional().nullable(),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;
export type InquiryAdminUpdateInput = z.infer<typeof inquiryAdminUpdateSchema>;
