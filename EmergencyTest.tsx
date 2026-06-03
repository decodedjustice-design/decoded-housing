/**
 * EMERGENCY TEST PAGE — Dev-only preview of the EmergencyAlertCard
 * Forces the severe weather activation to be active with demo data.
 * Remove this page before production or gate behind a flag.
 */
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EmergencyAlertCard from '@/components/EmergencyAlertCard';
import { forceActiveSevereWeather } from '@/hooks/useSevereWeather';

export default function EmergencyTest() {
  const [fallbackTriggered, setFallbackTriggered] = useState(false);
  const [loading, setLoading] = useState(false);
  const status = forceActiveSevereWeather();

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
      <Navbar />
      <div className="container py-8 max-w-2xl">
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-yellow-800 text-sm font-body font-semibold">
            🧪 Dev Preview — Emergency Activation Layer (forced active)
          </p>
          <p className="text-yellow-700 text-xs font-body mt-1">
            This page simulates what users see when severe weather shelters are activated.
            The real system fetches kcrha.org every 10 minutes.
          </p>
        </div>

        <EmergencyAlertCard
          status={status}
          onRefresh={handleRefresh}
          loading={loading}
          onFallback={() => setFallbackTriggered(true)}
        />

        {fallbackTriggered && (
          <div className="mt-4 p-4 bg-[#F9FAFB] border border-[#E8E7E1] rounded-xl">
            <p className="text-[#374151] text-sm font-body font-semibold">
              ✓ Fallback triggered — standard shelter options would appear here
            </p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
