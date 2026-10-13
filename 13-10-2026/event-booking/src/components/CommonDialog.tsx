"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormField from "./form-field/FormField";
import type { FormFieldProps } from "@/components/form-field/fields/Types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "cn";

// Always the same types FormField accepts, so the two can never drift apart
export type FieldType = NonNullable<FormFieldProps["type"]>;

export type FormValues = Record<string, any>;
export type FormErrors = Record<string, string>;

export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  options?: { label: string; value: string }[]; // select / radio / multiselect
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  /** Helper text under the field. */
  hint?: string;
  /** For number fields: validated automatically. */
  min?: number;
  max?: number;
  /** Groups fields under a heading, e.g. "Schedule". */
  section?: string;
  /** "full" takes the whole row. Textarea and checkbox are always full. */
  span?: "half" | "full";
  /** Hide the field (and skip its validation) until this returns true. */
  visibleWhen?: (values: FormValues) => boolean;
}

interface CommonDialogProps {
  title: string;
  description?: string;
  /** Optional icon shown in a tile next to the title. */
  icon?: React.ReactNode;

  open: boolean;
  onOpenChange: (open: boolean) => void;

  fields?: FieldConfig[];
  /** The form starts from these values every time the dialog opens. */
  defaultValues?: FormValues;
  /** Extra or fully custom content. Gets live values + setValue. */
  children?:
    | React.ReactNode
    | ((context: {
        values: FormValues;
        setValue: (name: string, value: any) => void;
        errors: FormErrors;
      }) => React.ReactNode);
  /** Return { fieldName: "message" } to block submit. */
  validate?: (values: FormValues) => FormErrors | void;

  /** Receives all values. The dialog closes after it finishes. */
  onSubmit: (values: FormValues) => void | Promise<void>;
  saveLabel?: string;
  cancelLabel?: string;
  /** Use "destructive" for delete confirmations. */
  saveVariant?: "primary" | "destructive";
}

const isEmpty = (value: unknown) =>
  value === undefined || value === null || value === "";

export function CommonDialog({
  title,
  description,
  icon,
  open,
  onOpenChange,
  fields = [],
  defaultValues = {},
  children,
  validate,
  onSubmit,
  saveLabel = "Save changes",
  cancelLabel = "Cancel",
  saveVariant = "primary",
}: CommonDialogProps) {
  const [values, setValues] = React.useState<FormValues>(defaultValues);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSaving, setIsSaving] = React.useState(false);

  // Every time the dialog opens, start from the latest default values
  React.useEffect(() => {
    if (open) {
      setValues(defaultValues);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const setValue = (name: string, value: any) => {
    setValues((previousValues) => ({ ...previousValues, [name]: value }));
    setErrors((previousErrors) => ({ ...previousErrors, [name]: "" }));
  };

  const visibleFields = fields.filter(
    (field) => !field.visibleWhen || field.visibleWhen(values),
  );

  const validateFields = (): FormErrors => {
    const nextErrors: FormErrors = {};

    visibleFields.forEach((field) => {
      const value = values[field.name];

      if (field.required && isEmpty(value)) {
        nextErrors[field.name] = `${field.label} is required`;
        return;
      }

      if (field.type === "number" && !isEmpty(value)) {
        if (field.min !== undefined && value < field.min) {
          nextErrors[field.name] =
            `${field.label} must be at least ${field.min}`;
        } else if (field.max !== undefined && value > field.max) {
          nextErrors[field.name] =
            `${field.label} must be at most ${field.max}`;
        }
      }
    });

    return { ...nextErrors, ...(validate?.(values) ?? {}) };
  };

  async function handleSubmit(submitEvent: React.FormEvent) {
    submitEvent.preventDefault();

    const nextErrors = validateFields();
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    setIsSaving(true);
    try {
      await onSubmit(values);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }

  const hasBody = visibleFields.length > 0 || !!children;
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

          {hasBody && (
            <div className="max-h-[60vh] overflow-y-auto border-t border-line px-6 py-5">
              {visibleFields.length > 0 && (
                <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
                  {visibleFields.map((field, fieldIndex) => {
                    const previousSection =
                      visibleFields[fieldIndex - 1]?.section;
                    const showSection =
                      !!field.section && field.section !== previousSection;
                    const isFullWidth =
                      field.span === "full" ||
                      field.type === "textarea" ||
                      field.type === "checkbox";

                    return (
                      <React.Fragment key={field.name}>
                        {showSection && (
                          <h3
                            className={cn(
                              "text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:col-span-2",
                              fieldIndex > 0 && "mt-2",
                            )}
                          >
                            {field.section}
                          </h3>
                        )}
                        <div className={cn(isFullWidth && "sm:col-span-2")}>
                          <FormField
                            {...({
                              type: field.type ?? "mySelect",
                              name: field.name,
                              label: field.label,
                              value: values[field.name],
                              onChange: (nextValue: any) =>
                                setValue(
                                  field.name,
                                  field.type === "number" && nextValue !== ""
                                    ? Number(nextValue)
                                    : nextValue,
                                ),
                              placeholder: field.placeholder,
                              options: field.options,
                              required: field.required,
                              disabled: field.disabled,
                              helperText: field.hint,
                              min: field.min,
                              max: field.max,
                              error: errors[field.name],
                            } as FormFieldProps)}
                          />
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {children && (
                <div
                  className={cn(
                    "grid gap-4",
                    visibleFields.length > 0 && "mt-5",
                  )}
                >
                  {typeof children === "function"
                    ? children({ values, setValue, errors })
                    : children}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <DialogFooter
            className={cn(
              "flex-row justify-end gap-2 bg-tertiary px-6 py-4",
              hasBody && "border-t border-line",
            )}
          >
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              {cancelLabel}
            </Button>
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
