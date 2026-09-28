import React from "react";
import { X } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const CommonDrawer = ({
  trigger,
  title,
  description,
  children,
  footer,
  showCloseButton = true, // "Cancel" button in footer
  closeLabel = "Close",
  open,
  onOpenChange,
}) => {
  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}

      <DrawerContent
        style={{
          left: "auto",
          right: 0,
          top: 0,
          bottom: 0,
          marginTop: 0,
          height: "100dvh",
          maxHeight: "100dvh",
          borderRadius: 0,
        }}
        className="
          fixed inset-y-0 right-0 left-auto top-0 bottom-0 mt-0
          h-full w-full sm:max-w-md
          rounded-none rounded-l-2xl
          border-0 border-l border-border
          bg-background p-0 outline-none
          shadow-[-8px_0_30px_-12px_rgba(0,0,0,0.25)]
          [&>div:first-child:not([class*='flex'])]:hidden
        "
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <DrawerHeader className="relative border-b border-border px-6 py-5 !text-left">
            <div className="pr-10 text-left">
              <DrawerTitle className="text-lg font-semibold leading-snug text-tertiary">
                {title}
              </DrawerTitle>

              {description && (
                <DrawerDescription className="mt-1 text-sm leading-relaxed text-secondary">
                  {description}
                </DrawerDescription>
              )}
            </div>

            {/* Close icon */}
            <DrawerClose asChild>
              <button
                type="button"
                aria-label="Close drawer"
                className="
                  absolute right-4 top-4
                  inline-flex h-9 w-9 items-center justify-center
                  rounded-full text-secondary
                  transition-colors
                  hover:bg-secondary hover:text-tertiary
                  focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-tertiary focus-visible:ring-offset-2
                "
              >
                <X className="h-5 w-5" />
              </button>
            </DrawerClose>
          </DrawerHeader>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>

          {/* Sticky footer */}
          {footer && (
            <DrawerFooter className="flex-col gap-3 border-t border-border bg-secondary/40 px-6 py-4">
              {footer}

              {showCloseButton && (
                <DrawerClose asChild>
                  <button
                    type="button"
                    className="
                      w-full rounded-lg border border-border bg-background
                      px-4 py-2.5 text-sm font-semibold text-tertiary
                      transition-colors hover:bg-secondary
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-tertiary focus-visible:ring-offset-2
                    "
                  >
                    {closeLabel}
                  </button>
                </DrawerClose>
              )}
            </DrawerFooter>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CommonDrawer;

/* ---------- Usage ----------

<CommonDrawer
  trigger={<button className="rounded-lg bg-tertiary px-4 py-2 text-white">Open</button>}
  title="Edit profile"
  description="Update your details and save."
  footer={
    <button className="w-full rounded-lg bg-tertiary px-4 py-2.5 text-sm font-semibold text-white">
      Save changes
    </button>
  }
>
  <form className="space-y-4">...</form>
</CommonDrawer>

*/