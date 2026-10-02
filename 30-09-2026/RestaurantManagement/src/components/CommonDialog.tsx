"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {cn} from "../lib/utils";

export type FieldType =
  | "text" | "number" | "email" | "date" | "password"
  | "textarea" | "select" | "checkbox";
 
export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  options?: { label: string; value: string }[]; // for select
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}
 
export type FormValues = Record<string, any>;
 
interface CommonDialogProps {
  title: string;
  description?: string;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
 
  /** Auto-generated fields (name, label, type) */
  fields?: FieldConfig[];
  /** Previous data: form opens pre-filled with this */
  defaultValues?: FormValues;
  /** Extra / fully custom content. Gets live values + setValue */
  children?:
    | React.ReactNode
    | ((ctx: {
        values: FormValues;
        setValue: (k: string, v: any) => void;
        errors: Record<string, string>;
      }) => React.ReactNode);
  /** Return { fieldName: "message" } to block submit (works with custom children too) */
  validate?: (values: FormValues) => Record<string, string> | void;
 
  /** Receives all values; dialog closes after it finishes */
  onSubmit: (values: FormValues) => void | Promise<void>;
  saveLabel?: string;
  cancelLabel?: string;
}
 
const inputBase =
  "h-10 rounded-lg border-line bg-primary px-3 text-sm text-primary shadow-none transition-colors " +
  "placeholder:text-tertiary focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20";
 
export function CommonDialog({
  title,
  description,
  trigger,
  open: openProp,
  onOpenChange,
  fields = [],
  defaultValues = {},
  children,
  validate,
  onSubmit,
  saveLabel = "Save changes",
  cancelLabel = "Cancel",
}: CommonDialogProps) {
  const [openState, setOpenState] = React.useState(false);
  const [values, setValues] = React.useState<FormValues>(defaultValues);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(false);
 
  const open = openProp ?? openState;
  const setOpen = (v: boolean) => {
    setOpenState(v);
    onOpenChange?.(v);
  };
 
  // every time the dialog opens, start from the latest previous data
  React.useEffect(() => {
    if (open) {
      setValues(defaultValues);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
 
  const setValue = (k: string, v: any) => {
    setValues((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };
 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    fields.forEach((f) => {
      const v = values[f.name];
      if (f.required && (v === undefined || v === null || v === "")) {
        errs[f.name] = `${f.label} is required`;
      }
    });
    Object.assign(errs, validate?.(values) ?? {});
    setErrors(errs);
    if (Object.keys(errs).some((k) => errs[k])) return;
 
    setLoading(true);
    try {
      await onSubmit(values);
      setOpen(false);
    } finally {
      setLoading(false);
    }
  }
 
  const hasBody = fields.length > 0 || !!children;
 
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-line bg-primary p-0 shadow-xl sm:max-w-xl">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col">
          <DialogHeader className="space-y-1 px-6 pb-4 pt-6 text-left">
            <DialogTitle className="text-lg font-semibold tracking-tight text-primary">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm leading-relaxed text-secondary">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
 
          {hasBody && (
            <div className="max-h-[60vh] overflow-y-auto border-t border-line px-6 py-5">
              {fields.length > 0 && (
                <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
                  {fields.map((f) => (
                    <FieldRenderer
                      key={f.name}
                      field={f}
                      value={values[f.name]}
                      error={errors[f.name]}
                      onChange={(v) => setValue(f.name, v)}
                    />
                  ))}
                </div>
              )}
              {children && (
                <div className={cn("grid gap-4", fields.length > 0 && "mt-5")}>
                  {typeof children === "function"
                    ? children({ values, setValue, errors })
                    : children}
                </div>
              )}
            </div>
          )}
 
          <DialogFooter className="gap-2 border-t border-line bg-primary px-6 py-4 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="cursor-pointer rounded-lg border-line bg-tertiary text-Primary  "
            >
              {cancelLabel}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="cursor-pointer rounded-lg bg-button-primary mb-2 text-on-brand shadow-sm hover:bg-success-soft"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saveLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
 
function FieldRenderer({
  field: f,
  value,
  error,
  onChange,
}: {
  field: FieldConfig;
  value: any;
  error?: string;
  onChange: (v: any) => void;
}) {
  const id = `field-${f.name}`;
  const type = f.type ?? "text";
  const invalid = !!error;
  const invalidCls = invalid
    ? "border-danger/60 focus-visible:border-danger focus-visible:ring-danger/20"
    : "";
 
  if (type === "checkbox") {
    return (
      <div className="sm:col-span-2">
        <label
          htmlFor={id}
          className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3 py-2.5 transition-colors hover:bg-secondary"
        >
          <Checkbox
            id={id}
            checked={!!value}
            disabled={f.disabled}
            className="border-line-strong data-[state=checked]:border-brand data-[state=checked]:bg-brand data-[state=checked]:text-on-brand"
            onCheckedChange={(c) => onChange(c === true)}
          />
          <span className="text-sm font-medium text-primary">{f.label}</span>
        </label>
        {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
      </div>
    );
  }
 
  let control: React.ReactNode;
  if (type === "textarea") {
    control = (
      <Textarea
        id={id}
        rows={4}
        value={value ?? ""}
        placeholder={f.placeholder}
        disabled={f.disabled}
        aria-invalid={invalid}
        onChange={(e) => onChange(e.target.value)}
        className={cn(inputBase, "h-auto min-h-[96px] resize-y py-2.5", invalidCls)}
      />
    );
  } else if (type === "select") {
    control = (
      <Select
        value={value != null && value !== "" ? String(value) : undefined}
        onValueChange={onChange}
        disabled={f.disabled}
      >
        <SelectTrigger id={id} aria-invalid={invalid} className={cn(inputBase, "w-full", invalidCls)}>
          <SelectValue placeholder={f.placeholder ?? "Select an option"} />
        </SelectTrigger>
        <SelectContent className="rounded-lg border-line bg-primary text-primary">
          {f.options?.map((o) => (
            <SelectItem key={o.value} value={o.value} className="cursor-pointer focus:bg-brand-soft focus:text-brand">
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  } else {
    control = (
      <Input
        id={id}
        type={type}
        value={value ?? ""}
        placeholder={f.placeholder}
        disabled={f.disabled}
        aria-invalid={invalid}
        onChange={(e) =>
          onChange(
            type === "number" && e.target.value !== ""
              ? Number(e.target.value)
              : e.target.value
          )
        }
        className={cn(inputBase, invalidCls)}
      />
    );
  }
 
  return (
    <div className={cn("grid content-start gap-1.5", type === "textarea" && "sm:col-span-2")}>
      <Label htmlFor={id} className="text-sm font-medium text-secondary">
        {f.label}
        {f.required && <span className="ml-0.5 text-danger">*</span>}
      </Label>
      {control}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
 