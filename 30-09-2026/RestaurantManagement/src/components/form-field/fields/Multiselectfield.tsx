import { ChevronsUpDown, X } from "lucide-react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../ui/popover";
import { FieldWrapper } from "../Fieldwrapper ";
import type { MultiSelectFieldProps } from "./Types";

const inputCls =
  "min-h-9 rounded-lg border border-line bg-primary text-primary placeholder:text-tertiary";

export function MultiSelectField({
  name,
  label,
  value = [],
  onChange,
  options,
  placeholder = "Select options",
  error,
  helperText,
  required,
  disabled,
  className,
}: MultiSelectFieldProps) {
  const toggle = (v: string) => {
    onChange?.(
      value.includes(v)
        ? value.filter((x) => x !== v)
        : [...value, v],
      name,
    );
  };

  return (
    <FieldWrapper
      {...{
        name,
        label,
        required,
        error,
        helperText,
        className,
      }}
    >
      <Popover>
        <PopoverTrigger
          render={
            <Button
              id={name}
              type="button"
              variant="outline"
              disabled={disabled}
              aria-invalid={!!error}
              className={`${inputCls} w-full justify-between px-3 py-1.5 font-normal hover:bg-primary`}
            />
          }
        >
          <span className="flex min-w-0 flex-1 flex-wrap gap-1">
            {value.length === 0 && (
              <span className="text-tertiary">
                {placeholder}
              </span>
            )}

            {value.map((v) => (
              <Badge
                key={v}
                variant="secondary"
                className="gap-1 rounded-md row-dull text-secondary"
              >
                {options.find((o) => o.value === v)?.label ?? v}

                <X
                  className="size-3 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(v);
                  }}
                />
              </Badge>
            ))}
          </span>

          <ChevronsUpDown className="size-4 shrink-0 text-tertiary" />
        </PopoverTrigger>

        <PopoverContent
          className="w-(--anchor-width) rounded-lg border-line bg-primary p-2 text-primary"
          align="start"
        >
          <div className="grid max-h-60 gap-1 overflow-auto">
            {options.map((o) => {
              const id = `${name}-${o.value}`;

              return (
                <div
                  key={o.value}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 focus-with:row-dull hover:row-dull"
                >
                  <Checkbox
                    id={id}
                    checked={value.includes(o.value)}
                    disabled={o.disabled}
                    onCheckedChange={() => toggle(o.value)}
                  />

                  <Label
                    htmlFor={id}
                    className="flex-1 cursor-pointer text-sm font-normal text-primary"
                  >
                    {o.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  );
}