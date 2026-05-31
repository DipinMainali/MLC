import { serviceUpdateSchema, serviceUpsertSchema } from "./service.schemas";
import {
  createServiceRecord,
  deleteServiceRecord,
  getServiceRecordBySlug,
  listAllServiceRecords,
  listServiceRecords,
  updateServiceRecord,
} from "./service.repository";

export async function listServices() {
  return listServiceRecords();
}

export async function listAllServices() {
  return listAllServiceRecords();
}

export async function getServiceBySlug(slug: string) {
  return getServiceRecordBySlug(slug);
}

export async function createService(input: unknown) {
  const data = serviceUpsertSchema.parse(input);

  return createServiceRecord(data);
}

export async function updateService(slug: string, input: unknown) {
  const data = serviceUpdateSchema.parse(input);

  return updateServiceRecord(slug, data);
}

export async function deleteService(slug: string) {
  return deleteServiceRecord(slug);
}
