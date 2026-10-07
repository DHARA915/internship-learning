import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface ViewDialogProps<T extends Record<string, any>> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: T | null;
  title?: string;
  description?: string;

  /**
   * Fields that should not be displayed.
   */
  excludeFields?: string[];
}

const formatLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .replace(/_/g, " ");
};

const formatValue = (value: unknown): React.ReactNode => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "—";
    }

    return (
      <div className="space-y-2">
        {value.map((item, index) => (
          <div
            key={index}
            className="rounded-lg border border-border/60 bg-muted/30 p-3"
          >
            {typeof item === "object" && item !== null ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(item).map(([key, value]) => {
                  if (key === "id") return null;

                  return (
                    <div key={key}>
                      <p className="text-xs font-medium text-muted-foreground">
                        {formatLabel(key)}
                      </p>

                      <div className="mt-1 text-sm text-foreground">
                        {formatValue(value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-foreground">
                {formatValue(item)}
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.entries(value as Record<string, unknown>).map(
          ([key, value]) => {
            if (key === "id") return null;

            return (
              <div key={key}>
                <p className="text-xs font-medium text-muted-foreground">
                  {formatLabel(key)}
                </p>

                <div className="mt-1 text-sm text-foreground">
                  {formatValue(value)}
                </div>
              </div>
            );
          },
        )}
      </div>
    );
  }

  return String(value);
};

export function ViewDialog<T extends Record<string, any>>({
  open,
  onOpenChange,
  data,
  title = "View Details",
  description = "View the complete details.",
  excludeFields = ["id", "srNo"],
}: ViewDialogProps<T>) {
  if (!data) return null;

  const visibleFields = Object.entries(data).filter(
    ([key]) => !excludeFields.includes(key),
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto bg-primary">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>

          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          {visibleFields.map(([key, value]) => (
            <div
              key={key}
              className="rounded-lg border border-border/60 bg-muted/20 p-3"
            >
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                {formatLabel(key)}
              </p>

              <div className="text-sm text-foreground">
                {formatValue(value)}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}