/*
 * TENANT PORTAL — /tenant-portal
 * Current tenant resources: maintenance, lease info, community, renewal
 */
import { useState } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench, FileText, Users, Bell, Phone, ExternalLink,
  ArrowRight, CheckCircle2, AlertCircle, Clock, Info,
  Home, Calendar, DollarSign, Shield, Heart
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RESOURCES = [
  {
    id: 'maintenance',
    icon: <Wrench className="w-5 h-5" />,
    title: 'Report a Maintenance Issue',
    color: 'bg-orange-50 border-orange-200',
    iconColor: 'bg-orange-100 text-orange-700',
    content: (
      <div className="space-y-4">
        <p className="text-[#374151] text-sm font-body leading-relaxed">
          Under Washington State law (RCW 59.18.060), your landlord must maintain your unit in a habitable condition. Here's how to report issues effectively.
        </p>
        <div className="space-y-3">
          {[
            { step: 1, title: 'Document the issue', desc: 'Take photos or video with timestamps. Note the date you first noticed the problem.' },
            { step: 2, title: 'Submit in writing', desc: 'Always report in writing (email or certified letter) so there\'s a paper trail. Verbal reports are harder to prove.' },
            { step: 3, title: 'Set a deadline', desc: 'State a reasonable deadline for repairs (10 days for non-emergency, 24 hours for emergencies).' },
            { step: 4, title: 'Follow up', desc: 'If no response, send a second notice. If still unresolved, contact your local code enforcement or legal aid.' },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <div className="w-6 h-6 bg-[#1B4332] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{s.step}</div>
              <div>
                <div className="font-body font-semibold text-[#374151] text-sm">{s.title}</div>
                <div className="font-body text-[#6B7280] text-xs mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-orange-800 text-xs font-body font-semibold mb-1">Emergency issues (no heat, flooding, gas leak)</p>
          <p className="text-orange-700 text-xs font-body">Call your landlord immediately. If no response within 24 hours, contact your city's code enforcement. For gas leaks, call 911.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'lease',
    icon: <FileText className="w-5 h-5" />,
    title: 'Lease Renewal & Rent Increases',
    color: 'bg-blue-50 border-blue-200',
    iconColor: 'bg-blue-100 text-blue-700',
    content: (
      <div className="space-y-4">
        <p className="text-[#374151] text-sm font-body leading-relaxed">
          Know your rights around lease renewals and rent increases in Washington State.
        </p>
        <div className="space-y-3">
          {[
            { title: 'Rent increase notice', desc: 'Landlords must give at least 60 days written notice before any rent increase for month-to-month tenants.' },
            { title: 'Lease renewal', desc: 'If your lease is expiring, your landlord must give notice if they don\'t plan to renew. Review your lease terms carefully.' },
            { title: 'Affordable unit rent limits', desc: 'If you live in an ARCH or MFTE unit, your rent is capped by your income level. Ask your property manager for your current limit.' },
            { title: 'Negotiating renewal', desc: 'You can negotiate lease terms at renewal. Request any agreed changes in writing before signing.' },
          ].map(item => (
            <div key={item.title} className="flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#52B788] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-body font-semibold text-[#374151] text-sm">{item.title}</div>
                <div className="font-body text-[#6B7280] text-xs mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-blue-800 text-xs font-body font-semibold mb-1">MFTE / ARCH tenants</p>
          <p className="text-blue-700 text-xs font-body">You may be required to re-certify your income annually. Keep your income documentation updated to maintain your affordable unit.</p>
        </div>
      </div>
    ),
  },
  {
    id: 'community',
    icon: <Users className="w-5 h-5" />,
    title: 'Community & Neighbor Resources',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'bg-purple-100 text-purple-700',
    content: (
      <div className="space-y-4">
        <p className="text-[#374151] text-sm font-body leading-relaxed">
          Building community with your neighbors can improve your housing stability and quality of life.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Tenant organizing', desc: 'Connect with other tenants in your building to address shared concerns collectively.', link: 'https://tenantsunion.org' },
            { name: 'Neighborhood associations', desc: 'Join your local neighborhood association to participate in community decisions.', link: 'https://kingcounty.gov' },
            { name: 'Hopelink community programs', desc: 'Food, childcare, employment, and community events for Eastside residents.', link: 'https://www.hopelink.org' },
            { name: 'King County 211', desc: 'Connect to local services, events, and community resources by calling 211.', link: 'https://www.211kingcounty.org' },
          ].map(item => (
            <div key={item.name} className="bg-white rounded-xl border border-[#E8E7E1] p-4">
              <h4 className="font-body font-semibold text-[#374151] text-sm mb-1">{item.name}</h4>
              <p className="text-[#6B7280] text-xs font-body mb-2">{item.desc}</p>
              <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-[#1B4332] text-xs font-body font-medium flex items-center gap-1 hover:underline">
                <ExternalLink className="w-3 h-3" /> Learn more
              </a>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'income-recert',
    icon: <DollarSign className="w-5 h-5" />,
    title: 'Income Re-Certification',
    color: 'bg-green-50 border-green-200',
    iconColor: 'bg-green-100 text-green-700',
    content: (
      <div className="space-y-4">
        <p className="text-[#374151] text-sm font-body leading-relaxed">
          If you live in an income-restricted unit (ARCH, MFTE, Section 8), you likely need to re-certify your income annually.
        </p>
        <div className="space-y-3">
          {[
            { title: 'Annual recertification', desc: 'Most programs require income verification every 12 months. Your property manager will notify you when it\'s due.' },
            { title: 'Documents needed', desc: 'Same documents as your original application: pay stubs, tax returns, bank statements, and benefit letters.' },
            { title: 'Income changes', desc: 'If your income increases significantly, you may no longer qualify for your current unit. Contact your property manager to understand your options.' },
            { title: 'Section 8 recertification', desc: 'KCHA conducts annual inspections and income reviews for voucher holders. Missing a recertification can result in loss of your voucher.' },
          ].map(item => (
            <div key={item.title} className="flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#52B788] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-body font-semibold text-[#374151] text-sm">{item.title}</div>
                <div className="font-body text-[#6B7280] text-xs mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'moving-on',
    icon: <Home className="w-5 h-5" />,
    title: 'Moving On: What to Know',
    color: 'bg-amber-50 border-amber-200',
    iconColor: 'bg-amber-100 text-amber-700',
    content: (
      <div className="space-y-4">
        <p className="text-[#374151] text-sm font-body leading-relaxed">
          Planning to move? Here's what you need to know to protect your deposit and rental history.
        </p>
        <div className="space-y-3">
          {[
            { title: 'Give proper notice', desc: 'Month-to-month tenants must give 20 days written notice. Check your lease for the required notice period.' },
            { title: 'Move-out inspection', desc: 'Request a move-out inspection with your landlord present. Document the condition of the unit with photos.' },
            { title: 'Deposit return', desc: 'Your landlord must return your deposit within 21 days with an itemized statement of any deductions.' },
            { title: 'Rental history letter', desc: 'Ask your landlord for a positive rental reference letter before you leave — it can help with your next application.' },
          ].map(item => (
            <div key={item.title} className="flex gap-3">
              <CheckCircle2 className="w-4 h-4 text-[#52B788] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-body font-semibold text-[#374151] text-sm">{item.title}</div>
                <div className="font-body text-[#6B7280] text-xs mt-0.5">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function TenantPortal() {
  const [activeId, setActiveId] = useState<string>('maintenance');
  const [, navigate] = useLocation();
  const current = RESOURCES.find(r => r.id === activeId);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      <div className="bg-[#1B4332] text-white py-12">
        <div className="container">
          <div className="max-w-2xl">
            <span className="text-[#95D5A3] text-xs font-body font-semibold uppercase tracking-widest mb-3 block">Current Residents</span>
            <h1 className="font-display text-4xl font-bold mb-3">Tenant Portal</h1>
            <p className="text-[#D8F3DC] font-body text-lg">
              Resources for current affordable housing residents — maintenance, lease renewals, income re-certification, and community connections.
            </p>
          </div>
        </div>
      </div>

      <main className="flex-1 container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar nav */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              {RESOURCES.map(r => (
                <button
                  key={r.id}
                  onClick={() => setActiveId(r.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all border ${
                    activeId === r.id
                      ? 'bg-[#1B4332] text-white border-[#1B4332] shadow-md'
                      : 'bg-white text-[#374151] border-[#E8E7E1] hover:border-[#52B788]'
                  }`}
                >
                  <span className={activeId === r.id ? 'text-white' : 'text-[#1B4332]'}>{r.icon}</span>
                  <span className="font-body font-medium text-sm">{r.title}</span>
                </button>
              ))}

              {/* Quick contacts */}
              <div className="mt-4 bg-white rounded-xl border border-[#E8E7E1] p-4">
                <h4 className="font-body font-semibold text-[#374151] text-xs uppercase tracking-wider mb-3">Quick Contacts</h4>
                <div className="space-y-2">
                  <a href="tel:211" className="flex items-center gap-2 text-[#1B4332] font-body font-medium text-xs hover:underline">
                    <Phone className="w-3.5 h-3.5" /> 211 — Community services
                  </a>
                  <a href="tel:4257477274" className="flex items-center gap-2 text-[#1B4332] font-body font-medium text-xs hover:underline">
                    <Phone className="w-3.5 h-3.5" /> ELAP legal aid
                  </a>
                  <a href="tel:2067230500" className="flex items-center gap-2 text-[#1B4332] font-body font-medium text-xs hover:underline">
                    <Phone className="w-3.5 h-3.5" /> Tenants Union
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3">
            {current && (
              <motion.div key={current.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className={`flex items-center gap-3 p-4 rounded-xl border mb-6 ${current.color}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${current.iconColor}`}>
                    {current.icon}
                  </div>
                  <h2 className="font-display font-bold text-xl text-[#1B4332]">{current.title}</h2>
                </div>
                <div className="bg-white rounded-2xl border border-[#E8E7E1] p-6 shadow-sm">
                  {current.content}
                </div>
              </motion.div>
            )}

            {/* Related links */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Know your rights', href: '/tenant-rights', icon: <Shield className="w-4 h-4" /> },
                { label: 'Rental assistance', href: '/rental-assistance', icon: <DollarSign className="w-4 h-4" /> },
                { label: 'Supportive services', href: '/supportive-services', icon: <Heart className="w-4 h-4" /> },
              ].map(link => (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[#E8E7E1] text-[#374151] hover:border-[#52B788] hover:text-[#1B4332] transition-all shadow-sm"
                >
                  <span className="text-[#1B4332]">{link.icon}</span>
                  <span className="font-body font-medium text-sm">{link.label}</span>
                  <ArrowRight className="w-4 h-4 text-[#9CA3AF] ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
