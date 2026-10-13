import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { cn } from "../../../lib/utils";
import type { CheckboxFieldProps } from "./Types";

export function CheckboxField({
  name, label, value = false, onChange, error, helperText,
  required, disabled, className,
}: CheckboxFieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <div className="flex items-center gap-2">
        <Checkbox
          id={name}
          name={name}
          checked={value}
          disabled={disabled}
          onCheckedChange={(c) => onChange?.(c === true, name)}
        />
        {label && (
          <Label htmlFor={name} className="font-normal">
            {label}
            {required && <span className="ml-0.5 text-destructive">*</span>}
          </Label>
        )}
      </div>
      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : helperText ? (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      ) : null}
    </div>
  );
}