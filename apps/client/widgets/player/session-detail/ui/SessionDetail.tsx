'use client';

import { clsx } from 'clsx';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { StatsTiles } from '@/entities/player/stats';
import { STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { EmptyState, Skeleton } from '@/ui-kit';

import type { SessionDetailProps } from './SessionDetail.types';

import { useSessionDetail } from '../model/hooks';
import { SessionBattles, SessionHeader, SessionHighlights, SessionTanks } from './components';

import s from './SessionDetail.module.scss';

export const SessionDetail = ({ accountId, sessionId, nickname, withShare = true, className }: SessionDetailProps) => {
  const t = useTranslations('profile.sessions');
  const { data: session, isPending, isError } = useSessionDetail({ accountId, sessionId });

  if (isError) {
    return <EmptyState className={className} description={t('errorDescription')} title={t('errorTitle')} />;
  }

  if (isPending) {
    return (
      <div aria-busy className={clsx(s.root, className)}>
        <Skeleton height={48} shape='block' />
        <Skeleton height={220} shape='block' />
        <Skeleton height={160} shape='block' />
      </div>
    );
  }

  return (
    <motion.article key={session.id} animate='visible' className={clsx(s.root, className)} initial='hidden' variants={STAGGER}>
      <motion.div variants={STAGGER_ITEM}>
        <SessionHeader nickname={nickname} session={session} withShare={withShare} />
      </motion.div>
      <motion.div variants={STAGGER_ITEM}>
        <StatsTiles stats={session.stats} />
      </motion.div>
      <motion.div variants={STAGGER_ITEM}>
        <SessionHighlights best={session.best} worst={session.worst} />
      </motion.div>
      <motion.div variants={STAGGER_ITEM}>
        <SessionTanks tanks={session.tanks} />
      </motion.div>
      {session.battles && (
        <motion.div variants={STAGGER_ITEM}>
          <SessionBattles battles={session.battles} />
        </motion.div>
      )}
    </motion.article>
  );
};
