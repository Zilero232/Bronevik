'use client';

import { useTranslations } from 'next-intl';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { KeyFigure, KeyFigures } from '@/ui-kit';

import type { HeaderFiguresProps } from './HeaderFigures.types';

import { FIGURE_FORMAT } from '../../../../../config';

import s from './HeaderFigures.module.scss';

export const HeaderFigures = ({ stats }: HeaderFiguresProps) => {
  const t = useTranslations('profile.header');

  return (
    <KeyFigures className={s.root} isFramed={false}>
      <KeyFigure format={FIGURE_FORMAT.integer} label='WN8' size='lg' tone={ratingValueTone(stats.wn8)} value={stats.wn8.value} />
      <KeyFigure format={FIGURE_FORMAT.integer} label={t('broneIndex')} size='lg' value={stats.broneIndex.value} />
      <KeyFigure format={FIGURE_FORMAT.percent} label={t('winRate')} size='lg' suffix='%' tone={winRateTone(stats.winRate)} value={stats.winRate} />
      <KeyFigure format={FIGURE_FORMAT.integer} label={t('battles')} size='lg' value={stats.battles} />
      <KeyFigure format={FIGURE_FORMAT.integer} label={t('avgDamage')} size='lg' value={stats.avgDamage} />
      <KeyFigure format={FIGURE_FORMAT.integer} label={t('avgXp')} size='lg' value={stats.avgXp} />
    </KeyFigures>
  );
};
