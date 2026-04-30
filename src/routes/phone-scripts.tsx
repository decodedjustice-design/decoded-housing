import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
export const Route = createFileRoute("/phone-scripts")({ component: PhoneScriptsPage });
function PhoneScriptsPage(){
  const [mode,setMode]=useState(false);
  return <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6"><h1 className="font-display text-3xl">Phone Scripts & Apply Flow</h1><p className="mt-2 text-muted-foreground">Property-aware scripts, call outcomes, and next-step logging.</p><button onClick={()=>setMode(v=>!v)} className="mt-4 rounded-md border px-3 py-2 text-sm">{mode?"Exit":"Enter"} teleprompter mode</button><section className={mode?"mt-4 rounded-xl border bg-card p-6 text-lg leading-relaxed":"mt-4 rounded-xl border bg-card p-4 text-sm"}>Hi, my name is ____. I'm calling about current openings, waitlist status, and application steps for my household size.</section><div className="mt-4 rounded-xl border bg-card p-4"><h2 className="font-semibold">Post-call outcome</h2><ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground"><li>Did they answer?</li><li>Waitlist open or closed?</li><li>Callback date and who to ask for</li></ul></div><Link to="/housing-shelter" className="mt-4 inline-block text-primary">Back to discovery</Link></main>
}
