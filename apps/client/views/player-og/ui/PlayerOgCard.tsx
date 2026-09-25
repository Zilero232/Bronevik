import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { OG_COLORS, OG_FONTS, OG_TONES } from '@/shared/seo/og';

import type { PlayerOgCardProps } from './PlayerOgCard.types';

const numberFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });

export const PlayerOgCard = ({ profile, labels, host }: PlayerOgCardProps) => {
  const { nickname, clan, overall, accountId } = profile.summary;
  const metrics = [
    {
      key: 'bi',
      label: labels.broneIndex,
      value: numberFormat.format(overall.broneIndex.value ?? 0),
      color: OG_TONES[ratingValueTone(overall.broneIndex)]
    },
    { key: 'wn8', label: 'WN8', value: numberFormat.format(overall.wn8.value ?? 0), color: OG_TONES[ratingValueTone(overall.wn8)] },
    { key: 'wr', label: labels.winRate, value: `${(overall.winRate ?? 0).toFixed(2)}%`, color: OG_TONES[winRateTone(overall.winRate)] },
    { key: 'battles', label: labels.battles, value: numberFormat.format(overall.battles), color: OG_COLORS.text }
  ];

  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: `radial-gradient(circle at 88% 0%, rgba(255,107,26,0.28), transparent 45%), ${OG_COLORS.bg}`,
        color: OG_COLORS.text,
        fontFamily: OG_FONTS.body
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          color: OG_COLORS.accent,
          fontFamily: OG_FONTS.display,
          fontSize: 30,
          letterSpacing: 4
        }}
      >
        <div style={{ display: 'flex', width: 14, height: 14, background: OG_COLORS.accent }} />
        {`БРОНЕВИК · ${labels.eyebrow} · #${accountId}`}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', fontFamily: OG_FONTS.display, fontSize: nickname.length > 16 ? 96 : 124, lineHeight: 1 }}>{nickname}</div>
        <div style={{ display: 'flex', color: OG_COLORS.muted, fontSize: 36 }}>{clan ? `[${clan.tag}] ${clan.name}` : labels.noClan}</div>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        {metrics.map(({ key, label, value, color }) => (
          <div
            key={key}
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              padding: '20px 24px',
              border: `2px solid ${OG_COLORS.border}`,
              borderTop: `6px solid ${color}`,
              background: OG_COLORS.surface
            }}
          >
            <div style={{ display: 'flex', color: OG_COLORS.muted, fontSize: 20, letterSpacing: 1, whiteSpace: 'nowrap' }}>{label.toUpperCase()}</div>
            <div style={{ display: 'flex', color, fontFamily: OG_FONTS.display, fontSize: 60 }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', color: OG_COLORS.dim, fontSize: 22 }}>
        <div style={{ display: 'flex' }}>{`${host}/p/${nickname}`}</div>
        <div style={{ display: 'flex' }}>{labels.source}</div>
      </div>
    </div>
  );
};
