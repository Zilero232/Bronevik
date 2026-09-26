'use client';

import type { GoalMetric } from '@otmetki/schemas';

import { goalMetricSchema } from '@otmetki/schemas';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { Button, Input, Select } from '@/ui-kit';

import type { GoalDuration } from '../../../lib/goal-form';

import { useGoalForm } from '../../../model/hooks';

import s from './GoalForm.module.scss';

export const GoalForm = () => {
  const t = useTranslations('me.goals');
  const { form, durations, isInvalid, isDisabled, onSubmit } = useGoalForm();

  return (
    <form noValidate className={s.root} onSubmit={onSubmit}>
      <h3 className={s.title}>{t('newGoal')}</h3>
      <Controller
        render={({ field: { value, onChange } }) => (
          <Select<GoalMetric>
            items={goalMetricSchema.options.map((metric) => ({ value: metric, label: t(`metric.${metric}`) }))}
            label={t('metricLabel')}
            value={value}
            onValueChange={onChange}
          />
        )}
        control={form.control}
        name='metric'
      />
      <label className={s.field}>
        <span className={s.label}>{t('targetLabel')}</span>
        <Input inputMode='decimal' isInvalid={isInvalid} placeholder={t('targetPlaceholder')} {...form.register('target')} />
      </label>
      <Controller
        render={({ field: { value, onChange } }) => (
          <Select<GoalDuration>
            items={durations.map((duration) => ({ value: duration, label: t('duration', { count: Number(duration) }) }))}
            label={t('durationLabel')}
            value={value}
            onValueChange={onChange}
          />
        )}
        control={form.control}
        name='duration'
      />
      {isInvalid && <p className={s.error}>{t('invalid')}</p>}
      <Button block disabled={isDisabled} type='submit'>
        <Plus size={16} />
        {t('add')}
      </Button>
    </form>
  );
};
