import { OG_COLORS, OG_FONTS } from '@/shared/seo/og';

import type { OgMetricsProps } from './OgMetrics.types';

export const OgMetrics = ({ metrics }: OgMetricsProps) => (
  <div style={{ display: 'flex', border: `2px solid ${OG_COLORS.border}`, background: OG_COLORS.surface }}>
    {metrics.map(({ key, label, value, color }, index) => (
      <div
        key={key}
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          padding: '20px 24px',
          borderLeft: index === 0 ? 'none' : `2px solid ${OG_COLORS.border}`
        }}
      >
        <div style={{ display: 'flex', color: OG_COLORS.muted, fontSize: 20, letterSpacing: 1, whiteSpace: 'nowrap' }}>{label.toUpperCase()}</div>
        <div style={{ display: 'flex', color, fontFamily: OG_FONTS.display, fontSize: 60 }}>{value}</div>
      </div>
    ))}
  </div>
);
