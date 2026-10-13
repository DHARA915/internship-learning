export type EventCategory = "Technology" | "Business" | "Design" | "Music";
 
export type PriceType = "free" | "paid";
 
export type EventStatus = "draft" | "published" | "closed";
 
export interface Event {
  id: number;
  title: string;
  category: EventCategory;
  description: string;
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:mm"
  end_time: string; // "HH:mm"
  venue: string;
  city: string;
  speaker: string;
  speaker_role: string;
  agenda: string; // items separated by " | "
  price_type: PriceType;
  price: number; // in rupees, 0 when free
  capacity: number;
  registered: number;
  status: EventStatus;
}
 
// Payload for the "Create event" form (server sets id and registered)
export type CreateEventInput = Omit<Event, "id" | "registered">;
 
// ---------- helpers ----------
 
export const seatsLeft = (e: Event): number =>
  Math.max(e.capacity - e.registered, 0);
 
export const isSoldOut = (e: Event): boolean => seatsLeft(e) === 0;
 
export const parseAgenda = (e: Event): string[] => e.agenda.split(" | ");
 
export const formatPrice = (e: Event): string =>
  e.price_type === "free" ? "Free" : `₹${e.price.toLocaleString("en-IN")}`;

export const events:Event[] =[
  {
    "id": 1,
    "title": "Bharat Product Summit 2026",
    "category": "Technology",
    "description": "A two-day gathering for product managers, founders and engineers building software for India's small and mid-size businesses.",
    "date": "2026-11-14",
    "start_time": "09:00",
    "end_time": "18:00",
    "venue": "Riverfront Convention Centre",
    "city": "Ahmedabad",
    "speaker": "Ananya Rao",
    "speaker_role": "VP Product, Lumio Pay",
    "agenda": "09:00 Registration and chai | 10:00 Keynote: Building for 60 million small businesses | 12:30 Lunch and demo floor | 15:30 Panel: Pricing for customers who count every rupee",
    "price_type": "paid",
    "price": 4999,
    "capacity": 600,
    "registered": 541,
    "status": "published"
  },
  {
    "id": 2,
    "title": "AI Automation for Small Business",
    "category": "Technology",
    "description": "A free morning session on using AI tools to automate billing, support and follow-ups without hiring a tech team.",
    "date": "2026-11-21",
    "start_time": "11:00",
    "end_time": "14:00",
    "venue": "Tech Park Auditorium",
    "city": "Bengaluru",
    "speaker": "Rohan Mehta",
    "speaker_role": "Founder, AutoKaro",
    "agenda": "11:00 Welcome | 11:15 Talk: Five tasks you can automate this week | 12:15 Live demo: WhatsApp support bot | 13:15 Q and A",
    "price_type": "free",
    "price": 0,
    "capacity": 250,
    "registered": 188,
    "status": "published"
  },
  {
    "id": 3,
    "title": "Founder Roundtable: Growing an SME",
    "category": "Business",
    "description": "An evening roundtable where SME founders share how they scaled from 10 to 100 employees.",
    "date": "2026-10-29",
    "start_time": "18:30",
    "end_time": "21:00",
    "venue": "Textile Hall",
    "city": "Surat",
    "speaker": "Meera Shah",
    "speaker_role": "CEO, Shah Textiles",
    "agenda": "18:30 Networking | 19:00 Fireside chat: Hiring and cash flow | 20:00 Open roundtable | 20:45 Closing notes",
    "price_type": "free",
    "price": 0,
    "capacity": 120,
    "registered": 74,
    "status": "published"
  },
  {
    "id": 4,
    "title": "Winter Founders Meetup",
    "category": "Business",
    "description": "An evening for early-stage founders to swap notes on hiring, pricing and first customers. Pizza included.",
    "date": "2026-12-12",
    "start_time": "17:00",
    "end_time": "20:00",
    "venue": "Cowork Hub",
    "city": "Pune",
    "speaker": "Karan Joshi",
    "speaker_role": "Partner, Seed Route Ventures",
    "agenda": "17:00 Arrivals | 17:30 Lightning pitches | 18:30 Pizza and networking | 19:15 Investor Q and A",
    "price_type": "paid",
    "price": 999,
    "capacity": 150,
    "registered": 40,
    "status": "published"
  },
  {
    "id": 5,
    "title": "Design Systems Lab",
    "category": "Design",
    "description": "A hands-on lab on building and maintaining a design system that a small team can actually keep up with.",
    "date": "2026-10-25",
    "start_time": "10:00",
    "end_time": "16:00",
    "venue": "Studio Kala",
    "city": "Vadodara",
    "speaker": "Farah Sheikh",
    "speaker_role": "Head of Design, Tessera",
    "agenda": "10:00 Intro to tokens | 11:30 Build a button library | 13:00 Lunch | 14:00 Documenting and versioning | 15:30 Review",
    "price_type": "paid",
    "price": 1499,
    "capacity": 80,
    "registered": 62,
    "status": "published"
  },
  {
    "id": 6,
    "title": "UX Writing Masterclass",
    "category": "Design",
    "description": "Learn to write clear interface copy, error messages and onboarding flows in English and Hindi.",
    "date": "2026-11-28",
    "start_time": "14:00",
    "end_time": "17:30",
    "venue": "Studio Kala",
    "city": "Vadodara",
    "speaker": "Isha Verma",
    "speaker_role": "Lead Content Designer, Paytrail",
    "agenda": "14:00 Voice and tone | 15:00 Writing error messages | 16:00 Rewrite exercise | 17:00 Feedback round",
    "price_type": "paid",
    "price": 2999,
    "capacity": 100,
    "registered": 22,
    "status": "published"
  },
  {
    "id": 7,
    "title": "Monsoon Sessions: Indie Night",
    "category": "Music",
    "description": "An evening of live indie music from five up-and-coming bands across western India.",
    "date": "2026-11-01",
    "start_time": "19:30",
    "end_time": "23:00",
    "venue": "Harbour Hall",
    "city": "Mumbai",
    "speaker": "The Rain Tapes",
    "speaker_role": "Headline band",
    "agenda": "19:30 Doors open | 20:00 Opening act | 21:00 Second band | 22:00 Headliner: The Rain Tapes",
    "price_type": "paid",
    "price": 899,
    "capacity": 400,
    "registered": 400,
    "status": "published"
  },
  {
    "id": 8,
    "title": "Open Mic Sunday",
    "category": "Music",
    "description": "A free, relaxed open mic for singers, poets and instrumentalists. Sign up at the door.",
    "date": "2026-11-08",
    "start_time": "17:00",
    "end_time": "20:00",
    "venue": "Café Raag",
    "city": "Jaipur",
    "speaker": "Dev Malhotra",
    "speaker_role": "Host and singer-songwriter",
    "agenda": "17:00 Sign-ups | 17:30 First round | 18:30 Break | 19:00 Second round and jam",
    "price_type": "free",
    "price": 0,
    "capacity": 70,
    "registered": 31,
    "status": "published"
  }
]