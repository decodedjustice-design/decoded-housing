import { Outlet, Link } from "@tanstack/react-router";
import { Header } from "../navigation/Header";
import { QuickAssistSidebar } from "../QuickAssistSidebar";

export function SiteLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Outlet />
      <footer className="mt-16 border-t border-border bg-card">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
          <div>
            <h3 className="font-display text-xl">Decoded Housing</h3>
            <p className="mt-2 text-sm text-muted-foreground">Housing and shelter discovery for King County, with practical next steps and grounded support.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Navigation</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/housing-shelter">Housing & Shelter</Link></li>
              <li><Link to="/bills-basics">Bills & Basics</Link></li>
              <li><Link to="/tenant-rights">Tenant Rights</Link></li>
              <li><Link to="/phone-scripts">Phone Scripts</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Need help now?</h4>
            <p className="mt-2 text-sm text-muted-foreground">If you need a safe place tonight, start with urgent shelter routing and call scripts.</p>
            <Link to="/shelter/tonight" className="mt-3 inline-flex rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">Get urgent shelter help</Link>
          </div>
        </div>
      </footer>
      <QuickAssistSidebar />
    </div>
  );
}
