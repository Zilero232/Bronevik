'use client';

import { Target } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { getGoals, removeGoal } from '@/shared/api/me';
import { Skeleton } from '@/ui-kit';

import { useMeMutation, useMeSection } from '../../../model/hooks';
import { GoalForm } from '../GoalForm';
import { GoalItem } from '../GoalItem';
import { MeCard } from '../MeCard';

import s from './GoalsCard.module.scss';

export const GoalsCard = () => {
  const t = useTranslations('me.goals');
  const { data: goals, isPending } = useMeSection({ section: 'goals', fetcher: getGoals });
  const remove = useMeMutation({ section: 'goals', mutationFn: removeGoal, successKey: 'goalRemoved' });

  return (
    <MeCard description={t('description')} icon={<Target size={18} />} title={t('title')}>
      <div className={s.root}>
        <div className={s.list}>
          {isPending && <Skeleton height={180} shape='block' />}
          {goals?.length === 0 && <p className={s.empty}>{t('empty')}</p>}
          {goals?.map((goal, index) => (
            <GoalItem key={goal.id} goal={goal} index={index} onRemove={() => remove.mutate(goal.id)} />
          ))}
        </div>
        <GoalForm />
      </div>
    </MeCard>
  );
};
