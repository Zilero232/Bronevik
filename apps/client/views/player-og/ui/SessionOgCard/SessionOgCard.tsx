import { OG_COLORS, OG_FONTS, OgFrame, OgMetrics } from '@/shared/seo/og';

import type { SessionOgCardProps } from './SessionOgCard.types';

import { sessionOgDate, sessionOgMetrics } from '../../lib';

export const SessionOgCard = ({ nickname, session, labels, locale }: SessionOgCardProps) => (
  <OgFrame
    footer={
      <>
        <div style={{ display: 'flex' }}>{session.best ? `${labels.session.best}: ${session.best.vehicle.shortName}` : ' '}</div>
        <div style={{ display: 'flex' }}>{labels.session.source}</div>
      </>
    }
    heading={`${labels.brand} · ${labels.session.kind}`}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', fontFamily: OG_FONTS.display, fontSize: 108, lineHeight: 1 }}>{nickname}</div>
      <div style={{ display: 'flex', color: OG_COLORS.muted, fontSize: 38 }}>{sessionOgDate({ startedAt: session.startedAt, locale })}</div>
    </div>
    <OgMetrics metrics={sessionOgMetrics({ stats: session.stats, labels: labels.session, locale })} />
  </OgFrame>
);
