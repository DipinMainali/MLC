import type { ReactNode } from "react";

export type DashboardTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

type DashboardDataTableProps<T> = {
  columns: DashboardTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyState?: ReactNode;
};

export function DashboardDataTable<T>({
  columns,
  rows,
  rowKey,
  emptyState,
}: DashboardDataTableProps<T>) {
  if (!rows.length) {
    return emptyState ?? null;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full text-left text-sm">
          <thead className="border-b border-border/70 bg-secondary/30 text-muted-foreground">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 font-medium ${column.headerClassName ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                className="transition-colors hover:bg-secondary/20"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-4 align-top ${column.cellClassName ?? ""}`}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
