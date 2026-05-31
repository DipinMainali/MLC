"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import {
  dashboardNavigation,
  type DashboardNavigationItem,
} from "@/components/dashboard/navigation";

type DashboardSidebarProps = {
  role: string;
  name: string | null | undefined;
  email: string | null | undefined;
  navigation?: DashboardNavigationItem[];
};

function isActiveRoute(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === href || pathname === `${href}/`;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar({
  role,
  name,
  email,
  navigation = dashboardNavigation,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-border/70 bg-card/70 px-6 py-8 backdrop-blur lg:border-b-0 lg:border-r xl:px-8">
      <div className="flex h-full flex-col gap-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Admin workspace
              </p>
              <h1 className="text-xl font-semibold tracking-tight">
                Prajesh Studio
              </h1>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(pathname, item.href);

            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-sm transition-all ${
                  isActive
                    ? "border-primary/20 bg-primary/5 text-foreground shadow-sm"
                    : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary/40 hover:text-foreground"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="size-4" />
                  {item.label}
                </span>
                <ArrowUpRight className="size-4 opacity-60" />
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-border/70 bg-background/70 p-4 text-sm text-muted-foreground shadow-sm">
          <p className="font-medium text-foreground">{name ?? email}</p>
          <p className="mt-1 break-words">{email}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.24em]">{role}</p>
        </div>
      </div>
    </aside>
  );
}
