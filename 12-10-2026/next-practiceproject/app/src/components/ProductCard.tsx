import Link from "next/link";


type ProductCardProps = {
  id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  rating: number;
};

export default function ProductCard({
  id,
  title,
  description,
  price,
  image,
  rating,
}: ProductCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-background-card shadow-sm transition-shadow hover:shadow-md">
      <div className="bg-background-secondary">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-44 w-full object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="line-clamp-1 font-semibold text-foreground">{title}</div>

        <div className="line-clamp-2 text-sm text-foreground-muted">
          {description}
        </div>

        <div className="text-sm text-foreground-secondary">
          ⭐ {rating.toFixed(1)}
        </div>

        <div className="mt-auto flex-col md:flex-row flex items-center justify-between pt-3">
          <span className="text-lg font-bold text-foreground">${price}</span>
          <Link
            href={`/products/${id}`}
            className="rounded-lg bg-background-primary  items-center  px-2 py-2 text-sm font-semibold text-foreground-on-primary! transition-colors hover:bg-background-primary-hover"
          >
             View Details
          </Link>
        </div>
      </div>
    </div>
  );
}