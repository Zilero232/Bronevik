'use client';

import { Award, Check } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { useChallengeTitle } from '@/entities/social/challenge';
import { Badge, ProgressRing } from '@/ui-kit';

import type { ChallengeCardProps } from './ChallengeCard.types';

import { CHALLENGES_VIEW } from '../../../config';

import s from './ChallengeCard.module.scss';

export const ChallengeCard = ({ row }: ChallengeCardProps) => {
  const t = useTranslations('social.challenges');
  const format = useFormatter();
  const titleOf = useChallengeTitle();

  return (
    <article className={s.root} data-completed={row.isCompleted}>
      <ProgressRing
        label={t('progressLabel', { value: row.value, target: row.target })}
        max={row.target}
        size={CHALLENGES_VIEW.ringSize}
        tone={row.isCompleted ? 'good' : 'accent'}
        value={Math.min(row.value, row.target)}
      >
        {row.isCompleted ? <Check aria-hidden size={20} /> : format.number(row.share, 'share')}
      </ProgressRing>
      <div className={s.body}>
        <h3 className={s.title}>{titleOf(row)}</h3>
        <p className={s.progress}>{t('progress', { value: format.number(row.value, 'integer'), target: format.number(row.target, 'integer') })}</p>
        <div className={s.reward}>
          <Badge shape='pill' tone={row.isCompleted ? 'success' : 'neutral'}>
            <Award aria-hidden size={12} />
            {row.isCompleted ? t('reward.received') : t('reward.badge')}
          </Badge>
          {row.completedAt && <span className={s.done}>{t('completedAt', { date: format.dateTime(new Date(row.completedAt), 'dateTime') })}</span>}
        </div>
      </div>
    </article>
  );
};
