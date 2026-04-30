import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/tenant-rights")({ component: TenantRightsLandingPage });

function TenantRightsLandingPage() {
  const links=["/tenant-rights/eviction-help","/tenant-rights/notices","/tenant-rights/landlord-problems","/tenant-rights/legal-help"];
  return <main className="mx-auto max-w-5xl px-4 pb-20 pt-10 sm:px-6"><h1 className="text-3xl font-semibold">Tenant Rights</h1><div className="mt-6 grid gap-3 sm:grid-cols-2">{links.map(l=><Link key={l} to={l} className="rounded-lg border p-3">{l.replace('/tenant-rights/','').replaceAll('-',' ')}</Link>)}</div></main>;
}
