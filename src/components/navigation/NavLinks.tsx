import { Home, House, AlertTriangle, HeartHandshake, Scale, BookOpen, Bookmark, Search } from "lucide-react";

export const primaryNavLinks = [
  { to: "/", label: "Start Here", icon: Home, activeExact: true },
  { to: "/housing", label: "Housing", icon: House },
  { to: "/shelter", label: "Shelter", icon: AlertTriangle },
  { to: "/bills-basics", label: "Bills & Basics", icon: HeartHandshake },
  { to: "/tenant-rights", label: "Tenant Rights", icon: Scale },
  { to: "/about", label: "About", icon: BookOpen },
] as const;

export const utilityNavLinks = [
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/housing/find-affordable-housing", label: "Search", icon: Search },
] as const;
