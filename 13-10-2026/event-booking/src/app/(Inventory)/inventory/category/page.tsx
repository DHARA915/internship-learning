// app/categories/page.tsx
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FolderPlus, PencilLine, Plus, Trash2 } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import FormField from "@/components/form-field/FormField";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { CommonDialog } from "@/components/CommonDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  EMPTY_CATEGORY_VALUES,
  categoryToValues,
  isCategoryStatus,
  validateCategory,
  type Category,
  type CategoryFormValues,
} from "@/data/Inventory/categorydata";
import {
  categoryAdded,
  categoryDeleted,
  categoryStatusToggled,
  categoryUpdated,
  selectAllCategories,
} from "@/Redux/Slices/inventory/categoryslice";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const categories = useSelector(selectAllCategories);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState<Category | null>(null);

  // the dialog's own values (strings, like FormField gives them)
  const [values, setValues] = useState<CategoryFormValues>(
    EMPTY_CATEGORY_VALUES,
  );
  const [submitted, setSubmitted] = useState(false);

  const errors = validateCategory(values, categories, editing?.id ?? null);
  // errors show after the first Save click, then update as the user fixes them
  const visibleErrors = submitted ? errors : {};

  const setField = (field: keyof CategoryFormValues, value: string) =>
    setValues((previous) => ({ ...previous, [field]: value }));

  const handleAdd = () => {
    setEditing(null);
    setValues(EMPTY_CATEGORY_VALUES);
    setSubmitted(false);
    setIsDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditing(category);
    setValues(categoryToValues(category));
    setSubmitted(false);
    setIsDialogOpen(true);
  };

  // returning false keeps the dialog open; otherwise CommonDialog closes it
  const handleSave = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0 || !isCategoryStatus(values.status))
      return false;

    const input = { name: values.name.trim(), status: values.status };
    if (editing) dispatch(categoryUpdated({ id: editing.id, changes: input }));
    else dispatch(categoryAdded(input));
  };

  const handleDelete = () => {
    if (deleting) dispatch(categoryDeleted(deleting.id));
  };

  const columns: DataTableColumn<Category>[] = [
    // { key: "no", header: "#", headerClassName: "w-14", cell: (_category, index) => index + 1 },
    {
      key: "name",
      header: "Category",
      isSort: true,
      cell: (category) => <span className="font-medium">{category.name}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (category) => (
        <Badge variant={category.status === "active" ? "active" : "inactive"}>
          {category.status === "active" ? "Active" : "Inactive"}
        </Badge>
      ),
      isSort: true,
    },
    {
      key: "created_at",
      header: "Created",
      cell: (category) => formatDate(category.created_at),
      isSort: true,
    },
    {
      key: "actions",
      header: "Actions",
      srOnlyHeader: true,
      align: "right",
      headerClassName: "w-28",
      cell: (category) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Edit ${category.name}`}
            onClick={() => handleEdit(category)}
          >
            <PencilLine />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            aria-label={`Delete ${category.name}`}
            onClick={() => setDeleting(category)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight border-l-4 p-1 border-brand sm:text-3xl ">
            {categories.length === 1 ? "Category" : "Categories"}
          </h1>
        </div>

        <Button type="button" variant="primary" onClick={handleAdd}>
          <Plus />
          Add category
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        getRowKey={(category) => category.id}
        caption="Categories"
        emptyMessage="No categories yet. Click Add category to create one."
        searchFields={["name"]}
        searchPlaceholder="Search categories..."
        pageSize={5}
        minWidth={560}
        className="border border-line"
      />

      {/* Add / edit category */}
      <CommonDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        icon={editing ? <PencilLine /> : <FolderPlus />}
        title={editing ? "Edit category" : "Add category"}
        description={
          editing
            ? "Update the name or status of this category."
            : "Create a new category to group your products."
        }
        saveLabel={editing ? "Save changes" : "Add category"}
        onSubmit={handleSave}
      >
        <div className="flex flex-col gap-5">
          <FormField
            type="text"
            name="name"
            label="Category name"
            placeholder="e.g. Electronics"
            value={values.name}
            onChange={(value) => setField("name", value)}
            error={visibleErrors.name}
            required
          />

          <div className="flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3">
            <div className="min-w-0">
              <label htmlFor="category-status" className="text-sm font-medium">
                Active
              </label>
              <p className="text-xs text-muted-foreground">
                Inactive categories are hidden from product forms.
              </p>
            </div>
            <Switch
              id="category-status"
              checked={values.status === "active"}
              onCheckedChange={(checked) =>
                setField("status", checked ? "active" : "inactive")
              }
            />
          </div>
        </div>
      </CommonDialog>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleting(null);
        }}
        icon={Trash2}
        variant="danger"
        title="Delete this category?"
        description={
          deleting && (
            <>
              <span className="font-medium text-foreground">
                {deleting.name}
              </span>{" "}
              will be removed. This can't be undone.
            </>
          )
        }
        confirmLabel="Delete category"
        onConfirm={handleDelete}
      />
    </div>
  );
}