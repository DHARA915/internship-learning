import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { nanoid } from "@reduxjs/toolkit";
import { Plus, Trash2, Check } from "lucide-react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge.tsx";
import { CommonDialog, type FormValues } from "../../components/CommonDialog";
import { DataTable, type Column } from "../../components/DataTable";
import { FormField } from "../../components/form-field/FormField";
import { cn } from "../../lib/utils";

import { selectActiveModifiers } from "../../Redux/Slices/Modifierslice.ts";
import {
  MODIFIER_TYPE_LABELS,
  type ModifierGroup,
} from "../../utils/Modifierdata";

type Ctx = {
  values: FormValues;
  setValue: (k: string, v: any) => void;
  errors: Record<string, string>;
};

type ItemModifierOption = {
  id: string;
  name: string;
  price: number | "";
};

type ItemModifierGroup = {
  groupId: string | number;
  groupName: string;
  type: string;
  selection: string;
  options: ItemModifierOption[];
};

type GroupOption = {
  label: string;
  value: string;
  count: number;
};

type MenuItemRow = {
  id: string;
  name: string;
  isVeg: boolean;
  image: string;
  description: string;
  modifiers: ItemModifierGroup[];
};

const read = (e: any) => (e?.target ? e.target.value : e);

const vegOptions = [
  { label: "Veg", value: "true" },
  { label: "Non-Veg", value: "false" },
];

const isValidUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

const VegMark = ({ isVeg }: { isVeg: boolean }) => (
  <span className="inline-flex items-center gap-2 text-sm">
    <span
      aria-hidden
      className={cn(
        "flex h-4 w-4 items-center justify-center rounded-[3px] border-2",
        isVeg ? "border-green-600" : "border-red-600",
      )}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          isVeg ? "bg-green-600" : "bg-red-600",
        )}
      />
    </span>
    {isVeg ? "Veg" : "Non-Veg"}
  </span>
);

const Thumb = ({ src, name }: { src: string; name: string }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-tertiary text-sm font-medium text-secondary">
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-10 w-10 shrink-0 rounded-lg border border-line object-cover"
    />
  );
};

const toItemGroup = (g: ModifierGroup): ItemModifierGroup => ({
  groupId: g.id,
  groupName: g.name,
  type: g.type,
  selection: g.selection,
  options: g.options.map((o) => ({
    id: o.id,
    name: o.name,
    price: o.price ?? "",
  })),
});

const renderOption = (o: GroupOption, selected: boolean) => (
  <div className="flex items-center justify-between gap-2">
    <span className="flex items-center gap-2">
      <Check
        className={cn("size-3.5", selected ? "opacity-100" : "opacity-0")}
      />
      {o.label}
    </span>
    <span className="rounded-full bg-tertiary px-1.5 text-xs leading-5 text-tertiary">
      {o.count}
    </span>
  </div>
);

const pickerSelectProps = {
  unstyled: true,
  isSearchable: true,
  noOptionsMessage: () => "No results",
  getOptionValue: (o: GroupOption) => o.value,
  components: {
    DropdownIndicator: null,
    IndicatorSeparator: null,
  },
  styles: {
    menu: (base: any) => ({
      ...base,
      position: "static",
      boxShadow: "none",
    }),
  },
  classNames: {
    control: () =>
      "min-h-9 rounded-lg border border-line bg-secondary px-2 text-sm",
    valueContainer: () => "gap-1.5 py-1",
    input: () => "text-primary",
    placeholder: () => "text-tertiary",
    multiValue: () =>
      "flex items-center gap-1 rounded-md row-dull px-1.5 py-0.5 text-sm font-medium text-button-primary",
    multiValueRemove: () =>
      "cursor-pointer rounded-sm text-button-primary hover:bg-tertiary",
    menu: () => "mt-2",
    menuList: () => "max-h-40 overflow-y-auto scrollbar-hide",
    option: (state: any) =>
      cn(
        "cursor-pointer rounded-md px-2 py-1.5 text-sm",
        state.isSelected
          ? "row-dull text-primary"
          : state.isFocused
            ? "bg-secondary text-primary"
            : "text-secondary",
      ),
    noOptionsMessage: () => "px-2 py-2 text-sm text-tertiary",
  },
};

