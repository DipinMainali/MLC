import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type DashboardPaginationProps = {
  currentPage: number;
  totalPages: number;
  previousHref?: string;
  nextHref?: string;
};

export function DashboardPagination({
  currentPage,
  totalPages,
  previousHref,
  nextHref,
}: DashboardPaginationProps) {
  const hasPrevious = Boolean(previousHref) && currentPage > 1;
  const hasNext = Boolean(nextHref) && currentPage < totalPages;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card px-4 py-4 text-sm text-muted-foreground shadow-sm md:flex-row md:items-center md:justify-between">
      <p>
        Page <span className="font-medium text-foreground">{currentPage}</span>{" "}
        of{" "}
        <span className="font-medium text-foreground">{totalPages || 1}</span>
      </p>
      <div className="flex items-center gap-2">
        {hasPrevious ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full px-4"
          >
            <Link href={previousHref as string}>
              <ChevronLeft className="size-4" />
              Previous
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-4"
            disabled
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
        )}
        {hasNext ? (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="rounded-full px-4"
          >
            <Link href={nextHref as string}>
              Next
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full px-4"
            disabled
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
