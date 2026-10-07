import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Badge } from "../../components/ui/badge.tsx";
import { CommonDialog, type FormValues } from "../../components/CommonDialog";
import { DataTable, type Column } from "../../components/DataTable";
import { FormField } from "../../components/form-field/FormField";
import { useSearchParams } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Filter } from "../../components/Filter.tsx";
import type { RootState, AppDispatch } from "../../Redux/store";
import {
  addModifier,
  updateModifier,
  deleteModifier,
  type NewModifier,
} from "../../Redux/Slices/Modifierslice.ts";
import {
  MODIFIER_LIMITS,
  MODIFIER_TYPE_LABELS,
  type ModifierGroup,
  type ModifierOption,
  type ModifierType,
  type Selection,
} from "../../utils/Modifierdata";
import { formatPrice } from "../../utils/MenuItemdata.ts";


/* ---------- shared dialog fields (Add + Edit) ---------- */
type Ctx = {
  values: FormValues;
  setValue: (k: string, v: any) => void;
  errors: Record<string, string>;
};

const inputCls =
  "rounded-lg border-line bg-primary px-3 text-sm text-primary shadow-none transition-colors " +
  "placeholder:text-tertiary";

// a new group starts with exactly one empty option
const blankOptions = (): ModifierOption[] => [
  { id: nanoid(), name: "",},
];

// the two choices for an add-on
const selectionOptions = [
  { label: "Choose One", value: "single" },
  { label: "Choose Many", value: "multiple" },
];

const modifierTypeOptions = (
  Object.keys(MODIFIER_TYPE_LABELS) as ModifierType[]
).map((t) => ({ label: MODIFIER_TYPE_LABELS[t], value: t }));

