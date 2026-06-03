/*
 * NAVBAR — Affordable Housing Hub
 * Mega-menu with 5 sections:
 *   1. Find Housing (Search, Eligibility Checker, How to Apply)
 *   2. Support & Resources (Rental Assistance, Tenant Rights, Supportive Services)
 *   3. Dashboards (Applicant Portal, Tenant Portal)
 *   4. For Owners (Developer Hub, Data & Impact)
 *   5. Help (Language Access, Help Center, Shelter Finder)
 */
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import {
  Menu, X, Home, AlertTriangle, Search, CheckSquare, FileText,
  DollarSign, Scale, Heart, User, Building2, BarChart3, Globe,
  HelpCircle, Map, ChevronDown
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Find Housing',
    items: [
      { href: '/search', label: 'Search Portal', description: 'Map + list view with filters', icon: <Search className="w-4 h-4" /> },
      { href: '/eligibility', label: 'Eligibility Checker', description: 'Find programs you qualify for', icon: <CheckSquare className="w-4 h-4" /> },
      { href: '/how-to-apply', label: 'How to Apply', description: 'Step-by-step application guide', icon: <FileText className="w-4 h-4" /> },
    ],
  },
  {
    label: 'Support',
    items: [
      { href: '/rental-assistance', label: 'Rental Assistance', description: 'Section 8, ERA, local subsidies', icon: <DollarSign className="w-4 h-4" /> },
      { href: '/tenant-rights', label: 'Tenant Rights', description: 'Fair housing, eviction prevention', icon: <Scale className="w-4 h-4" /> },
      { href: '/supportive-services', label: 'Supportive Services', description: 'Childcare, transit, employment', icon: <Heart className="w-4 h-4" /> },
    ],
  },
  {
    label: 'My Portal',
    items: [
      { href: '/applicant-portal', label: 'Applicant Portal', description: 'Save listings, track applications', icon: <User className="w-4 h-4" />, badge: 'New' },
      { href: '/tenant-portal', label: 'Tenant Portal', description: 'Maintenance, renewals, case workers', icon: <Building2 className="w-4 h-4" />, badge: 'New' },
    ],
  },
  {
    label: 'For Owners',
    items: [
      { href: '/owner-hub', label: 'Owner & Developer Hub', description: 'List properties, tax incentives', icon: <Building2 className="w-4 h-4" /> },
      { href: '/data-impact', label: 'Data & Impact', description: 'Housing metrics dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    ],
  },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [location] = useLocation();
  const megaRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = (href: string) => location === href || location.startsWith(href + '/');

  const handleSectionEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveSection(label);
  };

  const handleSectionLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveSection(null), 150);
  };

  const handleMegaEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  useEffect(() => {
    setMenuOpen(false);
    setActiveSection(null);
  }, [location]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const currentSection = NAV_SECTIONS.find(s => s.label === activeSection);

  return (
    <nav className="sticky top-0 z-50 bg-white/98 backdrop-blur-sm border-b border-[#E8E7E1] shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 bg-[#1B4332] rounded-md flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-[#1B4332] font-bold text-lg leading-tight">Decoded</span>
              <span className="font-body text-[#52B788] text-xs font-medium tracking-widest uppercase leading-tight">Housing Hub</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1 relative" ref={megaRef}>
            {NAV_SECTIONS.map(section => (
              <div
                key={section.label}
                className="relative"
                onMouseEnter={() => handleSectionEnter(section.label)}
                onMouseLeave={handleSectionLeave}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium font-body transition-colors ${
                    activeSection === section.label || section.items.some(i => isActive(i.href))
                      ? 'bg-[#1B4332] text-white'
                      : 'text-[#374151] hover:bg-[#F0EFE9] hover:text-[#1B4332]'
                  }`}
                >
                  {section.label}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeSection === section.label ? 'rotate-180' : ''}`} />
                </button>
              </div>
            ))}

            {/* Scripts direct link */}
            <Link
              href="/scripts"
              className={`px-3 py-2 rounded-md text-sm font-medium font-body transition-colors ${
                isActive('/scripts')
                  ? 'bg-[#1B4332] text-white'
                  : 'text-[#374151] hover:bg-[#F0EFE9] hover:text-[#1B4332]'
              }`}
            >
              Scripts
            </Link>

            {/* Shelter CTA */}
            <Link
              href="/shelter-finder"
              className="ml-2 flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium font-body hover:bg-red-700 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Get Shelter
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              href="/shelter-finder"
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-md text-xs font-medium font-body"
            >
              <AlertTriangle className="w-3 h-3" />
              Shelter
            </Link>
            <button
              className="p-2 rounded-md text-[#374151] hover:bg-[#F0EFE9]"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mega menu dropdown */}
        {activeSection && currentSection && (
          <div
            className="absolute left-0 right-0 top-16 bg-white border-t border-[#E8E7E1] shadow-xl z-50 hidden lg:block"
            onMouseEnter={handleMegaEnter}
            onMouseLeave={handleSectionLeave}
          >
            <div className="container py-6">
              <div className="grid grid-cols-3 gap-4">
                {currentSection.items.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-start gap-3 p-4 rounded-xl transition-all group ${
                      isActive(item.href)
                        ? 'bg-[#D8F3DC] border border-[#52B788]'
                        : 'hover:bg-[#F0EFE9] border border-transparent'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isActive(item.href) ? 'bg-[#1B4332] text-white' : 'bg-[#F0EFE9] text-[#1B4332] group-hover:bg-[#1B4332] group-hover:text-white'
                    } transition-colors`}>
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-body font-semibold text-[#1F2937] text-sm">{item.label}</span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 bg-[#D97706] text-white text-xs font-body font-medium rounded">{item.badge}</span>
                        )}
                      </div>
                      <p className="text-[#6B7280] text-xs font-body mt-0.5">{item.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden py-3 border-t border-[#E8E7E1] max-h-[80vh] overflow-y-auto">
            {NAV_SECTIONS.map(section => (
              <div key={section.label}>
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold font-body text-[#1B4332] hover:bg-[#F0EFE9]"
                  onClick={() => setMobileSection(mobileSection === section.label ? null : section.label)}
                >
                  {section.label}
                  <ChevronDown className={`w-4 h-4 transition-transform ${mobileSection === section.label ? 'rotate-180' : ''}`} />
                </button>
                {mobileSection === section.label && (
                  <div className="pl-4 pb-2">
                    {section.items.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-body transition-colors rounded-lg mx-2 mb-1 ${
                          isActive(item.href)
                            ? 'text-[#1B4332] bg-[#D8F3DC]'
                            : 'text-[#374151] hover:bg-[#F0EFE9]'
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className="text-[#1B4332]">{item.icon}</span>
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-[#9CA3AF]">{item.description}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="border-t border-[#E8E7E1] mt-2 pt-2 px-4">
              <Link
                href="/scripts"
                className="block py-3 text-sm font-medium font-body text-[#374151] hover:text-[#1B4332]"
                onClick={() => setMenuOpen(false)}
              >
                📞 Phone Scripts
              </Link>
              <Link
                href="/help-center"
                className="block py-3 text-sm font-medium font-body text-[#374151] hover:text-[#1B4332]"
                onClick={() => setMenuOpen(false)}
              >
                <Globe className="w-4 h-4 inline mr-2" />
                Language & Help
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
