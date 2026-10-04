"use client";

import * as React from "react";
import { Trash2, Inbox, PencilLine } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { cn } from "../lib/utils";
import { CommonDialog, type FieldConfig, type FieldType } from "../components/CommonDialog";
import { ConfirmDialog } from "./ConfirmDialog";

export interface Column<T> {
  key: string;
  header: string;
  /** custom display in the table only */
  cell?: (row: T, index: number) => React.ReactNode;
  className?: string;

  /** edit-form settings (all optional) */
  type?: FieldType;                       // default "text"
  options?: FieldConfig["options"];       // for type "select"
  required?: boolean;
  editable?: boolean;                     // false -> not shown in edit form (id, createdAt...)
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
  columns, data, getRowId = (r) => r.id, emptyText = "No records found.",
  onDelete, onEdit, editTitle = "Edit record", editDescription,
  renderEditForm, validate,
}: DataTableProps<T>) {
  const [editing, setEditing] = React.useState<T | null>(null);
  const [deleting, setDeleting] = React.useState<T | null>(null);

  // edit form is generated from columns
  const fields: FieldConfig[] = React.useMemo(
    () =>
      columns
        .filter((c) => c.editable !== false)
        .map((c) => ({
          name: c.key, label: c.header, type: c.type,
          options: c.options, required: c.required,
        })),
    [columns]
  );

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
                      c.className
                    )}
                  >
                    {c.header}
                  </TableHead>
                ))}
                {onDelete && (
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
                      <p className="text-sm text-muted-foreground">{emptyText}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow
                    key={getRowId(row)}
                    tabIndex={onEdit ? 0 : undefined}
                    title={onEdit ? "Double-click to edit" : undefined}
                    onDoubleClick={() => onEdit && setEditing(row)}
                    onKeyDown={(e) => e.key === "Enter" && onEdit && setEditing(row)}
                   className={cn(
  "group border-0 transition-colors duration-150",
  "hover:bg-hover",
  "focus-visible:row-dull",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40",
  onEdit && "cursor-pointer select-none"
)}
                  >
                    {columns.map((c) => (
                      <TableCell
                        key={c.key}
                        className={cn(
                          "whitespace-nowrap border-b border-border/40 px-4 py-1.5 text-sm text-foreground/90",
                          index === data.length - 1 && "border-b-0",
                          c.className
                        )}
                      >
                        {c.cell ? c.cell(row, index) : (row[c.key] as React.ReactNode)}
                      </TableCell>
                    ))}
                    {onDelete && (
                      <TableCell
                        className={cn(
                          "border-b border-border/40 px-4 py-1.5 text-center",
                          index === data.length - 1 && "border-b-0"
                        )}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete row"
                          className="h-7 w-7 cursor-pointer rounded-full text-danger opacity-60 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100 focus-visible:opacity-100"
                          onClick={(e) => { e.stopPropagation(); setDeleting(row); }}
                          onDoubleClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
            {onEdit && data.length > 0 && (
              <span className="flex items-center gap-1.5">
                <PencilLine className="h-3.5 w-3.5" />
                Double-click a row to edit
              </span>
            )}
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

      {/* {onDelete && (
        <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
          <AlertDialogContent className="max-w-md rounded-2xl border-border/60 bg-card p-6 shadow-xl">
            <AlertDialogHeader className="gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/10 text-danger">
                <Trash2 className="h-5 w-5" />
              </div>
              <div className="space-y-1.5">
                <AlertDialogTitle className="text-lg font-semibold">
                  Delete this record?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm leading-relaxed">
                  This permanently removes the record and can't be undone.
                </AlertDialogDescription>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-2 gap-2">
              <AlertDialogCancel
                variant="outline"
                size="default"
                className="cursor-pointer rounded-lg"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="default"
                size="default"
                className="cursor-pointer rounded-lg bg-danger text-white shadow-sm hover:bg-danger/90"
                onClick={async () => {
                  if (deleting) await onDelete(deleting);
                  setDeleting(null);
                }}
              >
                Delete record
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )} */}
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