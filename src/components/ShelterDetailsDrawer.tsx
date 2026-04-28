import { useEffect, useState } from "react";
import {
  Phone,
  MapPin,
  Clock,
  AlertTriangle,
  ShieldCheck,
  Users,
  ExternalLink,
  Navigation,
  Bookmark,
  BookmarkCheck,
  Link2,
  Check,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type Shelter = Tables<"shelters">;

const SAVED_KEY = "decoded-housing:saved-shelters";

function readSaved(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function writeSaved(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

const TYPE_LABEL: Record<string, string> = {
  emergency_shelter: "Emergency Shelter",
  transitional: "Transitional Housing",
  supportive: "Supportive Housing",
};

const AVAIL_STYLE: Record<string, string> = {
  sometimes_open: "bg-primary/10 text-primary border-primary/30",
  usually_full: "bg-destructive/10 text-destructive border-destructive/30",
  delayed: "bg-muted text-muted-foreground border-border",
  unknown: "bg-muted text-muted-foreground border-border",
};

const AVAIL_LABEL: Record<string, string> = {
  sometimes_open: "Sometimes open",
  usually_full: "Usually full",
  delayed: "Waitlist / delayed",
  unknown: "Unknown",
};

const BARRIER_STYLE: Record<string, string> = {
  low: "bg-primary/10 text-primary",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  high: "bg-destructive/10 text-destructive",
};

interface Props {
  shelter: Shelter | null;
  onClose: () => void;
  onSavedChange?: (ids: string[]) => void;
}

export function ShelterDetailsDrawer({ shelter, onClose, onSavedChange }: Props) {
  const open = shelter !== null;
  const s = shelter;
  const avail = s?.realistic_availability ?? "unknown";
  const barrier = s?.barrier_level ?? "medium";

  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSavedIds(readSaved());
  }, [shelter?.id]);

  useEffect(() => {
    if (!copied) return;
    const t = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(t);
  }, [copied]);

  const isSaved = s ? savedIds.includes(s.id) : false;

  const toggleSave = () => {
    if (!s) return;
    const next = isSaved ? savedIds.filter((id) => id !== s.id) : [...savedIds, s.id];
    setSavedIds(next);
    writeSaved(next);
    onSavedChange?.(next);
  };

  const copyShareLink = async () => {
    if (!s || typeof window === "undefined") return;
    const url = `${window.location.origin}/shelter?id=${encodeURIComponent(s.id)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const directionsUrl = s
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
        [s.address, s.city, "WA"].filter(Boolean).join(", "),
      )}`
    : "#";

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {s && (
          <>
            <SheetHeader className="text-left">
              <div className="flex items-start justify-between gap-3">
                <SheetTitle className="text-xl leading-tight">{s.name}</SheetTitle>
                {s.verified && (
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    <ShieldCheck className="h-3 w-3" /> Verified
                  </span>
                )}
              </div>
              {s.organization && <SheetDescription>{s.organization}</SheetDescription>}
            </SheetHeader>

            <div className="mt-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-2">
                {s.phone ? (
                  <a
                    href={`tel:${s.phone.replace(/[^0-9+]/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm font-medium text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    No phone
                  </span>
                )}
                {s.address || s.city ? (
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                  >
                    <Navigation className="h-4 w-4" />
                    Directions
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-muted px-3 py-2.5 text-sm font-medium text-muted-foreground">
                    <Navigation className="h-4 w-4" />
                    No address
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={toggleSave}
                  aria-pressed={isSaved}
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                    isSaved
                      ? "bg-primary/10 text-primary"
                      : "border border-border bg-background text-foreground hover:bg-muted"
                  }`}
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="h-4 w-4" /> Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" /> Save shelter
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={copyShareLink}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-primary" /> Link copied
                    </>
                  ) : (
                    <>
                      <Link2 className="h-4 w-4" /> Copy share link
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">
                  {TYPE_LABEL[s.type] ?? s.type}
                </span>
                <span className={`rounded-full border px-2 py-0.5 font-medium ${AVAIL_STYLE[avail]}`}>
                  {AVAIL_LABEL[avail]}
                </span>
                <span className={`rounded-full px-2 py-0.5 font-medium ${BARRIER_STYLE[barrier] ?? ""}`}>
                  {barrier} barrier
                </span>
                {s.intake && (
                  <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">
                    Intake: {s.intake.replace("_", " ")}
                  </span>
                )}
                {s.access_speed && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 font-medium text-foreground">
                    <Clock className="h-3 w-3" />
                    {s.access_speed.replace("_", " ")}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2 text-sm">
                {(s.address || s.city) && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      {s.address ? `${s.address}, ` : ""}
                      {s.city}
                    </span>
                  </div>
                )}
                {(s.population ?? []).length > 0 && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Users className="mt-0.5 h-4 w-4 shrink-0" />
                    <span className="capitalize">{(s.population ?? []).join(", ")}</span>
                  </div>
                )}
                {s.phone && (
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{s.phone}</span>
                  </div>
                )}
              </div>

              {s.access_notes && (
                <div className="rounded-xl border border-border bg-card p-3">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Intake notes
                  </p>
                  <p className="text-sm leading-relaxed text-foreground/90">
                    {s.access_notes}
                  </p>
                </div>
              )}

              {s.backup_option && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-500/10 p-3 text-sm text-foreground/90">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p>
                    <span className="font-semibold">If full: </span>
                    {s.backup_option}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
