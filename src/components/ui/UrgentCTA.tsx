import { Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export function UrgentCTA({ className = "" }: { className?: string }) {
  return (
    <Link to="/shelter/tonight" className={`inline-flex items-center gap-2 rounded-full bg-destructive px-3.5 py-2 text-[13px] font-semibold text-destructive-foreground ${className}`}>
      <AlertTriangle className="h-3.5 w-3.5" /> Shelter tonight
    </Link>
  );
}
