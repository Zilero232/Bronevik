'use client';

import { motion } from 'motion/react';

import { STAGGER, STAGGER_ITEM } from '@/shared/lib';

import type { PlayerDashboardProps } from './PlayerDashboard.types';

import { usePlayerDigest } from '../../../model/hooks';
import { MarksCard } from '../MarksCard';
import { PlayerHeader } from '../PlayerHeader';
import { QuickLinks } from '../QuickLinks';
import { SessionCard } from '../SessionCard';
import { StatGrid } from '../StatGrid';

import s from './PlayerDashboard.module.scss';

export const PlayerDashboard = ({ accountId, nickname }: PlayerDashboardProps) => {
  const { profile, session, marks } = usePlayerDigest(accountId);

  return (
    <motion.div animate='visible' className={s.root} initial='hidden' variants={STAGGER}>
      <motion.div variants={STAGGER_ITEM}>
        <PlayerHeader nickname={nickname} summary={profile?.summary} />
      </motion.div>
      <motion.div variants={STAGGER_ITEM}>
        <StatGrid stats={profile?.summary.overall} />
      </motion.div>
      <motion.div variants={STAGGER_ITEM}>
        <SessionCard nickname={nickname} session={session} />
      </motion.div>
      <motion.div variants={STAGGER_ITEM}>
        <MarksCard marks={marks} />
      </motion.div>
      <motion.div variants={STAGGER_ITEM}>
        <QuickLinks nickname={nickname} />
      </motion.div>
    </motion.div>
  );
};
