import type { ReactNode } from "react";

type DashboardPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  meta?: ReactNode;
};

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  action,
  meta,
}: DashboardPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-2">
          <h1 className="font-serif text-3xl tracking-tight md:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground md:text-base">
            {description}
          </p>
        </div>
        {meta ? <div className="pt-1">{meta}</div> : null}
      </div>

      {action ? (
        <div className="flex shrink-0 items-center gap-3">{action}</div>
      ) : null}
    </div>
  );
}
