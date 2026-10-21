// app/inventory/dashboard/page.tsx
"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  Boxes,
  ImagePlus,
  PackageX,
  TriangleAlert,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import {
  getStockStatus,
  type Product,
  type StockMovement,
} from "@/data/Inventory/productdata";
import { selectAllCategories } from "@/Redux/Slices/inventory/categoryslice";
import { selectAllMovements, selectAllProducts } from "@/Redux/Slices/inventory/productslice";
import { selectAllSuppliers } from "@/Redux/Slices/inventory/supplierslice";
import { KpiCard, type Tone } from "@/components/inventory/Kpicard";
import { StockHealth } from "@/components/inventory/Stockhealth";
import { MovementChart } from "@/components/inventory/Movementchart";
import { CategoryBars, type CategoryStat } from "@/components/inventory/Categorybars";

/* ------------------------------------------------------------------ */
/* types and helpers                                                    */
/* ------------------------------------------------------------------ */

type CardId = "products" | "value" | "low" | "out";

type Kpi = {
  id: CardId;
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone: Tone;
};

type ProductRow = Product & {
  categoryName: string;
  supplierName: string;
  stockValue: number; // unit price x available quantity
  stock: ReturnType<typeof getStockStatus>; // same status the details page shows in its Badge
  isOut: boolean; // nothing available
  isLow: boolean; // running low, but not out
};

/** A movement plus the product and category details the table needs. */
type MovementRow = StockMovement & {
  productName: string;
  sku: string;
  categoryName: string;
};

const DETAIL_ID = "dashboard-detail";

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

const compactMoney = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

/* ------------------------------------------------------------------ */
/* small page-only pieces                                               */
/* ------------------------------------------------------------------ */

