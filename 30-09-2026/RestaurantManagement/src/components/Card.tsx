import type { ReactNode } from "react";

interface CardProps {
  image?: string;
  title: string;
  badge?: ReactNode;
  price?: string;
  footer?: ReactNode;
  onClick?: () => void;
}

const Card = ({ image, title, badge, price, footer, onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-primary shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      {/* Image: same square size for every item */}
      {image && (
        <div className="relative aspect-square w-full shrink-0 overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {badge && <div className="absolute left-3 top-3">{badge}</div>}
        </div>
      )}

    {/* Details */}
<div className="flex flex-1 flex-col gap-2 border-t border-line p-4">
  <div className="flex items-center justify-between gap-3">
    <h3 className="line-clamp-2 text-base font-semibold leading-snug text-primary">
      {title}
    </h3>

    {price && (
      <span className="shrink-0 text-base font-bold text-button-primary">{price}</span>
    )}
  </div>

  {footer && <div className="pt-1">{footer}</div>}
</div>
    </div>
  );
};

export default Card;