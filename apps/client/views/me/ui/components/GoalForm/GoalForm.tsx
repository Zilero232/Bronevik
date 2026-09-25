'use client';

import type { GoalMetric } from '@bronevik/schemas';
import type { FormEvent } from 'react';

import { goalMetricSchema } from '@bronevik/schemas';
import { addDays } from 'date-fns';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { addGoal, getLinkedAccounts } from '@/shared/api/me';
import { Button, Input, Select } from '@/ui-kit';

import { goalFormSchema } from '../../../lib/goal-form';
import { useMeMutation, useMeSection } from '../../../model/hooks';

import s from './GoalForm.module.scss';

const DURATIONS = ['7', '14', '30'] as const;

type Duration = (typeof DURATIONS)[number];

export const GoalForm = () => {
  const t = useTranslations('me.goals');
  const { data: accounts } = useMeSection({ section: 'accounts', fetcher: getLinkedAccounts });
  const add = useMeMutation({ section: 'goals', mutationFn: addGoal, successKey: 'goalAdded' });

  const [metric, setMetric] = useState<GoalMetric>('winRate');
  const [duration, setDuration] = useState<Duration>('7');
  const [isInvalid, setIsInvalid] = useState(false);

  const accountId = accounts?.lesta.find(({ isPrimary }) => isPrimary)?.accountId ?? accounts?.lesta[0]?.accountId;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const parsed = goalFormSchema.safeParse({
      accountId,
      metric,
      target: new FormData(form).get('target'),
      endsAt: addDays(new Date(), Number(duration)).toISOString()
    });

    setIsInvalid(!parsed.success);

    if (parsed.success) {
      add.mutate(parsed.data, { onSuccess: () => form.reset() });
    }
  };

  return (
    <form noValidate className={s.root} onSubmit={onSubmit}>
      <h3 className={s.title}>{t('newGoal')}</h3>
      <Select<GoalMetric>
        items={goalMetricSchema.options.map((value) => ({ value, label: t(`metric.${value}`) }))}
        label={t('metricLabel')}
        value={metric}
        onValueChange={setMetric}
      />
      <label className={s.field}>
        <span className={s.label}>{t('targetLabel')}</span>
        <Input inputMode='decimal' isInvalid={isInvalid} name='target' placeholder={t('targetPlaceholder')} />
      </label>
      <Select<Duration>
        items={DURATIONS.map((value) => ({ value, label: t('duration', { count: Number(value) }) }))}
        label={t('durationLabel')}
        value={duration}
        onValueChange={setDuration}
      />
      {isInvalid && <p className={s.error}>{t('invalid')}</p>}
      <Button block disabled={add.isPending || accountId === undefined} type='submit'>
        <Plus size={16} />
        {t('add')}
      </Button>
    </form>
  );
};
