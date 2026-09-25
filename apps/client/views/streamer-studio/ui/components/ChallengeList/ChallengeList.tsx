'use client';

import { Swords } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { ROW_ITEM } from '@/shared/lib';
import { EmptyState, Skeleton } from '@/ui-kit';

import { useChallenges } from '../../../model/hooks';
import { ChallengeCard } from '../ChallengeCard';

import s from './ChallengeList.module.scss';

export const ChallengeList = () => {
  const t = useTranslations('streamer.challenges.list');
  const { data: challenges = [], isPending } = useChallenges();

  return (
    <section aria-label={t('title')} className={s.root}>
      {match({ challenges, isPending })
        .with({ isPending: true }, () => <Skeleton height={320} shape='block' />)
        .with({ challenges: [] }, () => <EmptyState description={t('emptyDescription')} icon={<Swords size={20} />} title={t('empty')} />)
        .otherwise(({ challenges: items }) => (
          <ul className={s.list}>
            {items.map((challenge, index) => (
              <motion.li key={challenge.id} animate='visible' custom={index} initial='hidden' variants={ROW_ITEM}>
                <ChallengeCard challenge={challenge} />
              </motion.li>
            ))}
          </ul>
        ))}
    </section>
  );
};
