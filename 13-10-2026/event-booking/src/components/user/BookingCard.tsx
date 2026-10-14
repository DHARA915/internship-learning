"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import type { Event, EventCategory } from "@/data/events/events";
import type { Registration } from "@/data/registration/registrationdata";

const Detail = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="mt-0.5 font-medium">{children}</p>
  </div>
);

// Uses the saved QR; older bookings without one get a QR made from the same data
const TicketQr = ({ booking }: { booking: Registration }) => {
  const [generated, setGenerated] = useState("");

  useEffect(() => {
    if (booking.qr_code) return;
    let active = true;
    QRCode.toDataURL(
      JSON.stringify({
        code: booking.code,
        event_id: booking.event_id,
        name: booking.full_name,
        tickets: booking.tickets,
      }),
      { width: 320, margin: 1, color: { dark: "#111111", light: "#ffffff" } },
    ).then((url) => {
      if (active) setGenerated(url);
    });
    return () => {
      active = false;
    };
  }, [booking]);

  const src = booking.qr_code || generated;

  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={`QR code for ${booking.code}`} className="size-36 rounded-lg" />
  ) : (
    <div className="size-36 rounded-lg bg-muted" aria-hidden="true" />
  );
};

const BookingCard = ({
  booking,
  event,
  onCancel,
}: {
  booking: Registration;
  event: Event | undefined;
  onCancel: () => void;
}) => {
const inr = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
// Full class names so Tailwind can see them
const categoryTile: Record<EventCategory, string> = {
  Technology: "bg-cat-technology",
  Business: "bg-cat-business",
  Design: "bg-cat-design",
  Music: "bg-cat-music",
};
    const getWhen = (event: Event | undefined) => {
      const date = event ? new Date(`${event.date}T${event.start_time}`) : null;
      if (!date || Number.isNaN(date.getTime())) return null;
    
      const day = date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const time = date
        .toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true })
        .toLowerCase();
    
      return {
        dayNumber: date.getDate(),
        month: date.toLocaleDateString("en-IN", { month: "short" }),
        text: `${day}, ${time}`,
      };
    };

  const when = getWhen(event);
  const venue = event ? [event.venue, event.city].filter(Boolean).join(", ") : "";

  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl bg-card md:flex-row">
      {/* Date tile */}
      <div
        className={cn(
          "flex shrink-0 flex-col items-center justify-center p-6 text-white md:w-36",
          event ? categoryTile[event.category] : "bg-brand",
        )}
      >
        <span className="text-5xl font-extrabold leading-none">{when?.dayNumber ?? "--"}</span>
        <span className="mt-1 text-sm font-semibold uppercase tracking-wide">
          {when?.month ?? ""}
        </span>
      </div>

      {/* Details */}
      <div className="flex-1 p-6">
        <h2 className="text-xl font-extrabold leading-tight tracking-tight">
          {booking.event_title}
        </h2>

        <div className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <Detail label="Date and time">{when?.text ?? "Not set"}</Detail>
          <Detail label="Venue">{venue || "Not available"}</Detail>
          <Detail label="Tickets">
            {booking.tickets} {booking.tickets === 1 ? "ticket" : "tickets"}
          </Detail>
          <Detail label="Attendee">{booking.full_name}</Detail>
        </div>

        <p className="mt-5 text-sm text-muted-foreground">
          {booking.total_amount > 0 ? `Paid ${inr(booking.total_amount)}` : "Free registration"}
        </p>
      </div>

      {/* Ticket stub */}
      <div className="relative border-t-2 border-dashed border-line-strong md:w-96 md:border-l-2 md:border-t-0">
        {/* cut-outs where the stub is torn off */}
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 hidden size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background md:block"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-0 hidden size-5 -translate-x-1/2 translate-y-1/2 rounded-full bg-background md:block"
        />

        <div className="flex h-full items-center gap-5 p-6">
          <TicketQr booking={booking} />

          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted-foreground">Ticket code</p>
            <p className="font-mono text-lg font-bold tracking-wide">{booking.code}</p>

            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="-ml-3 mt-3 text-danger hover:bg-danger-soft hover:text-danger"
            >
              <X />
              Cancel booking
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BookingCard