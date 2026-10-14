export type PaymentMethod = "upi" | "card" | "netbanking" | "free";

// Flat on purpose: no nested objects. Unused payment fields are empty strings.
export interface Registration {
  id: number;
  code: string;
  event_id: number;
  event_title: string;
  full_name: string;
  email: string;
  phone: string;
  city: string;
  tickets: number;
  price_per_ticket: number;
  total_amount: number;
  payment_method: PaymentMethod;
  upi_id: string;
  qr_code?:string;
  card_name: string;
  card_last4: string; // never store the full card number or CVV
  bank_name: string;
  status: "paid" | "free";
  created_at: string;
}

export type NewRegistration = Omit<Registration, "id">;

// 5 dummy registrations, one per event id (1 to 5)
export const registrations: Registration[] = [
  {
    id: 1, code: "REG-0001", event_id: 1, event_title: "Bharat Product Summit 2026",
    full_name: "Aarav Patel", email: "aarav.patel@example.com", phone: "9876500001", city: "Ahmedabad",
    tickets: 2, price_per_ticket: 4999, total_amount: 9998,
    payment_method: "upi", upi_id: "aarav@okhdfcbank", card_name: "", card_last4: "", bank_name: "",
    status: "paid", created_at: "2026-10-01T10:15:00.000Z",
  },
  {
    id: 2, code: "REG-0002", event_id: 2, event_title: "AI Automation for Small Business",
    full_name: "Diya Shah", email: "diya.shah@example.com", phone: "9876500002", city: "Bengaluru",
    tickets: 1, price_per_ticket: 0, total_amount: 0,
    payment_method: "upi", upi_id: "diya@okicici", card_name: "", card_last4: "", bank_name: "",
    status: "free", created_at: "2026-10-02T09:30:00.000Z",
  },
  {
    id: 3, code: "REG-0003", event_id: 3, event_title: "Founder Roundtable: Growing an SME",
    full_name: "Kabir Singh", email: "kabir.singh@example.com", phone: "9876500003", city: "Surat",
    tickets: 3, price_per_ticket: 0, total_amount: 0,
    payment_method: "card", upi_id: "", card_name: "Kabir Singh", card_last4: "1111", bank_name: "",
    status: "free", created_at: "2026-10-03T14:05:00.000Z",
  },
  {
    id: 4, code: "REG-0004", event_id: 4, event_title: "Winter Founders Meetup",
    full_name: "Neha Joshi", email: "neha.joshi@example.com", phone: "9876500004", city: "Pune",
    tickets: 2, price_per_ticket: 999, total_amount: 1998,
    payment_method: "card", upi_id: "", card_name: "Neha Joshi", card_last4: "4242", bank_name: "",
    status: "paid", created_at: "2026-10-04T16:45:00.000Z",
  },
  {
    id: 5, code: "REG-0005", event_id: 5, event_title: "Design Systems Lab",
    full_name: "Rohan Desai", email: "rohan.desai@example.com", phone: "9876500005", city: "Vadodara",
    tickets: 1, price_per_ticket: 1499, total_amount: 1499,
    payment_method: "netbanking", upi_id: "", card_name: "", card_last4: "", bank_name: "HDFC Bank",
    status: "paid", created_at: "2026-10-05T11:20:00.000Z",
  },
];