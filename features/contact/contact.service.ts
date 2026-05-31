import { contactMessageSchema } from "./contact.schemas";
import {
  createInquiryRecord,
  deleteInquiryRecord,
  getInquiryRecordById,
  listInquiryRecords,
  updateInquiryRecord,
} from "./contact.repository";
import {
  inquiryAdminUpdateSchema,
  type ContactMessageInput,
  type InquiryAdminUpdateInput,
} from "./contact.schemas";

export async function createContactMessage(
  input: unknown,
  userId?: string | null,
) {
  // Validate client-submitted contact form
  const data: ContactMessageInput = contactMessageSchema.parse(input);

  // Persist as an Inquiry (store the form inside `data` JSONB). If a userId
  // is provided, include it inside the JSON payload for traceability.
  const payload = {
    ...data,
    ...(userId ? { userId } : {}),
  };

  return createInquiryRecord(payload, userId);
}

export async function listContactMessages() {
  return listInquiryRecords();
}

export async function getContactMessage(id: string) {
  return getInquiryRecordById(id);
}

export async function updateContactMessage(id: string, input: unknown) {
  const payload: InquiryAdminUpdateInput =
    inquiryAdminUpdateSchema.parse(input);

  return updateInquiryRecord(id, payload);
}

export async function deleteContactMessage(id: string) {
  return deleteInquiryRecord(id);
}
