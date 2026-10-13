"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CalendarPlus,
  Minus,
  PencilLine,
  Plus,
  Trash2,
} from "lucide-react";
import {
  formatPrice,
  seatsLeft,
  type CreateEventInput,
  type Event,
  type EventCategory,
} from "@/data/events/events";
import {
  agendaToList,
  eventAdded,
  eventDeleted,
  eventStatusToggled,
  eventUpdated,
  listToAgenda,
  selectAllEvents,
} from "@/Redux/Slices/eventslice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FormField from "@/components/form-field/FormField";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { CommonDialog, type FormValues } from "@/components/CommonDialog";
import { cn } from "cn";

type Tab = "all" | "published" | "draft" | "closed";
type Status = Exclude<Tab, "all">;

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "published", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "closed", label: "Closed" },
];

const CAPACITY_STEP = 10;

const categoryTile: Record<EventCategory, string> = {
  Technology: "bg-cat-technology",
  Business: "bg-cat-business",
  Design: "bg-cat-design",
  Music: "bg-cat-music",
};

// Which Badge variant + label to show for each status
const statusBadge = {
  published: { variant: "active", label: "Published" },
  closed: { variant: "inactive", label: "Closed" },
  draft: { variant: "option", label: "Draft" },
} as const;

// Draft -> "draft", published but full -> "closed", otherwise "published"
const getTab = (event: Event): Status =>
  event.status === "draft"
    ? "draft"
    : seatsLeft(event) === 0
      ? "closed"
      : "published";

const formatDate = (event: Event) => {
  const eventDate = new Date(`${event.date}T${event.start_time}`);
  const day = eventDate.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = eventDate
    .toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
  return `${day}, ${time}`;
};

type FormContext = {
  values: FormValues;
  setValue: (name: string, value: any) => void;
  errors: Record<string, string>;
};

const CATEGORY_OPTIONS = (Object.keys(categoryTile) as EventCategory[]).map(
  (category) => ({ label: category, value: category }),
);

const PRICE_TYPE_OPTIONS = [
  { label: "Free", value: "free" },
  { label: "Paid", value: "paid" },
];

const STATUS_OPTIONS = [
  { label: "Draft", value: "draft" },
  { label: "Published", value: "published" },
];

const NEW_EVENT_DEFAULTS: FormValues = {
  status: "draft",
  price_type: "free",
  price: 0,
};

/* ---------- form <-> event helpers ---------- */

// agenda is stored as "a | b | c" but edited as one item per line
const eventToFormValues = (event: Event): FormValues => ({
  ...event,
  agenda: agendaToList(event.agenda ?? "").join("\n"),
});

const toEventInput = (values: FormValues): CreateEventInput => {
  const isPaid = values.price_type === "paid";

  return {
    title: String(values.title).trim(),
    category: values.category,
    description: String(values.description).trim(),
    date: values.date,
    start_time: values.start_time,
    end_time: values.end_time,
    venue: String(values.venue).trim(),
    city: String(values.city).trim(),
    speaker: String(values.speaker).trim(),
    speaker_role: String(values.speaker_role ?? "").trim(),
    agenda: listToAgenda(String(values.agenda ?? "").split("\n")),
    price_type: values.price_type,
    price: isPaid ? Number(values.price) : 0,
    capacity: Number(values.capacity),
    status: values.status,
  } as CreateEventInput;
};

const validateEvent = (
  values: FormValues,
  registered: number,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const requiredLabels: Record<string, string> = {
    title: "Event title",
    category: "Category",
    description: "Description",
    date: "Date",
    start_time: "Start time",
    end_time: "End time",
    venue: "Venue",
    city: "City",
    speaker: "Speaker",
    capacity: "Capacity",
  };

  Object.entries(requiredLabels).forEach(([name, label]) => {
    if (!String(values[name] ?? "").trim()) errors[name] = `${label} is required`;
  });

  if (values.start_time && values.end_time && values.end_time <= values.start_time)
    errors.end_time = "End time must be after start time";

  // capacity can never drop below seats already sold
  const minCapacity = Math.max(1, registered);
  if (!errors.capacity && Number(values.capacity) < minCapacity)
    errors.capacity = `Capacity must be at least ${minCapacity}`;

  if (values.price_type === "paid" && !(Number(values.price) > 0))
    errors.price = "Enter a price greater than 0";

  return errors;
};

