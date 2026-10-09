import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { Plus, Trash2, Check } from "lucide-react";
import { Switch } from "../../components/ui/switch.tsx";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge.tsx";
import { CommonDialog, type FormValues } from "../../components/CommonDialog";
import { DataTable, type Column } from "../../components/DataTable";
import { FormField } from "../../components/form-field/FormField";
import { useSearchParams } from "react-router-dom";
import { Filter } from "../../components/Filter.tsx";
import type { ViewConfig } from "../../components/ViewDialog";
import { cn } from "../../lib/utils";
import { MoreValues } from "../../components/MoreValues.tsx";
import type { RootState, AppDispatch } from "../../Redux/store";
import {
  addMenu,
  updateMenu,
  deleteMenu,
  type NewMenu,
} from "../../Redux/Slices/menuSectionSlice";
import type { MenuItem } from "../../utils/MenuItemdata.ts";
import {
  DAYS,
  daysLabel,
  fmtTime,
  isMenuLive,
  type Day,
  type Menu,
  type MenuTiming,
} from "../../utils/Menusectiondata.ts";

type Ctx = {
  values: FormValues;
  setValue: (k: string, v: any) => void;
  errors: Record<string, string>;
};

type Choice = {
  label: string;
  value: string;
  count?: number;
  isVeg?: boolean;
};

const read = (e: any) => (e?.target ? e.target.value : e);

const isValidUrl = (s: string) => {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};

