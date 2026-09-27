import { OG_COLORS, OG_FONTS, OgFrame, OgMetrics } from '@/shared/seo/og';

import type { EntityOgCardProps } from './EntityOgCard.types';

export const EntityOgCard = ({ heading, title, subtitle, metrics, url, source }: EntityOgCardProps) => (
  <OgFrame
    footer={
      <>
        <div style={{ display: 'flex' }}>{url}</div>
        <div style={{ display: 'flex' }}>{source}</div>
      </>
    }
    heading={heading}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', fontFamily: OG_FONTS.display, fontSize: title.length > 18 ? 88 : 112, lineHeight: 1 }}>{title}</div>
      <div style={{ display: 'flex', color: OG_COLORS.muted, fontSize: 36 }}>{subtitle}</div>
    </div>
    <OgMetrics metrics={metrics} />
  </OgFrame>
);
