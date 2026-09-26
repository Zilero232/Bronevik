'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { ratingValueTone, winRateTone } from '@/entities/player/stats';
import { KeyFigure, ProgressRing } from '@/ui-kit';

import type { HeaderFiguresProps } from './HeaderFigures.types';

import { FIGURE_FORMAT, PROFILE_HEADER } from '../../../../../config';

import s from './HeaderFigures.module.scss';

export const HeaderFigures = ({ stats, ring }: HeaderFiguresProps) => {
  const t = useTranslations('profile.header');
  const format = useFormatter();
  const tone = ratingValueTone(stats.wn8);

  return (
    <div className={s.root}>
      <div className={s.ring} data-tone={tone}>
        <ProgressRing
          label={t('wn8Ring')}
          max={ring.max}
          size={PROFILE_HEADER.wn8Ring.size}
          thickness={PROFILE_HEADER.wn8Ring.thickness}
          tone={tone}
          value={ring.value}
        >
          <span className={s.ringValue}>{stats.wn8.value === null ? '—' : format.number(stats.wn8.value, FIGURE_FORMAT.integer)}</span>
          <span className={s.ringLabel}>WN8</span>
        </ProgressRing>
      </div>
      <div className={s.figures}>
        <KeyFigure
          format={FIGURE_FORMAT.percent}
          isFramed={false}
          label={t('winRate')}
          suffix='%'
          tone={winRateTone(stats.winRate)}
          value={stats.winRate}
        />
        <KeyFigure format={FIGURE_FORMAT.integer} isFramed={false} label={t('battles')} value={stats.battles} />
        <KeyFigure format={FIGURE_FORMAT.integer} isFramed={false} label={t('avgDamage')} value={stats.avgDamage} />
      </div>
    </div>
  );
};