const MenuItemFields = ({ values, setValue, errors }: Ctx) => {
  const allGroups: ModifierGroup[] = useSelector(selectActiveModifiers);
  const [picking, setPicking] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const pickerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<any>(null);
  

  useEffect(() => {
    if (!picking) return;

    const onDown = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) {
        setPicking(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPicking(false);
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [picking]);

  useEffect(() => {
    if (!picking) return;

    const timer = setTimeout(() => {
      selectRef.current?.focus();
    }, 0);

    return () => {
      clearTimeout(timer);
    };
  }, [picking, typeFilter]);

  const modifiers: ItemModifierGroup[] = values.modifiers ?? [];

  const typeChoices: GroupOption[] = [
    {
      value: "all",
      label: "All",
      count: allGroups.length,
    },
    ...Object.keys(MODIFIER_TYPE_LABELS).map((t) => ({
      value: t,
      label: MODIFIER_TYPE_LABELS[t as keyof typeof MODIFIER_TYPE_LABELS],
      count: allGroups.filter((g) => g.type === t).length,
    })),
  ];

  const groupChoices: GroupOption[] = allGroups
    .filter((g) => typeFilter === "all" || g.type === typeFilter)
    .map((g) => ({
      label: g.name,
      value: String(g.id),
      count: g.options.length,
    }));

  const selectedChoices = groupChoices.filter((c) =>
    modifiers.some((m) => String(m.groupId) === c.value),
  );

  const syncGroups = (picked: readonly GroupOption[]) => {
    const visibleIds = new Set(groupChoices.map((c) => c.value));

    const kept = modifiers.filter((m) => !visibleIds.has(String(m.groupId)));

    const added = picked
      .map((p) => {
        const existing = modifiers.find((m) => String(m.groupId) === p.value);

        if (existing) return existing;

        const g = allGroups.find((x) => String(x.id) === p.value);

        return g ? toItemGroup(g) : null;
      })
      .filter(Boolean) as ItemModifierGroup[];

    setValue("modifiers", [...kept, ...added]);
  };

  const removeGroup = (groupId: string | number) =>
    setValue(
      "modifiers",
      modifiers.filter((m) => m.groupId !== groupId),
    );

  const updatePrice = (groupId: string | number, optId: string, raw: string) =>
    setValue(
      "modifiers",
      modifiers.map((m) =>
        m.groupId !== groupId
          ? m
          : {
              ...m,
              options: m.options.map((o) =>
                o.id === optId
                  ? {
                      ...o,
                      price: raw === "" ? "" : Number(raw),
                    }
                  : o,
              ),
            },
      ),
    );

  const removeOption = (groupId: string | number, optId: string) =>
    setValue(
      "modifiers",
      modifiers.map((m) =>
        m.groupId !== groupId
          ? m
          : {
              ...m,
              options: m.options.filter((o) => o.id !== optId),
            },
      ),
    );

  return (
    <>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <FormField
          type="text"
          name="name"
          label="Item Name"
          placeholder="e.g. Margherita Pizza"
          value={values.name ?? ""}
          onChange={(e: any) => setValue("name", read(e))}
          error={errors.name}
          required
        />

        <FormField
          type="select"
          name="isVeg"
          label="Veg / Non-Veg"
          value={String(values.isVeg ?? true)}
          options={vegOptions}
          onChange={(v: any) => setValue("isVeg", read(v) === "true")}
          error={errors.isVeg}
          required
        />
      </div>

      <FormField
        type="text"
        name="image"
        label="Image URL"
        placeholder="https://example.com/item.jpg"
        value={values.image ?? ""}
        onChange={(e: any) => setValue("image", read(e))}
        error={errors.image}
      />

      <FormField
        type="textarea"
        name="description"
        label="Description"
        placeholder="Short description shown to customers"
        value={values.description ?? ""}
        onChange={(e: any) => setValue("description", read(e))}
        error={errors.description}
      />

      <div className="grid gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-secondary">Modifiers</p>
            <p className="text-xs text-tertiary">
              Add preferences and optional add-ons with pricing.
            </p>
          </div>

          <div ref={pickerRef} className="relative shrink-0">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={
                  allGroups.filter((g) => g.type === "preference").length === 0
                }
                aria-haspopup="listbox"
                aria-expanded={picking && typeFilter === "preference"}
                onClick={() => {
                  setTypeFilter("preference");
                  setPicking(true);
                }}
                className={cn(
                  "cursor-pointer rounded-lg border-button-primary text-button-primary",
                  picking && typeFilter === "preference"
                    ? "row-dull"
                    : "bg-primary hover:bg-secondary",
                )}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Preference
              </Button>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={
                  allGroups.filter((g) => g.type === "addon").length === 0
                }
                aria-haspopup="listbox"
                aria-expanded={picking && typeFilter === "addon"}
                onClick={() => {
                  setTypeFilter("addon");
                  setPicking(true);
                }}
                className={cn(
                  "cursor-pointer rounded-lg border-button-primary text-button-primary",
                  picking && typeFilter === "addon"
                    ? "row-dull"
                    : "bg-primary hover:bg-secondary",
                )}
              >
                <Plus className="mr-1 h-4 w-4" />
                Add-on
              </Button>
            </div>

            {picking && (
              <div className="absolute right-0 bottom-full z-30 mb-2 w-72 rounded-xl border border-line bg-primary p-2 shadow-lg">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="px-1 text-xs font-medium text-tertiary">
                      Type
                    </label>

                    <Select<GroupOption, false>
                      {...pickerSelectProps}
                      options={typeChoices}
                      value={
                        typeChoices.find((t) => t.value === typeFilter) ?? null
                      }
                      onChange={(o) => setTypeFilter(o?.value ?? "all")}
                      placeholder="Search Type..."
                      formatOptionLabel={(o) =>
                        renderOption(o, o.value === typeFilter)
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="px-1 text-xs font-medium text-tertiary">
                      Modifier Group
                    </label>

                    <Select<GroupOption, true>
                      ref={selectRef}
                      {...pickerSelectProps}
                      isMulti
                      menuIsOpen
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      options={groupChoices}
                      value={selectedChoices}
                      onChange={syncGroups}
                      placeholder="Search Modifier Group..."
                      formatOptionLabel={(o, { context }) =>
                        context === "menu"
                          ? renderOption(
                              o,
                              selectedChoices.some((s) => s.value === o.value),
                            )
                          : o.label
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {modifiers.map((g) => (
          <div
            key={g.groupId}
            className="grid gap-2 rounded-lg border border-line p-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge className="text-button-primary row-dull border-none " variant="option">{g.groupName}</Badge>

                <Badge  variant="option">
                  {MODIFIER_TYPE_LABELS[
                    g.type as keyof typeof MODIFIER_TYPE_LABELS
                  ] ?? g.type}
                </Badge>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeGroup(g.groupId)}
                className="cursor-pointer rounded-lg text-danger bg-brand-soft hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="mr-1 h-4 w-4" />
                Remove group
              </Button>
            </div>

            {g.options.length === 0 && (
              <p className="text-xs text-tertiary">
                All options removed. Remove this group or it will be skipped.
              </p>
            )}

            {g.options.map((o) => (
              <div key={o.id} className="flex items-center gap-2">
                <Label className="flex-1 truncate text-sm text-tertairy">
                  {o.name}
                </Label>
                <FormField
                  type="number"
                  name={`modifier-${g.groupId}-${o.id}-price`}
                  value={String(o.price)}
                  placeholder="Price"
                  min={0}
                  validate={false}
                  onChange={(value: string) =>
                    updatePrice(g.groupId, o.id, value)
                  }
                  className="w-28 shrink-0"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${o.name}`}
                  onClick={() => removeOption(g.groupId, o.id)}
                  className="size-8 shrink-0 cursor-pointer rounded-lg text-danger hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ))}

        {errors.modifiers && (
          <p className="text-xs text-danger">{errors.modifiers}</p>
        )}
      </div>
    </>
  );
};

const validate = (v: FormValues): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!String(v.name ?? "").trim()) {
    errors.name = "Item name is required";
  }

  const image = String(v.image ?? "").trim();

  if (image && !isValidUrl(image)) {
    errors.image = "Enter a valid URL starting with http:// or https://";
  }

  const groups: ItemModifierGroup[] = v.modifiers ?? [];

  const hasPreference = groups.some((g) => g.type === "preference");

  if (!hasPreference) {
    errors.modifiers = "Select at least one preference";
  } else if (groups.some((g) => g.options.length === 0)) {
    errors.modifiers = "Each modifier group needs at least one option";
  } else if (groups.some((g) => g.options.some((o) => Number(o.price) < 0))) {
    errors.modifiers = "Price cannot be negative";
  }

  return errors;
};

const normalize = (v: FormValues): MenuItemRow => ({
  id: v.id || nanoid(),
  name: String(v.name).trim(),
  isVeg: v.isVeg !== false,
  image: String(v.image ?? "").trim(),
  description: String(v.description ?? "").trim(),
  modifiers: ((v.modifiers ?? []) as ItemModifierGroup[])
    .filter((g) => g.options.length > 0)
    .map((g) => ({
      ...g,
      options: g.options.map((o) => ({
        ...o,
        price: Number(o.price) || 0,
      })),
    })),
});

const AddMenuItems = () => {
  const [items, setItems] = useState<MenuItemRow[]>([]);

  const columns: Column<MenuItemRow>[] = useMemo(
    () => [
      {
        key: "srNo",
        header: "Sr. No",
        className: "w-20",
        cell: (_r, i) => i + 1,
      },
      {
        key: "name",
        header: "Item",
        cell: (r) => (
          <div className="flex items-center gap-3">
            <Thumb src={r.image} name={r.name} />

            <div className="grid gap-0.5">
              <span className="font-medium text-primary">{r.name}</span>

              {r.description && (
                <span className="line-clamp-1 text-xs text-tertiary">
                  {r.description}
                </span>
              )}
            </div>
          </div>
        ),
         isSort:true,
      },
      {
        key: "isVeg",
        header: "Type",
        cell: (r) => <VegMark isVeg={r.isVeg} />,
         isSort:true
      },
      {
        key: "modifiers",
        header: "Modifiers",
        cell: (r) => (
          <div className="flex flex-wrap gap-1.5">
            {r.modifiers.length === 0 ? (
              <span className="text-xs text-tertiary">None</span>
            ) : (
              r.modifiers.map((g) => (
                <Badge key={g.groupId} variant="option">
                  {g.groupName} · {g.options.length}
                </Badge>
              ))
            )}
          </div>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Menu Items</h1>

        <CommonDialog
          title="Add Menu Item"
          description="Enter item details and attach modifier groups with item-specific prices."
          trigger={
            <Button className="flex cursor-pointer items-center gap-2 bg-button-primary text-white hover:bg-button-primary-hover">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          }
          defaultValues={{
            name: "",
            isVeg: true,
            image: "",
            description: "",
            modifiers: [],
          }}
          validate={validate}
          onSubmit={(v) => {
            const data = normalize(v);

            console.log("Menu Item JSON:", JSON.stringify(data, null, 2));

            setItems((prev) => [...prev, data]);
          }}
        >
          {(ctx) => <MenuItemFields {...ctx} />}
        </CommonDialog>
      </div>

      <DataTable
        columns={columns}
        data={items}
        searchFields={["name"]}
        onDelete={(row) =>
          setItems((prev) => prev.filter((i) => i.id !== row.id))
        }
        editTitle="Edit Menu Item"
        validate={validate}
        renderEditForm={(ctx) => <MenuItemFields {...ctx} />}
        onEdit={(updated) => {
          const data = normalize(updated);

          console.log("Updated Menu Item JSON:", JSON.stringify(data, null, 2));

          setItems((prev) => prev.map((i) => (i.id === data.id ? data : i)));
        }}
      />
    </div>
  );
};

export default AddMenuItems;
