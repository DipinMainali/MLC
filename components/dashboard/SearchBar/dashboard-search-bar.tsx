import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type DashboardSearchBarProps = {
  action: string;
  queryName?: string;
  defaultValue?: string;
  placeholder?: string;
  resetHref?: string;
};

export function DashboardSearchBar({
  action,
  queryName = "query",
  defaultValue = "",
  placeholder = "Search...",
  resetHref,
}: DashboardSearchBarProps) {
  return (
    <form action={action} method="get" className="flex flex-wrap gap-3">
      <input type="hidden" name="page" value="1" />
      <div className="relative min-w-55 flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name={queryName}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="pl-9"
        />
      </div>
      <Button type="submit" className="rounded-full px-5">
        Search
      </Button>
      {resetHref ? (
        <Button asChild variant="outline" className="rounded-full px-5">
          <Link href={resetHref}>Reset</Link>
        </Button>
      ) : null}
    </form>
  );
}
