'use client';

import type { GoalMetric } from '@otmetki/schemas';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Controller } from 'react-hook-form';

import { TankPicker } from '@/features/tank/pick-tank';
import { Button, FormField, Input, Select } from '@/ui-kit';

import type { GoalDuration } from '../../../lib/goal-form';

import { useGoalForm } from '../../../model/hooks';

import s from './GoalForm.module.scss';

export const GoalForm = () => {
  const t = useTranslations('me.goals');
  const { form, metric, metricItems, durationItems, hasTank, tank, onTankChange, isInvalid, isTankInvalid, isDisabled, onSubmit } = useGoalForm();

  return (
    <form noValidate className={s.root} onSubmit={onSubmit}>
      <h3 className={s.title}>{t('newGoal')}</h3>
      <Controller
        render={({ field: { value, onChange } }) => (
          <Select<GoalMetric> items={metricItems} label={t('metricLabel')} value={value} onValueChange={onChange} />
        )}
        control={form.control}
        name='metric'
      />
      {hasTank && (
        <FormField error={isTankInvalid && t('tankRequired')} label={t('tankLabel')}>
          <TankPicker placeholder={t('tankPlaceholder')} value={tank} onChange={onTankChange} />
        </FormField>
      )}
      <FormField error={isInvalid && t('invalid')} hint={t(`hint.${metric}`)} label={t('targetLabel')}>
        <Input inputMode='decimal' isInvalid={isInvalid} placeholder={t(`targetPlaceholder.${metric}`)} {...form.register('target')} />
      </FormField>
      <Controller
        render={({ field: { value, onChange } }) => (
          <Select<GoalDuration> items={durationItems} label={t('durationLabel')} value={value} onValueChange={onChange} />
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
