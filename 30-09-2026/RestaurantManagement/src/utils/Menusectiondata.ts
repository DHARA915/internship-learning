import type { Status } from "./Modifierdata";

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type Day = (typeof DAYS)[number];

/** when the menu is shown to customers */
export interface MenuTiming {
  startTime: string; // "HH:mm" (24h)
  endTime: string; // "HH:mm" (24h), must be after startTime
  days: Day[];
}

export interface Menu {
  id: string;
  name: string;
  icon: string; // image URL
  status: Status;
  timing: MenuTiming;
  itemIds: string[]; // ids of items from the Menu Items module
  createdAt: string;
  updatedAt: string;
}

/* ---------- helpers ---------- */
const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

/** "13:30" -> "1:30 PM" */
export const fmtTime = (t: string) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

export const daysLabel = (days: readonly Day[]) =>
  days.length === DAYS.length ? "Every day" : days.join(", ");

/** is this menu being served right now? */
export const isMenuLive = (m: Menu, now = new Date()) => {
  if (m.status !== "Active") return false;
  const today = DAYS[(now.getDay() + 6) % 7]; // JS: Sunday = 0
  if (!m.timing.days.includes(today)) return false;
  const cur = now.getHours() * 60 + now.getMinutes();
  return cur >= toMinutes(m.timing.startTime) && cur < toMinutes(m.timing.endTime);
};

/* ---------- seed ---------- */
// item ids match menuItemSeed (itm_001 …); itm_015 is Inactive on purpose
const ids = (...nums: number[]) =>
  nums.map((n) => `itm_${String(n).padStart(3, "0")}`);

let count = 0;
const menu = (
  name: string,
  status: Status,
  startTime: string,
  endTime: string,
  days: readonly Day[],
  itemIds: string[],
): Menu => {
  count += 1;
  return {
    id: `menu_${String(count).padStart(3, "0")}`,
    name,
    icon: "",
    status,
    timing: { startTime, endTime, days: [...days] },
    itemIds,
    createdAt: "2026-10-03",
    updatedAt: "2026-10-03",
  };
};

const WEEKDAYS = DAYS.slice(0, 5);

export const menuSeed: Menu[] = [
  menu("Breakfast", "Active", "07:00", "11:00", DAYS, ids(2, 4, 17)),
  menu("Beverages", "Active", "10:00", "23:00", DAYS, ids(1, 2, 3, 4, 5, 6, 7, 8)),
  menu("Lunch", "Active", "12:00", "16:00", WEEKDAYS, ids(26, 27, 28, 29, 30, 31, 32)),
  menu("Snacks & Pizza", "Active", "16:00", "22:00", DAYS, ids(16, 17, 18, 19, 20, 21, 22, 23, 24, 25)),
  menu("Desserts", "Active", "12:00", "23:30", DAYS, ids(9, 10, 11, 12, 13, 14, 15)),
  menu("Late Night Bites", "Inactive", "22:00", "23:59", DAYS, ids(20, 24, 25)),
];