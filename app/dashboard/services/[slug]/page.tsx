import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getServiceBySlug } from "@/features/content/services/service.service";
import { normalizeService } from "@/app/dashboard/_lib/dashboard";

type ServiceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const normalized = normalizeService(service);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
            Service detail
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {normalized.title}
          </h1>
          <p className="text-muted-foreground">/{normalized.slug}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" className="rounded-full px-5">
            <Link href="/dashboard/services">Back to services</Link>
          </Button>
          <Button asChild className="rounded-full px-5">
            <Link
              href={`/dashboard/services?edit=${encodeURIComponent(normalized.slug)}`}
            >
              Edit service
            </Link>
          </Button>
        </div>
      </div>

      <Card className="border-border/70 shadow-sm">
        <CardHeader className="space-y-3 border-b border-border/70 pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant={normalized.isPublished ? "secondary" : "outline"}
              className="rounded-full px-3 py-1"
            >
              {normalized.isPublished ? "Published" : "Draft"}
            </Badge>
            <Badge variant="outline" className="rounded-full px-3 py-1">
              Sort {normalized.sortOrder}
            </Badge>
          </div>
          <CardTitle className="text-xl">Public-facing summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Icon label</p>
              <p className="font-medium">{normalized.icon ?? "—"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Slug</p>
              <p className="font-medium">{normalized.slug}</p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <p className="text-sm text-muted-foreground">Short description</p>
              <p className="leading-7 text-foreground">
                {normalized.shortDescription || "—"}
              </p>
            </div>
            <div className="space-y-2 md:col-span-2">
              <p className="text-sm text-muted-foreground">Full description</p>
              <p className="whitespace-pre-wrap leading-7 text-foreground">
                {normalized.fullDescription || "—"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Features</p>
            {normalized.features.length ? (
              <div className="flex flex-wrap gap-2">
                {normalized.features.map((feature) => (
                  <Badge
                    key={feature}
                    variant="outline"
                    className="rounded-full px-3 py-1"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No features added yet.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
