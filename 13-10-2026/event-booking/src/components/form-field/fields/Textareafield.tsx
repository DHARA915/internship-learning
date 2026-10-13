import { Textarea } from "../../ui/textarea";
import { FieldWrapper } from "../Fieldwrapper ";
import type { TextareaFieldProps } from "./Types";

export function TextareaField({
  name, label, value = "", onChange, onBlur, placeholder, rows = 4,
  error, helperText, required, disabled, className,
}: TextareaFieldProps) {
  return (
    <FieldWrapper {...{ name, label, required, error, helperText, className }}>
      <Textarea
        id={name}
        name={name}
        rows={rows}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        onChange={(e) => onChange?.(e.target.value, name)}
        onBlur={onBlur}
      />
    </FieldWrapper>
  );
}