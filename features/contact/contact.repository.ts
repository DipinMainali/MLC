import { prisma } from "@/lib/db";
import type { InquiryData, InquiryRecord } from "./contact.interfaces";

/**
 * Create an Inquiry record. The contact form payload is stored inside the
 * `data` JSONB column. We include the optional userId inside the data object
 * for traceability since the Prisma schema does not have a dedicated userId
 * column on Inquiry.
 */
export async function createInquiryRecord(
  input: InquiryData,
  userId?: string | null,
): Promise<InquiryRecord & { userId?: string | null }> {
  const dbRecord = await prisma.inquiry.create({
    data: {
      data: input,
      status: "new",
      assignedTo: null,
      adminNotes: null,
    },
  });

  // Normalize returned shape to match the Inquiry record shape.
  const created = {
    id: dbRecord.id,
    data: dbRecord.data as InquiryData,
    // Extract userId if it was embedded in the JSON payload
    userId: (dbRecord.data as any)?.userId ?? null,
    status: dbRecord.status,
    assignedTo: dbRecord.assignedTo ?? null,
    adminNotes: dbRecord.adminNotes ?? null,
    createdAt: dbRecord.createdAt,
    updatedAt: (dbRecord as any).updatedAt,
  };

  return created;
}

export async function listInquiryRecords() {
  const records = await prisma.inquiry.findMany({
    orderBy: [{ createdAt: "desc" }],
  });

  return records.map((record) => ({
    id: record.id,
    data: record.data as InquiryData,
    status: record.status,
    assignedTo: record.assignedTo ?? null,
    adminNotes: record.adminNotes ?? null,
    createdAt: record.createdAt,
  }));
}

export async function getInquiryRecordById(id: string) {
  const record = await prisma.inquiry.findUnique({ where: { id } });

  if (!record) {
    return null;
  }

  return {
    id: record.id,
    data: record.data as InquiryData,
    status: record.status,
    assignedTo: record.assignedTo ?? null,
    adminNotes: record.adminNotes ?? null,
    createdAt: record.createdAt,
  };
}

export async function updateInquiryRecord(
  id: string,
  input: Partial<Pick<InquiryRecord, "status" | "assignedTo" | "adminNotes">>,
) {
  const record = await prisma.inquiry.update({
    where: { id },
    data: {
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.assignedTo !== undefined
        ? { assignedTo: input.assignedTo }
        : {}),
      ...(input.adminNotes !== undefined
        ? { adminNotes: input.adminNotes }
        : {}),
    },
  });

  return {
    id: record.id,
    data: record.data as InquiryData,
    status: record.status,
    assignedTo: record.assignedTo ?? null,
    adminNotes: record.adminNotes ?? null,
    createdAt: record.createdAt,
  };
}

export async function deleteInquiryRecord(id: string) {
  await prisma.inquiry.delete({ where: { id } });
  return { id };
}