/* ---------- small pieces ---------- */
const VegDot = ({ isVeg }: { isVeg: boolean }) => (
  <span
    aria-label={isVeg ? "Veg" : "Non-Veg"}
    className={cn(
      "flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border-2",
      isVeg ? "border-green-600" : "border-red-600",
    )}
  >
    <span
      className={cn("h-2 w-2 rounded-full", isVeg ? "bg-green-600" : "bg-red-600")}
    />
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

const renderChoice = (o: Choice, selected: boolean) => (
  <div className="flex items-center justify-between gap-2">
    <span className="flex items-center gap-2">
      <Check
        className={cn("size-3.5", selected ? "opacity-100" : "opacity-0")}
      />
      {o.label}
    </span>

    {o.count !== undefined ? (
      <span className="rounded-full bg-tertiary px-1.5 text-xs leading-5 text-tertiary">
        {o.count}
      </span>
    ) : o.isVeg !== undefined ? (
      <VegDot isVeg={o.isVeg} />
    ) : null}
  </div>
);

// same react-select look as the Filter component
const pickerSelectProps = {
  unstyled: true,
  isSearchable: true,
  noOptionsMessage: () => "No results",
  getOptionValue: (o: Choice) => o.value,
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

/* ---------- shared dialog fields (Add + Edit) ---------- */
const MenuFields = ({ values, setValue, errors }: Ctx) => {
  const allItems = useSelector((s: RootState) => s.menuItems.menuItems);

  // only ACTIVE items can be picked for a menu
  const activeItems = useMemo(
    () => allItems.filter((i) => i.status === "Active"),
    [allItems],
  );

  const [picking, setPicking] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const pickerRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<any>(null);

  useEffect(() => {
    if (!picking) return;

    const onDown = (e: MouseEvent) => {
      if (!pickerRef.current?.contains(e.target as Node)) setPicking(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPicking(false);
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
    const timer = setTimeout(() => selectRef.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [picking, typeFilter]);

  const timing: MenuTiming = values.timing ?? {
    startTime: "",
    endTime: "",
    days: [],
  };
  const itemIds: string[] = values.itemIds ?? [];

  const setTiming = (patch: Partial<MenuTiming>) =>
    setValue("timing", { ...timing, ...patch });

  const toggleDay = (d: Day) =>
    setTiming({
      days: timing.days.includes(d)
        ? timing.days.filter((x) => x !== d)
        : [...timing.days, d],
    });

  /* ----- item picker ----- */
  const typeChoices: Choice[] = [
    { value: "all", label: "All", count: activeItems.length },
    { value: "veg", label: "Veg", count: activeItems.filter((i) => i.isVeg).length },
    {
      value: "nonveg",
      label: "Non-Veg",
      count: activeItems.filter((i) => !i.isVeg).length,
    },
  ];

  const itemChoices: Choice[] = activeItems
    .filter(
      (i) =>
        typeFilter === "all" || (typeFilter === "veg" ? i.isVeg : !i.isVeg),
    )
    .map((i) => ({ label: i.name, value: i.id, isVeg: i.isVeg }));

  const selectedChoices = itemChoices.filter((c) => itemIds.includes(c.value));

  // ids hidden by the Type filter stay selected; visible ones follow the select
  const syncItems = (picked: readonly Choice[]) => {
    const visible = new Set(itemChoices.map((c) => c.value));
    const kept = itemIds.filter((id) => !visible.has(id));
    setValue("itemIds", [...kept, ...picked.map((p) => p.value)]);
  };

  const removeItem = (id: string) =>
    setValue(
      "itemIds",
      itemIds.filter((x) => x !== id),
    );

  const selectedItems = itemIds
    .map((id) => allItems.find((i) => i.id === id))
    .filter((i): i is MenuItem => Boolean(i));

  return (
    <>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <FormField
          type="text"
          name="name"
          label="Menu Name"
          placeholder="e.g. Breakfast, Lunch, Desserts"
          value={values.name ?? ""}
          onChange={(e: any) => setValue("name", read(e))}
          error={errors.name}
          required
        />

        <FormField
          type="text"
          name="icon"
          label="Menu Icon (Image URL)"
          placeholder="https://example.com/icon.png"
          value={values.icon ?? ""}
          onChange={(e: any) => setValue("icon", read(e))}
          error={errors.icon}
        />
      </div>

      {/* timing */}
      <div className="grid gap-3">
        <div>
          <p className="text-sm font-medium text-secondary">
            Timing<span className="ml-0.5 text-danger">*</span>
          </p>
          <p className="text-xs text-tertiary">
            The menu is shown to customers only during these hours and days.
          </p>
        </div>

        <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
          <FormField
            type="time"
            name="startTime"
            label="Start Time"
            value={timing.startTime}
            onChange={(e: any) => setTiming({ startTime: read(e) })}
            error={errors.startTime}
            required
          />

          <FormField
            type="time"
            name="endTime"
            label="End Time"
            value={timing.endTime}
            onChange={(e: any) => setTiming({ endTime: read(e) })}
            error={errors.endTime}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label className="text-sm font-medium text-secondary">
            Available Days<span className="ml-0.5 text-danger">*</span>
          </Label>

          <div className="flex flex-wrap gap-2">
            {DAYS.map((d) => {
              const on = timing.days.includes(d);
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleDay(d)}
                  className={cn(
                    "cursor-pointer rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    on
                      ? "border-button-primary row-dull text-primary"
                      : "border-line bg-primary text-secondary hover:bg-secondary",
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>

          {errors.days && <p className="text-xs text-danger">{errors.days}</p>}
        </div>
      </div>

      {/* items */}
      <div className="grid gap-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-secondary">
              Items<span className="ml-0.5 text-danger">*</span>
            </p>
            <p className="text-xs text-tertiary">
              Only active menu items can be added.
            </p>
          </div>

          <div ref={pickerRef} className="relative shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={activeItems.length === 0}
              aria-haspopup="listbox"
              aria-expanded={picking}
              onClick={() => setPicking((p) => !p)}
              className={cn(
                "cursor-pointer rounded-lg border-button-primary text-button-primary",
                picking ? "row-dull" : "bg-primary hover:bg-secondary",
              )}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Items
            </Button>

            {picking && (
              <div className="absolute right-0 bottom-full z-30 mb-2 w-72 rounded-xl border border-line bg-primary p-2 shadow-lg">
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="px-1 text-xs font-medium text-tertiary">
                      Type
                    </label>

                    <Select<Choice, false>
                      {...pickerSelectProps}
                      options={typeChoices}
                      value={
                        typeChoices.find((t) => t.value === typeFilter) ?? null
                      }
                      onChange={(o) => setTypeFilter(o?.value ?? "all")}
                      placeholder="Search Type..."
                      formatOptionLabel={(o) =>
                        renderChoice(o, o.value === typeFilter)
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="px-1 text-xs font-medium text-tertiary">
                      Items
                    </label>

                    <Select<Choice, true>
                      ref={selectRef}
                      {...pickerSelectProps}
                      isMulti
                      menuIsOpen
                      closeMenuOnSelect={false}
                      hideSelectedOptions={false}
                      options={itemChoices}
                      value={selectedChoices}
                      onChange={syncItems}
                      placeholder="Search Items..."
                      formatOptionLabel={(o, { context }) =>
                        context === "menu"
                          ? renderChoice(
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

        {selectedItems.length === 0 ? (
          <p className="rounded-lg border border-dashed border-line px-3 py-4 text-center text-xs text-tertiary">
            No items added. Click "Add Items" to choose items for this menu.
          </p>
        ) : (
          <div className="grid gap-2">
            {selectedItems.map((i) => (
              <div
                key={i.id}
                className={cn(
                  "flex items-center gap-3 rounded-lg border border-line p-2",
                  i.status !== "Active" && "opacity-60",
                )}
              >
                <Thumb src={i.image} name={i.name} />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-primary">
                      {i.name}
                    </span>
                    <VegDot isVeg={i.isVeg} />
                    {i.status !== "Active" && (
                      <Badge variant="inactive">Inactive</Badge>
                    )}
                  </div>

                  {i.description && (
                    <p className="line-clamp-1 text-xs text-tertiary">
                      {i.description}
                    </p>
                  )}
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${i.name}`}
                  onClick={() => removeItem(i.id)}
                  className="size-8 shrink-0 cursor-pointer rounded-lg text-danger hover:bg-danger/10 hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {errors.itemIds && (
          <p className="text-xs text-danger">{errors.itemIds}</p>
        )}
      </div>

      <Switch
        id="menu-status"
        checked={values.status !== "Inactive"}
        onCheckedChange={(checked) =>
          setValue("status", checked ? "Active" : "Inactive")
        }
        aria-label="Menu status"
        className="data-checked:bg-slate-200 data-unchecked:bg-gray-300 dark:data-unchecked:bg-gray-600"
      />
    </>
  );
};

/* ---------- validation + normalising ---------- */
// built from the live item list so "at least one ACTIVE item" can be checked
const makeValidate =
  (items: MenuItem[]) =>
  (v: FormValues): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!String(v.name ?? "").trim()) errors.name = "Menu name is required";

    const icon = String(v.icon ?? "").trim();
    if (icon && !isValidUrl(icon))
      errors.icon = "Enter a valid URL starting with http:// or https://";

    const t: Partial<MenuTiming> = v.timing ?? {};
    if (!t.startTime) errors.startTime = "Start time is required";
    if (!t.endTime) errors.endTime = "End time is required";
    if (t.startTime && t.endTime && t.endTime <= t.startTime)
      errors.endTime = "End time must be after start time";
    if (!(t.days ?? []).length) errors.days = "Select at least one day";

    const ids: string[] = v.itemIds ?? [];
    const hasActive = ids.some(
      (id) => items.find((i) => i.id === id)?.status === "Active",
    );
    if (!hasActive) errors.itemIds = "Add at least one active item";

    return errors;
  };

const makeNormalize =
  (items: MenuItem[]) =>
  (v: FormValues): NewMenu => {
    const exists = new Set(items.map((i) => i.id));
    const t: Partial<MenuTiming> = v.timing ?? {};

    return {
      name: String(v.name).trim(),
      icon: String(v.icon ?? "").trim(),
      status: v.status === "Inactive" ? "Inactive" : "Active",
      timing: {
        startTime: String(t.startTime),
        endTime: String(t.endTime),
        // keep Mon → Sun order
        days: DAYS.filter((d) => (t.days ?? []).includes(d)),
      },
      // unique, and drop items that were deleted since
      itemIds: Array.from(new Set<string>(v.itemIds ?? [])).filter((id) =>
        exists.has(id),
      ),
    };
  };

/* ---------- page ---------- */
const AddMenuSection = () => {
  const dispatch = useDispatch<AppDispatch>();
  const menus = useSelector((s: RootState) => s.menus.menus);
  const items = useSelector((s: RootState) => s.menuItems.menuItems);

  const validate = useMemo(() => makeValidate(items), [items]);
  const normalize = useMemo(() => makeNormalize(items), [items]);

  const [searchParams] = useSearchParams();

  const nameFilter = searchParams.get("name") ?? "all";
  const statusFilter = searchParams.get("status") ?? "all"; // "Active" | "Inactive"

  const nameOptions = useMemo(() => {
    const names = Array.from(new Set(menus.map((m) => m.name)));
    return [
      { value: "all", label: "All", count: menus.length },
      ...names.map((name) => ({
        value: name,
        label: name,
        count: menus.filter((m) => m.name === name).length,
      })),
    ];
  }, [menus]);

  const statusOptions = useMemo(
    () => [
      { value: "all", label: "All", count: menus.length },
      {
        value: "Active",
        label: "Active",
        count: menus.filter((m) => m.status === "Active").length,
      },
      {
        value: "Inactive",
        label: "Inactive",
        count: menus.filter((m) => m.status === "Inactive").length,
      },
    ],
    [menus],
  );

  const filterFields = [
    { key: "name", label: "Menu Name", options: nameOptions, defaultValue: "all" },
    { key: "status", label: "Status", options: statusOptions, defaultValue: "all" },
  ];

  const visible = useMemo(
    () =>
      menus.filter((m) => {
        const matchesName = nameFilter === "all" || m.name === nameFilter;
        const matchesStatus = statusFilter === "all" || m.status === statusFilter;
        return matchesName && matchesStatus;
      }),
    [menus, nameFilter, statusFilter],
  );

  // a menu only ever shows its ACTIVE items
  const activeItemsOf = (m: Menu) =>
    m.itemIds
      .map((id) => items.find((i) => i.id === id))
      .filter((i): i is MenuItem => Boolean(i) && i!.status === "Active");

  const columns: Column<Menu>[] = useMemo(
    () => [
      {
        key: "srNo",
        header: "Sr. No",
        className: "w-20",
        cell: (_r, i) => i + 1,
      },
      {
        key: "name",
        header: "Menu",
        cell: (r) => (
          <div className="flex items-center gap-3">
            <Thumb src={r.icon} name={r.name} />
            <span className="font-medium text-primary">{r.name}</span>
          </div>
        ),
        isSort: true,
      },
      {
        key: "timing",
        header: "Timing",
        cell: (r) => (
          <div className="flex items-center gap-2">
            <div className="grid gap-0.5">
              <span className="text-sm text-primary">
                {fmtTime(r.timing.startTime)} – {fmtTime(r.timing.endTime)}
              </span>
              <span className="text-xs text-tertiary">
                {daysLabel(r.timing.days)}
              </span>
            </div>
            {isMenuLive(r) && <Badge variant="active">Live now</Badge>}
          </div>
        ),
      },
      {
        key: "itemIds",
        header: "Items",
        cell: (r) => {
          const list = activeItemsOf(r);
          if (list.length === 0)
            return <span className="text-xs text-tertiary">No active items</span>;
         return (
      <MoreValues
        items={list}
        visibleCount={3}
        title="More Items"
        renderItem={(item) => (
          <Badge key={item.id} variant="option">
            {item.name}
          </Badge>
        )}
      />
    );
        },
      },
      {
        key: "status",
        header: "Status",
        cell: (r) => (
          <Badge variant={r.status === "Active" ? "active" : "inactive"}>
            {r.status}
          </Badge>
        ),
        isSort: true,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  );

  // what the View dialog shows for a menu
  const viewConfig: ViewConfig<Menu> = useMemo(
    () => ({
      title: "Menu Details",
      description: "Timing and the active items served in this menu.",
      header: {
        imageKey: "icon",
        titleKey: "name",
        badges: [{ key: "status", label: "Status", type: "status" }],
      },
      fields: [
        {
          key: "hours",
          label: "Hours",
          getValue: (m) =>
            `${fmtTime(m.timing.startTime)} – ${fmtTime(m.timing.endTime)}`,
        },
        {
          key: "live",
          label: "Available Now",
          type: "boolean",
          getValue: (m) => isMenuLive(m),
        },
        {
          key: "days",
          label: "Days",
          type: "chips",
          getValue: (m) => m.timing.days,
        },
        {
          key: "items",
          label: "Items",
          type: "chips",
          getValue: (m) => activeItemsOf(m).map((i) => i.name),
        },
        { key: "updatedAt", label: "Last Updated" },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items],
  );

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="border-l-4 border-button-primary pl-3 text-xl font-semibold">
          Menus
        </h1>

        <div className="flex items-center gap-3">
          <Filter fields={filterFields} />

          <CommonDialog
            title="Add Menu"
            description="Name the menu, set when it is available and pick the items it serves."
            trigger={
              <Button variant="primary">
  <Plus className="h-4 w-4" />
  Add
</Button>
            }
            defaultValues={{
              name: "",
              icon: "",
              status: "Active",
              timing: {
                startTime: "09:00",
                endTime: "22:00",
                days: [...DAYS],
              },
              itemIds: [],
            }}
            validate={validate}
            onSubmit={(v) => {
              const data = normalize(v);

              console.log("Menu JSON:", JSON.stringify(data, null, 2));

              dispatch(addMenu(data));
            }}
          >
            {(ctx) => <MenuFields {...ctx} />}
          </CommonDialog>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={visible}
        searchFields={["name"]}
        enableView
        viewConfig={viewConfig}
        onDelete={(row) => dispatch(deleteMenu(row.id))}
        editTitle="Edit Menu"
        validate={validate}
        renderEditForm={(ctx) => <MenuFields {...ctx} />}
        onEdit={(updated) => {
          const data = normalize(updated);

          console.log("Updated Menu JSON:", JSON.stringify(data, null, 2));

          dispatch(updateMenu({ id: updated.id, data }));
        }}
      />
    </div>
  );
};

export default AddMenuSection;