/* ---------- shared dialog fields (Create + Edit) ---------- */
const SectionTitle = ({ children }: { children: ReactNode }) => (
  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:col-span-2">
    {children}
  </h3>
);

const EventFields = ({
  values,
  setValue,
  errors,
  registered,
}: FormContext & { registered: number }) => (
  <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
    <SectionTitle>Basics</SectionTitle>

    <FormField
      type="text"
      name="title"
      label="Event title"
      placeholder="e.g. AI Automation for Small Business"
      value={values.title ?? ""}
      onChange={(value) => setValue("title", value)}
      error={errors.title}
      required
      className="sm:col-span-2"
    />

    <FormField
      type="select"
      name="category"
      label="Category"
      placeholder="Select category"
      options={CATEGORY_OPTIONS}
      value={values.category}
      onChange={(value) => setValue("category", value)}
      error={errors.category}
      required
    />

    <FormField
      type="select"
      name="status"
      label="Status"
      options={STATUS_OPTIONS}
      value={values.status}
      onChange={(value) => setValue("status", value)}
      error={errors.status}
    />

    <FormField
      type="textarea"
      name="description"
      label="Description"
      placeholder="What will attendees learn?"
      value={values.description ?? ""}
      onChange={(value) => setValue("description", value)}
      error={errors.description}
      required
      className="sm:col-span-2"
    />

    <SectionTitle>Schedule and venue</SectionTitle>

    <FormField
      type="date"
      name="date"
      label="Date"
      value={values.date ?? ""}
      onChange={(value) => setValue("date", value)}
      error={errors.date}
      required
    />

    <div className="hidden sm:block" aria-hidden="true" />

    <FormField
      type="time"
      name="start_time"
      label="Start time"
      value={values.start_time ?? ""}
      onChange={(value) => setValue("start_time", value)}
      error={errors.start_time}
      required
    />

    <FormField
      type="time"
      name="end_time"
      label="End time"
      value={values.end_time ?? ""}
      onChange={(value) => setValue("end_time", value)}
      error={errors.end_time}
      required
    />

    <FormField
      type="text"
      name="venue"
      label="Venue"
      placeholder="e.g. Tech Park Auditorium"
      value={values.venue ?? ""}
      onChange={(value) => setValue("venue", value)}
      error={errors.venue}
      required
    />

    <FormField
      type="text"
      name="city"
      label="City"
      placeholder="e.g. Bengaluru"
      value={values.city ?? ""}
      onChange={(value) => setValue("city", value)}
      error={errors.city}
      required
    />

    <SectionTitle>Speaker</SectionTitle>

    <FormField
      type="text"
      name="speaker"
      label="Speaker"
      placeholder="Full name"
      value={values.speaker ?? ""}
      onChange={(value) => setValue("speaker", value)}
      error={errors.speaker}
      required
    />

    <FormField
      type="text"
      name="speaker_role"
      label="Speaker role"
      placeholder="e.g. Founder, AutoKaro"
      value={values.speaker_role ?? ""}
      onChange={(value) => setValue("speaker_role", value)}
      error={errors.speaker_role}
    />

    <FormField
      type="textarea"
      name="agenda"
      label="Agenda"
      placeholder={"11:00 Welcome\n11:15 Talk: Five tasks you can automate"}
      helperText="One item per line"
      value={values.agenda ?? ""}
      onChange={(value) => setValue("agenda", value)}
      error={errors.agenda}
      className="sm:col-span-2"
    />

    <SectionTitle>Tickets</SectionTitle>

    <FormField
      type="number"
      name="capacity"
      label="Capacity"
      min={Math.max(1, registered)}
      helperText={
        registered > 0 ? `${registered} seats already sold` : "Total seats available"
      }
      value={String(values.capacity ?? "")}
      onChange={(value) =>
        setValue("capacity", value === "" ? "" : Number(value))
      }
      error={errors.capacity}
      required
    />

    <FormField
      type="select"
      name="price_type"
      label="Price type"
      options={PRICE_TYPE_OPTIONS}
      value={values.price_type}
      onChange={(value) => setValue("price_type", value)}
      error={errors.price_type}
    />

    {values.price_type === "paid" && (
      <FormField
        type="number"
        name="price"
        label="Price (₹)"
        min={1}
        value={String(values.price ?? "")}
        onChange={(value) => setValue("price", value === "" ? "" : Number(value))}
        error={errors.price}
        required
      />
    )}
  </div>
);

