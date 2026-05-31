import Link from "next/link";
import { DashboardStatCard } from "@/components/dashboard/content";
import type { DashboardStat } from "@/components/dashboard/admin-types";

type OverviewSectionProps = {
  stats: DashboardStat[];
};

export function OverviewSection({ stats }: OverviewSectionProps) {
  return (
    <section id="overview" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            Overview
          </p>
          <h3 className="mt-2 font-serif text-2xl tracking-tight">
            Quick snapshot of the studio
          </h3>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="mr-2">Quick actions:</span>
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/dashboard/projects"
          >
            Projects
          </Link>
          <span className="mx-2">•</span>
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/dashboard/services"
          >
            Services
          </Link>
          <span className="mx-2">•</span>
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/dashboard/messages"
          >
            Messages
          </Link>
          <span className="mx-2">•</span>
          <Link
            className="text-foreground underline-offset-4 hover:underline"
            href="/dashboard/site-settings"
          >
            Site settings
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <DashboardStatCard key={item.label} {...item} />
        ))}
      </div>
    </section>
  );
}
