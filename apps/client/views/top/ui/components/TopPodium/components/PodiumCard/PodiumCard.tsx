'use client';

import { MasteryIcon } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import type { PodiumCardProps } from './PodiumCard.types';

import { TOP_BOARD } from '../../../../../config';
import { EntrantCell, ValueCell } from '../../../TopTable/components';

import s from './PodiumCard.module.scss';

export const PodiumCard = ({ entry, filter }: PodiumCardProps) => {
  const t = useTranslations('top');

  return (
    <li className={s.root} data-medal={TOP_BOARD.medals[entry.rank - 1]} data-rank={entry.rank}>
      <MasteryIcon aria-hidden className={s.glyph} level='master' size={160} />
      <div className={s.head}>
        <span aria-label={t('podium.place', { rank: entry.rank })} className={s.ring}>
          {entry.rank}
        </span>
        <span className={s.entrant}>
          <EntrantCell badge={null} entry={entry} />
        </span>
      </div>
      <div className={s.figure}>
        <span className={s.label}>{filter.scope === 'marks' ? t('marksLabel') : t(`metrics.${filter.metric}`)}</span>
        <ValueCell isHero entry={entry} filter={filter} />
      </div>
      <span className={s.battles}>{t('podium.battles', { count: entry.battles })}</span>
    </li>
  );
};
