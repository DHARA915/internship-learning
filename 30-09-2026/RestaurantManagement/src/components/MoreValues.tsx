import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Badge } from "./ui/badge";

interface MoreValuesProps<T> {
  items: T[];
  visibleCount?: number;
  title?: string;
  renderItem: (item: T, index: number) => React.ReactNode;
}

export function MoreValues<T>({
  items,
  visibleCount = 3,
  title = "More Items",
  renderItem,
}: MoreValuesProps<T>) {
  const visibleItems = items.slice(0, visibleCount);
  const remainingItems = items.slice(visibleCount);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {/* Visible items */}
      {visibleItems.map((item, index) => (
        <React.Fragment key={index}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}

      {/* Remaining items */}
      {remainingItems.length > 0 && (
        <Popover>
          <PopoverTrigger >
            <Badge
              variant="option"
              className="cursor-pointer border-dashed hover:bg-secondary"
            >
              +{remainingItems.length}
            </Badge>
          </PopoverTrigger>

          <PopoverContent
            side="top"
            align="start"
            className=" w-auto max-w-[280px] rounded-xl border border-line bg-primary p-3 shadow-lg"
          >
            <div className="mb-3">
              <p className="text-sm font-semibold text-primary">
                {title}
              </p>
            </div>

            <div className="flex max-h-52 flex-col gap-1.5 overflow-y-auto">
              {remainingItems.map((item, index) => (
                <React.Fragment key={index}>
                  {renderItem(item, index)}
                </React.Fragment>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
