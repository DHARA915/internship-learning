// components/inventory/ProductFormDialog.tsx
"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PackagePlus, PencilLine } from "lucide-react";
import { cn } from "cn";
import FormField from "@/components/form-field/FormField";
import { CommonDialog } from "@/components/CommonDialog";
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
  productUpdated,
  selectAllProducts,
} from "@/Redux/Slices/inventory/productslice";

type ProductFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The product to edit, or null to add a new one. Set it in the same click that opens the dialog. */
  product: Product | null;
};

/** Add / edit product dialog. Used by the products list and the product details page. */
export function ProductFormDialog({ open, onOpenChange, product }: ProductFormDialogProps) {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectAllCategories);
  const suppliers = useSelector(selectAllSuppliers);

  const [values, setValues] = useState<ProductFormValues>(EMPTY_PRODUCT_VALUES);
  const [submitted, setSubmitted] = useState(false);
  // changes every time the dialog opens, so the image field starts fresh
  const [formKey, setFormKey] = useState(0);
  const [wasOpen, setWasOpen] = useState(false);

  // Each time the dialog opens: start from the product's values (edit) or a blank form (add).
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setValues(product ? productToValues(product) : EMPTY_PRODUCT_VALUES);
      setSubmitted(false);
      setFormKey((key) => key + 1);
    }
  }

  const editing = product;
  const mode = editing ? "edit" : "add";

  const errors = validateProduct(values, mode, {
    categoryIds: categories.map((category) => category.id),
    supplierIds: suppliers.map((supplier) => supplier.id),
  });
  const visibleErrors = submitted ? errors : {};

  const setField = (field: keyof ProductFormValues, value: string) =>
    setValues((previous) => ({ ...previous, [field]: value }));

  // dropdowns: only active categories (plus the one this product already has)
  const categoryOptions = categories
    .filter(
      (category) => category.status === "active" || category.id === editing?.categoryId,
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
      // the slice sets availableQuantity = quantity for a new product
      dispatch(
        productAdded({
          ...common,
          quantity: Number(values.quantity),
          sku: generateSku(selectedCategory.name, products),
        }),
      );
    }
  };

  return (
    <CommonDialog
      open={open}
      onOpenChange={onOpenChange}
      icon={editing ? <PencilLine /> : <PackagePlus />}
      title={editing ? "Edit product" : "Add product"}
      description={
        editing
          ? "Update the details of this product. Stock is changed with Adjust stock on the product's page."
          : "Add a product and its opening stock to your inventory."
      }
      saveLabel={editing ? "Save changes" : "Add product"}
      onSubmit={handleSave}
    >
      <div className="flex flex-col gap-5">
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

        {/* Total quantity is set once, when the product is added */}
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
  );
}