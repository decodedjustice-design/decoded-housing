import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/shelter")({ component: ShelterLandingPage });

function ShelterLandingPage() {
  const links=["/shelter/tonight","/shelter/family","/shelter/single-adults","/shelter/youth-young-adults","/shelter/if-full","/shelter/crisis-numbers"];
  return <main className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6"><h1 className="text-3xl font-semibold">Shelter</h1><div className="mt-6 grid gap-3 sm:grid-cols-2">{links.map(l=><Link key={l} to={l} className="rounded-lg border p-3">{l.replace('/shelter/','').replaceAll('-',' ')}</Link>)}</div></main>;
}
