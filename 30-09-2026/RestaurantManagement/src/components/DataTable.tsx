import * as React from "react";
import { useState } from "react";
import { ViewDialog } from "./ViewDialog";
import {
  Trash2,
  Inbox,
  PencilLine,
  MoreVertical,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";
import {
  CommonDialog,
  type FieldConfig,
  type FieldType,
} from "../components/CommonDialog";
import { ConfirmDialog } from "./ConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "./ui/pagination";
import { FormField } from "./form-field/FormField";

// Constant For Pagination
const HEADER_H = 36; // h-9 header
const ROW_H = 44; // h-11 rows

export interface Column<T> {
  key: string;
  header: string;

  // Enable sorting for this column
  isSort?: boolean;

  /** custom display in the table only */
  cell?: (row: T, index: number) => React.ReactNode;
  className?: string;

  /** edit-form settings (all optional) */
  type?: FieldType; // default "text"
  options?: FieldConfig["options"]; // for type "select"
  required?: boolean;
  editable?: boolean; // false -> not shown in edit form (id, createdAt...)
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];

  // for search
  searchFields?: (keyof T)[];

  getRowId?: (row: T) => string | number;
  emptyText?: string;
  /** Pass it -> delete icon appears on each row */
  onDelete?: (row: T) => unknown;
  /** Pass it -> double click opens pre-filled edit modal. Gets the updated row. */
  onEdit?: (updated: T, original: T) => unknown;

  enableView?: boolean;

  editTitle?: string;
  editDescription?: string;
  /** Optional: your own fields for the edit modal (instead of auto-generated ones) */
  renderEditForm?: React.ComponentProps<typeof CommonDialog>["children"];
  validate?: React.ComponentProps<typeof CommonDialog>["validate"];

  /** rows per page (default 10). Pass 0 to turn pagination off */
  pageSize?: number;
  pageSizeOptions?: number[];
}

type PageItem = number | "ellipsis-left" | "ellipsis-right";

