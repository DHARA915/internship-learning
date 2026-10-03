"use client";

import * as React from "react";
import { Loader2, Trash2, type LucideIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import { cn } from "../lib/utils";

interface ConfirmDialogProps {
  /** Dialog is open while this is true */
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" (default) for destructive actions, "default" for normal confirms */
  variant?: "danger" | "default";
  icon?: LucideIcon;

  /** Runs on confirm; dialog closes after it finishes */
  onConfirm: () => void | Promise<void>;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Delete this record?",
  description = "This permanently removes the record and can't be undone.",
  confirmLabel = "Delete record",
  cancelLabel = "Cancel",
  variant = "danger",
  icon: Icon = Trash2,
  onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const isDanger = variant === "danger";

  async function handleConfirm(e: React.MouseEvent) {
    // keep dialog open until the async action finishes
    e.preventDefault();
    setLoading(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={(o) => !loading && onOpenChange(o)}>
      <AlertDialogContent className="gap-0 overflow-hidden rounded-2xl border-line bg-primary p-0 shadow-xl sm:max-w-md">
        <AlertDialogHeader className="gap-4 px-6 pb-5 pt-6 text-left">
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full",
              isDanger ? "bg-danger/10 text-danger" : "bg-brand-soft text-brand"
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <AlertDialogTitle className="text-lg font-semibold leading-6 tracking-tight text-primary">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-secondary">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2 border-t border-line bg-primary px-6 py-4 sm:justify-end">
          <div className="flex gap-1.5">
            <AlertDialogCancel
              disabled={loading}
              className="mt-0 cursor-pointer rounded-lg border-line bg-tertiary text-primary"
            >
              {cancelLabel}
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={loading}
              onClick={handleConfirm}
              className={cn(
                "cursor-pointer rounded-lg shadow-sm",
                isDanger
                  ? "bg-danger text-white hover:bg-danger/90"
                  : "bg-button-primary text-on-brand hover:bg-success-soft"
              )}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {confirmLabel}
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/* ------------------------------------------------------------------
   Usage

   const [deleting, setDeleting] = React.useState<Row | null>(null);

   <Button onClick={() => setDeleting(row)}>Delete</Button>

   <ConfirmDialog
     open={!!deleting}
     onOpenChange={(o) => !o && setDeleting(null)}
     onConfirm={async () => {
       if (deleting) await onDelete(deleting);
     }}
   />

   // custom text
   <ConfirmDialog
     open={open}
     onOpenChange={setOpen}
     title="Remove this user?"
     description="They will lose access immediately."
     confirmLabel="Remove user"
     onConfirm={removeUser}
   />
------------------------------------------------------------------- */