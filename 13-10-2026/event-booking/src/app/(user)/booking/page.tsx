// app/bookings/page.tsx
"use client";

import {  useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trash2,  } from "lucide-react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Event } from "@/data/events/events";
import type { Registration } from "@/data/registration/registrationdata";
import { seatsReleased, selectAllEvents } from "@/Redux/Slices/eventslice";
import {
  registrationRemoved,
  selectAllRegistrations,
} from "@/Redux/Slices/Registrationsslice ";
import BookingCard from "@/components/user/BookingCard";

export default function BookingsPage() {
  const dispatch = useDispatch();
  const bookings = useSelector(selectAllRegistrations);
  const events = useSelector(selectAllEvents);

  // the booking the user clicked "Cancel booking" on (asks for confirmation first)
  const [cancelling, setCancelling] = useState<Registration | null>(null);

  const eventById = useMemo(
    () => new Map<number, Event>(events.map((event) => [event.id, event])),
    [events],
  );


  // newest booking first
  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => b.id - a.id),
    [bookings],
  );

  // removes the booking and gives its seats back to the event
  const handleCancel = () => {
    if (!cancelling) return;

    dispatch(registrationRemoved(cancelling.id));
    dispatch(seatsReleased({ id: cancelling.event_id, tickets: cancelling.tickets }));
  };

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight">My bookings</h1>
        <p className="mt-2 text-muted-foreground">
          {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}. Show the QR code at
          the gate.
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {sortedBookings.length === 0 && (
          <p className="rounded-2xl bg-card p-10 text-center text-muted-foreground">
            You have no bookings yet.
          </p>
        )}

        {sortedBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            event={eventById.get(booking.event_id)}
            onCancel={() => setCancelling(booking)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={cancelling !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setCancelling(null);
        }}
        variant="danger"
        icon={Trash2}
        title="Cancel this booking?"
        description={
          cancelling && (
            <>
              <span className="font-medium text-foreground">{cancelling.event_title}</span>{" "}
              ({cancelling.tickets} {cancelling.tickets === 1 ? "ticket" : "tickets"}, code{" "}
              {cancelling.code}) will be removed and its QR code will stop working. This cannot be
              undone.
            </>
          )
        }
        confirmLabel="Yes, cancel booking"
        cancelLabel="Keep booking"
        onConfirm={handleCancel}
      />
    </div>
  );
}