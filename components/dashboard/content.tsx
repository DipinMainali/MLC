import type { ComponentType, ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type StatCardProps = {
  label: string;
  value: number | string;
  helper: string;
  icon: ComponentType<{ className?: string }>;
};

export function DashboardStatCard({
  label,
  value,
  helper,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div>
          <CardDescription>{label}</CardDescription>
          <CardTitle className="mt-2 text-3xl font-semibold">{value}</CardTitle>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
          <Icon className="size-5" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{helper}</p>
      </CardContent>
    </Card>
  );
}

type ContentSectionProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function ContentSection({
  title,
  description,
  action,
  children,
}: ContentSectionProps) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="space-y-2 border-b border-border/70 pb-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">{children}</CardContent>
    </Card>
  );
}

type ContentRowProps = {
  title: string;
  subtitle: string;
  badge?: string;
};

export function ContentRow({ title, subtitle, badge }: ContentRowProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-medium">{title}</p>
          {badge && (
            <Badge variant="outline" className="rounded-full px-2.5 py-0.5">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

export function ContentDivider() {
  return <Separator className="w-full" />;
}
