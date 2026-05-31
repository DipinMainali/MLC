import { ServicesClient } from "@/components/dashboard/services/services-client";
import { listAllServices } from "@/features/content/services/service.service";
import { normalizeService } from "../_lib/dashboard";

type ServicesPageProps = {
  searchParams?: { edit?: string };
};

export default async function ServicesPage({
  searchParams = {},
}: ServicesPageProps) {
  const services = (await listAllServices()).map(normalizeService);

  return (
    <ServicesClient
      initialServices={services}
      initialEditSlug={searchParams.edit ?? null}
    />
  );
}
