"use client";

import { Button } from "@/components/ui/button";
import type { Genre } from "@/data/musichub/music";

export type GenreFilterValue = "All" | Genre;

type GenreFilterProps = {
  /** Genres to show as chips ("All" is added in front automatically). */
  genres: readonly Genre[];
  value: GenreFilterValue;
  onChange: (genre: GenreFilterValue) => void;
  /** Shown at the right: "12 results". */
  resultCount: number;
};

export default function GenreFilter({ genres, value, onChange, resultCount }: GenreFilterProps) {
  const filters: GenreFilterValue[] = ["All", ...genres];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filter by genre">
        {filters.map((item) => {
          const isActive = value === item;
          return (
            <Button
              key={item}
              type="button"
              role="tab"
              size="sm"
              aria-selected={isActive}
              className={`shrink-0 rounded-full ${
                isActive
                  ? "bg-brand text-foreground"
                  : "bg-hover text-muted-foreground hover:bg-hover"
              }`}
              onClick={() => onChange(item)}
            >
              {item}
            </Button>
          );
        })}
      </div>
      <span className="text-sm text-muted-foreground">{resultCount} results</span>
    </div>
  );
}