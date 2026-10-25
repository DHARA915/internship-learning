// components/EventCard.tsx
import { CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  isSoldOut,
  seatsLeft,
  type Event,
  type EventCategory,
} from "@/data/events/events";
import { cn } from "cn";

// Full class names so Tailwind can see them
const categoryBg: Record<EventCategory, string> = {
  Technology: "bg-cat-technology",
  Business: "bg-cat-business",
  Design: "bg-cat-design",
  Music: "bg-cat-music",
};

const categoryDot: Record<EventCategory, string> = {
  Technology: "bg-cat-technology",
  Business: "bg-cat-business",
  Design: "bg-cat-design",
  Music: "bg-cat-music",
};

// "Filling fast" when 15% or fewer seats are left
const FILLING_FAST_RATIO = 0.15;

const formatWhen = (e: Event) => {
  const d = new Date(`${e.date}T${e.start_time}`);
  const day = d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = d
    .toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
  return `${day}, ${time}`;
};

type EventCardProps = {
  event: Event;
  onRegister?: (event: Event) => void;
  /** open the details dialog (click on the card or press Enter on the title) */
  onOpen?: (event: Event) => void;
  className?: string;
};

export function EventCard({
  event,
  onRegister,
  onOpen,
  className,
}: EventCardProps) {
  const left = seatsLeft(event);
  const soldOut = isSoldOut(event);
  const fillingFast = !soldOut && left / event.capacity <= FILLING_FAST_RATIO;
  const pct = Math.min(
    Math.round((event.registered / event.capacity) * 100),
    100,
  );

  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      {/* Top banner: category + status */}
      <div
        className={cn(
          "flex h-32 items-start justify-between p-4",
          categoryBg[event.category],
        )}
      >
        <Badge variant="outline" className="h-6 border-transparent bg-card px-2.5">
          <span
            className={cn("size-2 rounded-full", categoryDot[event.category])}
          />
          {event.category}
        </Badge>

        {soldOut && (
          <Badge variant="soldout" className="h-6 px-2.5">
            Sold out
          </Badge>
        )}
        {fillingFast && (
          <Badge variant="filling" className="h-6 px-2.5">
            Filling fast
          </Badge>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold leading-snug">
          {/* stretched button: the whole card opens the dialog, but Register stays separate */}
          <Button
            type="button"
            onClick={() => onOpen?.(event)}
            className="line-clamp-2 cursor-pointer text-left outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {event.title}
          </Button>
        </h3>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {event.description}
        </p>

        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" />
            {formatWhen(event)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">
              {event.venue}, {event.city}
            </span>
          </p>
        </div>

        {/* Seats */}
        <div className="mt-auto border-t border-dashed border-line-strong pt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {event.registered} of {event.capacity} registered
            </span>
            <span className="font-semibold">
              {soldOut ? "Sold out" : `${left} seats left`}
            </span>
          </div>

          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
            <div
              className={cn(
                "h-full rounded-full",
                soldOut
                  ? "bg-danger"
                  : fillingFast
                    ? "bg-accent"
                    : "bg-button-primary",
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Price + register */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div>
            <p className="text-2xl font-extrabold leading-tight">
              {formatPrice(event)}
            </p>
            <p className="text-xs text-muted-foreground">
              {event.price_type === "free"
                ? "No payment needed"
                : "per attendee"}
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            disabled={soldOut}
            className="relative z-10"
            onClick={() => onRegister?.(event)}
          >
            {soldOut ? "Sold out" : "Register"}
          </Button>
        </div>
      </div>
    </article>
  );
}