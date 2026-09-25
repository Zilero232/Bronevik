'use client';

import { GlobalMapIcon, StrongholdIcon } from '@bronevik/icons';
import { Crosshair, Flame, Swords, Trophy } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { percentText, STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

import type { HeroStat, HeroStatsProps } from './HeroStats.types';

import s from './HeroStats.module.scss';

const DASH = '—';

export const HeroStats = ({ stats }: HeroStatsProps) => {
  const t = useTranslations('clans.clan.stats');
  const format = useFormatter();

  const { avgWinRate, avgWn8, avgBattlesPerDay, strongholdLevel, provincesCount, eloRating10 } = stats;
  const number = (value: number | null) => (value === null ? DASH : format.number(Math.round(value)));
  const winRate = percentText({ format, value: avgWinRate });
  const tiles: HeroStat[] = [
    {
      key: 'winRate',
      label: t('winRate'),
      icon: <Trophy size={16} />,
      value: <RatingBadge size='lg' tone={winRateTone(avgWinRate)} value={winRate} />
    },
    {
      key: 'wn8',
      label: t('wn8'),
      icon: <Crosshair size={16} />,
      value: <RatingBadge size='lg' tone={ratingValueTone(avgWn8)} value={number(avgWn8.value)} />
    },
    { key: 'battles', label: t('battlesPerDay'), icon: <Swords size={16} />, value: number(avgBattlesPerDay) },
    {
      key: 'stronghold',
      label: t('stronghold'),
      icon: <StrongholdIcon size={16} />,
      value: strongholdLevel === null ? DASH : t('level', { level: strongholdLevel })
    },
    { key: 'provinces', label: t('provinces'), icon: <GlobalMapIcon size={16} />, value: format.number(provincesCount) },
    { key: 'elo', label: t('elo'), icon: <Flame size={16} />, value: number(eloRating10) }
  ];

  return (
    <motion.dl className={s.root} variants={STAGGER}>
      {tiles.map(({ key, label, icon, value }) => (
        <motion.div key={key} className={s.tile} variants={STAGGER_ITEM}>
          <dt className={s.label}>
            <span aria-hidden className={s.icon}>
              {icon}
            </span>
            {label}
          </dt>
          <dd className={s.value}>{value}</dd>
        </motion.div>
      ))}
    </motion.dl>
  );
};
