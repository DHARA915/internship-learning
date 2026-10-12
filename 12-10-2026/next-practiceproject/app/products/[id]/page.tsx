// app/products/[id]/page.tsx
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ id: string }>;
};

type Review = {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
};

type ProductDetail = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
  reviews: Review[];
  images: string[];
  thumbnail: string;
};

// Only request the fields this page shows (dummyjson `select`).
const FIELDS =
  "id,title,description,category,brand,price,discountPercentage,rating,stock," +
  "availabilityStatus,tags,sku,weight,dimensions,warrantyInformation," +
  "shippingInformation,returnPolicy,reviews,images,thumbnail";

const MAX_THUMBNAILS = 4;
const MAX_TAGS = 3;
const MAX_REVIEWS = 2;

async function getProduct(id: string): Promise<ProductDetail> {
  const res = await fetch(`https://dummyjson.com/products/${id}?select=${FIELDS}`);
  if (res.status === 404) notFound();
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

async function ProductDetails({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  const thumbs = product.images.slice(0, MAX_THUMBNAILS);
  const tags = product.tags.slice(0, MAX_TAGS);
  const reviews = product.reviews.slice(0, MAX_REVIEWS);
  const { width, height, depth } = product.dimensions;

  const specs = [
    { label: "SKU", value: product.sku },
    { label: "Weight", value: `${product.weight} kg` },
    { label: "Dimensions (W×H×D)", value: `${width} × ${height} × ${depth}` },
    { label: "Warranty", value: product.warrantyInformation },
    { label: "Shipping", value: product.shippingInformation },
    { label: "Return policy", value: product.returnPolicy },
  ];

  return (
    <div>
      <Link
        href="/products"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-foreground-primary!"
      >
        <ArrowLeft size={18} />
        Back to products
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Images */}
        <div>
          <div className="rounded-xl bg-background-secondary p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.thumbnail}
              alt={product.title}
              className="mx-auto h-72 w-full object-contain sm:h-96"
            />
          </div>

          {thumbs.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {thumbs.map((img) => (
                <div
                  key={img}
                  className="h-16 w-16 shrink-0 rounded-lg border border-border bg-background-secondary p-1"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="h-full w-full object-contain" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main info */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground-primary">
            {product.category}
            {product.brand ? ` · ${product.brand}` : ""}
          </span>

          <h1>{product.title}</h1>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              ${product.price}
            </span>
            <span className="rounded-md bg-background-primary-soft px-2 py-0.5 text-sm font-semibold text-foreground-primary">
              {product.discountPercentage}% off
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-muted">
            <span className="flex items-center gap-1">
              <Star size={16} className="fill-current" />
              {product.rating.toFixed(1)}
            </span>
            <span>{product.availabilityStatus}</span>
            <span>{product.stock} in stock</span>
          </div>

          <p>{product.description}</p>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-background-primary-soft px-3 py-1 text-xs font-medium text-foreground-primary"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-10">
        <div className="mb-3 text-lg font-bold text-foreground">Details</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="rounded-lg border border-border bg-background-secondary p-3"
            >
              <div className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
                {spec.label}
              </div>
              <div className="mt-1 text-sm font-semibold text-foreground">
                {spec.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-10">
        <div className="mb-3 text-lg font-bold text-foreground">
          Reviews ({product.reviews.length})
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="rounded-xl border border-border bg-background-card p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">
                  {review.reviewerName}
                </span>
                <span className="flex items-center gap-1 text-sm text-foreground-muted">
                  <Star size={14} className="fill-current" />
                  {review.rating}
                </span>
              </div>
              <p className="mt-1">{review.comment}</p>
              <span className="text-xs text-foreground-muted">
                {new Date(review.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailsPage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="h-80 animate-pulse rounded-xl bg-background-muted" />
      }
    >
      <ProductDetails params={params} />
    </Suspense>
  );
}