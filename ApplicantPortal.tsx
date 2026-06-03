/*
 * APPLICANT PORTAL — /applicant-portal
 * localStorage-based: saved listings, application status tracker, document checklist
 */
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, CheckCircle2, Clock, AlertCircle, Plus, Trash2,
  FileText, Search, ArrowRight, X, Edit3, Save, Star,
  Upload, CheckSquare, Square, Phone, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import propertiesData from '@/data/properties.json';
import { Property } from '@/lib/types';

const allProperties = propertiesData as Property[];

type AppStatus = 'interested' | 'called' | 'applied' | 'waitlisted' | 'rejected' | 'approved';

interface TrackedApp {
  propertyId: string;
  status: AppStatus;
  notes: string;
  dateAdded: string;
  dateUpdated: string;
  contactName?: string;
  referenceNumber?: string;
}

interface DocChecked {
  id: string;
  checked: boolean;
}

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string; icon: React.ReactNode }> = {
  interested: { label: 'Interested', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: <Star className="w-3 h-3" /> },
  called: { label: 'Called', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Phone className="w-3 h-3" /> },
  applied: { label: 'Applied', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <FileText className="w-3 h-3" /> },
  waitlisted: { label: 'Waitlisted', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: <Clock className="w-3 h-3" /> },
  rejected: { label: 'Not selected', color: 'bg-red-100 text-red-700 border-red-200', icon: <X className="w-3 h-3" /> },
  approved: { label: 'Approved!', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle2 className="w-3 h-3" /> },
};

const DOCS = [
  { id: 'id', label: 'Government-issued photo ID', required: true },
  { id: 'ssn', label: 'Social Security card or ITIN', required: true },
  { id: 'paystubs', label: 'Last 2–3 pay stubs', required: true },
  { id: 'tax', label: 'Most recent tax return (1040)', required: true },
  { id: 'w2', label: 'W-2 or 1099 forms', required: true },
  { id: 'bank', label: 'Last 2–3 months bank statements', required: true },
  { id: 'rental', label: 'Rental history / landlord contacts', required: true },
  { id: 'birth', label: 'Birth certificates (household members)', required: false },
  { id: 'custody', label: 'Custody documentation', required: false },
  { id: 'benefits', label: 'Benefit award letters (SSI, SSDI, etc.)', required: false },
];

const STORAGE_KEY_APPS = 'dh_applicant_apps';
const STORAGE_KEY_DOCS = 'dh_applicant_docs';
const STORAGE_KEY_SAVED = 'dh_saved_properties';

function useLocalStorage<T>(key: string, initial: T): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });
  const set = (val: T) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };
  return [value, set];
}

