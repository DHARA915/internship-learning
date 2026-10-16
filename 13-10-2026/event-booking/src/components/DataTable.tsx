// components/ui/data-table.tsx
import type { Key, ReactNode } from "react";
import { cn } from "cn";

export type DataTableColumn<T> = {
  /** Unique key for the column (used as React key). */
  key: string;
  /** Header content. */
  header: ReactNode;
  /** Render the cell for one row. */
  cell: (row: T, index: number) => ReactNode;
  /** Hide the header visually but keep it for screen readers (e.g. Actions). */
  srOnlyHeader?: boolean;
  /** Text alignment for both header and cells. */
  align?: "left" | "center" | "right";
  /** Extra classes for the <th> (e.g. "w-16"). */
  headerClassName?: string;
  /** Extra classes for every <td> in this column (e.g. "font-medium"). */
  cellClassName?: string;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  /** Stable unique key for each row. */
  getRowKey: (row: T, index: number) => Key;
  /** Shown when `data` is empty. */
  emptyMessage?: ReactNode;
  /** Min width (px) before the table scrolls horizontally. */
  minWidth?: number;
  /** Accessible table caption (visually hidden). */
  caption?: string;
  /** Make rows clickable. */
  onRowClick?: (row: T) => void;
  /** Extra classes per row. */
  rowClassName?: (row: T, index: number) => string | undefined;
  /** Extra classes for the outer card. */
  className?: string;
};

const ALIGN = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function DataTable<T>({
  columns,
  data,
  getRowKey,
  emptyMessage = "No results found.",
  minWidth,
  caption,
  onRowClick,
  rowClassName,
  className,
}: DataTableProps<T>) {
  const lastColumnIndex = columns.length - 1;

  return (
    <div className={cn("overflow-hidden rounded-2xl bg-card shadow-sm", className)}>
      <div className="overflow-x-auto p-3">
        <table
          className="w-full border-separate border-spacing-0 text-left text-sm"
          style={{ minWidth }}
        >
          {caption && <caption className="sr-only">{caption}</caption>}

          <thead>
            <tr className="bg-tertiary text-xs font-semibold text-muted-foreground">
              {columns.map((column, columnIndex) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cn(
                    "px-4 py-3",
                    ALIGN[column.align ?? "left"],
                    columnIndex === 0 && "rounded-l-lg",
                    columnIndex === lastColumnIndex && "rounded-r-lg",
                    column.headerClassName,
                  )}
                >
                  {column.srOnlyHeader ? (
                    <span className="sr-only">{column.header}</span>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}

            {data.map((row, rowIndex) => {
              const isLastRow = rowIndex === data.length - 1;
              return (
                <tr
                  key={getRowKey(row, rowIndex)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    onRowClick && "cursor-pointer hover:bg-tertiary/50",
                    rowClassName?.(row, rowIndex),
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cn(
                        "px-4 py-4 align-middle",
                        ALIGN[column.align ?? "left"],
                        !isLastRow && "border-b border-line",
                        column.cellClassName,
                      )}
                    >
                      {column.cell(row, rowIndex)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}