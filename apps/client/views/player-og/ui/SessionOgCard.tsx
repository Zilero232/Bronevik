import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { OG_COLORS, OG_FONTS, OG_TONES } from '@/shared/seo/og';

import type { SessionOgCardProps } from './SessionOgCard.types';

const numberFormat = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });

export const SessionOgCard = ({ nickname, session, labels }: SessionOgCardProps) => {
  const { stats, best } = session;
  const metrics = [
    { key: 'battles', label: labels.battles, value: numberFormat.format(stats.battles), color: OG_COLORS.text },
    { key: 'wr', label: labels.winRate, value: `${(stats.winRate ?? 0).toFixed(1)}%`, color: OG_TONES[winRateTone(stats.winRate)] },
    { key: 'dmg', label: labels.avgDamage, value: numberFormat.format(stats.avgDamage ?? 0), color: OG_COLORS.accentHot },
    { key: 'wn8', label: 'WN8', value: numberFormat.format(stats.wn8.value ?? 0), color: OG_TONES[ratingValueTone(stats.wn8)] }
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
        background: `radial-gradient(circle at 10% 100%, rgba(122,165,204,0.22), transparent 45%), radial-gradient(circle at 92% 0%, rgba(255,107,26,0.26), transparent 42%), ${OG_COLORS.bg}`,
        color: OG_COLORS.text,
        fontFamily: OG_FONTS.body
      }}
    >
      <div
        style={{ display: 'flex', color: OG_COLORS.accent, fontFamily: OG_FONTS.display, fontSize: 30, letterSpacing: 4 }}
      >{`БРОНЕВИК · ${labels.eyebrow}`}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', fontFamily: OG_FONTS.display, fontSize: 108, lineHeight: 1 }}>{nickname}</div>
        <div style={{ display: 'flex', color: OG_COLORS.muted, fontSize: 38 }}>{labels.date}</div>
      </div>
      <div style={{ display: 'flex', gap: 22 }}>
        {metrics.map(({ key, label, value, color }) => (
          <div
            key={key}
            style={{
              display: 'flex',
              flex: 1,
              flexDirection: 'column',
              padding: '18px 22px',
              borderLeft: `6px solid ${color}`,
              background: OG_COLORS.surface
            }}
          >
            <div style={{ display: 'flex', color: OG_COLORS.muted, fontSize: 22 }}>{label.toUpperCase()}</div>
            <div style={{ display: 'flex', color, fontFamily: OG_FONTS.display, fontSize: 64 }}>{value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', color: OG_COLORS.dim, fontSize: 24 }}>{best ? `${labels.best}: ${best.vehicle.shortName}` : ' '}</div>
    </div>
  );
};
