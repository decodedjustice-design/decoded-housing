import { HousingType, HOUSING_TYPE_COLORS } from '@/lib/types';

interface HousingTypeBadgeProps {
  type: HousingType;
  size?: 'sm' | 'md';
}

export default function HousingTypeBadge({ type, size = 'sm' }: HousingTypeBadgeProps) {
  const colors = HOUSING_TYPE_COLORS[type];
  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  return (
    <span
      className={`inline-flex items-center rounded-full font-body font-medium ${padding}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {colors.label}
    </span>
  );
}
