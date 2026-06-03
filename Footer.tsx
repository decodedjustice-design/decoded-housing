import { Link } from 'wouter';
import { Home, ExternalLink, AlertTriangle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1B4332] text-white mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-md flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display text-white font-bold text-lg leading-tight">Decoded Housing Hub</span>
                <span className="font-body text-[#52B788] text-xs font-medium tracking-widest uppercase leading-tight">King County</span>
              </div>
            </div>
            <p className="text-[#95D5A3] text-sm font-body leading-relaxed max-w-xs mb-4">
              A free resource for King County residents seeking affordable housing — from emergency shelter to long-term homes.
            </p>
            <Link
              href="/shelter-finder"
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-body font-medium hover:bg-red-700 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Need shelter tonight?
            </Link>
          </div>

          {/* Find Housing */}
          <div>
            <h4 className="font-body font-semibold text-white text-sm uppercase tracking-wider mb-4">Find Housing</h4>
            <ul className="space-y-2">
              {[
                { href: '/search', label: 'Search Portal' },
                { href: '/eligibility', label: 'Eligibility Checker' },
                { href: '/how-to-apply', label: 'How to Apply' },
                { href: '/scripts', label: 'Phone Scripts' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#95D5A3] hover:text-white text-sm font-body transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-body font-semibold text-white text-sm uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              {[
                { href: '/rental-assistance', label: 'Rental Assistance' },
                { href: '/tenant-rights', label: 'Tenant Rights' },
                { href: '/supportive-services', label: 'Supportive Services' },
                { href: '/shelter-finder', label: 'Shelter Finder' },
                { href: '/shelter-map', label: 'Shelter Map' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#95D5A3] hover:text-white text-sm font-body transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h4 className="font-body font-semibold text-white text-sm uppercase tracking-wider mb-4">More</h4>
            <ul className="space-y-2">
              {[
                { href: '/applicant-portal', label: 'Applicant Portal' },
                { href: '/tenant-portal', label: 'Tenant Portal' },
                { href: '/owner-hub', label: 'Owner & Developer Hub' },
                { href: '/data-impact', label: 'Data & Impact' },
                { href: '/help-center', label: 'Help Center' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[#95D5A3] hover:text-white text-sm font-body transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-body font-semibold text-white text-sm uppercase tracking-wider mb-3 mt-6">Official Sources</h4>
            <ul className="space-y-2">
              {[
                { href: 'https://www.archhousing.org', label: 'ARCH Housing' },
                { href: 'https://www.kcha.org', label: 'KCHA' },
                { href: 'https://kcrha.org', label: 'KCRHA' },
              ].map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#95D5A3] hover:text-white text-sm font-body transition-colors flex items-center gap-1"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#52B788] text-xs font-body">
            © 2026 Decoded Housing Hub. Data sourced from ARCH, City of Bellevue, KCHA, and public records.
          </p>
          <p className="text-[#52B788] text-xs font-body">
            Not affiliated with any government agency. Always verify directly with properties.
          </p>
        </div>
      </div>
    </footer>
  );
}
