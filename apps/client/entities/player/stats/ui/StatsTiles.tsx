'use client';

import { clsx } from 'clsx';
import { Crosshair, Flame, Gauge, Percent, Shield, Skull, Swords, Target } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { StatTile } from '@/ui-kit';

import type { StatsTilesProps } from './StatsTiles.types';

import { ratingValueTone, signed, statsDelta, winRateTone } from '../lib/stats-view';

import s from './StatsTiles.module.scss';

const DECIMALS_2 = { maximumFractionDigits: 2, minimumFractionDigits: 2 } as const;
const DECIMALS_1 = { maximumFractionDigits: 1, minimumFractionDigits: 1 } as const;

export const StatsTiles = ({ stats, reference, trends, className }: StatsTilesProps) => {
  const t = useTranslations('profile.stats');

  const delta = (pick: (block: NonNullable<StatsTilesProps['reference']>) => number | null) =>
    reference ? statsDelta({ current: pick(stats), reference: pick(reference) }) : undefined;

  const winRate = stats.winRate ?? 0;
  const winRateDelta = delta((block) => block.winRate);
  const damageDelta = delta((block) => block.avgDamage);
  const wn8Delta = delta((block) => block.wn8.value);

  return (
    <div className={clsx(s.root, className)}>
      <StatTile icon={<Swords size={16} />} label={t('battles')} tone='steel' value={stats.battles} />
      <StatTile
        delta={winRateDelta}
        deltaLabel={signed({ value: winRateDelta, digits: 2 })}
        format={DECIMALS_2}
        icon={<Percent size={16} />}
        label={t('winRate')}
        suffix='%'
        tone={winRateTone(stats.winRate)}
        trend={trends?.winRate}
        value={winRate}
      />
      <StatTile
        delta={damageDelta}
        deltaLabel={signed({ value: damageDelta })}
        icon={<Flame size={16} />}
        label={t('avgDamage')}
        trend={trends?.avgDamage}
        value={stats.avgDamage ?? 0}
      />
      <StatTile
        delta={wn8Delta}
        deltaLabel={signed({ value: wn8Delta })}
        icon={<Gauge size={16} />}
        label='WN8'
        tone={ratingValueTone(stats.wn8)}
        trend={trends?.wn8}
        value={stats.wn8.value ?? 0}
      />
      <StatTile icon={<Target size={16} />} label='EFF' tone={ratingValueTone(stats.eff)} value={stats.eff.value ?? 0} />
      <StatTile format={DECIMALS_2} icon={<Skull size={16} />} label={t('avgFrags')} tone='steel' value={stats.avgFrags ?? 0} />
      <StatTile format={DECIMALS_1} icon={<Shield size={16} />} label={t('survival')} suffix='%' tone='steel' value={stats.survivalRate ?? 0} />
      <StatTile format={DECIMALS_1} icon={<Crosshair size={16} />} label={t('accuracy')} suffix='%' tone='steel' value={stats.accuracy ?? 0} />
    </div>
  );
};
