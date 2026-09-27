import { OG_COLORS, OG_FONTS, OgFrame, OgMetrics } from '@/shared/seo/og';

import type { WrappedOgCardProps } from './WrappedOgCard.types';

import { wrappedOgMetrics } from '../../lib';

export const WrappedOgCard = ({ nickname, wrapped, labels, locale, host }: WrappedOgCardProps) => (
  <OgFrame
    footer={
      <>
        <div style={{ display: 'flex' }}>{`${host}/p/${nickname}/wrapped/${wrapped.year}`}</div>
        <div style={{ display: 'flex' }}>{labels.wrapped.source}</div>
      </>
    }
    heading={`${labels.brand} · ${labels.wrapped.kind}`}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', color: OG_COLORS.accent, fontFamily: OG_FONTS.display, fontSize: 64, lineHeight: 1 }}>
        {`${labels.wrapped.year} ${wrapped.year}`}
      </div>
      <div style={{ display: 'flex', fontFamily: OG_FONTS.display, fontSize: nickname.length > 16 ? 96 : 120, lineHeight: 1 }}>{nickname}</div>
    </div>
    <OgMetrics metrics={wrappedOgMetrics({ wrapped, labels: labels.wrapped, locale })} />
  </OgFrame>
);
