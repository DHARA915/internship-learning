// // components/events/event-form-fields.ts
// import type { FieldConfig, FormErrors, FormValues } from "@/components/CommonDialog";
// import { agendaToList, listToAgenda } from "@/Redux/Slices/eventslice";
// import type { CreateEventInput, Event } from "@/data/events/events";

// const CATEGORY_OPTIONS = ["Technology", "Business", "Design", "Music"].map(
//   (category) => ({ label: category, value: category }),
// );

// const PRICE_TYPE_OPTIONS = [
//   { label: "Free", value: "free" },
//   { label: "Paid", value: "paid" },
// ];

// const STATUS_OPTIONS = [
//   { label: "Draft", value: "draft" },
//   { label: "Published", value: "published" },
// ];

// /**
//  * Fields for the create / edit event dialog.
//  * Pass the event being edited so capacity can't go below seats already sold.
//  */
// export const getEventFields = (editingEvent?: Event | null): FieldConfig[] => {
//   const registered = editingEvent?.registered ?? 0;

//   return [
//     // ---- Basics ----
//     {
//       name: "title",
//       label: "Event title",
//       required: true,
//       placeholder: "e.g. AI Automation for Small Business",
//       span: "full",
//       section: "Basics",
//     },
//     {
//       name: "category",
//       label: "Category",
//       type: "select",
//       options: CATEGORY_OPTIONS,
//       required: true,
//       placeholder: "Select category",
//     },
//     {
//       name: "status",
//       label: "Status",
//       type: "select",
//       options: STATUS_OPTIONS,
//       required: true,
//     },
//     {
//       name: "description",
//       label: "Description",
//       type: "textarea",
//       required: true,
//       placeholder: "What will attendees learn?",
//     },

//     // ---- Schedule and venue ----
//     { name: "date", label: "Date", type: "date", required: true, section: "Schedule and venue" },
//     { name: "start_time", label: "Start time", type: "time", required: true },
//     { name: "end_time", label: "End time", type: "time", required: true },
//     { name: "venue", label: "Venue", required: true, placeholder: "e.g. Tech Park Auditorium" },
//     { name: "city", label: "City", required: true, placeholder: "e.g. Bengaluru" },

//     // ---- Speaker ----
//     { name: "speaker", label: "Speaker", required: true, placeholder: "Full name", section: "Speaker" },
//     { name: "speaker_role", label: "Speaker role", placeholder: "e.g. Founder, AutoKaro" },
//     {
//       name: "agenda",
//       label: "Agenda",
//       type: "textarea",
//       placeholder: "11:00 Welcome\n11:15 Talk: Five tasks you can automate",
//       hint: "One item per line",
//     },

//     // ---- Tickets ----
//     {
//       name: "capacity",
//       label: "Capacity",
//       type: "number",
//       required: true,
//       min: Math.max(1, registered),
//       hint: registered > 0 ? `${registered} seats already sold` : "Total seats available",
//       section: "Tickets",
//     },
//     {
//       name: "price_type",
//       label: "Price type",
//       type: "select",
//       options: PRICE_TYPE_OPTIONS,
//       required: true,
//     },
//     {
//       name: "price",
//       label: "Price (₹)",
//       type: "number",
//       required: true,
//       min: 1,
//       visibleWhen: (values) => values.price_type === "paid",
//     },
//   ];
// };

// export const NEW_EVENT_DEFAULTS: FormValues = {
//   status: "draft",
//   price_type: "free",
//   price: 0,
// };

// /** Event -> form values (agenda "a | b" becomes one item per line) */
// export const eventToFormValues = (event: Event): FormValues => ({
//   ...event,
//   agenda: agendaToList(event.agenda ?? "").join("\n"),
// });

// /** Form values -> the payload the redux slice expects */
// export const formValuesToEventInput = (values: FormValues): CreateEventInput => {
//   const isPaid = values.price_type === "paid";

//   return {
//     title: values.title,
//     category: values.category,
//     description: values.description,
//     date: values.date,
//     start_time: values.start_time,
//     end_time: values.end_time,
//     venue: values.venue,
//     city: values.city,
//     speaker: values.speaker,
//     speaker_role: values.speaker_role ?? "",
//     agenda: listToAgenda(String(values.agenda ?? "").split("\n")),
//     price_type: values.price_type,
//     price: isPaid ? Number(values.price) : 0,
//     capacity: Number(values.capacity),
//     status: values.status,
//   } as CreateEventInput;
// };

// /** Cross-field rules that a single field can't express */
// export const validateEventForm = (values: FormValues): FormErrors => {
//   const errors: FormErrors = {};

//   if (values.start_time && values.end_time && values.end_time <= values.start_time) {
//     errors.end_time = "End time must be after start time";
//   }

//   return errors;
// };