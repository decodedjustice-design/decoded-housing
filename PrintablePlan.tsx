/**
 * PrintablePlan — Shelter Finder print output
 * Design: Editorial Civic — clean, high-contrast, print-safe
 *
 * Renders a single-page printable shelter plan with:
 *   - Date/time generated
 *   - User's intake answers
 *   - Card 1: Best Option
 *   - Card 2: Next Options
 *   - Card 3: Backup Options
 *   - Always-visible 211 fallback
 *   - Footer disclaimer
 *
 * Uses window.print() with a dedicated @media print stylesheet injected
 * into a hidden div so the rest of the page is hidden during print.
 */

import { useRef, useCallback } from 'react';
import { Printer } from 'lucide-react';
import { RankedResults } from '@/lib/decisionEngine';
import { Layer1Record } from '@/data/layer1_shelter';
import { UserInput } from '@/lib/decisionEngine';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SPEED_LABEL: Record<string, string> = {
  immediate: 'Immediate',
  same_day:  'Same day',
  delayed:   'Delayed',
};

const BARRIER_LABEL: Record<string, string> = {
  low:    'Low barrier',
  medium: 'Medium barrier',
  high:   'High barrier',
};

const ENTRY_LABEL: Record<string, string> = {
  'call':      'Call to enter',
  'walk-in':   'Walk-in',
  'scheduled': 'Scheduled intake',
  'referral':  'Referral needed',
  'screened':  'Screening required',
};

const POP_LABEL: Record<string, string> = {
  Families:          'Family with children',
  Adults:            'Single adult',
  Youth:             'Young adult / youth',
  Women:             'Woman',
  Men:               'Man',
  'Vehicle dwellers':'Living in vehicle',
  All:               'All populations',
  not_sure:          'Not specified',
};

const AREA_LABEL: Record<string, string> = {
  'East King':  'East King County',
  'South King': 'South King County',
  Seattle:      'Seattle / North KC',
  Countywide:   'Countywide',
  not_sure:     'All areas',
};

const SIT_LABEL: Record<string, string> = {
  outside:         'Outside / unsheltered',
  vehicle:         'In a vehicle',
  shelter_already: 'In a shelter already',
  couch:           'Couch surfing',
  not_sure:        'Not specified',
};

// ─── Print HTML builder ───────────────────────────────────────────────────────