/** 1 … 4 5 6 … 20 */
function getPageNumbers(current: number, total: number): PageItem[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  const pages: PageItem[] = [1];
  if (left > 2) pages.push("ellipsis-left");
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < total - 1) pages.push("ellipsis-right");
  pages.push(total);
  return pages;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  searchFields = [],
  getRowId = (r) => r.id,
  emptyText = "No records found.",
  enableView,
  onDelete,
  onEdit,
  editTitle = "Edit record",
  editDescription,
  renderEditForm,
  validate,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 20],
}: DataTableProps<T>) {
  const [editing, setEditing] = useState<T | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const [viewing, setViewing] = React.useState<T | null>(null);
  const [search, setSearch] = useState<string>("");

  // console.log("Selected module columns:",columns)
  console.log("Selected Module Data Array", data);

  const [sortConfig, setSortConfig] = React.useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);

  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [page, setPage] = React.useState(1);

  const paginated = pageSize > 0;

  // For Searching...
  const searchedData = React.useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return data;
    }

    return data.filter((row) =>
      searchFields.some((field) =>
        String(row[field] ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [data, search, searchFields]);

  // For  Sorting....
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return searchedData;

    return [...searchedData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Empty values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Number sorting
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // String sorting
      const result = String(aValue).localeCompare(String(bValue), undefined, {
        sensitivity: "base",
      });

      return sortConfig.direction === "asc" ? result : -result;
    });
  }, [searchedData, sortConfig]);

  const totalPages = paginated
    ? Math.max(1, Math.ceil(sortedData.length / pageSize))
    : 1;

  // never land on a page that doesn't exist (after delete or filter change)
  const currentPage = Math.min(page, totalPages);
  const startIndex = paginated ? (currentPage - 1) * pageSize : 0;

  const pageRows = paginated
    ? sortedData.slice(startIndex, startIndex + pageSize)
    : sortedData;

  // edit form is generated from columns
  const fields: FieldConfig[] = React.useMemo(
    () =>
      columns
        .filter((c) => c.editable !== false)
        .map((c) => ({
          name: c.key,
          label: c.header,
          type: c.type,
          options: c.options,
          required: c.required,
        })),
    [columns],
  );

  const hasActions = !!enableView || !!onEdit || !!onDelete;
  const colCount = columns.length + (onDelete ? 1 : 0);

  const handleSort = (column: Column<T>) => {
    if (!column.isSort) return;

    setPage(1);

    setSortConfig((current) => {
      // Same column → toggle direction
      if (current?.key === column.key) {
        return {
          key: column.key,
          direction: current.direction === "asc" ? "desc" : "asc",
        };
      }
      // New column → start with ascending
      return {
        key: column.key,
        direction: "asc",
      };
    });
  };

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-border/60 bg-primary shadow-sm ring-1 ring-black/[0.02]">
        <div
          className="overflow-x-auto"
          style={
            paginated ? { minHeight: HEADER_H + pageSize * ROW_H } : undefined
          }
        >
          <div className="relative w-full max-w-sm">
            <FormField
              type="search"
              name="search"
              value={search}
              onChange={(value) => {
                setSearch(String(value));
                setPage(1);
              }}
              placeholder="Search..."
              className="p-2"
            />
          </div>

          <Table className="w-full border-separate border-spacing-0">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {/* {columns.map((c) => (
                      <TableHead
                        key={c.key}
                        className={cn(
                          "h-9 whitespace-nowrap border-b border-border/60 bg-muted/40 px-4 text-xs font-semibold tracking-wide text-muted-foreground",
                          c.className,
                        )}
                      >
                        {c.header}
                      </TableHead>
                    ))} */}
                {columns.map((c) => {
                  const isSorted = sortConfig?.key === c.key;

                  return (
                    <TableHead
                      key={c.key}
                      className={cn(
                        // Keep all your original heading styles
                        "h-9 whitespace-nowrap border-b border-border/60 bg-muted/40 px-4 text-xs font-semibold tracking-wide text-muted-foreground",
                        c.className,
                      )}
                    >
                      {c.isSort ? (
                        <button
                          type="button"
                          onClick={() => handleSort(c)}
                          className={cn(
                            "flex w-full items-center gap-1.5 text-left",
                            "cursor-pointer transition-colors",
                            "hover:text-foreground",
                            isSorted && "text-foreground",
                          )}
                        >
                          <span>{c.header}</span>

                          {!isSorted && (
                            <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                          )}

                          {isSorted && sortConfig.direction === "asc" && (
                            <ArrowUp className="h-3.5 w-3.5" />
                          )}

                          {isSorted && sortConfig.direction === "desc" && (
                            <ArrowDown className="h-3.5 w-3.5" />
                          )}
                        </button>
                      ) : (
                        c.header
                      )}
                    </TableHead>
                  );
                })}
                {hasActions && (
                  <TableHead className="h-9 whitespace-nowrap border-b border-border/60 bg-muted/40 px-4 text-center text-xs font-semibold tracking-wide text-muted-foreground">
                    Action
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {searchedData.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={colCount} className="py-16">
                    <div className="flex flex-col items-center gap-3 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Inbox className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {emptyText}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((row, i) => {
                  const index = startIndex + i; // absolute index, so Sr. No continues across pages
                  const isLast = i === pageRows.length - 1; // last row on the current page

                  return (
                    <TableRow key={getRowId(row)} className="group h-11">
                      {columns.map((c) => (
                        <TableCell
                          key={c.key}
                          className={cn(
                            "whitespace-nowrap border-b border-border/40 px-4 py-1.5 text-sm text-foreground/90",
                            isLast && "border-b-0",
                            c.className,
                          )}
                        >
                          {c.cell
                            ? c.cell(row, index)
                            : (row[c.key] as React.ReactNode)}
                        </TableCell>
                      ))}

                      {hasActions && (
                        <TableCell
                          className={cn(
                            "border-b border-border/40 px-4 py-1.5 text-center",
                            isLast && "border-b-0",
                          )}
                          onClick={(e) => e.stopPropagation()}
                          onDoubleClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger>
                              <Button
                                variant="ghost"
                                size="icon"
                                aria-label="Row actions"
                                className="h-7 w-7 cursor-pointer rounded-full text-muted-foreground opacity-60 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:bg-muted data-[state=open]:opacity-100"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="min-w-[8rem] bg-primary"
                              onDoubleClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                            >
                              {enableView && (
                                <DropdownMenuItem
                                  className="cursor-pointer gap-2"
                                  onClick={() => setViewing(row)}
                                >
                                  <Eye className="h-4 w-4" />
                                  View
                                </DropdownMenuItem>
                              )}

                              {onEdit && (
                                <DropdownMenuItem
                                  className="cursor-pointer gap-2"
                                  onClick={() => setEditing(row)}
                                >
                                  <PencilLine className="h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                              )}
                              {onDelete && (
                                <DropdownMenuItem
                                  className="cursor-pointer gap-2 text-danger focus:bg-danger/10 focus:text-danger"
                                  onClick={() => setDeleting(row)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {(data.length > 0 || onEdit) && (
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border/60 bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>
                {data.length} {data.length === 1 ? "record" : "records"}
              </span>

              {paginated && data.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="whitespace-nowrap">Rows per page</span>
                  <FormField
                    type="select"
                    name="pageSize"
                    value={String(pageSize)}
                    options={pageSizeOptions.map((n) => ({
                      label: String(n),
                      value: String(n),
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

            {paginated && totalPages > 1 && (
              <Pagination className="mx-0 w-auto justify-end">
                <PaginationContent className="gap-1">
                  {getPageNumbers(currentPage, totalPages).map((p) =>
                    typeof p === "number" ? (
                      <PaginationItem key={p}>
                        <PaginationLink
                          isActive={p === currentPage}
                          size="icon"
                          aria-label={`Page ${p}`}
                          onClick={() => setPage(p)}
                          className={cn(
                            "size-8 cursor-pointer rounded-lg border text-sm transition-colors",
                            p === currentPage
                              ? "border-button-primary row-dull text-primary"
                              : "border-line bg-primary text-secondary hover:bg-secondary",
                          )}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationEllipsis className="size-8" />
                      </PaginationItem>
                    ),
                  )}
                </PaginationContent>
              </Pagination>
            )}
          </div>
        )}
      </div>

      {enableView && (
        <ViewDialog
          open={!!viewing}
          onOpenChange={(open) => {
            if (!open) {
              setViewing(null);
            }
          }}
          data={viewing}
          title="View Details"
          description="View the complete details."
        />
      )}

      {onEdit && editing && (
        <CommonDialog
          key={String(getRowId(editing))}
          open
          onOpenChange={(o) => !o && setEditing(null)}
          title={editTitle}
          description={editDescription}
          fields={renderEditForm ? undefined : fields}
          defaultValues={editing}
          validate={validate}
          onSubmit={async (values) => {
            await onEdit({ ...editing, ...values }, editing);
          }}
        >
          {renderEditForm}
        </CommonDialog>
      )}

      {onDelete && (
        <ConfirmDialog
          open={!!deleting}
          onOpenChange={(o) => !o && setDeleting(null)}
          onConfirm={async () => {
            if (deleting) await onDelete(deleting);
          }}
        />
      )}
    </>
  );
}
