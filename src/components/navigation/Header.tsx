import { Link } from "@tanstack/react-router";
import { Menu, X, Home } from "lucide-react";
import { useState } from "react";
import { MobileMenu } from "./MobileMenu";
import { primaryNavLinks, utilityNavLinks } from "./NavLinks";
import { UrgentCTA } from "../ui/UrgentCTA";

export function Header() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55"><div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6"><Link to="/" className="group flex items-center gap-2.5"><div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Home className="h-[18px] w-[18px]" /></div><div className="leading-tight"><div className="font-display text-[17px] font-semibold tracking-tight text-foreground">Decoded Housing</div><div className="text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">King County</div></div></Link><nav className="hidden items-center gap-0.5 lg:flex">{primaryNavLinks.map((l) => <Link key={l.to} to={l.to} activeOptions={{ exact: l.activeExact ?? false }} className="rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground" activeProps={{ className: "rounded-full px-3 py-1.5 text-[13px] font-semibold bg-foreground text-background" }}>{l.label}</Link>)}</nav><div className="hidden items-center gap-2 lg:flex">{utilityNavLinks.map((l) => <Link key={l.to} to={l.to} className="rounded-full px-3 py-1.5 text-[13px] font-medium text-muted-foreground hover:bg-accent/70 hover:text-accent-foreground" activeProps={{ className: "rounded-full px-3 py-1.5 text-[13px] font-semibold bg-accent text-accent-foreground" }}>{l.label}</Link>)}<UrgentCTA /></div><button onClick={() => setOpen((v) => !v)} className="rounded-lg p-2 text-foreground hover:bg-accent lg:hidden" aria-label="Toggle menu">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button></div>{open && <MobileMenu onClose={() => setOpen(false)} />}</header>;
}
