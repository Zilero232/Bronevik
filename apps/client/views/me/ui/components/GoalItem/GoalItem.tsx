'use client';

import { differenceInCalendarDays } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';

import { percentText } from '@/shared/lib';
import { Badge, IconButton, ProgressBar } from '@/ui-kit';

import type { GoalItemProps } from './GoalItem.types';

import { GOAL_STATUS_TONE } from '../../../config';
import { isPercentMetric } from '../../../lib/goal-form';
import { goalProgress } from '../../../lib/goal-progress';

import s from './GoalItem.module.scss';

export const GoalItem = ({ goal, onRemove }: GoalItemProps) => {
  const t = useTranslations('me.goals');
  const format = useFormatter();

  const [now] = useState(Date.now);

  const { metric, target, baseline, current, status, endsAt } = goal;
  const progress = goalProgress({ baseline, target, current });
  const daysLeft = differenceInCalendarDays(new Date(endsAt), now);
  const value = (number: number) =>
    isPercentMetric(metric) ? percentText({ format, value: number, digits: 2 }) : format.number(number, { maximumFractionDigits: 2 });

  return (
    <article className={s.root} data-status={status}>
      <div className={s.head}>
        <strong className={s.title}>{t('goalTitle', { metric: t(`metric.${metric}`), target: value(target) })}</strong>
        <Badge tone={GOAL_STATUS_TONE[status]}>{t(`status.${status}`)}</Badge>
        <IconButton aria-label={t('remove')} size='sm' onClick={onRemove}>
          <Trash2 size={14} />
        </IconButton>
      </div>
      <ProgressBar
        label={t('progress', { from: value(baseline), current: current === null ? '—' : value(current) })}
        tone={status === 'achieved' ? 'good' : 'accent'}
        value={progress * 100}
        valueLabel={`${Math.round(progress * 100)}%`}
      />
      <span className={s.deadline}>{daysLeft >= 0 ? t('daysLeft', { count: daysLeft }) : t('overdue')}</span>
    </article>
  );
};
