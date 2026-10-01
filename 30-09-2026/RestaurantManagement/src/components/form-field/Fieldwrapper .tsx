import * as React from "react";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";

interface FieldWrapperProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  children: React.ReactNode;
}

/** Label + error + helper text, shared by all fields */
export function FieldWrapper({
  name,
  label,
  required,
  error,
  helperText,
  className,
  children,
}: FieldWrapperProps) {
  return (
    <div className={cn("grid w-full gap-1.5", className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
      )}
      {children}
      {error ? (
        <p id={`${name}-error`} className=" text-danger text-sm text-destructive">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}