export default function AddEventsPage() {
  const dispatch = useDispatch();
  const events = useSelector(selectAllEvents);
  const [tab, setTab] = useState<Tab>("all");
  const [query, setQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null);

  const changeCapacity = (event: Event, delta: number) =>
    dispatch(
      eventUpdated({
        id: event.id,
        // capacity can never drop below seats already sold
        changes: { capacity: Math.max(event.registered, event.capacity + delta) },
      }),
    );

  const toggleRegistration = (event: Event) =>
    dispatch(eventStatusToggled(event.id));

  const counts = useMemo(
    () => ({
      all: events.length,
      published: events.filter((event) => getTab(event) === "published").length,
      draft: events.filter((event) => getTab(event) === "draft").length,
      closed: events.filter((event) => getTab(event) === "closed").length,
    }),
    [events],
  );

  const visibleEvents = useMemo(() => {
    const searchText = query.trim().toLowerCase();
    return events.filter((event) => {
      if (tab !== "all" && getTab(event) !== tab) return false;
      if (!searchText) return true;
      return [
        event.title,
        event.category,
        event.venue,
        event.city,
        event.speaker,
      ].some((fieldValue) => fieldValue.toLowerCase().includes(searchText));
    });
  }, [events, tab, query]);

  const handleNewEvent = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsFormOpen(true);
  };

  const handleSaveEvent = (values: FormValues) => {
    const eventInput = toEventInput(values);

    if (editingEvent) {
      dispatch(eventUpdated({ id: editingEvent.id, changes: eventInput }));
    } else {
      dispatch(eventAdded(eventInput));
    }
  };

  const handleDeleteEvent = () => {
    if (deletingEvent) dispatch(eventDeleted(deletingEvent.id));
  };

  const columns: DataTableColumn<Event>[] = [
    {
      key: "event",
      header: "Event",
      cell: (event) => (
        <div className="flex items-center gap-4">
          <div
            className={cn("h-12 w-14 shrink-0 rounded-lg", categoryTile[event.category])}
            aria-hidden="true"
          />
          <div className="min-w-0">
            <p className="font-semibold leading-snug">{event.title}</p>
            <p className="text-muted-foreground">{event.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date and venue",
      cell: (event) => (
        <>
          <p className="font-medium">{formatDate(event)}</p>
          <p className="text-muted-foreground">
            {event.venue}, {event.city}
          </p>
        </>
      ),
    },
    {
      key: "capacity",
      header: "Capacity",
      cell: (event) => {
        const percentSold = Math.round((event.registered / event.capacity) * 100);
        return (
          <div className="flex flex-col gap-2">
            <div className="inline-flex w-fit items-center rounded-lg border border-line-strong">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Decrease capacity of ${event.title}`}
                disabled={event.capacity <= event.registered}
                onClick={() => changeCapacity(event, -CAPACITY_STEP)}
                className="size-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <Minus className="size-3.5" />
              </Button>
              <span className="min-w-10 text-center font-semibold tabular-nums">
                {event.capacity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Increase capacity of ${event.title}`}
                onClick={() => changeCapacity(event, CAPACITY_STEP)}
                className="size-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
              >
                <Plus className="size-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-1.5 w-32 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-button-primary"
                  style={{ width: `${Math.min(percentSold, 100)}%` }}
                />
              </div>
              <span className="whitespace-nowrap text-xs text-muted-foreground">
                {event.registered} sold, {percentSold}%
              </span>
            </div>
          </div>
        );
      },
    },
    {
      key: "price",
      header: "Price",
      cellClassName: "font-medium",
      cell: (event) => formatPrice(event),
    },
    {
      key: "registration",
      header: "Registration",
      cell: (event) => {
        const status = getTab(event);
        const registrationOn = status === "published";
        const badge = statusBadge[status];
        return (
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={registrationOn}
              aria-label={`Registration for ${event.title}`}
              disabled={seatsLeft(event) === 0}
              onClick={() => toggleRegistration(event)}
              className={cn(
                "relative h-6 w-10 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                registrationOn ? "bg-button-primary" : "bg-line-strong",
              )}
            >
              <span
                className={cn(
                  "absolute left-0.5 top-0.5 size-5 rounded-full bg-card shadow transition-transform",
                  registrationOn && "translate-x-4",
                )}
              />
            </button>
            <Badge variant={badge.variant} className="h-6 px-3">
              {badge.label}
            </Badge>
          </div>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      srOnlyHeader: true,
      align: "right",
      headerClassName: "w-28",
      cell: (event) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label={`Edit ${event.title}`}
            onClick={() => handleEditEvent(event)}
          >
            <PencilLine />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            aria-label={`Delete ${event.title}`}
            onClick={() => setDeletingEvent(event)}
          >
            <Trash2 />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Page heading */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Events</h1>
          <p className="mt-1 text-muted-foreground">
            Change capacity and registration status without leaving this page.
          </p>
        </div>

        <Button variant="primary" size="lg" onClick={handleNewEvent}>
          <Plus />
          New event
        </Button>
      </div>

      {/* Tabs + search */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1 rounded-xl bg-line p-1">
          {TABS.map(({ key, label }) => (
            <Button
              key={key}
              type="button"
              variant="ghost"
              aria-pressed={tab === key}
              onClick={() => setTab(key)}
              className={
                tab === key
                  ? "bg-card text-foreground shadow-sm hover:bg-card"
                  : "text-muted-foreground"
              }
            >
              {label} <span className="ml-0.5">{counts[key]}</span>
            </Button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <FormField
            type="search"
            name="search"
            aria-label="Search events"
            value={query}
            onChange={setQuery}
            placeholder="Search events"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={visibleEvents}
        getRowKey={(event) => event.id}
        caption="Events"
        emptyMessage="No events match your search."
      />

      {/* Create / edit */}
      <CommonDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        icon={editingEvent ? <PencilLine /> : <CalendarPlus />}
        title={editingEvent ? "Edit event" : "Create new event"}
        description={
          editingEvent
            ? "Update the details attendees see for this event."
            : "Add the details attendees will see. You can change them later."
        }
        defaultValues={
          editingEvent ? eventToFormValues(editingEvent) : NEW_EVENT_DEFAULTS
        }
        validate={(values) => validateEvent(values, editingEvent?.registered ?? 0)}
        saveLabel={editingEvent ? "Save changes" : "Create event"}
        onSubmit={handleSaveEvent}
      >
        {(context) => (
          <EventFields {...context} registered={editingEvent?.registered ?? 0} />
        )}
      </CommonDialog>

      {/* Delete confirmation */}
      <CommonDialog
        open={deletingEvent !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeletingEvent(null);
        }}
        icon={<Trash2 />}
        title="Delete event?"
        description={
          deletingEvent
            ? `"${deletingEvent.title}" will be removed permanently.${
                deletingEvent.registered > 0
                  ? ` ${deletingEvent.registered} people are already registered.`
                  : ""
              }`
            : undefined
        }
        saveLabel="Delete event"
        saveVariant="destructive"
        onSubmit={handleDeleteEvent}
      />
    </div>
  );
}