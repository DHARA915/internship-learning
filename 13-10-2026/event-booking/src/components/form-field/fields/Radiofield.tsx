import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import { cn } from "../../../lib/utils";
import { FieldWrapper } from "../Fieldwrapper ";
import type { RadioFieldProps } from "./Types";

export function RadioField({
  name, label, value, onChange, options, orientation = "vertical",
  error, helperText, required, disabled, className,
}: RadioFieldProps) {
  return (
    <FieldWrapper {...{ name, label, required, error, helperText, className }}>
      <RadioGroup
        name={name}
        value={value}
        disabled={disabled}
        onValueChange={(v) => onChange?.(v, name)}
        className={cn(orientation === "horizontal" && "flex flex-wrap gap-4")}
      >
        {options.map((o) => {
          const id = `${name}-${o.value}`;
          return (
            <div key={o.value} className="flex items-center gap-2">
              <RadioGroupItem id={id} value={o.value} disabled={o.disabled} />
              <Label htmlFor={id} className="font-normal">{o.label}</Label>
            </div>
          );
        })}
      </RadioGroup>
    </FieldWrapper>
  );
}