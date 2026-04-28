import { Link } from "@tanstack/react-router";
import { Home, Search, ClipboardList, HeartHandshake, Scale, AlertTriangle, Bookmark, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Start Here", icon: Home },
  { to: "/search", label: "Search Housing", icon: Search },
  { to: "/apply", label: "Apply", icon: ClipboardList },
  { to: "/basic-needs", label: "Basic Needs", icon: HeartHandshake },
  { to: "/tenant-rights", label: "Tenant Rights", icon: Scale },
  { to: "/shelter", label: "Shelter", icon: AlertTriangle },
  { to: "/saved-shelters", label: "Saved", icon: Bookmark },
  { to: "/our-story", label: "Our Story", icon: BookOpen },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-card)]">
            <Home className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <div className="text-base font-semibold text-foreground">Decoded Housing</div>
            <div className="text-[11px] text-muted-foreground">King County</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: "rounded-lg px-3 py-2 text-sm font-semibold bg-accent text-accent-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/shelter"
          className="hidden items-center gap-2 rounded-lg bg-destructive px-3 py-2 text-sm font-semibold text-destructive-foreground shadow-[var(--shadow-card)] hover:opacity-95 sm:inline-flex"
        >
          <AlertTriangle className="h-4 w-4" /> Need shelter tonight
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-foreground hover:bg-accent lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                activeProps={{ className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold bg-accent text-accent-foreground" }}
              >
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}