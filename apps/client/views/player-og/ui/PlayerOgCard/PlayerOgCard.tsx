import { clanLabel } from '@/entities/player/player';
import { OG_COLORS, OG_FONTS } from '@/shared/seo/og';

import type { PlayerOgCardProps } from './PlayerOgCard.types';

import { playerOgMetrics } from '../../lib';
import { OgFrame } from '../OgFrame';
import { OgMetrics } from '../OgMetrics';

export const PlayerOgCard = ({ profile: { summary }, labels, locale, host }: PlayerOgCardProps) => (
  <OgFrame
    footer={
      <>
        <div style={{ display: 'flex' }}>{`${host}/p/${summary.nickname}`}</div>
        <div style={{ display: 'flex' }}>{labels.player.source}</div>
      </>
    }
    heading={`${labels.brand} · ${labels.player.kind}`}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ display: 'flex', fontFamily: OG_FONTS.display, fontSize: summary.nickname.length > 16 ? 96 : 120, lineHeight: 1 }}>
        {summary.nickname}
      </div>
      <div style={{ display: 'flex', color: OG_COLORS.muted, fontSize: 36 }}>{summary.clan ? clanLabel(summary.clan) : labels.player.noClan}</div>
    </div>
    <OgMetrics metrics={playerOgMetrics({ stats: summary.overall, labels: labels.player, locale })} />
  </OgFrame>
);