export default function ApplicantPortal() {
  const [activeTab, setActiveTab] = useState<'tracker' | 'saved' | 'docs'>('tracker');
  const [apps, setApps] = useLocalStorage<TrackedApp[]>(STORAGE_KEY_APPS, []);
  const [savedIds, setSavedIds] = useLocalStorage<string[]>(STORAGE_KEY_SAVED, []);
  const [docChecks, setDocChecks] = useLocalStorage<Record<string, boolean>>(STORAGE_KEY_DOCS, {});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState<AppStatus>('interested');
  const [addingNew, setAddingNew] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [, navigate] = useLocation();

  const savedProperties = allProperties.filter(p => savedIds.includes(p.id));
  const filteredProps = allProperties.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  const addToTracker = (propertyId: string) => {
    if (apps.find(a => a.propertyId === propertyId)) {
      toast.info('Already in your tracker');
      return;
    }
    const newApp: TrackedApp = {
      propertyId,
      status: 'interested',
      notes: '',
      dateAdded: new Date().toLocaleDateString(),
      dateUpdated: new Date().toLocaleDateString(),
    };
    setApps([...apps, newApp]);
    toast.success('Added to application tracker');
  };

  const removeApp = (propertyId: string) => {
    setApps(apps.filter(a => a.propertyId !== propertyId));
    toast.success('Removed from tracker');
  };

  const saveEdit = (propertyId: string) => {
    setApps(apps.map(a => a.propertyId === propertyId
      ? { ...a, status: editStatus, notes: editNotes, dateUpdated: new Date().toLocaleDateString() }
      : a
    ));
    setEditingId(null);
    toast.success('Updated');
  };

  const toggleDoc = (id: string) => {
    setDocChecks({ ...docChecks, [id]: !docChecks[id] });
  };

  const removeSaved = (id: string) => {
    setSavedIds(savedIds.filter(s => s !== id));
    toast.success('Removed from saved');
  };

  const checkedRequired = DOCS.filter(d => d.required && docChecks[d.id]).length;
  const totalRequired = DOCS.filter(d => d.required).length;
  const docProgress = Math.round((checkedRequired / totalRequired) * 100);

  const statusCounts = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
    key,
    label: cfg.label,
    count: apps.filter(a => a.status === key).length,
    color: cfg.color,
  })).filter(s => s.count > 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />

      <div className="bg-[#1B4332] text-white py-12">
        <div className="container">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[#95D5A3] text-xs font-body font-semibold uppercase tracking-widest">My Portal</span>
                <span className="px-2 py-0.5 bg-[#D97706] text-white text-xs font-body font-bold rounded">New</span>
              </div>
              <h1 className="font-display text-4xl font-bold mb-3">Applicant Portal</h1>
              <p className="text-[#D8F3DC] font-body text-lg">
                Track your applications, save favorite listings, and manage your document checklist — all stored privately on your device.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="bg-white/10 rounded-xl p-4 text-center min-w-[80px]">
                <div className="font-display text-2xl font-bold text-[#FCD34D]">{apps.length}</div>
                <div className="text-[#95D5A3] text-xs font-body">Tracked</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center min-w-[80px]">
                <div className="font-display text-2xl font-bold text-[#FCD34D]">{savedIds.length}</div>
                <div className="text-[#95D5A3] text-xs font-body">Saved</div>
              </div>
              <div className="bg-white/10 rounded-xl p-4 text-center min-w-[80px]">
                <div className="font-display text-2xl font-bold text-[#FCD34D]">{docProgress}%</div>
                <div className="text-[#95D5A3] text-xs font-body">Docs ready</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy notice */}
      <div className="bg-[#F0FDF4] border-b border-[#BBF7D0]">
        <div className="container py-2.5">
          <p className="text-[#166534] text-xs font-body flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            Your data is stored only on this device. Nothing is sent to any server. Clear your browser data to reset.
          </p>
        </div>
      </div>

      <main className="flex-1 container py-8">
        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-[#E8E7E1] p-1 mb-6 w-fit shadow-sm">
          {[
            { id: 'tracker', label: 'Application Tracker', count: apps.length },
            { id: 'saved', label: 'Saved Listings', count: savedIds.length },
            { id: 'docs', label: 'Document Checklist', count: null },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-[#1B4332] text-white shadow-sm'
                  : 'text-[#374151] hover:bg-[#F0EFE9]'
              }`}
            >
              {tab.label}
              {tab.count !== null && tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#E8E7E1] text-[#6B7280]'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── APPLICATION TRACKER ── */}
          {activeTab === 'tracker' && (
            <motion.div key="tracker" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Status summary */}
              {statusCounts.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {statusCounts.map(s => (
                    <span key={s.key} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold border ${s.color}`}>
                      {STATUS_CONFIG[s.key as AppStatus].icon}
                      {s.label}: {s.count}
                    </span>
                  ))}
                </div>
              )}

              {/* Add new */}
              <div className="bg-white rounded-xl border border-[#E8E7E1] p-4 mb-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <Plus className="w-4 h-4 text-[#1B4332]" />
                  <span className="font-body font-semibold text-[#374151] text-sm">Add a property to track</span>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                  <input
                    type="text"
                    placeholder="Search by property name or city..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm font-body border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332]"
                  />
                </div>
                {searchQuery && (
                  <div className="mt-2 border border-[#E5E7EB] rounded-lg overflow-hidden">
                    {filteredProps.map(p => (
                      <div key={p.id} className="flex items-center justify-between px-3 py-2.5 hover:bg-[#F9FAFB] border-b border-[#F0EFE9] last:border-0">
                        <div>
                          <div className="font-body text-sm font-medium text-[#1F2937]">{p.name}</div>
                          <div className="font-body text-xs text-[#9CA3AF]">{p.city} · {p.housing_types.join(', ')}</div>
                        </div>
                        <button
                          onClick={() => { addToTracker(p.id); setSearchQuery(''); }}
                          className="px-3 py-1.5 bg-[#1B4332] text-white rounded-lg text-xs font-body font-medium hover:bg-[#2D6A4F] transition-colors"
                        >
                          Track
                        </button>
                      </div>
                    ))}
                    {filteredProps.length === 0 && (
                      <div className="px-3 py-3 text-sm font-body text-[#9CA3AF] text-center">No properties found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Tracked apps */}
              {apps.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-[#E8E7E1]">
                  <div className="text-4xl mb-3">📋</div>
                  <h3 className="font-display text-[#1B4332] text-lg font-bold mb-2">No applications tracked yet</h3>
                  <p className="text-[#6B7280] font-body text-sm mb-4">Search for a property above to start tracking your applications.</p>
                  <button onClick={() => navigate('/search')} className="px-4 py-2 bg-[#1B4332] text-white rounded-lg font-body text-sm">
                    Browse properties
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {apps.map(app => {
                    const property = allProperties.find(p => p.id === app.propertyId);
                    if (!property) return null;
                    const isEditing = editingId === app.propertyId;
                    const statusCfg = STATUS_CONFIG[app.status];
                    return (
                      <div key={app.propertyId} className="bg-white rounded-xl border border-[#E8E7E1] p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-display text-[#1B4332] font-bold text-base">{property.name}</h3>
                              <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-body font-semibold border ${statusCfg.color}`}>
                                {statusCfg.icon} {statusCfg.label}
                              </span>
                            </div>
                            <p className="text-[#6B7280] text-xs font-body">{property.address}, {property.city}</p>
                            {app.notes && !isEditing && (
                              <p className="text-[#374151] text-xs font-body mt-2 bg-[#F9FAFB] rounded-lg p-2">{app.notes}</p>
                            )}
                            <p className="text-[#9CA3AF] text-[10px] font-body mt-1">Added {app.dateAdded} · Updated {app.dateUpdated}</p>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => navigate(`/property/${property.id}`)} className="p-1.5 text-[#6B7280] hover:text-[#1B4332] transition-colors" title="View property">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setEditingId(app.propertyId); setEditNotes(app.notes); setEditStatus(app.status); }}
                              className="p-1.5 text-[#6B7280] hover:text-[#1B4332] transition-colors"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => removeApp(app.propertyId)} className="p-1.5 text-[#6B7280] hover:text-red-600 transition-colors" title="Remove">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {isEditing && (
                          <div className="mt-3 pt-3 border-t border-[#E8E7E1] space-y-3">
                            <div>
                              <label className="block text-xs font-body font-semibold text-[#374151] mb-1.5">Status</label>
                              <div className="flex flex-wrap gap-1.5">
                                {(Object.entries(STATUS_CONFIG) as [AppStatus, typeof STATUS_CONFIG[AppStatus]][]).map(([key, cfg]) => (
                                  <button
                                    key={key}
                                    onClick={() => setEditStatus(key)}
                                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-body font-semibold border transition-all ${editStatus === key ? cfg.color : 'bg-white text-[#6B7280] border-[#E5E7EB]'}`}
                                  >
                                    {cfg.icon} {cfg.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs font-body font-semibold text-[#374151] mb-1.5">Notes</label>
                              <textarea
                                value={editNotes}
                                onChange={e => setEditNotes(e.target.value)}
                                placeholder="Contact name, reference number, next steps..."
                                rows={2}
                                className="w-full px-3 py-2 text-sm font-body border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B4332] resize-none"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => saveEdit(app.propertyId)} className="flex items-center gap-1.5 px-4 py-2 bg-[#1B4332] text-white rounded-lg text-xs font-body font-semibold">
                                <Save className="w-3.5 h-3.5" /> Save
                              </button>
                              <button onClick={() => setEditingId(null)} className="px-4 py-2 border border-[#E5E7EB] text-[#374151] rounded-lg text-xs font-body">
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ── SAVED LISTINGS ── */}
          {activeTab === 'saved' && (
            <motion.div key="saved" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {savedProperties.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-[#E8E7E1]">
                  <div className="text-4xl mb-3">❤️</div>
                  <h3 className="font-display text-[#1B4332] text-lg font-bold mb-2">No saved listings yet</h3>
                  <p className="text-[#6B7280] font-body text-sm mb-4">Click the heart icon on any property to save it here.</p>
                  <button onClick={() => navigate('/search')} className="px-4 py-2 bg-[#1B4332] text-white rounded-lg font-body text-sm">
                    Browse properties
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {savedProperties.map(p => (
                    <div key={p.id} className="bg-white rounded-xl border border-[#E8E7E1] p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-[#1B4332] font-bold text-sm leading-tight">{p.name}</h3>
                        <button onClick={() => removeSaved(p.id)} className="p-1 text-[#9CA3AF] hover:text-red-500 transition-colors flex-shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[#6B7280] text-xs font-body mb-2">{p.address}, {p.city}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {p.housing_types.map(t => (
                          <span key={t} className="text-[10px] font-body px-1.5 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332]">{t}</span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => navigate(`/property/${p.id}`)} className="flex-1 py-2 bg-[#1B4332] text-white rounded-lg text-xs font-body font-medium hover:bg-[#2D6A4F] transition-colors">
                          View details
                        </button>
                        <button onClick={() => addToTracker(p.id)} className="px-3 py-2 border border-[#E5E7EB] text-[#374151] rounded-lg text-xs font-body hover:bg-[#F0EFE9] transition-colors">
                          Track
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ── DOCUMENT CHECKLIST ── */}
          {activeTab === 'docs' && (
            <motion.div key="docs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="max-w-xl">
                {/* Progress */}
                <div className="bg-[#1B4332] text-white rounded-2xl p-5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold text-base">Document Readiness</h3>
                    <span className="font-display text-2xl font-bold text-[#FCD34D]">{docProgress}%</span>
                  </div>
                  <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#52B788] rounded-full transition-all duration-500" style={{ width: `${docProgress}%` }} />
                  </div>
                  <p className="text-[#95D5A3] text-xs font-body mt-2">{checkedRequired} of {totalRequired} required documents gathered</p>
                </div>

                <div className="bg-white rounded-2xl border border-[#E8E7E1] p-5 shadow-sm">
                  <h3 className="font-display text-[#1B4332] font-bold text-base mb-4">Required Documents</h3>
                  <div className="space-y-2 mb-5">
                    {DOCS.filter(d => d.required).map(doc => (
                      <label key={doc.id} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                        <button
                          onClick={() => toggleDoc(doc.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            docChecks[doc.id] ? 'bg-[#1B4332] border-[#1B4332]' : 'border-[#D1D5DB] group-hover:border-[#52B788]'
                          }`}
                        >
                          {docChecks[doc.id] && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`font-body text-sm ${docChecks[doc.id] ? 'text-[#9CA3AF] line-through' : 'text-[#374151]'}`}>
                          {doc.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <h3 className="font-display text-[#1B4332] font-bold text-base mb-3">Optional (may be required)</h3>
                  <div className="space-y-2">
                    {DOCS.filter(d => !d.required).map(doc => (
                      <label key={doc.id} className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-[#F9FAFB] transition-colors">
                        <button
                          onClick={() => toggleDoc(doc.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                            docChecks[doc.id] ? 'bg-[#1B4332] border-[#1B4332]' : 'border-[#D1D5DB] group-hover:border-[#52B788]'
                          }`}
                        >
                          {docChecks[doc.id] && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </button>
                        <span className={`font-body text-sm ${docChecks[doc.id] ? 'text-[#9CA3AF] line-through' : 'text-[#374151]'}`}>
                          {doc.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-4 p-4 bg-[#FFFBEB] border border-[#FCD34D]/40 rounded-xl">
                  <p className="text-[#78350F] text-xs font-body">
                    <strong>Pro tip:</strong> Scan all documents and save them in a single folder on your phone or computer. You'll need to submit them multiple times across different applications.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
