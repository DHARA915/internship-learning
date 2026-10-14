"use client";

import * as React from "react";
import { Loader2, type LucideIcon } from "lucide-react";
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
  title = "",
  description = "",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  icon: Icon,
  onConfirm,
}: ConfirmDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const isDanger = variant === "danger";

  async function handleConfirm(e: React.MouseEvent) {
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
      {/* "!" forces the white card colour even if alert-dialog.tsx sets its own background */}
      <AlertDialogContent className="gap-0 overflow-hidden rounded-2xl border border-line bg-card! p-0 shadow-xl sm:max-w-md">
        <AlertDialogHeader className="flex-row items-start gap-4 p-6 pb-5 text-left">
          {Icon && (
            <div
              aria-hidden="true"
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                isDanger
                  ? "bg-danger-soft text-danger"
                  : "bg-muted text-foreground",
              )}
            >
              <Icon className="size-5" />
            </div>
          )}

          <div className="min-w-0 space-y-1.5">
            <AlertDialogTitle className="text-lg font-semibold leading-6 tracking-tight text-foreground">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        {/* Same white surface as the body: no tinted strip, no divider */}
        <AlertDialogFooter className="flex-col-reverse gap-2 bg-card px-6  py-3 sm:flex-row  sm:justify-end">
          <AlertDialogCancel
            disabled={loading}
            className="mt-0 rounded-lg border-line-strong bg-card text-foreground shadow-none hover:bg-muted"
          >
            {cancelLabel}
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={handleConfirm}
            className={cn(
              "rounded-lg shadow-sm",
              isDanger
                ? "bg-danger text-white hover:bg-danger/90 focus-visible:outline-danger"
                : "bg-button-primary text-primary-foreground hover:bg-button-primary-hover",
            )}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}


