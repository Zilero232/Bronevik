'use client';

import { motion } from 'motion/react';

import { periodStats, StatsTiles } from '@/entities/player/stats';
import { STAGGER, STAGGER_ITEM } from '@/shared/lib';

import { OVERVIEW } from '../../../config';
import { useProfileContext } from '../../../model/context';
import { usePlayerHistory } from '../../../model/hooks';
import { ActivityCard, RatingHistoryCard, TankHighlightsCard } from './components';

import s from './OverviewTab.module.scss';

export const OverviewTab = () => {
  const { profile, period } = useProfileContext();
  const { data: history } = usePlayerHistory({ metric: OVERVIEW.historyMetric, granularity: OVERVIEW.historyGranularity });

  const { overall } = profile.summary;
  const stats = periodStats({ overall, recent: profile.recent, period }) ?? overall;
  const trend = history?.points.slice(-30).flatMap(({ value }) => (value === null ? [] : [value]));

  return (
    <motion.div animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <motion.div variants={STAGGER_ITEM}>
        <StatsTiles reference={period === 'overall' ? null : overall} stats={stats} trends={{ wn8: trend }} />
      </motion.div>
      <div className={s.split}>
        <motion.div variants={STAGGER_ITEM}>
          <RatingHistoryCard />
        </motion.div>
        <motion.div variants={STAGGER_ITEM}>
          <TankHighlightsCard />
        </motion.div>
      </div>
      <motion.div variants={STAGGER_ITEM}>
        <ActivityCard />
      </motion.div>
    </motion.div>
  );
};
