// app/products/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { ImagePlus, PackagePlus,Eye,PencilLine, Plus, Trash2 } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import FormField from "@/components/form-field/FormField";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { CommonDialog } from "@/components/CommonDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  EMPTY_PRODUCT_VALUES,
  generateSku,
  productToValues,
  validateProduct,
  type Product,
  type ProductFormValues,
} from "@/data/Inventory/productdata";
import { selectAllCategories } from "@/Redux/Slices/inventory/categoryslice";
import { selectAllSuppliers } from "@/Redux/Slices/inventory/supplierslice";
import {
  productAdded,
  productDeleted,
  productUpdated,
  selectAllProducts,
} from "@/Redux/Slices/inventory/productslice";

const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

export default function ProductsPage() {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectAllCategories);
  const suppliers = useSelector(selectAllSuppliers);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);

  const [values, setValues] = useState<ProductFormValues>(EMPTY_PRODUCT_VALUES);
  const [submitted, setSubmitted] = useState(false);

  // changes every time the dialog is opened, so the image field starts fresh
  const [formKey, setFormKey] = useState(0);

  const mode = editing ? "edit" : "add";

  const errors = validateProduct(values, mode, {
    categoryIds: categories.map((category) => category.id),
    supplierIds: suppliers.map((supplier) => supplier.id),
  });
  const visibleErrors = submitted ? errors : {};

  const setField = (field: keyof ProductFormValues, value: string) =>
    setValues((previous) => ({ ...previous, [field]: value }));

  const categoryName = (id: number) =>
    categories.find((category) => category.id === id)?.name ?? "—";
  const supplierName = (id: number) =>
    suppliers.find((supplier) => supplier.id === id)?.name ?? "—";

  // dropdowns: only active categories (plus the one this product already has)
  const categoryOptions = categories
    .filter(
      (category) =>
        category.status === "active" || category.id === editing?.categoryId,
    )
    .map((category) => ({ label: category.name, value: String(category.id) }));
  const supplierOptions = suppliers.map((supplier) => ({
    label: supplier.name,
    value: String(supplier.id),
  }));

  // SKU is locked once a product exists; for a new one it follows the category
  const selectedCategory = categories.find(
    (category) => String(category.id) === values.categoryId,
  );
  const skuPreview = editing
    ? editing.sku
    : selectedCategory
      ? generateSku(selectedCategory.name, products)
      : "";

  const handleAdd = () => {
    setEditing(null);
    setValues(EMPTY_PRODUCT_VALUES);
    setSubmitted(false);
    setFormKey((key) => key + 1);
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditing(product);
    setValues(productToValues(product));
    setSubmitted(false);
    setFormKey((key) => key + 1);
    setIsDialogOpen(true);
  };

  // ImageField gives us the picked File (or null on Remove); the store keeps a data URL string
  const handleImageFile = (file: File | null) => {
    if (!file) return setField("image", "");

    const reader = new FileReader();
    reader.onload = () => setField("image", String(reader.result));
    reader.readAsDataURL(file);
  };

  // returning false keeps the dialog open; otherwise CommonDialog closes it
  const handleSave = () => {
    setSubmitted(true);
    if (Object.keys(errors).length > 0 || !selectedCategory) return false;

    const common = {
      name: values.name.trim(),
      description: values.description.trim(),
      categoryId: Number(values.categoryId),
      supplierId: Number(values.supplierId),
      unitPrice: Number(values.unitPrice),
      image: values.image || null,
    };

    if (editing) {
      dispatch(productUpdated({ id: editing.id, changes: common }));
    } else {
      dispatch(
        productAdded({
          ...common,
          quantity: Number(values.quantity),
          sku: generateSku(selectedCategory.name, products),
        }),
      );
    }
  };

  const handleDelete = () => {
    if (deleting) dispatch(productDeleted(deleting.id));
  };

  const columns: DataTableColumn<Product>[] = [
    {
      key: "name",
      header: "Product",
      isSort: true,
      cell: (product) => (
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-brand-soft text-brand">
            {product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image}
                alt=""
                className="size-full object-cover"
              />
            ) : (
              <ImagePlus className="size-4" />
            )}
          </div>
          <span className="font-medium">{product.name}</span>
        </div>
      ),
    },
    {
      key: "sku",
      header: "SKU",
      isSort: true,
      cell: (product) => (
        <span className="font-mono text-xs">{product.sku}</span>
      ),
    },
    {
      key: "categoryId",
      header: "Category",
      cell: (product) => categoryName(product.categoryId),
    },
    {
      key: "supplierId",
      header: "Supplier",
      cell: (product) => supplierName(product.supplierId),
    },
    {
      key: "unitPrice",
      header: "Unit price",
      isSort: true,
      cell: (product) => formatPrice(product.unitPrice),
    },
    {
      key: "quantity",
      header: "Total quantity",
      isSort: true,
      cell: (product) => (
        <span className={cn(product.quantity === 0 && "font-medium text-destructive")}>
          {product.quantity}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      srOnlyHeader: true,
      align: "right",
      headerClassName: "w-28",
      cell: (product) => (
        <div className="flex items-center justify-end gap-2">
               <Button  variant="outline" size="icon" aria-label={`View ${product.name}`}>
        <Link href={`/inventory/products/${product.id}`}>
          <Eye />
        </Link>
      </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Edit ${product.name}`}
            onClick={() => handleEdit(product)}
          >
            <PencilLine />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            aria-label={`Delete ${product.name}`}
            onClick={() => setDeleting(product)}
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
        <h1 className="border-l-4 border-brand p-1 text-3xl font-extrabold tracking-tight">
          Products
        </h1>

        <Button type="button" variant="primary" onClick={handleAdd}>
          <Plus />
          Add product
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        getRowKey={(product) => product.id}
        caption="Products"
        emptyMessage="No products yet. Click Add product to create one."
        searchFields={["name", "sku"]}
        searchPlaceholder="Search by name or SKU..."
        pageSize={5}
        minWidth={820}
        className="border border-line"
      />

      {/* Add / edit product */}
      <CommonDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        icon={editing ? <PencilLine /> : <PackagePlus />}
        title={editing ? "Edit product" : "Add product"}
        description={
          editing
            ? "Update the details of this product. Stock quantity isn't changed here."
            : "Add a product and its opening stock to your inventory."
        }
        saveLabel={editing ? "Save changes" : "Add product"}
        onSubmit={handleSave}
      >
        <div className="flex flex-col gap-5">
          {/* Image (the only part that changed) */}

          <FormField
            type="text"
            name="name"
            label="Product name"
            placeholder="e.g. Wireless mouse"
            value={values.name}
            onChange={(value) => setField("name", value)}
            error={visibleErrors.name}
            required
          />

          <FormField
            type="textarea"
            name="description"
            label="Description"
            placeholder="Short description of the product"
            value={values.description}
            onChange={(value) => setField("description", value)}
            error={visibleErrors.description}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              type="select"
              name="categoryId"
              label="Category"
              placeholder="Select category"
              options={categoryOptions}
              value={values.categoryId}
              onChange={(value) => setField("categoryId", value)}
              error={visibleErrors.categoryId}
              required
            />
            <FormField
              type="select"
              name="supplierId"
              label="Supplier"
              placeholder="Select supplier"
              options={supplierOptions}
              value={values.supplierId}
              onChange={(value) => setField("supplierId", value)}
              error={visibleErrors.supplierId}
              required
            />
          </div>

          {/* Autogenerated, read-only */}
          <div className="rounded-xl border border-line px-4 py-3">
            <p className="text-sm font-medium">SKU</p>
            <p className="mt-0.5 font-mono text-sm">
              {skuPreview || (
                <span className="font-sans text-muted-foreground">
                  Choose a category to generate the SKU
                </span>
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Generated automatically and can't be changed.
            </p>
          </div>

          {/* Quantity is set once, when the product is added */}
          <div className={cn("grid gap-5", !editing && "sm:grid-cols-2")}>
            <FormField
              type="number"
              name="unitPrice"
              label="Unit price (₹)"
              placeholder="0.00"
              value={values.unitPrice}
              onChange={(value) => setField("unitPrice", value)}
              error={visibleErrors.unitPrice}
              required
            />
            {!editing && (
              <FormField
                type="number"
                name="quantity"
                label="Total quantity"
                placeholder="0"
                value={values.quantity}
                onChange={(value) => setField("quantity", value)}
                error={visibleErrors.quantity}
                required
              />
            )}
          </div>
                <FormField
            key={formKey}
            type="file"
            name="image"
            label="Product image"
            maxSizeMB={2}
            value={values.image}
            onFileChange={handleImageFile}
            required
          />

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
        title="Delete this product?"
        description={
          deleting && (
            <>
              <span className="font-medium text-foreground">
                {deleting.name}
              </span>{" "}
              ({deleting.sku}) will be removed. This can't be undone.
            </>
          )
        }
        confirmLabel="Delete product"
        onConfirm={handleDelete}
      />
    </div>
  );
}