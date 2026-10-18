"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "cn";

type SubmitResult = void | boolean | Promise<void | boolean>;

/** Error message per field name, shared by every form that uses CommonDialog. */
export type FormErrors = Record<string, string | undefined>;

interface CommonDialogProps {
  title: string;
  description?: string;
  /** Optional icon shown in a tile next to the title. */
  icon?: React.ReactNode;

  open: boolean;
  onOpenChange: (open: boolean) => void;

  /** Anything you want in the body: form fields, text, etc. */
  children?: React.ReactNode;

  /**
   * Called when the footer submit button is pressed (or Enter in a field).
   * Return `false` to keep the dialog open (e.g. validation failed).
   * Otherwise the dialog closes when it finishes.
   */
  onSubmit: () => SubmitResult;
  saveLabel?: string;
  cancelLabel?: string;
  /** Use "destructive" for delete-style actions. */
  saveVariant?: "primary" | "destructive";

  /** Optional. When passed, a Back button is shown on the left of the footer. */
  onBack?: () => void;
  backLabel?: string;
  /** Hide the Cancel button (e.g. on a final "Done" step). */
  hideCancel?: boolean;

  /**
   * Optional. When passed, a Draft button is shown in the footer.
   * Return `false` to keep the dialog open (e.g. validation failed).
   */
  onSaveDraft?: () => SubmitResult;
  draftLabel?: string;
}

export function CommonDialog({
  title,
  description,
  icon,
  open,
  onOpenChange,
  children,
  onSubmit,
  saveLabel = "Save changes",
  cancelLabel = "Cancel",
  saveVariant = "primary",
  onBack,
  backLabel = "Back",
  hideCancel = false,
  onSaveDraft,
  draftLabel = "Save as draft",
}: CommonDialogProps) {
  const [isSaving, setIsSaving] = React.useState(false);

  async function run(action: () => SubmitResult) {
    setIsSaving(true);
    try {
      const result = await action();
      if (result !== false) onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }

  function handleSubmit(submitEvent: React.FormEvent) {
    submitEvent.preventDefault();
    return run(onSubmit);
  }

  const isDestructive = saveVariant === "destructive";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-line bg-card p-0 shadow-xl sm:max-w-xl">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          {/* Header */}
          <DialogHeader className="flex-row items-start gap-4 px-6 pb-5 pt-6 text-left">
            {icon && (
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl [&_svg]:size-5",
                  isDestructive
                    ? "bg-danger-soft text-danger"
                    : "bg-brand-soft text-brand",
                )}
                aria-hidden="true"
              >
                {icon}
              </div>
            )}
            <div className="min-w-0 space-y-1">
              <DialogTitle className="text-lg font-semibold leading-6 tracking-tight text-foreground">
                {title}
              </DialogTitle>
              {description && (
                <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </div>
          </DialogHeader>

          {/* Body */}
          {children && (
            <div className="max-h-[60vh] overflow-y-auto  border-t scrollbar-none  border-line px-6 py-5">
              {children}
            </div>
          )}

          {/* Footer: Back | Draft ... Cancel, Save */}
          <DialogFooter
            className={cn(
              "flex-row justify-end gap-2 bg-tertiary px-6 py-4",
              children && "border-t border-line",
            )}
          >
            {/* Only rendered when a back handler is passed */}
            {onBack && (
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={onBack}
                className="mr-auto"
              >
                {backLabel}
              </Button>
            )}

            {/* Only rendered when a draft handler is passed */}
            {onSaveDraft && (
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => run(onSaveDraft)}
                className={cn(!onBack && "mr-auto")}
              >
                {draftLabel}
              </Button>
            )}

            {/* The only Cancel button */}
            {!hideCancel && (
              <Button
                type="button"
                variant="outline"
                disabled={isSaving}
                onClick={() => onOpenChange(false)}
              >
                {cancelLabel}
              </Button>
            )}

            <Button type="submit" variant={saveVariant} disabled={isSaving}>
              {isSaving && <Loader2 className="animate-spin" />}
              {saveLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}