import type { Service, ServiceFeature } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { ServiceDTO } from "./service.interfaces";

type ServiceRecord = Service & { features: ServiceFeature[] };

type PrismaKnownError = {
  code?: string;
  meta?: {
    modelName?: string;
  };
};

function isMissingServiceTableError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as PrismaKnownError).code === "P2021"
  );
}

function serviceTableMissingMessage() {
  return [
    "The Service table is missing in the current database.",
    "Run the Prisma schema sync step (for example, `pnpm prisma db push` or `pnpm prisma migrate dev`) and try again.",
  ].join(" ");
}

function mapService(service: ServiceRecord): ServiceDTO {
  return {
    id: service.id,
    slug: service.slug,
    title: service.title,
    icon: service.icon,
    shortDescription: service.shortDescription,
    fullDescription: service.fullDescription,
    features: service.features.map((feature) => feature.title),
    sortOrder: service.sortOrder,
    isPublished: service.isPublished,
  };
}

export async function listServiceRecords() {
  try {
    const services = await prisma.service.findMany({
      where: { isPublished: true },
      include: { features: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    });

    return services.map(mapService);
  } catch (error) {
    if (isMissingServiceTableError(error)) {
      return [];
    }

    throw error;
  }
}

export async function listAllServiceRecords() {
  try {
    const services = await prisma.service.findMany({
      include: { features: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    });

    return services.map(mapService);
  } catch (error) {
    if (isMissingServiceTableError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getServiceRecordBySlug(slug: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
      include: { features: { orderBy: { sortOrder: "asc" } } },
    });

    return service ? mapService(service) : null;
  } catch (error) {
    if (isMissingServiceTableError(error)) {
      return null;
    }

    throw error;
  }
}

export async function createServiceRecord(data: {
  slug: string;
  title: string;
  icon?: string | null;
  shortDescription?: string | null;
  fullDescription?: string | null;
  sortOrder: number;
  isPublished: boolean;
  features: string[];
}) {
  try {
    const service = await prisma.service.create({
      data: {
        slug: data.slug,
        title: data.title,
        icon: data.icon ?? null,
        shortDescription: data.shortDescription ?? null,
        fullDescription: data.fullDescription ?? null,
        sortOrder: data.sortOrder,
        isPublished: data.isPublished,
        features: {
          create: data.features.map((title, index) => ({
            title,
            sortOrder: index,
          })),
        },
      },
      include: { features: { orderBy: { sortOrder: "asc" } } },
    });

    return mapService(service);
  } catch (error) {
    if (isMissingServiceTableError(error)) {
      throw new Error(serviceTableMissingMessage());
    }

    throw error;
  }
}

export async function updateServiceRecord(
  slug: string,
  data: {
    slug?: string;
    title?: string;
    icon?: string | null;
    shortDescription?: string | null;
    fullDescription?: string | null;
    sortOrder?: number;
    isPublished?: boolean;
    features?: string[];
  },
) {
  try {
    const service = await prisma.service.update({
      where: { slug },
      data: {
        ...(data.slug ? { slug: data.slug } : {}),
        ...(data.title ? { title: data.title } : {}),
        ...(data.icon !== undefined ? { icon: data.icon } : {}),
        ...(data.shortDescription !== undefined
          ? { shortDescription: data.shortDescription }
          : {}),
        ...(data.fullDescription !== undefined
          ? { fullDescription: data.fullDescription }
          : {}),
        ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
        ...(data.isPublished !== undefined
          ? { isPublished: data.isPublished }
          : {}),
        ...(data.features
          ? {
              features: {
                deleteMany: {},
                create: data.features.map((title, index) => ({
                  title,
                  sortOrder: index,
                })),
              },
            }
          : {}),
      },
      include: { features: { orderBy: { sortOrder: "asc" } } },
    });

    return mapService(service);
  } catch (error) {
    if (isMissingServiceTableError(error)) {
      throw new Error(serviceTableMissingMessage());
    }

    throw error;
  }
}

export async function deleteServiceRecord(slug: string) {
  try {
    await prisma.service.delete({ where: { slug } });
    return { slug };
  } catch (error) {
    if (isMissingServiceTableError(error)) {
      throw new Error(serviceTableMissingMessage());
    }

    throw error;
  }
}
