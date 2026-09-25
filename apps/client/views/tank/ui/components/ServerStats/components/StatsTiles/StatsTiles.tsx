'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { REVEAL_VIEWPORT, STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { StatTile } from '@/ui-kit';

import { cohortRow } from '../../../../../lib';
import { useTank } from '../../../../../model/context';
import { useTankTrend } from '../../../../../model/hooks';
import { SectionNotice } from '../../../SectionNotice';
import { STAT_TILES } from './StatsTiles.constants';

import s from './StatsTiles.module.scss';

export const StatsTiles = () => {
  const t = useTranslations('tank.stats');
  const { detail } = useTank();
  const { data: trend } = useTankTrend();

  const row = cohortRow(detail.serverStats, 'all');

  if (!row) {
    return <SectionNotice description={t('emptyDescription')} kind='empty' title={t('emptyTitle')} />;
  }

  return (
    <motion.div className={s.root} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
      {STAT_TILES.map(({ key, icon: Icon, unit, format, pick, tone, trend: toTrend }) => (
        <motion.div key={key} variants={STAGGER_ITEM}>
          <StatTile
            format={format}
            hint={t(`hints.${key}`)}
            icon={<Icon size={16} />}
            label={t(`tiles.${key}`)}
            suffix={unit && (unit === 'percent' ? '%' : ` ${t('pp')}`)}
            tone={tone(row)}
            trend={toTrend && trend ? trend.flatMap((point) => toTrend(point) ?? []) : undefined}
            value={pick(row)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};
