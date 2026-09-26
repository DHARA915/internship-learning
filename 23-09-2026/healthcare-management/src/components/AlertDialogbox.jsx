

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AlertDialogbox = ({
  open,
  onOpenChange,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent
        className="
          max-w-md
          rounded-xl
          border
          border-border
          bg-card
          p-0
          text-card-foreground
          shadow-lg
        "
      >
        {/* Header */}
       <AlertDialogHeader
  className="
    space-y-1.5
    px-6
    py-5
    text-left
  "
>
  <AlertDialogTitle className="text-lg font-semibold text-foreground">
    {title}
  </AlertDialogTitle>

  <AlertDialogDescription className="text-sm leading-5 text-muted-foreground">
    {description}
  </AlertDialogDescription>
</AlertDialogHeader>

<AlertDialogFooter
  className="
    mt-0
    border-t
    border-border
    bg-muted/40
    px-6
    pt-4
    pb-6
    gap-2
    sm:justify-end
  "
>
  <AlertDialogCancel
    className="
      bg-background
      text-foreground
      hover:bg-secondary
      hover:text-foreground
    "
  >
    {cancelText}
  </AlertDialogCancel>

  <AlertDialogAction
    onClick={onConfirm}
    className="
      bg-danger
      text-white
      hover:bg-danger/90
    "
  >
    {confirmText}
  </AlertDialogAction>
</AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogbox;

