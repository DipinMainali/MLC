import { Badge } from "@/components/ui/badge";

type DashboardHeaderProps = {
  role: string;
  name: string | null | undefined;
  email: string | null | undefined;
};

export function DashboardHeader({ role, name, email }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border/70 bg-background/80 px-6 py-6 backdrop-blur xl:px-10">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Dashboard
          </Badge>
          <span className="text-sm text-muted-foreground">
            Shared shell for content management and publishing workflows
          </span>
        </div>
      </div>
    </header>
  );
}
