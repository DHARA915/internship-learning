import { useEffect, useRef, useState } from "react";
import { ListFilter, Check, X } from "lucide-react";
import Select from "react-select";
import { useSearchParams } from "react-router-dom";
import { cn } from "../lib/utils";
import { Button } from "../components/ui/button";

export interface FilterOption<V extends string | number> {
  value: V;
  label: string;
  count?: number;
}

export interface FilterField<V extends string | number = string> {
  key: string;
  label: string;
  options: FilterOption<V>[];
  defaultValue: V;
}

interface FilterProps {
  fields: FilterField[];
  className?: string;
}

export function Filter({ fields, className }: FilterProps) {
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const rootRef = useRef<HTMLDivElement>(null);

  const getValue = (field: FilterField) => {
    return searchParams.get(field.key) ?? String(field.defaultValue);
  };

  const activeFilters = fields.filter(
    (field) => getValue(field) !== String(field.defaultValue)
  );

  const isFiltered = activeFilters.length > 0;

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    setSearchParams(params);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams);

    fields.forEach((field) => {
      params.delete(field.key);
    });

    setSearchParams(params);
  };

  useEffect(() => {
    if (!open) return;

    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative flex flex-row items-center gap-3",
        className
      )}
    >
      {/* Active filter chips */}
      {activeFilters.map((field) => {
        const value = getValue(field);

        const selected = field.options.find(
          (option) => String(option.value) === value
        );

        if (!selected) return null;

        return (
          <div
            key={field.key}
            className="relative flex items-center text-sm"
          >
            <span className="max-w-[10rem] truncate rounded-md row-dull p-1.5 font-medium text-button-primary">
              {field.label}: {selected.label}
            </span>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Clear ${field.label} filter`}
              onClick={() => updateFilter(field.key, "all")}
              className="absolute -right-2 -top-2 size-4 cursor-pointer rounded-full border border-line bg-primary text-tertiary shadow-sm hover:bg-tertiary hover:text-primary"
            >
              <X className="size-2.5" />
            </Button>
          </div>
        );
      })}

      {/* Filter button */}
      <Button
        type="button"
        variant="ghost"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "h-9 shrink-0 cursor-pointer gap-2 rounded-lg border border-button-primary px-3 text-sm font-medium text-primary",
          open || isFiltered
            ? "row-dull"
            : "bg-primary hover:bg-secondary"
        )}
      >
        <ListFilter className="size-4 text-button-primary" />
        <span className="text-button-primary">Filter</span>
      </Button>

      {/* Filter panel */}
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-line bg-primary p-2 shadow-lg">
          <div className="space-y-3">
            {fields.map((field) => {
              const value = getValue(field);

              const selected =
                field.options.find(
                  (option) => String(option.value) === value
                ) ?? null;

              return (
                <div key={field.key} className="space-y-1">
                  <label className="px-1 text-xs font-medium text-tertiary">
                    {field.label}
                  </label>

                  <Select
                    unstyled
                    isSearchable
                    options={field.options}
                    value={selected}
                    onChange={(option) =>
                      updateFilter(
                        field.key,
                        option
                          ? String(option.value)
                          : String(field.defaultValue)
                      )
                    }
                    placeholder={`Search ${field.label}...`}
                    noOptionsMessage={() => "No results"}
                    getOptionValue={(option) =>
                      String(option.value)
                    }
                    components={{
                      DropdownIndicator: null,
                      IndicatorSeparator: null,
                    }}
                    formatOptionLabel={(option) => (
                      <div className="flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2">
                          <Check
                            className={cn(
                              "size-3.5",
                              String(option.value) === value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />

                          {option.label}
                        </span>

                        {option.count !== undefined && (
                          <span className="rounded-full bg-tertiary px-1.5 text-xs leading-5 text-tertiary">
                            {option.count}
                          </span>
                        )}
                      </div>
                    )}
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
                      menuList: () =>
                        "max-h-40 overflow-y-auto scrollbar-hide",
                      option: (state) =>
                        cn(
                          "cursor-pointer rounded-md px-2 py-1.5 text-sm",
                          state.isSelected
                            ? "row-dull text-primary"
                            : state.isFocused
                              ? "bg-secondary text-primary"
                              : "text-secondary"
                        ),
                      noOptionsMessage: () =>
                        "px-2 py-2 text-sm text-tertiary",
                    }}
                  />
                </div>
              );
            })}
          </div>

          {isFiltered && (
            <Button
              type="button"
              variant="ghost"
              onClick={clearAll}
              className="mt-3 h-auto w-full cursor-pointer gap-1.5 rounded-lg border border-line py-1.5 text-sm text-secondary hover:bg-secondary"
            >
              <X className="size-3.5" />
              Clear all filters
            </Button>
          )}
        </div>
      )}
    </div>
  );
}