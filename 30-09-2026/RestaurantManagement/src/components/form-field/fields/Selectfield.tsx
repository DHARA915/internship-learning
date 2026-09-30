import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { FieldWrapper } from "../Fieldwrapper ";
import type { SelectFieldProps } from "./Types";

export function SelectField({
  name,
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  error,
  helperText,
  required,
  disabled,
  className,
}: SelectFieldProps) {
  return (
    <FieldWrapper {...{ name, label, required, error, helperText, className }}>
      <Select
        name={name}
        value={value || undefined}
        disabled={disabled}
        onValueChange={(v) => onChange?.(v ?? "", name)}
      >
        <SelectTrigger id={name} aria-invalid={!!error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value} disabled={o.disabled}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldWrapper>
  );
}
