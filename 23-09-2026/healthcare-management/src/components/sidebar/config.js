import {
  LayoutDashboard,
  Users,
  Calendar,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    to: "/patients",
    label: "Patients",
    icon: Users,
    actionLabel: 'Add Patient'
  },
  {
    to: "/appointments",
    label: "Appointments",
    icon: Calendar,
    actionLabel: 'Add Appointment'

  },
];