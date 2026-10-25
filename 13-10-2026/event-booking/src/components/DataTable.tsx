"use client";

import { useMemo, useState, type Key, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "cn";
import FormField from "@/components/form-field/FormField";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "./ui/button";

export type DataTableColumn<T> = {
  /** Unique key for the column (used as React key). Also the field used for sorting. */
  key: string;
  /** Header content. */
  header: ReactNode;
  /** Render the cell for one row. `index` is the row's position across all pages. */
  cell: (row: T, index: number) => ReactNode;
  /** Hide the header visually but keep it for screen readers (e.g. Actions). */
  srOnlyHeader?: boolean;
  /** Text alignment for both header and cells. */
  align?: "left" | "center" | "right";
  /** Extra classes for the <th> (e.g. "w-16"). */
  headerClassName?: string;
  /** Extra classes for every <td> in this column (e.g. "font-medium"). */
  cellClassName?: string;
  /** Click the header to sort by this column (uses row[column.key]). */
  isSort?: boolean;
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

  /** Fields the search box looks in. Pass it to show the search box. */
  searchFields?: (keyof T)[];
  searchPlaceholder?: string;
  /** Shown when a search matches nothing. */
  noResultsMessage?: ReactNode;

  /** Rows per page. 0 (the default) shows every row and hides the pagination. */
  pageSize?: number;
  pageSizeOptions?: number[];
};

const ALIGN = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

type SortConfig = { key: string; direction: "asc" | "desc" };

type PageItem = number | "ellipsis-left" | "ellipsis-right";

/** 1 … 4 5 6 … 20 */
function getPageNumbers(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  const pages: PageItem[] = [1];
  if (left > 2) pages.push("ellipsis-left");
  for (let page = left; page <= right; page++) pages.push(page);
  if (right < total - 1) pages.push("ellipsis-right");
  pages.push(total);
  return pages;
}

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
  searchFields = [],
  searchPlaceholder = "Search...",
  noResultsMessage = "No records match your search.",
  pageSize: initialPageSize = 0,
  pageSizeOptions = [5, 10, 20],
}: DataTableProps<T>) {
  const lastColumnIndex = columns.length - 1;

  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const searchable = searchFields.length > 0;
  const paginated = pageSize > 0;

  /* ---------- search ---------- */
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query || !searchable) return data;

    return data.filter((row) =>
      searchFields.some((field) =>
        String(row[field] ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [data, search, searchable, searchFields]);

  /* ---------- sorting ---------- */
  const sorted = useMemo(() => {
    if (!sortConfig) return filtered;

    return [...filtered].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortConfig.key];
      const bValue = (b as Record<string, unknown>)[sortConfig.key];

      // empty values always go last
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // numbers: low to high / high to low
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // text: A-Z / Z-A
      const result = String(aValue).localeCompare(String(bValue), undefined, {
        sensitivity: "base",
      });
      return sortConfig.direction === "asc" ? result : -result;
    });
  }, [filtered, sortConfig]);

  const handleSort = (column: DataTableColumn<T>) => {
    if (!column.isSort) return;
    setPage(1);
    setSortConfig((current) =>
      current?.key === column.key
        ? { key: column.key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key: column.key, direction: "asc" },
    );
  };

  /* ---------- pagination ---------- */
  const totalPages = paginated ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  // never land on a page that no longer exists (after a delete or a new search)
  const currentPage = Math.min(page, totalPages);
  const startIndex = paginated ? (currentPage - 1) * pageSize : 0;
  const rows = paginated ? sorted.slice(startIndex, startIndex + pageSize) : sorted;

  const goTo = (target: number) => setPage(Math.min(Math.max(1, target), totalPages));

  const showFooter = paginated && sorted.length > 0;
  const showingFrom = sorted.length === 0 ? 0 : startIndex + 1;
  const showingTo = startIndex + rows.length;

  return (
    <div className={cn("overflow-hidden rounded-2xl bg-card shadow-sm", className)}>
      {searchable && (
        <div className="border-b border-line p-3">
          <div className="max-w-sm">
            <FormField
              type="search"
              name="table-search"
              value={search}
              placeholder={searchPlaceholder}
              onChange={(value) => {
                setSearch(value);
                setPage(1);
              }}
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto p-3">
        <table
          className="w-full border-separate border-spacing-0 text-left text-sm"
          style={{ minWidth }}
        >
          {caption && <caption className="sr-only">{caption}</caption>}

          <thead>
            <tr className="bg-tertiary text-xs font-semibold text-muted-foreground">
              {columns.map((column, columnIndex) => {
                const isSorted = sortConfig?.key === column.key;

                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={
                      isSorted
                        ? sortConfig.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : undefined
                    }
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
                    ) : column.isSort ? (
                      <Button
                        type="button"
                        onClick={() => handleSort(column)}
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-1.5 transition-colors hover:text-foreground",
                          isSorted && "text-foreground",
                        )}
                      >
                        <span>{column.header}</span>
                        {!isSorted && <ArrowUpDown className="size-3.5 opacity-40" />}
                        {isSorted && sortConfig.direction === "asc" && (
                          <ArrowUp className="size-3.5" />
                        )}
                        {isSorted && sortConfig.direction === "desc" && (
                          <ArrowDown className="size-3.5" />
                        )}
                      </Button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-16 text-center text-muted-foreground"
                >
                  {data.length === 0 ? emptyMessage : noResultsMessage}
                </td>
              </tr>
            )}

            {rows.map((row, rowOnPage) => {
              const rowIndex = startIndex + rowOnPage; // position across all pages
              const isLastRow = rowOnPage === rows.length - 1;
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

      {showFooter && (
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line px-4 py-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>
              Showing {showingFrom}–{showingTo} of {sorted.length}
              {sorted.length !== data.length && ` (filtered from ${data.length})`}
            </span>

            {pageSizeOptions.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap">Rows per page</span>
                <FormField
                  type="select"
                  name="table-page-size"
                  value={String(pageSize)}
                  options={pageSizeOptions.map((size) => ({
                    label: String(size),
                    value: String(size),
                  }))}
                  onChange={(value) => {
                    setPageSize(Number(value));
                    setPage(1);
                  }}
                  className="w-20"
                />
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(currentPage - 1);
                    }}
                    aria-disabled={currentPage === 1}
                    className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>

                {getPageNumbers(currentPage, totalPages).map((item) =>
                  typeof item === "number" ? (
                    <PaginationItem key={item}>
                      <PaginationLink
                        href="#"
                        isActive={item === currentPage}
                        size="icon"
                        aria-label={`Page ${item}`}
                        onClick={(event) => {
                          event.preventDefault();
                          goTo(item);
                        }}
                        className={cn(
                          "size-8 rounded-lg border text-sm transition-colors",
                          item === currentPage
                            ? "border-brand bg-brand-soft text-brand"
                            : "border-line hover:bg-tertiary",
                        )}
                      >
                        {item}
                      </PaginationLink>
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <PaginationEllipsis className="size-8" />
                    </PaginationItem>
                  ),
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault();
                      goTo(currentPage + 1);
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      )}
    </div>
  );
}