import { Link } from "@tanstack/react-router";
import { primaryNavLinks, utilityNavLinks } from "./NavLinks";

export function MobileMenu({ onClose }: { onClose: () => void }) {
  return <div className="border-t border-border bg-background lg:hidden"><nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">{[...primaryNavLinks, ...utilityNavLinks].map((l) => <Link key={l.to} to={l.to} onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground" activeProps={{ className: "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold bg-accent text-accent-foreground" }}><l.icon className="h-4 w-4" /> {l.label}</Link>)}</nav></div>;
}
