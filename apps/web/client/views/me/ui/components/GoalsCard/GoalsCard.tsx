'use client';

import { Target } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Skeleton } from '@/ui-kit';

import { useGoalsCard } from '../../../model/hooks';
import { GoalForm } from '../GoalForm';
import { GoalItem } from '../GoalItem';
import { MeCard } from '../MeCard';
import { SectionError } from '../SectionError';

import s from './GoalsCard.module.scss';

export const GoalsCard = () => {
  const t = useTranslations('me.goals');
  const { goals, isPending, isError, isRetrying, onRetry, onRemove } = useGoalsCard();

  return (
    <MeCard description={t('description')} icon={<Target size={18} />} title={t('title')}>
      <div className={s.root}>
        <div className={s.list}>
          {isPending && <Skeleton height={180} shape='block' />}
          {isError && <SectionError isRetrying={isRetrying} onRetry={onRetry} />}
          {goals?.length === 0 && <p className={s.empty}>{t('empty')}</p>}
          {goals?.map((goal, index) => (
            <GoalItem key={goal.id} goal={goal} index={index} onRemove={() => onRemove(goal.id)} />
          ))}
        </div>
        <GoalForm />
      </div>
    </MeCard>
  );
};
