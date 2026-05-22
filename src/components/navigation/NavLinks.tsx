import { Home, House, HeartHandshake, Scale, Phone, BookOpen, Bookmark, AlertTriangle } from "lucide-react";

export const primaryNavLinks = [
  { to: "/", label: "Home", icon: Home, activeExact: true },
  { to: "/housing-shelter", label: "Housing & Shelter", icon: House, activeExact: false },
  { to: "/bills-basics", label: "Bills & Basics", icon: HeartHandshake, activeExact: false },
  { to: "/tenant-rights", label: "Tenant Rights", icon: Scale, activeExact: false },
  { to: "/phone-scripts", label: "Phone Scripts", icon: Phone, activeExact: false },
  { to: "/about", label: "About", icon: BookOpen, activeExact: false },
] as const;

export const utilityNavLinks = [
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/shelter/tonight", label: "Urgent Shelter", icon: AlertTriangle },
] as const;
