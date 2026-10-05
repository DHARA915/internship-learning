"use client";

import * as React from "react";
import { Trash2, Inbox, PencilLine, MoreVertical } from "lucide-react";
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

export interface Column<T> {
  key: string;
  header: string;
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
  getRowId?: (row: T) => string | number;
  emptyText?: string;
  /** Pass it -> delete icon appears on each row */
  onDelete?: (row: T) => unknown;
  /** Pass it -> double click opens pre-filled edit modal. Gets the updated row. */
  onEdit?: (updated: T, original: T) => unknown;
  editTitle?: string;
  editDescription?: string;
  /** Optional: your own fields for the edit modal (instead of auto-generated ones) */
  renderEditForm?: React.ComponentProps<typeof CommonDialog>["children"];
  validate?: React.ComponentProps<typeof CommonDialog>["validate"];
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  getRowId = (r) => r.id,
  emptyText = "No records found.",
  onDelete,
  onEdit,
  editTitle = "Edit record",
  editDescription,
  renderEditForm,
  validate,
}: DataTableProps<T>) {
  const [editing, setEditing] = React.useState<T | null>(null);
  const [deleting, setDeleting] = React.useState<T | null>(null);

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

  const hasActions = !!onEdit || !!onDelete;
  const colCount = columns.length + (onDelete ? 1 : 0);

  return (
    <>
      <div className="w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm ring-1 ring-black/[0.02]">
        <div className="overflow-x-auto">
          <Table className="w-full border-separate border-spacing-0">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {columns.map((c) => (
                  <TableHead
                    key={c.key}
                    className={cn(
                      "h-9 whitespace-nowrap border-b border-border/60 bg-muted/40 px-4 text-xs font-semibold tracking-wide text-muted-foreground",
                      c.className,
                    )}
                  >
                    {c.header}
                  </TableHead>
                ))}
                {hasActions && (
                  <TableHead className="h-9 whitespace-nowrap border-b border-border/60 bg-muted/40 px-4 text-center text-xs font-semibold tracking-wide text-muted-foreground">
                    Action
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.length === 0 ? (
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
                data.map((row, index) => (
                  <TableRow
                    key={getRowId(row)}
                    className="group"
                  >
                    {columns.map((c) => (
                      <TableCell
                        key={c.key}
                        className={cn(
                          "whitespace-nowrap border-b border-border/40 px-4 py-1.5 text-sm text-foreground/90",
                          index === data.length - 1 && "border-b-0",
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
                          index === data.length - 1 && "border-b-0",
                        )}
                        onClick={(e) => e.stopPropagation()}
                        onDoubleClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        <DropdownMenu  modal={false}>
                          <DropdownMenuTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Row actions"
                              className="h-7 w-7 cursor-pointer rounded-full text-muted-foreground opacity-60 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100 data-[state=open]:bg-muted data-[state=open]:opacity-100"
                            >
                              <MoreVertical className="h-4 w-4" />{" "}
                              {/* the 3 vertical dots */}
                            </Button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="min-w-[8rem] bg-primary"
                            onDoubleClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                            
                          >
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
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {(data.length > 0 || onEdit) && (
          <div className="flex items-center justify-between gap-6 whitespace-nowrap border-t border-border/60 bg-muted/30 px-4 py-1.5 text-xs text-muted-foreground">
            <span>
              {data.length} {data.length === 1 ? "record" : "records"}
            </span>
          
          </div>
        )}
      </div>

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