const ModifierFields = ({ values, setValue, errors }: Ctx) => {
  const type: ModifierType = values.type ?? "preference";
  const limit = MODIFIER_LIMITS[type];
  const isAddon = type === "addon";
  const options: ModifierOption[] = values.options ?? [];
  const selection: Selection = values.selection ?? limit.selection;
  const isActive = values.status !== "Inactive";

  const changeType = (t: ModifierType) => {
    if (t === type) return;
    setValue("type", t);
    setValue("selection", MODIFIER_LIMITS[t].selection);
  };

  const updateOption = (i: number, updates: Partial<ModifierOption>) =>
    setValue(
      "options",
      options.map((o, idx) => (idx === i ? { ...o, ...updates } : o)),
    );

  const addOption = () =>
    setValue("options", [...options, { id: nanoid(), name: "", isVeg: true }]);

  const removeOption = (i: number) => {
    if (options.length > 1) {
      setValue(
        "options",
        options.filter((_, idx) => idx !== i),
      );
    }
  };

  return (
    <>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <FormField
          type="text"
          name="name"
          label="Modifier Group Name"
          placeholder="e.g. Size, Portion, Extra Cheese"
          value={values.name ?? ""}
          onChange={(value) => setValue("name", value)}
          error={errors.name}
          required
        />

        <FormField
          type="select"
          name="type"
          label="Type"
          value={type}
          options={modifierTypeOptions}
          placeholder="Select a type"
          onChange={(value) => changeType(value as ModifierType)}
          error={errors.type}
          required
        />
      </div>

      {/* add-on only: choose one or choose many */}
      {isAddon && (
        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <FormField
            type="select"
            name="selection"
            label="Selection Type"
            value={selection}
            options={selectionOptions}
            placeholder="Choose one or many"
            onChange={(value) => setValue("selection", value as Selection)}
            error={errors.selection}
            required
          />
        </div>
      )}

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-secondary">
            Options<span className="ml-0.5 text-danger">*</span>
          </Label>
          <span className="text-xs text-tertiary">
            {options.length} {options.length === 1 ? "option" : "options"}
          </span>
        </div>

        {options.map((o, i) => (
          <div key={o.id} className="flex items-center gap-2">
            <Input
              value={o.name}
              placeholder={`Ex. ${limit.placeholders[i] ?? "Option name"}`}
              onChange={(e) => updateOption(i, { name: e.target.value })}
              className={inputCls}
            />

            {/* add-on only: default price */}
            {limit.hasPrice && (
              <Input
                type="number"
                min={0}
                value={o.price ?? ""}
                placeholder="Price"
                onChange={(e) =>
                  updateOption(i, {
                    price:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                className={cn(inputCls, "w-28 shrink-0")}
              />
            )}

            {/* delete only with 2+ options; spacer keeps rows aligned */}
            {options.length > 1 ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Remove option"
                onClick={() => removeOption(i)}
                className="size-8 shrink-0 cursor-pointer rounded-lg text-danger hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : (
              <span className="size-8 shrink-0" aria-hidden />
            )}
          </div>
        ))}

        {errors.options && (
          <p className="text-xs text-danger">{errors.options}</p>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
          className="w-fit cursor-pointer rounded-lg border-line bg-tertiary text-primary"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add option
        </Button>

        <p className="text-xs text-tertiary">
          {limit.hasPrice
            ? "Default price is prefilled when adding an item. You can change it per item in the Add Item section."
            : "Prices are set per item in the Add Item section."}
        </p>
      </div>

      <Switch
        id="status"
        aria-label="Status"
        checked={isActive}
        onCheckedChange={(checked) =>
          setValue("status", checked ? "Active" : "Inactive")
        }
        className="data-checked:bg-slate-200 data-unchecked:bg-gray-300 dark:data-unchecked:bg-gray-600"
      />
    </>
  );
};

/* ---------- validation + normalising ---------- */
const validate = (v: FormValues) => {
  const errors: Record<string, string> = {};
  if (!String(v.name ?? "").trim())
    errors.name = "Modifier group name is required";

  const type: ModifierType = (v.type as ModifierType) ?? "preference";
  const limit = MODIFIER_LIMITS[type];

  if (
    limit.chooseSelection &&
    v.selection !== "single" &&
    v.selection !== "multiple"
  )
    errors.selection = "Choose one or choose many";

  const opts: ModifierOption[] = v.options ?? [];
  const names = opts.map((o) => o.name.trim().toLowerCase()).filter(Boolean);

  if (names.length < limit.min) errors.options = "Add at least 1 option";
  else if (new Set(names).size !== names.length)
    errors.options = "Option names must be unique";
  else if (limit.hasPrice && opts.some((o) => o.price != null && o.price < 0))
    errors.options = "Price cannot be negative";
  return errors;
};

const normalize = (v: FormValues): NewModifier => {
  const type: ModifierType = v.type ?? "preference";
  const limit = MODIFIER_LIMITS[type];
  // add-on: use what the admin picked; preference: always single
  const selection: Selection = limit.chooseSelection
    ? v.selection === "single"
      ? "single"
      : "multiple"
    : limit.selection;

  return {
    name: String(v.name).trim(),
    type,
    selection,
    required: limit.required,
    status: v.status === "Inactive" ? "Inactive" : "Active",
    options: (v.options ?? [])
      .map((o: ModifierOption) => ({
        id: o.id || nanoid(),
        name: o.name.trim(),
        ...(limit.hasPrice ? { price: Number(o.price) || 0 } : {}),
      }))
      .filter((o: ModifierOption) => o.name),
  };
};

/* ---------- page ---------- */
const AddModifier = () => {
  const dispatch = useDispatch<AppDispatch>();
  const modifiers = useSelector((s: RootState) => s.modifiers.modifiers);

  const [searchParams] = useSearchParams();

const typeFilter =
  (searchParams.get("type") as ModifierType | null) ?? "all";

const groupFilter =
  searchParams.get("group") ?? "all";

const statusFilter =
  (searchParams.get("status") as "Active" | "Inactive" | null) ?? "all";

const typeOptions = useMemo(
  () => [
    {
      value: "all" as const,
      label: "All",
      count: modifiers.length,
    },
    ...(Object.keys(MODIFIER_TYPE_LABELS) as ModifierType[]).map(
      (type) => ({
        value: type,
        label: MODIFIER_TYPE_LABELS[type],
        count: modifiers.filter((m) => m.type === type).length,
      }),
    ),
  ],
  [modifiers],
);

const groupOptions = useMemo(() => {
  const groups = Array.from(
    new Set(modifiers.map((modifier) => modifier.name)),
  );

  return [
    {
      value: "all",
      label: "All",
      count: modifiers.length,
    },
    ...groups.map((name) => ({
      value: name,
      label: name,
      count: modifiers.filter(
        (modifier) => modifier.name === name,
      ).length,
    })),
  ];
}, [modifiers]);

const statusOptions = useMemo(
  () => [
    {
      value: "all" as const,
      label: "All",
      count: modifiers.length,
    },
    {
      value: "Active" as const,
      label: "Active",
      count: modifiers.filter((m) => m.status === "Active").length,
    },
    {
      value: "Inactive" as const,
      label: "Inactive",
      count: modifiers.filter(
        (m) => m.status === "Inactive",
      ).length,
    },
  ],
  [modifiers],
);

const filterFields = [
  {
    key: "type",
    label: "Type",
    options: typeOptions,
    defaultValue: "all" as const,
  },
  {
    key: "group",
    label: "Modifier Group",
    options: groupOptions,
    defaultValue: "all",
  },
  {
    key: "status",
    label: "Status",
    options: statusOptions,
    defaultValue: "all" as const,
  },
];

const visible = useMemo(() => {
  return modifiers.filter((modifier) => {
    const matchesType =
      typeFilter === "all" ||
      modifier.type === typeFilter;

    const matchesGroup =
      groupFilter === "all" ||
      modifier.name === groupFilter;

    const matchesStatus =
      statusFilter === "all" ||
      modifier.status === statusFilter;

    return (
      matchesType &&
      matchesGroup &&
      matchesStatus
    );
  });
}, [
  modifiers,
  typeFilter,
  groupFilter,
  statusFilter,
]);

  const columns: Column<ModifierGroup>[] = useMemo(
    () => [
      {
        key: "srNo",
        header: "Sr. No",
        className: "w-20",
        cell: (_r, i) => i + 1,
      },
      { key: "name", header: "Modifier Group" },
      {
        key: "type",
        header: "Type",
        cell: (r) => MODIFIER_TYPE_LABELS[r.type],
      },
      {
        key: "options",
        header: "Options",
        cell: (r) => (
          <div className="flex flex-wrap gap-1.5">
            {r.options.map((o) => (
              <Badge key={o.id} variant="option">
                {o.name}
                {r.type === "addon" && o.price
                  ? ` · ${formatPrice(o.price)}`
                  : ""}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        key: "status",
        header: "Status",
        cell: (r) => (
          <Badge variant={r.status === "Active" ? "active" : "inactive"}>
            {r.status}
          </Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="border-l-4 border-button-primary pl-3 text-xl font-semibold">
          Modifiers
        </h1>

        <div className="flex items-center gap-3">
          <Filter fields={filterFields} />

          <CommonDialog
            title="Add Modifier Group"
            description="Define the choices customers see. Set prices when adding an item."
            trigger={
              <Button className="flex items-center gap-2 cursor-pointer bg-button-primary text-white hover:bg-button-primary-hover">
                <Plus className="h-4 w-4" /> Add
              </Button>
            }
           defaultValues={{
  name: "",
  type:
    typeFilter === "all"
      ? "preference"
      : typeFilter,
  selection:
    typeFilter === "addon"
      ? "multiple"
      : "single",
  status: "Active",
  options: blankOptions(),
}}
            validate={validate}
            onSubmit={(v) => {
              const data = normalize(v);

              console.log("Added Modifier:", data);

              dispatch(addModifier(data));
            }}
          >
            {(ctx) => <ModifierFields {...ctx} />}
          </CommonDialog>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={visible}
        onDelete={(row) => dispatch(deleteModifier(row.id))}
        editTitle="Edit Modifier Group"
        validate={validate}
        renderEditForm={(ctx) => <ModifierFields {...ctx} />}
        onEdit={(updated) => {
          dispatch(
            updateModifier({ id: updated.id, data: normalize(updated) }),
          );
        }}
      />
    </div>
  );
};

export default AddModifier;
