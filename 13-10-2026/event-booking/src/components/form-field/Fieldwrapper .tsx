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
    <div className={cn("flex flex-col justify-start w-full gap-2", className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="ml-0.5 text-brand">*</span>}
        </Label>
      )}
      {children}
            {/* always rendered, so the field height never changes */}
     {error ?  <p
        id={`${name}-error`}
        role={error ? "alert" : undefined}
        className={cn(
          " text-xs leading-4",
          error ? "text-danger" : "text-tertiary"
        )}
      >
        {error ?? helperText}
      </p>: <></>}
    </div>
  );
}