import { useEffect, useRef, useState } from "react";
import { ListFilter, Check, X } from "lucide-react";
import Select, { type SingleValue } from "react-select";
import { cn } from "../lib/utils";

export interface Option<V extends string | number> {
  value: V;
  label: string;
  /** optional number shown next to the label, e.g. how many records */
  count?: number;
}

interface FilterProps<V extends string | number> {
  options: Option<V>[];
  value: V;
  onChange: (value: V) => void;
  /** the "no filter" value (default: the first option, e.g. "All") */
  defaultValue?: V;
  className?: string;
}

export function Filter<V extends string | number>({
  options,
  value,
  onChange,
  defaultValue,
  className,
}: FilterProps<V>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const resetValue = (defaultValue ?? options[0]?.value) as V;
  const isFiltered = value !== resetValue;
  const selected = options.find((o) => o.value === value) ?? null;

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const handleChange = (opt: SingleValue<Option<V>>) => {
    onChange(opt ? opt.value : resetValue);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={cn("relative flex flex-row items-center gap-3", className)}>
        {/* Filter button */}
              {isFiltered && selected && (
  <div className="relative flex items-center text-sm">
  <span className="max-w-[10rem] truncate rounded-md row-dull p-1.5 font-medium text-button-primary">
    {selected.label}
  </span>

  <button
    type="button"
    aria-label="Clear filter"
    onClick={() => onChange(resetValue)}
    className="absolute -right-2 -top-2 flex size-4 cursor-pointer items-center justify-center rounded-full border border-line bg-primary text-tertiary shadow-sm transition-colors hover:bg-tertiary hover:text-primary"
  >
    <X className="size-2.5" />
  </button>
</div>
  )}
<button
  type="button"
  aria-haspopup="listbox"
  aria-expanded={open}
  onClick={() => setOpen((o) => !o)}
  className={cn(
    "flex h-9  shrink-0 cursor-pointer items-center gap-2 rounded-lg border border-button-primary px-3 text-sm font-medium text-primary transition-colors",
    open || isFiltered ? "row-dull" : "bg-primary hover:bg-secondary",
  )}
>
  <ListFilter className="size-4 text-button-primary" />
  <span className="text-button-primary">
  Filter
  </span>
    
</button>
      {/* panel with searchable select */}
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-64 rounded-xl border border-line bg-primary p-2 shadow-lg scrollbar-hide ">
          <Select<Option<V>, false>
            unstyled
            autoFocus
            menuIsOpen
            isSearchable
            hideSelectedOptions={false}
            controlShouldRenderValue={false}
            options={options}
            value={selected}
            onChange={handleChange}
            placeholder="Search..."
            noOptionsMessage={() => "No results"}
            getOptionValue={(o) => String(o.value)}
            components={{
              DropdownIndicator: null,
              IndicatorSeparator: null,
            }}
            formatOptionLabel={(o) => (
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Check
                    className={cn(
                      "size-3.5",
                      o.value === value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {o.label}
                </span>
                {/* {o.count !== undefined && (
                  <span className="rounded-full bg-tertiary px-1.5 text-xs leading-5 text-tertiary">
                    {o.count}
                  </span>
                )} */}
              </div>
            )}
            // keep the menu inside the panel instead of floating
            styles={{
              menu: (base) => ({
                ...base,
                position: "static",
                boxShadow: "none",
              }),
            }}
            classNames={{
              control: () =>
                "min-h-9 rounded-lg border border-line bg-secondary px-2 text-sm",
              valueContainer: () => "gap-1 py-1",
              input: () => "text-primary",
              placeholder: () => "text-tertiary",
              menu: () => "mt-2",
              menuList: () => "max-h-60 overflow-y-auto scrollbar-hide",
              option: (s) =>
                cn(
                  "cursor-pointer rounded-md px-2 py-1.5 text-sm",
                  s.isSelected
                    ? "row-dull text-primary"
                    : s.isFocused
                      ? "bg-secondary text-primary"
                      : "text-secondary",
                ),
              noOptionsMessage: () => "px-2 py-2 text-sm text-tertiary",
            }}
          />

          {isFiltered && (
            <button
              type="button"
              onClick={() => handleChange(null)}
              className="mt-2 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-line py-1.5 text-sm text-secondary transition-colors hover:bg-secondary"
            >
              <X className="size-3.5" />
              Clear filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}