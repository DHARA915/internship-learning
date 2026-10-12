import { Heart, ImageOff } from "lucide-react";
import { useState } from "react";
import { type ImageCardProps } from "../../utils/ImageGallaryUtils/ImageGallarydata";
import { Button } from "../../components/ui/button";

const ImageCard = ({ item, toggleLike, onOpen }: ImageCardProps) => {
  const [failedSrc, setFailedSrc] = useState<string>();
  const isBroken = !item.image || failedSrc === item.image;

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Button type="button" onClick={onOpen} className="block w-full">
          {isBroken ? (
            <div
              role="img"
              aria-label={`${item.title} (image unavailable)`}
              className="flex h-full w-full flex-col items-center justify-center gap-1 text-gray-400"
            >
              <ImageOff size={28} strokeWidth={1.5} />
              <span className="text-xs">Image unavailable</span>
            </div>
          ) : (
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="h-full w-full object-fill transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </Button>
      </div>
      <div className="flex min-w-0 items-center justify-between gap-3 p-3 sm:p-4">
        <div className="min-w-0 flex-1">
          <h3
            title={item.title}
            className="truncate text-sm font-semibold text-gray-900 sm:text-base"
          >
            {item.title}
          </h3>

          <p className="mt-1 truncate text-xs text-gray-500 sm:text-sm">
            {item.category}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            type="button"
            onClick={() => toggleLike(item.id)}
            aria-label={
              item.isLike ? `Unlike ${item.title}` : `Like ${item.title}`
            }
            aria-pressed={item.isLike}
            className=" flex h-9 w-9 items-center justify-center rounded-full   transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <Heart
              size={19}
              className={`transition-colors ${
                item.isLike
                  ? "fill-red-500 text-red-500"
                  : "fill-transparent text-gray-600"
              }`}
            />
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ImageCard;
