import { Link } from 'wouter';
import { MapPin, Phone, CheckCircle2, Clock, TrendingUp, Lightbulb, Train } from 'lucide-react';
import { Property } from '@/lib/types';
import HousingTypeBadge from './HousingTypeBadge';
import { getPropertyPhoto } from '@/data/propertyPhotos';
import { getTransit } from '@/data/propertyTransit';

interface PropertyCardProps {
  property: Property;
  highlighted?: boolean;
  onHover?: (id: string | null) => void;
}

export default function PropertyCard({ property, highlighted, onHover }: PropertyCardProps) {
  const lastVerifiedDate = new Date(property.last_verified);
  const daysSince = Math.floor((Date.now() - lastVerifiedDate.getTime()) / (1000 * 60 * 60 * 24));
  const isRecent = daysSince <= 30;
  const transit = getTransit(property.id);

  return (
    <Link href={`/property/${property.id}`}>
      <div
        className={`property-card bg-white rounded-xl border transition-all cursor-pointer ${
          highlighted
            ? 'border-[#1B4332] shadow-lg ring-2 ring-[#1B4332]/20'
            : 'border-[#E8E7E1] hover:border-[#52B788]'
        }`}
        onMouseEnter={() => onHover?.(property.id)}
        onMouseLeave={() => onHover?.(null)}
      >
        {/* Property photo */}
        <div className="relative h-40 overflow-hidden rounded-t-xl bg-[#F0EFE9]">
          <img
            src={getPropertyPhoto(property.id)}
            alt={property.name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              const img = e.currentTarget;
              img.src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';
            }}
          />
          {/* Housing type color strip overlay at bottom of image */}
          <div
            className="absolute bottom-0 left-0 right-0 h-1"
            style={{
              backgroundColor:
                property.housing_types.includes('Shelter') ? '#FDA4AF' :
                property.housing_types.includes('Section 8') ? '#93C5FD' :
                property.housing_types.includes('Transitional') ? '#C4B5FD' :
                property.housing_types.includes('MFTE') ? '#FCD34D' :
                '#52B788',
            }}
          />
          {property.verified && (
            <span className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[#1B4332] text-xs font-body font-medium px-2 py-0.5 rounded-full border border-[#95D5A3] shadow-sm">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
          )}
        </div>

        {/* Top accent bar based on primary housing type - REPLACED BY IMAGE */}
        <div
          className="h-0 hidden"
          style={{
            backgroundColor:
              property.housing_types.includes('Shelter') ? '#FDA4AF' :
              property.housing_types.includes('Section 8') ? '#93C5FD' :
              property.housing_types.includes('Transitional') ? '#C4B5FD' :
              property.housing_types.includes('MFTE') ? '#FCD34D' :
              '#52B788',
          }}
        />

        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-display font-semibold text-[#1B4332] text-base leading-snug line-clamp-2">
              {property.name}
            </h3>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-[#6B7280] text-sm font-body mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{property.address}, {property.city}</span>
          </div>

          {/* Housing type badges */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {property.housing_types.map(type => (
              <HousingTypeBadge key={type} type={type} size="sm" />
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs font-data text-[#6B7280] mb-3">
            <span>{property.affordable_units} affordable units</span>
            {property.unit_types.length > 0 && (
              <span>{property.unit_types.join(' · ')}</span>
            )}
          </div>

          {/* Notes preview */}
          <p className="text-[#6B7280] text-xs font-body line-clamp-2 mb-3">
            {property.notes}
          </p>

          {/* Insider tip preview */}
          {property.insider_tip && (
            <div className="insider-note px-3 py-2 mb-3 rounded-r-md">
              <div className="flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#D97706] flex-shrink-0 mt-0.5" />
                <p className="text-[#92400E] text-xs font-body line-clamp-2">{property.insider_tip}</p>
              </div>
            </div>
          )}

          {/* Transit badge */}
          {transit && (
            <div className="flex items-center gap-1.5 mb-3">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-body font-semibold border ${
                  transit.line === '2 Line'
                    ? 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]'
                    : 'bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]'
                }`}
              >
                <Train className="w-3 h-3" />
                {transit.line}
              </span>
              <span className="text-[#6B7280] text-[11px] font-body">
                {transit.station}
              </span>
              <span className={`text-[11px] font-data font-semibold ml-auto ${
                transit.distance_miles <= 0.25 ? 'text-[#16A34A]' :
                transit.distance_miles <= 0.5  ? 'text-[#D97706]' :
                'text-[#6B7280]'
              }`}>
                {transit.distance_str}
              </span>
            </div>
          )}

          {/* Footer row */}
          <div className="flex items-center justify-between pt-2 border-t border-[#F0EFE9]">
            <div className="flex items-center gap-3">
              {property.has_waitlist && (
                <span className="flex items-center gap-1 text-xs text-[#6B7280] font-body">
                  <Clock className="w-3 h-3" />
                  Waitlist
                </span>
              )}
              {property.likely_available && (
                <span className="flex items-center gap-1 text-xs text-[#1B4332] font-body font-medium">
                  <TrendingUp className="w-3 h-3" />
                  Likely available
                </span>
              )}
            </div>
            {property.contact_phone && (
              <span className="flex items-center gap-1 text-xs text-[#6B7280] font-body">
                <Phone className="w-3 h-3" />
                {property.contact_phone}
              </span>
            )}
          </div>

          {isRecent && (
            <div className="mt-2 text-xs text-[#52B788] font-body">
              ✓ Updated {daysSince === 0 ? 'today' : `${daysSince}d ago`}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
