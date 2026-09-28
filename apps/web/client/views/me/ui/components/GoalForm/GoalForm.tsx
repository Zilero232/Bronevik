'use client';

import type { GoalMetric } from '@otmetki/schemas';

import { goalMetricSchema } from '@otmetki/schemas';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { Controller } from 'react-hook-form';

import { Button, FormField, Input, Select } from '@/ui-kit';

import type { GoalDuration } from '../../../lib/goal-form';

import { useGoalForm } from '../../../model/hooks';

import s from './GoalForm.module.scss';

export const GoalForm = () => {
  const t = useTranslations('me.goals');
  const id = useId();
  const { form, metric, durations, isInvalid, isDisabled, onSubmit } = useGoalForm();

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
      <FormField error={isInvalid && t('invalid')} hint={t(`hint.${metric}`)} htmlFor={id} label={t('targetLabel')}>
        <Input id={id} inputMode='decimal' isInvalid={isInvalid} placeholder={t(`targetPlaceholder.${metric}`)} {...form.register('target')} />
      </FormField>
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
      <Button block disabled={isDisabled} type='submit'>
        <Plus size={16} />
        {t('add')}
      </Button>
    </form>
  );
};
