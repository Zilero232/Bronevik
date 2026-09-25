'use client';

import type { ChallengeCondition, ChallengeMetric } from '@bronevik/schemas';

import { challengeConditionSchema, challengeMetricSchema } from '@bronevik/schemas';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

import { NumberField, SegmentedControl, Select } from '@/ui-kit';

import type { ChallengeFormOutput, ChallengeFormValues } from '../../../model/studio.types';

import { CHALLENGE_FORM } from '../../../config';
import { ConditionScopeField } from '../ConditionScopeField';
import { FormField } from '../FormField';

import s from './ConditionBuilder.module.scss';

const { operator: operatorSchema, aggregate: aggregateSchema } = challengeConditionSchema.shape;

export const ConditionBuilder = () => {
  const t = useTranslations('streamer.challenges.condition');
  const { control } = useFormContext<ChallengeFormValues, unknown, ChallengeFormOutput>();

  return (
    <fieldset className={s.root}>
      <legend className={s.legend}>{t('legend')}</legend>
      <div className={s.row}>
        <Controller
          render={({ field }) => (
            <Select<ChallengeMetric>
              items={challengeMetricSchema.options.map((metric) => ({ value: metric, label: t(`metric.${metric}`) }))}
              label={t('metricLabel')}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
          control={control}
          name='condition.metric'
        />
        <FormField label={t('operatorLabel')}>
          <Controller
            render={({ field }) => (
              <SegmentedControl<ChallengeCondition['operator']>
                options={operatorSchema
                  .unwrap()
                  .options.map((operator) => ({ value: operator, label: t(`operator.${operator}`), 'aria-label': t(`operatorName.${operator}`) }))}
                aria-label={t('operatorLabel')}
                value={field.value ?? 'gte'}
                onChange={field.onChange}
              />
            )}
            control={control}
            name='condition.operator'
          />
        </FormField>
      </div>
      <div className={s.row}>
        <Controller
          control={control}
          name='condition.value'
          render={({ field }) => <NumberField label={t('value')} min={0} value={field.value} onValueChange={(value) => field.onChange(value ?? 0)} />}
        />
        <Controller
          render={({ field }) => (
            <NumberField
              label={t('battles')}
              max={CHALLENGE_FORM.battles.max}
              min={CHALLENGE_FORM.battles.min}
              value={field.value ?? CHALLENGE_FORM.battles.min}
              onValueChange={(value) => field.onChange(value ?? CHALLENGE_FORM.battles.min)}
            />
          )}
          control={control}
          name='condition.battles'
        />
      </div>
      <FormField hint={t('aggregateHint')} label={t('aggregateLabel')}>
        <Controller
          render={({ field }) => (
            <SegmentedControl<ChallengeCondition['aggregate']>
              aria-label={t('aggregateLabel')}
              options={aggregateSchema.unwrap().options.map((aggregate) => ({ value: aggregate, label: t(`aggregate.${aggregate}`) }))}
              size='sm'
              value={field.value ?? 'single'}
              onChange={field.onChange}
            />
          )}
          control={control}
          name='condition.aggregate'
        />
      </FormField>
      <ConditionScopeField />
    </fieldset>
  );
};
