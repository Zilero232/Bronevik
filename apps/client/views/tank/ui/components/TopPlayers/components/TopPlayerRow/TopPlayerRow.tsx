'use client';

import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { ROW_ITEM } from '@/shared/lib';
import { RatingBadge } from '@/ui-kit';

import type { TopPlayerRowProps } from './TopPlayerRow.types';

import { playerMetric } from '../../../../../lib';

import s from './TopPlayerRow.module.scss';

const PODIUM = 3;

export const TopPlayerRow = ({ entry, metric, index }: TopPlayerRowProps) => {
  const t = useTranslations('tank.players');
  const format = useFormatter();

  const { rank, name, clanTag, battles } = entry;
  const { value, tone, isPercent } = playerMetric({ metric, entry });
  const display = isPercent ? `${format.number(value, { maximumFractionDigits: 2 })}%` : format.number(value, { maximumFractionDigits: 0 });

  return (
    <motion.li animate='visible' className={s.root} custom={index} data-podium={rank <= PODIUM} initial='hidden' variants={ROW_ITEM}>
      <span className={s.rank}>{String(rank).padStart(2, '0')}</span>
      <span className={s.who}>
        <Link className={s.name} href={ROUTES.player(name)}>
          {name}
        </Link>
        <span className={s.meta}>
          {clanTag && <span className={s.clan}>{`[${clanTag}]`}</span>}
          {t('battles', { count: battles })}
        </span>
      </span>
      <RatingBadge label={t(`metrics.${metric}`)} tone={tone} value={display} />
    </motion.li>
  );
};