function buildPrintHTML(results: RankedResults, input: UserInput): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  function resourceBlock(r: Layer1Record, rank: string): string {
    const refBadge = r.referral_required === 'yes'
      ? `<span style="background:#FEF3C7;color:#92400E;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;">Referral required</span>`
      : '';
    return `
      <div style="border:1px solid #D1D5DB;border-radius:8px;padding:16px;margin-bottom:12px;page-break-inside:avoid;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
          <div>
            <div style="font-size:13px;font-weight:700;color:#1B4332;margin-bottom:2px;">${rank} — ${r.program_name}</div>
            <div style="font-size:11px;color:#6B7280;">${r.address}</div>
          </div>
          <span style="background:#D1FAE5;color:#065F46;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;white-space:nowrap;">${SPEED_LABEL[r.access_speed] ?? r.access_speed}</span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px;">
          <span style="background:#F3F4F6;color:#374151;padding:2px 8px;border-radius:999px;font-size:11px;">${BARRIER_LABEL[r.barrier_level] ?? r.barrier_level}</span>
          <span style="background:#F3F4F6;color:#374151;padding:2px 8px;border-radius:999px;font-size:11px;">${ENTRY_LABEL[r.entry_type] ?? r.entry_type}</span>
          ${refBadge}
        </div>
        <div style="font-size:12px;color:#374151;margin-bottom:10px;line-height:1.5;">${r.how_to_enter}</div>
        <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:6px;padding:10px;display:flex;align-items:center;gap:12px;">
          <div style="font-size:14px;font-weight:700;color:#1B4332;">${r.contact_details}</div>
          <div style="font-size:11px;color:#6B7280;">Call or copy this number</div>
        </div>
      </div>`;
  }

  const bestBlock = results.best
    ? `<div style="margin-bottom:20px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <span style="background:#D4A017;color:#1B4332;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">1</span>
          <div>
            <div style="font-weight:700;font-size:13px;color:#111827;">Best Immediate Option</div>
            <div style="font-size:11px;color:#6B7280;">Highest priority match for your situation</div>
          </div>
        </div>
        ${resourceBlock(results.best, 'Best Option')}
      </div>`
    : '';

  const nextBlock = results.next.length > 0
    ? `<div style="margin-bottom:20px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <span style="background:#B45309;color:#fff;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">2</span>
          <div>
            <div style="font-weight:700;font-size:13px;color:#111827;">Next Best Options</div>
            <div style="font-size:11px;color:#6B7280;">Try these if the first option is full or unavailable</div>
          </div>
        </div>
        ${results.next.map((r, i) => resourceBlock(r, `Option ${i + 2}`)).join('')}
      </div>`
    : '';

  const backupBlock = results.backup.length > 0
    ? `<div style="margin-bottom:20px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
          <span style="background:#4B5563;color:#fff;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;">3</span>
          <div>
            <div style="font-weight:700;font-size:13px;color:#111827;">Backup Options</div>
            <div style="font-size:11px;color:#6B7280;">Higher barriers or longer wait — use if others are full</div>
          </div>
        </div>
        ${results.backup.map((r, i) => resourceBlock(r, `Backup ${i + 1}`)).join('')}
      </div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Shelter Plan — Decoded Housing</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111827; background: #fff; padding: 32px; max-width: 720px; margin: 0 auto; }
    @media print {
      body { padding: 16px; }
      @page { margin: 12mm; size: A4 portrait; }
    }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="border-bottom:2px solid #1B4332;padding-bottom:16px;margin-bottom:20px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="font-size:20px;font-weight:800;color:#1B4332;letter-spacing:-0.5px;">Decoded Housing</div>
        <div style="font-size:11px;color:#6B7280;margin-top:2px;">decodedhousing.org · Not affiliated with ARCH or any government agency</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:12px;font-weight:700;color:#1B4332;">Shelter Plan</div>
        <div style="font-size:11px;color:#6B7280;">${dateStr}</div>
        <div style="font-size:11px;color:#6B7280;">${timeStr}</div>
      </div>
    </div>
  </div>

  <!-- Intake summary -->
  <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;padding:12px 16px;margin-bottom:20px;display:flex;gap:24px;flex-wrap:wrap;">
    <div>
      <div style="font-size:10px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;">Who needs shelter</div>
      <div style="font-size:13px;font-weight:600;color:#1B4332;margin-top:2px;">${POP_LABEL[input.population ?? 'not_sure'] ?? input.population}</div>
    </div>
    <div>
      <div style="font-size:10px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;">Area</div>
      <div style="font-size:13px;font-weight:600;color:#1B4332;margin-top:2px;">${AREA_LABEL[input.county_area ?? 'not_sure'] ?? input.county_area}</div>
    </div>
    <div>
      <div style="font-size:10px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.5px;">Current situation</div>
      <div style="font-size:13px;font-weight:600;color:#1B4332;margin-top:2px;">${SIT_LABEL[input.situation ?? 'not_sure'] ?? input.situation}</div>
    </div>
  </div>

  <!-- Emergency callout -->
  <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:12px 16px;margin-bottom:20px;">
    <div style="font-size:12px;font-weight:700;color:#991B1B;margin-bottom:4px;">⚠ If in immediate danger</div>
    <div style="font-size:12px;color:#7F1D1D;">Call 911 · Domestic violence: 1-800-656-7867 · Crisis line: 988</div>
  </div>

  <!-- Ranked results -->
  ${bestBlock}
  ${nextBlock}
  ${backupBlock}

  <!-- 211 fallback -->
  <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:8px;padding:14px 16px;margin-bottom:20px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
    <div>
      <div style="font-size:13px;font-weight:700;color:#111827;">Still need help? Call 211</div>
      <div style="font-size:11px;color:#6B7280;margin-top:2px;">24/7 navigator · Can route you to any King County resource</div>
    </div>
    <div style="font-size:22px;font-weight:800;color:#1B4332;">211</div>
  </div>

  <!-- Footer -->
  <div style="border-top:1px solid #E5E7EB;padding-top:12px;font-size:10px;color:#9CA3AF;line-height:1.6;">
    This plan was generated by Decoded Housing on ${dateStr} at ${timeStr}. Resource information is sourced from public records and community reports. Always verify directly with each organization before visiting. Decoded Housing is not affiliated with ARCH, King County, or any government agency. Data may be outdated — call ahead.
  </div>
</body>
</html>`;
}

// ─── Component ────────────────────────────────────────────────────────────────

interface PrintablePlanProps {
  results: RankedResults;
  input: UserInput;
  className?: string;
}

export function PrintablePlan({ results, input, className }: PrintablePlanProps) {
  const printWindowRef = useRef<Window | null>(null);

  const handlePrint = useCallback(() => {
    const html = buildPrintHTML(results, input);

    // Open a new window with the print-ready HTML
    const win = window.open('', '_blank', 'width=800,height=900');
    if (!win) {
      // Fallback: inject a hidden iframe and print from it
      const iframe = document.createElement('iframe');
      iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:800px;height:900px;border:none;';
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
        setTimeout(() => {
          iframe.contentWindow?.print();
          setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 300);
      }
      return;
    }

    printWindowRef.current = win;
    win.document.open();
    win.document.write(html);
    win.document.close();

    // Wait for content to render, then trigger print dialog
    win.onload = () => {
      setTimeout(() => {
        win.print();
        // Close the window after print dialog closes (optional)
        win.onafterprint = () => win.close();
      }, 200);
    };
  }, [results, input]);

  return (
    <button
      onClick={handlePrint}
      className={className ?? 'flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/20 rounded-lg font-body text-sm text-white hover:bg-white/20 transition-colors'}
    >
      <Printer className="w-3.5 h-3.5" />
      Print plan
    </button>
  );
}

export default PrintablePlan;
