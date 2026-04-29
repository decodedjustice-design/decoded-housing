export const WAITLIST_STORAGE_KEY = "dj_waitlist";

export const WAITLIST_STATUSES = [
  "Interested",
  "Applied",
  "Waitlisted",
  "Approved",
  "Rejected",
] as const;

export const WAITLIST_PRIORITIES = ["High", "Medium", "Low"] as const;

export type WaitlistStatus = (typeof WAITLIST_STATUSES)[number];
export type WaitlistPriority = (typeof WAITLIST_PRIORITIES)[number];

export type WaitlistEntry = {
  name: string;
  status: WaitlistStatus;
  date_added: string;
  last_updated: string;
  notes: string;
  priority: WaitlistPriority;
};

export type WaitlistMap = Record<string, WaitlistEntry>;

export function getWaitlist(): WaitlistMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(WAITLIST_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WaitlistMap) : {};
  } catch {
    return {};
  }
}

export function saveWaitlist(waitlist: WaitlistMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(waitlist));
}
