import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { formatPrice, type MenuItem } from "../../utils/MenuItemdata";

/* ---------- pieces the card is made of (also exported for the drawer) ---------- */

export const VegMark = ({ isVeg }: { isVeg: boolean }) => (
  <span
    title={isVeg ? "Veg" : "Non-veg"}
    className={`flex size-5 shrink-0 items-center justify-center rounded-sm border-2 bg-white ${
      isVeg ? "border-green-600" : "border-red-600"
    }`}
  >
    <span
      className={`size-2.5 rounded-full ${
        isVeg ? "bg-green-600" : "bg-red-600"
      }`}
    />
  </span>
);

/** image, or the first letter of the name when the URL is empty or broken */
export const ItemImage = ({
  src,
  name,
  className,
}: {
  src: string;
  name: string;
  className: string;
}) => {
  // remember which URL failed, so a new src is tried again automatically
  const [failedSrc, setFailedSrc] = useState<string>();

  if (!src || failedSrc === src) {
    return (
      <div
        role="img"
        aria-label={name}
        className={`flex items-center justify-center bg-brand-soft text-4xl font-semibold text-primary ${className}`}
      >
        {name.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={`object-cover ${className}`}
    />
  );
};

/* ---------- the card ---------- */

type ItemCardProps = {
  item: MenuItem;
  /** price shown on the card (for items with preferences it is the starting price) */
  startPrice: number;
  onClick: () => void;
  /** dull, not clickable (for example when the menu is not being served) */
  disabled?: boolean;
  showDescription?: boolean;
  showModifiers?: boolean;
};

const ItemCard = ({
  item,
  startPrice,
  onClick,
  disabled = false,
  showDescription = true,
  showModifiers = true,
}: ItemCardProps) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-disabled={disabled}
    className={`flex h-full flex-col overflow-hidden rounded-xl border border-line bg-primary text-left transition ${
      disabled ? "cursor-not-allowed opacity-60 grayscale" : "hover:shadow-md"
    }`}
  >
    <ItemImage src={item.image} name={item.name} className="h-40 w-full" />

    <div className="flex flex-1 flex-col gap-2 p-4">
      <div className="flex items-start gap-2">
        <VegMark isVeg={item.isVeg} />
        <h3 className="text-base font-semibold leading-tight text-primary">
          {item.name}
        </h3>
      </div>

      {showDescription && (
        <p className="line-clamp-2 text-sm text-secondary">
          {item.description}
        </p>
      )}

      {showModifiers && item.modifiers.length > 0 && (
        <p className="flex items-center gap-1.5 text-xs text-tertiary">
          <SlidersHorizontal className="size-3.5" />
          {item.modifiers.map((g) => g.groupName).join(" · ")}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between pt-2">
        <span className="text-base font-semibold text-button-primary">
          {item.modifiers.length > 0 ? "From " : ""}
          {formatPrice(startPrice)}
        </span>
        <span
          className={`rounded-lg px-3 py-1 text-xs font-semibold ${
            disabled
              ? "bg-gray-200 text-gray-500"
              : "bg-button-primary text-hover"
          }`}
        >
          {disabled ? "Unavailable" : "Add"}
        </span>
      </div>
    </div>
  </button>
);

export default ItemCard;