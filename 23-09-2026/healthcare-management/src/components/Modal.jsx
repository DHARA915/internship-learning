
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Modal
 *
 * A form modal built on shadcn's Dialog, styled against the app's
 * teal/slate token system (--card, --border, --primary, --muted-foreground …).
 *
 * fields: [{ name, label, type, placeholder, required, description, wide }]
 * Set wide: true on a field to have it span both columns.
 * onSubmit: (data: Record<string, string>) => void
 */
const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  fields = [],
  onSubmit,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  initialData={}//for edit mode auto fill stored data
}) => {

  const [formData,setFormData]=useState({})

const handleSubmit = (e) => {
  e.preventDefault();

  console.log("Data from Modal Component:", formData);

  onSubmit?.(formData);
};


useEffect(() => {
  if (open) {
    const values = {};

    fields.forEach((field) => {
      values[field.name] = initialData?.[field.name] ?? "";
    });

    setFormData(values);
  }
}, [open, initialData, fields]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-xl border border-border bg-card p-0 text-card-foreground shadow-lg sm:max-w-2xl">
        <form onSubmit={handleSubmit}>
            <DialogHeader className="space-y-1.5 border-b border-border px-8 py-5 text-left">
              <DialogTitle className="text-lg font-semibold leading-none tracking-tight text-foreground">
                {title}
              </DialogTitle>

              {description && (
                <DialogDescription className="text-sm text-muted-foreground">
                  {description}
                </DialogDescription>
              )}
            </DialogHeader>

          <FieldGroup className="grid grid-cols-2 gap-x-6 gap-y-5 px-8 py-6">
            {fields.map((field) => (
              <Field
                key={field.name}
                className={`gap-1.5 ${field.wide ? "col-span-2" : ""}`}
              >
                <Label
                  htmlFor={field.name}
                  className="flex items-center gap-1.5 text-sm font-medium text-foreground"
                >
                  {field.label}
                  {field.required && (
                    <span
                      aria-hidden="true"
                      className="inline-block h-1 w-1 rounded-full bg-primary"
                    />
                  )}
                </Label>

                <Input
                  id={field.name}
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  required={field.required}
                   value={formData[field.name] ?? ""}
                    onChange={(e) => {
    setFormData((prev) => ({
      ...prev,
      [field.name]: e.target.value,
    }));
  }}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-primary/30"
                />

                {field.description && (
                  <p className="text-xs text-muted-foreground">
                    {field.description}
                  </p>
                )}
              </Field>
            ))}
          </FieldGroup>

          <DialogFooter className="gap-2 border-t border-border bg-muted/40 px-8 py-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border text-secondary-foreground hover:bg-secondary"
            >
              {cancelLabel}
            </Button>

            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;