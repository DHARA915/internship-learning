// components/EventDetailDialog.tsx
"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import {
  CalendarDays,
  Clock,
  MapPin,
  Mic,
  Ticket,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  formatPrice,
  isSoldOut,
  parseAgenda,
  seatsLeft,
  type Event,
  type EventCategory,
} from "@/data/events/events";
import { cn } from "cn";

const categoryBg: Record<EventCategory, string> = {
  Technology: "bg-cat-technology",
  Business: "bg-cat-business",
  Design: "bg-cat-design",
  Music: "bg-cat-music",
};

type TabKey = "overview" | "agenda" | "speaker";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "agenda", label: "Agenda" },
  { key: "speaker", label: "Speaker" },
];

// "Sat, 14 Nov 2026"
const formatDate = (e: Event) =>
  new Date(`${e.date}T${e.start_time}`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// "09:00" -> "9:00 am"
const formatTime = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(2000, 0, 1, h, m);
  return d
    .toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};

// "09:00 Registration and chai" -> { time: "9:00 am", text: "Registration and chai" }
const parseAgendaItem = (item: string) => {
  const match = item.match(/^(\d{1,2}:\d{2})\s+(.*)$/);
  return match
    ? { time: formatTime(match[1]), text: match[2] }
    : { time: "", text: item };
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

type EventDetailDialogProps = {
  event: Event | null;
  onOpenChange: (open: boolean) => void;
  onRegister?: (event: Event) => void;
};


function DialogBody({
  event: e,
  tab,
  setTab,
  onRegister,
}: {
  event: Event;
  tab: TabKey;
  setTab: (t: TabKey) => void;
  onRegister?: (event: Event) => void;
}) {
  const left = seatsLeft(e);
  const soldOut = isSoldOut(e);
  const pct = Math.min(Math.round((e.registered / e.capacity) * 100), 100);
  const fillingFast = !soldOut && left / e.capacity <= 0.15;
  const agenda = parseAgenda(e).map(parseAgendaItem);

  return (
    <>
      {/* Header */}
      <div className={cn("relative shrink-0 px-5 pb-6 pt-5 text-primary-foreground sm:px-8", categoryBg[e.category])}>
        <Dialog.Close
          aria-label="Close"
          className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full bg-card text-foreground transition-colors hover:bg-muted"
        >
          <X className="size-4" />
        </Dialog.Close>

        <Badge variant="outline" className="h-6 border-transparent bg-card px-2.5 text-foreground">
          {e.category}
        </Badge>

        <Dialog.Title className="mt-3 pr-10 text-2xl font-extrabold leading-tight tracking-tight sm:text-4xl">
          {e.title}
        </Dialog.Title>

        <Dialog.Description className="mt-3 flex flex-col gap-1.5 text-sm font-medium sm:flex-row sm:flex-wrap sm:gap-x-5">
          <span className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0" />
            {formatDate(e)}, {formatTime(e.start_time)}
          </span>
          <span className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            {e.venue}, {e.city}
          </span>
        </Dialog.Description>
      </div>

      {/* Tabs */}
      <div className="shrink-0 border-b border-line px-3 sm:px-6" role="tablist">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "relative px-3 py-3.5 text-sm font-medium transition-colors",
              tab === key
                ? "text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-button-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div className="grid flex-1 gap-6 overflow-y-auto p-5 sm:p-8 lg:grid-cols-[1fr_300px]">
        {/* Left: tab content */}
        <div className="min-w-0">
          {tab === "overview" && (
            <div className="flex flex-col gap-6">
              <section>
                <h3 className="text-lg font-bold">About this event</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {e.description}
                </p>
              </section>

              <dl className="grid grid-cols-2 gap-4 rounded-2xl bg-tertiary p-4 text-sm">
                <Detail label="Date" value={formatDate(e)} />
                <Detail
                  label="Time"
                  value={`${formatTime(e.start_time)} to ${formatTime(e.end_time)}`}
                />
                <Detail label="Venue" value={e.venue} />
                <Detail label="City" value={e.city} />
              </dl>
            </div>
          )}

        {tab === "agenda" && (
  <section>
    <h3 className="text-lg font-bold">Sessions</h3>

    <ol className="mt-4 flex flex-col gap-y-4">
      {agenda.map((item, i) => (
        <li key={i} className="flex gap-4">
          <span className="w-16 shrink-0 pt-0.5 text-sm font-semibold tabular-nums">
            {item.time}
          </span>

          <div className="relative flex-1 border-l border-line pb-0 pl-5">
            <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-button-primary" />
            <p className="font-medium leading-snug">{item.text}</p>
          </div>
        </li>
      ))}
    </ol>
  </section>
)}

          {tab === "speaker" && (
            <section>
              <h3 className="text-lg font-bold">Featured speaker</h3>
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-line p-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-brand-soft text-lg font-bold text-brand">
                  {initials(e.speaker)}
                </div>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold">
                    <Mic className="size-4 text-muted-foreground" />
                    {e.speaker}
                  </p>
                  <p className="text-sm text-muted-foreground">{e.speaker_role}</p>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Right: ticket panel (sits below the content on mobile) */}
        <aside className="h-fit rounded-2xl bg-tertiary p-5 lg:sticky lg:top-0">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Ticket</span>
            {fillingFast && (
              <Badge variant="filling" className="h-6 px-2.5">
                Filling fast
              </Badge>
            )}
            {soldOut && (
              <Badge variant="soldout" className="h-6 px-2.5">
                Sold out
              </Badge>
            )}
          </div>

          <p className="mt-1 text-3xl font-extrabold">{formatPrice(e)}</p>
          <p className="text-sm text-muted-foreground">
            {e.price_type === "free" ? "No payment needed" : "per attendee"}
          </p>

          <div className="mt-5 border-t border-dashed border-line-strong pt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {e.registered} of {e.capacity} registered
              </span>
              <span className="font-semibold">
                {soldOut ? "Sold out" : `${left} left`}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className={cn(
                  "h-full rounded-full",
                  soldOut ? "bg-danger" : fillingFast ? "bg-accent" : "bg-button-primary",
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            size="lg"
            className="mt-5 w-full"
            disabled={soldOut}
            onClick={() => onRegister?.(e)}
          >
            <Ticket />
            {soldOut ? "Sold out" : "Register now"}
          </Button>

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            {formatTime(e.start_time)} to {formatTime(e.end_time)}
          </p>
        </aside>
      </div>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold">{value}</dd>
    </div>
  );
}


const  EventDetailDialog=({
  event,
  onOpenChange,
  onRegister,
}: EventDetailDialogProps) =>{
  const [tab, setTab] = React.useState<TabKey>("overview");

  // always start on Overview when a different event opens
  React.useEffect(() => {
    setTab("overview");
  }, [event?.id]);

  // keep the last event while the dialog closes so content doesn't vanish
  const lastEvent = React.useRef<Event | null>(null);
  if (event) lastEvent.current = event;
  const e = event ?? lastEvent.current;

  return (
    <Dialog.Root open={!!event} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-[var(--overlay)]" />

        <Dialog.Popup className="fixed inset-x-0 bottom-0 z-50 flex max-h-[92dvh] flex-col overflow-hidden rounded-t-3xl bg-card shadow-[0_24px_64px_rgba(17,20,40,0.28)] outline-none sm:inset-auto sm:left-1/2 sm:top-1/2 sm:max-h-[90dvh] sm:w-[calc(100%-2rem)] sm:max-w-4xl sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl">
          {e && <DialogBody event={e} tab={tab} setTab={setTab} onRegister={onRegister} />}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default EventDetailDialog