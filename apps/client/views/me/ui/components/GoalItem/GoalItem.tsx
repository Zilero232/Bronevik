'use client';

import { differenceInCalendarDays } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';
import { useState } from 'react';

import { percentText, ROW_ITEM } from '@/shared/lib';
import { Badge, IconButton, ProgressBar } from '@/ui-kit';

import type { GoalItemProps } from './GoalItem.types';

import { isPercentMetric } from '../../../lib/goal-form';
import { goalProgress } from '../../../lib/goal-progress';

import s from './GoalItem.module.scss';

const STATUS_TONE = { achieved: 'success', active: 'steel', failed: 'danger', cancelled: 'neutral' } as const;

export const GoalItem = ({ goal, index, onRemove }: GoalItemProps) => {
  const t = useTranslations('me.goals');
  const format = useFormatter();

  const [now] = useState(Date.now);

  const { metric, target, baseline, current, status, endsAt } = goal;
  const progress = goalProgress({ baseline, target, current });
  const daysLeft = differenceInCalendarDays(new Date(endsAt), now);
  const value = (number: number) =>
    isPercentMetric(metric) ? percentText({ format, value: number, digits: 2 }) : format.number(number, { maximumFractionDigits: 2 });

  return (
    <motion.article animate='visible' className={s.root} custom={index} data-status={status} initial='hidden' variants={ROW_ITEM}>
      <div className={s.head}>
        <strong className={s.title}>{t('goalTitle', { metric: t(`metric.${metric}`), target: value(target) })}</strong>
        <Badge tone={STATUS_TONE[status]}>{t(`status.${status}`)}</Badge>
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
    </motion.article>
  );
};