function Panel({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "min-w-0 rounded-2xl border border-line bg-card p-4 shadow-sm sm:p-5",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-base font-bold">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function TopValueList({ rows }: { rows: ProductRow[] }) {
  const top = [...rows]
    .filter((row) => row.stockValue > 0)
    .sort((a, b) => b.stockValue - a.stockValue)
    .slice(0, 5);

  if (top.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line px-4 py-10 text-center text-sm text-muted-foreground">
        No stock value to show yet.
      </p>
    );
  }
  const max = top[0].stockValue;

  return (
    <ol className="flex flex-col gap-4">
      {top.map((row, index) => (
        <li key={row.id}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <Link
              href={`/inventory/products/${row.id}`}
              className="min-w-0 truncate font-medium hover:text-brand hover:underline"
            >
              <span className="mr-2 text-muted-foreground">{index + 1}.</span>
              {row.name}
            </Link>
            <span className="shrink-0 font-semibold">{money(row.stockValue)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-tertiary">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${Math.max(2, (row.stockValue / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ */
/* table columns                                                        */
/* ------------------------------------------------------------------ */

// shown when a KPI card is clicked
const productColumns: DataTableColumn<ProductRow>[] = [
  {
    key: "name",
    header: "Product",
    isSort: true,
    cell: (row) => (
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-brand-soft text-brand">
          {row.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={row.image} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus className="size-4" />
          )}
        </div>
        <div className="min-w-0">
          <Link
            href={`/inventory/products/${row.id}`}
            className="block font-medium break-words hover:text-brand hover:underline"
          >
            {row.name}
          </Link>
          <span className="font-mono text-xs text-muted-foreground">{row.sku}</span>
        </div>
      </div>
    ),
  },
  { key: "categoryName", header: "Category", isSort: true, cell: (row) => row.categoryName },
  { key: "supplierName", header: "Supplier", isSort: true, cell: (row) => row.supplierName },
  {
    key: "availableQuantity",
    header: "Available / total",
    isSort: true,
    cell: (row) => (
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-medium">
          {row.availableQuantity} / {row.quantity}
        </span>
        <Badge variant={row.stock.status}>{row.stock.label}</Badge>
      </div>
    ),
  },
  { key: "unitPrice", header: "Unit price", isSort: true, cell: (row) => money(row.unitPrice) },
  {
    key: "stockValue",
    header: "Stock value",
    isSort: true,
    cellClassName: "font-semibold",
    cell: (row) => money(row.stockValue),
  },
];

// same columns as the Stock management page
const movementColumns: DataTableColumn<MovementRow>[] = [
  {
    key: "created_at",
    header: "Date & time",
    cellClassName: "whitespace-nowrap font-medium",
    cell: (row) => formatDateTime(row.created_at),
  },
  {
    key: "productName",
    header: "Product",
    cell: (row) => (
      <div className="flex flex-col">
        <Link
          href={`/inventory/products/${row.product_id}`}
          className="font-medium hover:underline"
        >
          {row.productName}
        </Link>
        <span className="font-mono text-xs text-muted-foreground">{row.sku}</span>
      </div>
    ),
  },
  {
    key: "type",
    header: "Stock status",
    cell: (row) => (
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
          row.type === "in" ? "bg-brand-soft text-brand" : "bg-danger-soft text-danger",
        )}
      >
        {row.type === "in" ? "Stock in" : "Stock out"}
      </span>
    ),
  },
  {
    key: "change",
    header: "Quantity change",
    cell: (row) => (
      <span className={cn("font-semibold", row.change > 0 ? "text-brand" : "text-danger")}>
        {row.change > 0 ? `+${row.change}` : row.change}
      </span>
    ),
  },
  { key: "new_quantity", header: "New quantity", cell: (row) => row.new_quantity },
  {
    key: "reason",
    header: "Reason",
    cell: (row) => <span className="capitalize">{row.reason}</span>,
  },
];

/* ------------------------------------------------------------------ */
/* page                                                                 */
/* ------------------------------------------------------------------ */

export default function InventoryDashboardPage() {
  const router = useRouter();
  const products = useSelector(selectAllProducts);
  const categories = useSelector(selectAllCategories);
  const suppliers = useSelector(selectAllSuppliers);
  const movements = useSelector(selectAllMovements);

  const [selected, setSelected] = useState<CardId | null>(null);

  // each movement joined with its product and category (newest first, as the slice stores them)
  const movementRows = useMemo<MovementRow[]>(
    () =>
      movements.map((movement) => {
        const product = products.find((item) => item.id === movement.product_id);
        const category = categories.find((item) => item.id === product?.categoryId);
        return {
          ...movement,
          productName: product?.name ?? "Deleted product",
          sku: product?.sku ?? "—",
          categoryName: category?.name ?? "—",
        };
      }),
    [movements, products, categories],
  );

  const productRows = useMemo<ProductRow[]>(() => {
    const categoryById = new Map(categories.map((category) => [category.id, category.name]));
    const supplierById = new Map(suppliers.map((supplier) => [supplier.id, supplier.name]));

    return products.map((product) => {
      const stock = getStockStatus(product.availableQuantity, product.quantity);
      const isOut = product.availableQuantity <= 0;
      return {
        ...product,
        categoryName: categoryById.get(product.categoryId) ?? "—",
        supplierName: supplierById.get(product.supplierId) ?? "—",
        stockValue: product.unitPrice * product.availableQuantity,
        stock,
        isOut,
        // "low" is whatever getStockStatus says is low (so the threshold lives in one place)
        isLow: !isOut && stock.label === "Low stock",
      };
    });
  }, [products, categories, suppliers]);

  const categoryStats = useMemo<CategoryStat[]>(
    () =>
      categories
        .map((category) => {
          const items = productRows.filter((row) => row.categoryId === category.id);
          return {
            name: category.name,
            value: items.reduce((sum, row) => sum + row.stockValue, 0),
            units: items.reduce((sum, row) => sum + row.availableQuantity, 0),
            products: items.length,
          };
        })
        .sort((a, b) => b.value - a.value),
    [categories, productRows],
  );

  const totalValue = productRows.reduce((sum, row) => sum + row.stockValue, 0);
  const lowStock = productRows.filter((row) => row.isLow);
  const outOfStock = productRows.filter((row) => row.isOut);
  const inStockCount = productRows.length - lowStock.length - outOfStock.length;
  const unitsAvailable = productRows.reduce((sum, row) => sum + row.availableQuantity, 0);
  const unitsReceived = productRows.reduce((sum, row) => sum + row.quantity, 0);

  const kpis: Kpi[] = [
    {
      id: "products",
      label: "Total products",
      value: String(productRows.length),
      hint: `${categories.length} categories · ${suppliers.length} suppliers`,
      icon: Boxes,
      tone: "ok",
    },
    {
      id: "value",
      label: "Total stock value",
      value: compactMoney(totalValue),
      hint: money(totalValue),
      icon: Wallet,
      tone: "ok",
    },
    {
      id: "low",
      label: "Low stock items",
      value: String(lowStock.length),
      hint: "20% or less left",
      icon: TriangleAlert,
      tone: "warn",
    },
    {
      id: "out",
      label: "Out of stock",
      value: String(outOfStock.length),
      hint: "Needs restocking",
      icon: PackageX,
      tone: "danger",
    },
  ];

  // what each card shows when it is clicked
  const details: Record<
    CardId,
    { title: string; description: string; data: ProductRow[]; empty: string }
  > = {
    products: {
      title: "All products",
      description: `${productRows.length} products across ${categories.length} categories`,
      data: [...productRows].sort((a, b) => a.name.localeCompare(b.name)),
      empty: "No products yet.",
    },
    value: {
      title: "Stock value by product",
      description: `${money(totalValue)} in total (available units × unit price)`,
      data: [...productRows].sort((a, b) => b.stockValue - a.stockValue),
      empty: "No products yet.",
    },
    low: {
      title: "Low stock items",
      description: "20% or less of the received quantity is left.",
      data: [...lowStock].sort((a, b) => a.availableQuantity - b.availableQuantity),
      empty: "No products are running low.",
    },
    out: {
      title: "Out of stock items",
      description: "No units available. Restock these first.",
      data: outOfStock,
      empty: "Everything is in stock.",
    },
  };

  const toggle = (id: CardId) => setSelected((current) => (current === id ? null : id));
  const detail = selected ? details[selected] : null;

  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="border-l-4 border-brand p-1 text-3xl font-extrabold tracking-tight">
            Inventory dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Stock levels, value and recent activity at a glance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/inventory/stockManagement")}
          >
            Stock management
          </Button>
          <Button type="button" variant="primary" onClick={() => router.push("/inventory/products")}>
            Products
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard
            key={kpi.id}
            label={kpi.label}
            value={kpi.value}
            hint={kpi.hint}
            icon={kpi.icon}
            tone={kpi.tone}
            active={selected === kpi.id}
            controls={DETAIL_ID}
            onClick={() => toggle(kpi.id)}
          />
        ))}
      </div>

      {/* Details for the clicked card */}
      {detail && selected && (
        <div id={DETAIL_ID} className="mt-4">
          <Panel
            title={detail.title}
            description={detail.description}
            action={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Close details"
                onClick={() => setSelected(null)}
              >
                <X />
              </Button>
            }
          >
            <DataTable
              key={selected}
              columns={productColumns}
              data={detail.data}
              getRowKey={(row) => row.id}
              caption={detail.title}
              emptyMessage={detail.empty}
              noResultsMessage="No products match your search."
              searchFields={["name", "sku", "categoryName", "supplierName"]}
              searchPlaceholder="Search by product, SKU, category or supplier..."
              pageSize={5}
              minWidth={760}
              className="border border-line"
            />
          </Panel>
        </div>
      )}

      {/* Charts */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Stock value by category" description="Available units × unit price">
          <CategoryBars data={categoryStats} />
        </Panel>

        <Panel title="Stock health" description="How your products are doing right now">
          <StockHealth
            inStock={inStockCount}
            low={lowStock.length}
            out={outOfStock.length}
            unitsAvailable={unitsAvailable}
            unitsReceived={unitsReceived}
          />
        </Panel>

        <Panel title="Stock movement" description="Units in and out over the last 7 days">
          <MovementChart rows={movementRows} />
        </Panel>

        <Panel title="Top products by stock value" description="Your five most valuable products">
          <TopValueList rows={productRows} />
        </Panel>
      </div>

      {/* Latest stock movements */}
      <Panel
        className="mt-4"
        title="Latest stock movements"
        description="The five most recent changes across all products"
        action={
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/inventory/stockManagement")}
          >
            View all
          </Button>
        }
      >
        <DataTable
          columns={movementColumns}
          data={movementRows.slice(0, 5)}
          getRowKey={(row) => row.id}
          caption="Latest stock movements"
          emptyMessage="No stock movements yet. Use Adjust stock on a product's page to record one."
          minWidth={720}
          className="border border-line"
        />
      </Panel>
    </div>
  );
}